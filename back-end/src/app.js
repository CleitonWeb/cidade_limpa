const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const swagger = require('@fastify/swagger');
const { connectDB } = require('./config/db');
const reclamacaoRoutes = require('./routes/reclamacao');
require('dotenv').config();

// Registrar plugins
fastify.register(cors, {
  origin: '*', // Em produção, você deve restringir isto para os domínios permitidos
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
});

// Configuração do Swagger
fastify.register(swagger, {
  routePrefix: '/documentacao',
  swagger: {
    info: {
      title: 'API de Reclamações - Coleta de Resíduos',
      description: 'Documentação da API para registro de reclamações',
      version: '1.0.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Encontre mais informações aqui'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: true
});

// Conectar ao MongoDB antes de iniciar o servidor
const start = async () => {
  try {
    await connectDB();
    
    // Registrar rotas
    fastify.register(reclamacaoRoutes, { prefix: '/api/reclamacoes' });
    
    // Rota raiz
    fastify.get('/', async (request, reply) => {
      return { 
        mensagem: 'API de Reclamações - Coleta de Resíduos',
        documentacao: '/documentacao'
      };
    });
    
    // Iniciar o servidor
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Servidor rodando em http://localhost:${port}`);
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

start();
