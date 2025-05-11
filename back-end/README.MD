# Sistema de Reclamações de Coleta de Resíduos Sólidos - Backend

Este é o backend de um sistema para registro e gerenciamento de reclamações relacionadas à coleta de resíduos sólidos. Desenvolvido com Node.js, Fastify e MongoDB, ele permite que cidadãos registrem reclamações sobre problemas com a coleta de lixo, como lixo não coletado, pontos de descarte irregular, entre outros.

## Funcionalidades

- Registro completo de reclamações com categorização
- Armazenamento detalhado do endereço da ocorrência
- Sistema de acompanhamento por status (Pendente, Em Andamento, Resolvido, etc.)
- Gerenciamento de respostas oficiais das autoridades responsáveis
- Consulta de reclamações por diversos filtros
- Documentação interativa com Swagger

## Estrutura do Projeto

```
projeto-backend/
├── src/
│   ├── app.js             # Configuração principal do Fastify
│   ├── controllers/
│   │   └── reclamacao.js  # Controlador de reclamações
│   ├── models/
│   │   └── reclamacao.js  # Modelo de dados para reclamações
│   ├── routes/
│   │   └── reclamacao.js  # Rotas da API
│   └── config/
│       └── db.js          # Configuração do MongoDB
├── .env                   # Arquivo de variáveis de ambiente
└── package.json           # Dependências do projeto
```

## Modelo de Dados

Cada reclamação contém:

- **ID**: Gerado automaticamente
- **Categoria**: Tipo de problema (ex: "Lixo não coletado", "Ponto de descarte irregular")
- **Status**: Estado atual da reclamação (Pendente, Em Andamento, Resolvido, etc.)
- **Nome da Pessoa**: Quem registrou a reclamação
- **Endereço**: Estrutura detalhada com rua, número, bairro, cidade, estado e país
- **Descrição**: Detalhes sobre o problema
- **Autoridade Responsável**: Órgão responsável pela resolução
- **Resposta**: Feedback oficial da autoridade (se houver)
- **Data de Criação e Atualização**: Registro temporal

## Requisitos

- Node.js 16+
- MongoDB 4.4+
- NPM ou Yarn

## Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/residuos-backend.git
   cd residuos-backend
   ```

2. Instale as dependências:
   ```
   npm install
   ```
   
3. Configure as variáveis de ambiente:
   ```
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações de MongoDB e porta:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/residuos-db
   ```

## Executando o Servidor

### Modo de Desenvolvimento
```
npm run dev
```

### Modo de Produção
```
npm start
```

O servidor estará disponível em `http://localhost:3000` (ou na porta que você configurou).

## Endpoints da API

A documentação completa da API está disponível em `http://localhost:3000/documentacao` após iniciar o servidor.

### Principais endpoints:

- `GET /api/reclamacoes` - Lista todas as reclamações
- `GET /api/reclamacoes/:id` - Obtém detalhes de uma reclamação específica
- `POST /api/reclamacoes` - Cria uma nova reclamação
- `PUT /api/reclamacoes/:id` - Atualiza uma reclamação existente
- `PATCH /api/reclamacoes/:id/status` - Atualiza o status e/ou resposta de uma reclamação
- `GET /api/reclamacoes/status/:status` - Filtra reclamações por status
- `DELETE /api/reclamacoes/:id` - Remove uma reclamação

## Exemplo de Uso

### Registrar uma nova reclamação

```bash
curl -X POST http://localhost:3000/api/reclamacoes \
  -H "Content-Type: application/json" \
  -d '{
    "categoria": "Lixo não coletado",
    "nome": "João Silva",
    "endereco": {
      "rua": "Rua das Flores",
      "numero": "123",
      "bairro": "Centro",
      "cidade": "São Paulo",
      "estado": "SP",
      "pais": "Brasil"
    },
    "descricao": "O lixo não foi coletado na terça-feira, dia 5 de maio",
    "autoridadeResponsavel": "Prefeitura Municipal"
  }'
```

### Atualizar o status de uma reclamação

```bash
curl -X PATCH http://localhost:3000/api/reclamacoes/[ID]/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Em Andamento",
    "resposta": "Estamos encaminhando sua reclamação para o setor responsável."
  }'
```

## Integração com Frontend

Este backend foi projetado para ser integrado com um frontend web relacionado à coleta de resíduos sólidos, onde os usuários podem:

- Ver informações sobre locais que fazem coleta de resíduos
- Aprender como separar corretamente o lixo
- Registrar reclamações

## Contribuição

Contribuições são bem-vindas! Por favor, sinta-se à vontade para submeter um Pull Request.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).