// src/routes/reclamacao.js
const ReclamacaoController = require('../controllers/reclamacao');

async function reclamacaoRoutes(fastify) {
  // Definição dos schemas para documentação do Swagger
  const reclamacaoSchema = {
    type: 'object',
    properties: {
      categoria: { type: 'string' },
      nome: { type: 'string' },
      endereco: { 
        type: 'object',
        properties: {
          rua: { type: 'string' },
          numero: { type: 'string' },
          bairro: { type: 'string' },
          cidade: { type: 'string' },
          estado: { type: 'string' },
          pais: { type: 'string' }
        }
      },
      descricao: { type: 'string' },
      autoridadeResponsavel: { type: 'string' }
    }
  };

  const reclamacaoResponseSchema = {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      categoria: { type: 'string' },
      status: { type: 'string' },
      nomePessoa: { type: 'string' },
      enderecoReclamacao: { 
        type: 'object',
        properties: {
          rua: { type: 'string' },
          numero: { type: 'string' },
          bairro: { type: 'string' },
          cidade: { type: 'string' },
          estado: { type: 'string' },
          pais: { type: 'string' }
        }
      },
      descricaoReclamacao: { type: 'string' },
      autoridadeResponsavel: { type: 'string' },
      resposta: { type: ['string', 'null'] },
      dataCriacao: { type: 'string', format: 'date-time' },
      dataAtualizacao: { type: 'string', format: 'date-time' }
    }
  };

  const statusUpdateSchema = {
    type: 'object',
    properties: {
      status: { type: 'string' },
      resposta: { type: 'string' }
    },
    required: ['status']
  };

  // Obter todas as reclamações
  fastify.get('/', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            reclamacoes: {
              type: 'array',
              items: reclamacaoResponseSchema
            }
          }
        }
      }
    }
  }, ReclamacaoController.getAll);
  
  // Obter uma reclamação por ID
  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            reclamacao: reclamacaoResponseSchema
          }
        }
      }
    }
  }, ReclamacaoController.getById);
  
  // Obter reclamações por status
  fastify.get('/status/:status', {
    schema: {
      params: {
        type: 'object',
        properties: {
          status: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            reclamacoes: {
              type: 'array',
              items: reclamacaoResponseSchema
            }
          }
        }
      }
    }
  }, ReclamacaoController.getByStatus);
  
  // Criar uma nova reclamação
  fastify.post('/', {
    schema: {
      body: reclamacaoSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            reclamacao: reclamacaoResponseSchema
          }
        }
      }
    }
  }, ReclamacaoController.create);
  
  // Atualizar uma reclamação
  fastify.put('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      body: reclamacaoSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            reclamacao: reclamacaoResponseSchema
          }
        }
      }
    }
  }, ReclamacaoController.update);
  
  // Atualizar apenas o status de uma reclamação
  fastify.patch('/:id/status', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      body: statusUpdateSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            reclamacao: reclamacaoResponseSchema
          }
        }
      }
    }
  }, ReclamacaoController.updateStatus);
  
  // Excluir uma reclamação
  fastify.delete('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, ReclamacaoController.delete);
}

module.exports = reclamacaoRoutes;