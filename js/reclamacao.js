// js/app.js
import ReclamacaoAPI from './reclamacaoApi.js';

// Classe principal da aplicação
class ReclamacaoApp {
  constructor() {
    // Instanciar a API de reclamações
    this.api = new ReclamacaoAPI();
    
    // Elementos do DOM
    this.formReclamacao = document.getElementById('formReclamacao');
    this.listaReclamacoes = document.getElementById('listaReclamacoes');
    this.tabs = document.querySelectorAll('.tab');
    this.modalDetalhe = document.getElementById('modalDetalhe');
    this.btnFecharModal = document.getElementById('btnFecharModal');
    this.btnFecharModalX = document.getElementById('btnFecharModalX');
    this.btnAtualizarStatus = document.getElementById('btnAtualizarStatus');
    
    // Estado da aplicação
    this.reclamacaoSelecionada = null;
    this.statusAtual = 'todos';
    
    // Inicializar a aplicação
    this.init();
  }
  
  // Método de inicialização
  init() {
    // Carregar reclamações iniciais
    this.carregarReclamacoes();
    
    // Configurar listeners de eventos
    this.setupEventListeners();
  }
  
  // Configurar todos os event listeners
  setupEventListeners() {
    // Form de criação de reclamação
    this.formReclamacao.addEventListener('submit', (event) => this.criarReclamacao(event));
    
    // Botão de fechar modal
    this.btnFecharModal.addEventListener('click', () => {
      this.fecharModal();
    });
    this.btnFecharModalX.addEventListener('click', () => {
      this.fecharModal();
    });
    
    // Botão de atualizar status
    this.btnAtualizarStatus.addEventListener('click', () => this.atualizarStatusReclamacao());

    // Fechar modal ao clicar fora dele
    this.modalDetalhe.addEventListener('click', (e) => {
      if (e.target === this.modalDetalhe) {
        this.fecharModal();
      }
    });
  }
  
  // Carregar reclamações do servidor
  async carregarReclamacoes() {
    try {
      let data;
      
      data = await this.api.listarReclamacoes();
      
      this.renderizarReclamacoes(data.reclamacoes);
    } catch (error) {
      console.error('Erro ao carregar reclamações:', error);
      this.listaReclamacoes.innerHTML = `<p>Erro ao carregar reclamações: ${error.message}</p>`;
    }
  }
  
