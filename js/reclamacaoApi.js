// reclamacaoAPI.js - Módulo para interagir com o ReclamacaoController no backend

class ReclamacaoAPI {
    constructor() {
      this.endpoint = `http://localhost:3000/api/reclamacoes`;
    }
  
    // Método auxiliar para requisições HTTP
    async #fetchAPI(url, options = {}) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || `Erro ${response.status}`);
        }
        
        return data;
      } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
      }
    }
  
    // Buscar todas as reclamações
    async listarReclamacoes() {
      return this.#fetchAPI(this.endpoint);
    }
  
    // Buscar reclamação por ID
    async buscarReclamacao(id) {
      return this.#fetchAPI(`${this.endpoint}/${id}`);
    }
  
    // Buscar reclamações por status
    async buscarPorStatus(status) {
      return this.#fetchAPI(`${this.endpoint}/status/${status}`);
    }
  
    // Criar nova reclamação
    async criarReclamacao(dadosReclamacao) {
      return this.#fetchAPI(this.endpoint, {
        method: 'POST',
        body: JSON.stringify(dadosReclamacao)
      });
    }
  
    // Atualizar reclamação existente
    async atualizarReclamacao(id, dadosReclamacao) {
      return this.#fetchAPI(`${this.endpoint}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dadosReclamacao)
      });
    }
  
    // Atualizar apenas o status de uma reclamação
    async atualizarStatus(id, status, resposta = null) {
      return this.#fetchAPI(`${this.endpoint}/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, resposta })
      });
    }
  
    // Excluir reclamação
    async excluirReclamacao(id) {
      return this.#fetchAPI(`${this.endpoint}/${id}`, {
        method: 'DELETE'
      });
    }
  }
  
export default ReclamacaoAPI;