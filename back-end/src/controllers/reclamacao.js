// src/controllers/reclamacao.js
const ReclamacaoModel = require('../models/reclamacao');

class ReclamacaoController {
  static async getAll(request, reply) {
    try {
      const reclamacoes = await ReclamacaoModel.getAll();
      return reply.code(200).send({ reclamacoes });
    } catch (error) {
      console.error('Erro ao buscar reclamações:', error);
      return reply.code(500).send({ error: 'Erro ao buscar reclamações', detalhes: error.message });
    }
  }

  static async getById(request, reply) {
    try {
      const { id } = request.params;
      const reclamacao = await ReclamacaoModel.getById(id);
      
      if (!reclamacao) {
        return reply.code(404).send({ error: 'Reclamação não encontrada' });
      }
      
      return reply.code(200).send({ reclamacao });
    } catch (error) {
      console.error('Erro ao buscar reclamação:', error);
      return reply.code(500).send({ error: 'Erro ao buscar reclamação', detalhes: error.message });
    }
  }

  static async create(request, reply) {
    try {
      const reclamacaoData = request.body;
      
      // Validações básicas
      if (!reclamacaoData.categoria) {
        return reply.code(400).send({ error: 'A categoria da reclamação é obrigatória' });
      }
      
      if (!reclamacaoData.nome) {
        return reply.code(400).send({ error: 'O nome da pessoa é obrigatório' });
      }
      
      if (!reclamacaoData.descricao) {
        return reply.code(400).send({ error: 'A descrição da reclamação é obrigatória' });
      }
      
      // Validação do endereço
      if (!reclamacaoData.endereco) {
        return reply.code(400).send({ error: 'O endereço é obrigatório' });
      }
      
      const { rua, bairro, cidade, estado } = reclamacaoData.endereco;
      if (!rua || !bairro || !cidade || !estado) {
        return reply.code(400).send({ error: 'Os campos rua, bairro, cidade e estado são obrigatórios para o endereço' });
      }
      
      const novaReclamacao = await ReclamacaoModel.create(reclamacaoData);
      return reply.code(201).send({ 
        message: 'Reclamação registrada com sucesso', 
        reclamacao: novaReclamacao 
      });
    } catch (error) {
      console.error('Erro ao criar reclamação:', error);
      return reply.code(500).send({ error: 'Erro ao criar reclamação', detalhes: error.message });
    }
  }

  static async update(request, reply) {
    try {
      const { id } = request.params;
      const reclamacaoData = request.body;
      
      // Obter reclamação existente para verificar se existe
      const reclamacaoExistente = await ReclamacaoModel.getById(id);
      if (!reclamacaoExistente) {
        return reply.code(404).send({ error: 'Reclamação não encontrada' });
      }
      
      // Validações básicas
      if (!reclamacaoData.categoria) {
        return reply.code(400).send({ error: 'A categoria da reclamação é obrigatória' });
      }
      
      if (!reclamacaoData.nome) {
        return reply.code(400).send({ error: 'O nome da pessoa é obrigatório' });
      }
      
      if (!reclamacaoData.descricao) {
        return reply.code(400).send({ error: 'A descrição da reclamação é obrigatória' });
      }
      
      // Validação do endereço
      if (!reclamacaoData.endereco) {
        return reply.code(400).send({ error: 'O endereço é obrigatório' });
      }
      
      // Atualizar reclamação
      const reclamacaoAtualizada = await ReclamacaoModel.update(id, reclamacaoData);
      
      return reply.code(200).send({ 
        message: 'Reclamação atualizada com sucesso', 
        reclamacao: reclamacaoAtualizada 
      });
    } catch (error) {
      console.error('Erro ao atualizar reclamação:', error);
      return reply.code(500).send({ error: 'Erro ao atualizar reclamação', detalhes: error.message });
    }
  }

  static async updateStatus(request, reply) {
    try {
      const { id } = request.params;
      const { status, resposta } = request.body;
      
      // Validação
      if (!status) {
        return reply.code(400).send({ error: 'O status é obrigatório' });
      }
      
      // Verificar se a reclamação existe
      const reclamacaoExistente = await ReclamacaoModel.getById(id);
      if (!reclamacaoExistente) {
        return reply.code(404).send({ error: 'Reclamação não encontrada' });
      }
      
      // Atualizar apenas o status e resposta
      const dadosAtualizacao = {
        ...reclamacaoExistente,
        status: status,
        resposta: resposta || reclamacaoExistente.resposta
      };
      
      const reclamacaoAtualizada = await ReclamacaoModel.update(id, dadosAtualizacao);
      
      return reply.code(200).send({ 
        message: 'Status da reclamação atualizado com sucesso', 
        reclamacao: reclamacaoAtualizada 
      });
    } catch (error) {
      console.error('Erro ao atualizar status da reclamação:', error);
      return reply.code(500).send({ error: 'Erro ao atualizar status da reclamação', detalhes: error.message });
    }
  }

  static async delete(request, reply) {
    try {
      const { id } = request.params;
      const deleted = await ReclamacaoModel.delete(id);
      
      if (!deleted) {
        return reply.code(404).send({ error: 'Reclamação não encontrada' });
      }
      
      return reply.code(200).send({ 
        message: 'Reclamação excluída com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir reclamação:', error);
      return reply.code(500).send({ error: 'Erro ao excluir reclamação', detalhes: error.message });
    }
  }
  
  // Endpoint adicional para buscar reclamações por status
  static async getByStatus(request, reply) {
    try {
      const { status } = request.params;
      
      if (!status) {
        return reply.code(400).send({ error: 'O status é obrigatório' });
      }
      
      const reclamacoes = await ReclamacaoModel.getByStatus(status);
      
      return reply.code(200).send({ reclamacoes });
    } catch (error) {
      console.error('Erro ao buscar reclamações por status:', error);
      return reply.code(500).send({ error: 'Erro ao buscar reclamações por status', detalhes: error.message });
    }
  }
}

module.exports = ReclamacaoController;