  // Renderizar lista de reclamações na interface
  renderizarReclamacoes(reclamacoes) {
    if (!reclamacoes || reclamacoes.length === 0) {
      this.listaReclamacoes.innerHTML = '<div class="sem-reclamacoes">Nenhuma reclamação encontrada</div>';
      return;
    }
    
    let html = '<div class="reclamacoes-container">';
    
    reclamacoes.forEach(reclamacao => {
      const statusClass = `status-${reclamacao.status.toLowerCase().replace(' ', '-')}`;
      const dataFormatada = new Date(reclamacao.dataCriacao).toLocaleDateString('pt-BR');
      
      html += `
        <div class="reclamacao-card" data-id="${reclamacao._id}">
          <div class="reclamacao-header">
            <h3>${reclamacao.categoria}</h3>
          </div>
          <div class="reclamacao-body">
            <p><span class="badge ${statusClass}">${reclamacao.status}</span></p>
            <p><strong>Nome Pessoa:</strong> ${reclamacao.nomePessoa}</p>
            <p><strong>Local:</strong> ${reclamacao.enderecoReclamacao.bairro}, ${reclamacao.enderecoReclamacao.cidade}</p>
            <p class="descricao-reclamacao">${reclamacao.descricaoReclamacao.substring(0, 100)}${reclamacao.descricaoReclamacao.length > 100 ? '...' : ''}</p>
          </div>
          <div class="reclamacao-footer">
            <span class="data-reclamacao">${dataFormatada}</span>
            <button class="btn-detalhe" data-id="${reclamacao._id}">Ver Detalhes</button>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    this.listaReclamacoes.innerHTML = html;
    
    // Adicionar listeners para os botões de detalhes
    document.querySelectorAll('.btn-detalhe').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita propagação se o card inteiro também for clicável
        this.exibirDetalhes(btn.dataset.id);
      });
    });
    
  }
  
  // Criar nova reclamação
  async criarReclamacao(event) {
    event.preventDefault();
    
    const novaReclamacao = {
      nome: document.getElementById('nome').value,
      categoria: document.getElementById('categoria').value,
      descricao: document.getElementById('descricao').value,
      endereco: {
        rua: document.getElementById('rua').value,
        bairro: document.getElementById('bairro').value,
        numero: document.getElementById('numero').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value
      },
      status: 'pendente'
    };
    
    try {
      await this.api.criarReclamacao(novaReclamacao);
      alert('Reclamação enviada com sucesso!');
      this.formReclamacao.reset();
      this.carregarReclamacoes();
    } catch (error) {
      alert(`Erro ao enviar reclamação: ${error.message}`);
    }
  }
  
  // Abrir modal com detalhes da reclamação
  async exibirDetalhes(id) {
    try {
      const { reclamacao } = await this.api.buscarReclamacao(id);
      this.reclamacaoSelecionada = reclamacao;
      
      const statusClass = `status-${reclamacao.status.toLowerCase().replace(' ', '-')}`;
      
      const detalhesReclamacao = document.getElementById('detalhesReclamacao');
      const areaResposta = document.getElementById('areaResposta');
      const btnAtualizarStatus = document.getElementById('btnAtualizarStatus');
      
      // Preencher detalhes
      detalhesReclamacao.innerHTML = `
        <h3>${reclamacao.categoria}</h3>
        <p><strong>Status:</strong> <span class="badge ${statusClass}">${reclamacao.status}</span></p>
        <p><strong>Nome:</strong> ${reclamacao.nomePessoa}</p>
        <p><strong>Endereço:</strong> ${reclamacao.enderecoReclamacao.rua}, ${reclamacao.enderecoReclamacao.numero}, ${reclamacao.enderecoReclamacao.bairro}, ${reclamacao.enderecoReclamacao.cidade}-${reclamacao.enderecoReclamacao.estado}</p>
        <p><strong>Descrição:</strong> ${reclamacao.descricaoReclamacao}</p>
        ${reclamacao.resposta ? `<p><strong>Resposta:</strong> ${reclamacao.resposta}</p>` : ''}
        <p><strong>Data:</strong> ${new Date(reclamacao.dataCriacao).toLocaleDateString()}</p>
      `;
      
      // Mostrar área de resposta para administradores
      // Em uma aplicação real, você deve verificar o perfil do usuário
      const isAdmin = true; // Exemplo - em produção use autenticação real
      
      if (isAdmin) {
        areaResposta.classList.remove('hidden');
        btnAtualizarStatus.classList.remove('hidden');
        
        // Preencher o status atual
        document.getElementById('novoStatus').value = reclamacao.status;
        document.getElementById('resposta').value = reclamacao.resposta || '';
      } else {
        areaResposta.classList.add('hidden');
        btnAtualizarStatus.classList.add('hidden');
      }
      
      // Mostrar modal
      this.modalDetalhe.classList.add('active');
    } catch (error) {
      alert(`Erro ao carregar detalhes: ${error.message}`);
    }
  }

  // Fechar modal
  fecharModal() {
    this.modalDetalhe.classList.remove('active');
  }
  
  async atualizarStatusReclamacao() {
    if (!this.reclamacaoSelecionada) return;
    
    const novoStatus = document.getElementById('novoStatus').value;
    const resposta = document.getElementById('resposta').value;
    
    try {
      await this.api.atualizarStatus(this.reclamacaoSelecionada._id, novoStatus, resposta);
      alert('Status atualizado com sucesso!');
      this.fecharModal();
      this.carregarReclamacoes();
    } catch (error) {
      alert(`Erro ao atualizar status: ${error.message}`);
    }
  }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Criar instância da aplicação
  const app = new ReclamacaoApp();

});