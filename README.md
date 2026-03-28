# API Server Node.js

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-ISC-blue)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-Jest-brightgreen?logo=jest)](package.json)
[![Coverage](https://img.shields.io/badge/Coverage-Available-brightgreen)](coverage/)

REST API com autenticação JWT, MySQL e arquitetura organizada para aplicações escaláveis.

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** (geralmente incluído com Node.js)
- **MySQL** (versão 5.7 ou superior) - [Download](https://www.mysql.com/downloads/)
- **Git** (opcional, para controle de versão) - [Download](https://git-scm.com/)

Para verificar se estão instalados, execute:
```bash
node --version
npm --version
mysql --version
```

---

## 🇧🇷 Sobre o projeto

Esta é uma **API REST completa**, desenvolvida em **Node.js** com **autenticação JWT**, validação, conexão com banco de dados **MySQL** e uma arquitetura organizada, pronta para uso em sistemas reais.

O objetivo deste projeto é servir como base para aplicações corporativas, permitindo:
- Autenticação e gerenciamento de usuários  
- Integração com serviços externos  
- Padronização de rotas e middlewares  
- Organização em camadas (controllers, services, repositories)  
- Fácil expansão para novas funcionalidades  

A API foi construída seguindo boas práticas:
- Estrutura limpa e escalável  
- Separação clara de responsabilidades  
- Tokens JWT para autorização  
- MySQL com variáveis de ambiente  
- Scripts prontos para desenvolvimento  

---

## 📦 Tecnologias utilizadas
- Node.js  
- Express  
- MySQL / mysql2  
- Knex.js (Database Migrations)  
- JWT (jsonwebtoken)  
- bcrypt  
- dotenv  
- Nodemon  
- Jest (testes automatizados)  
- Winston (logging)  
- Swagger (documentação)  
- Helmet (segurança)  
- CORS  

---

## 📁 Estrutura do projeto

```
api-serve-node/
├── docs/
│   ├── script.sql
│   └── backupBd/
│       ├── backup.sql
│       └── db_api_dev.sql
├── log/
├── models/
├── src/
│   ├── controllers/
│   │   ├── autorizacao.controller.js
│   │   └── usuario.controller.js
│   ├── repositories/
│   │   ├── autorizacao.repository.js
│   │   ├── db.js
│   │   └── usuario.repository.js
│   ├── routes/
│   │   ├── autorizacao.route.js
│   │   └── usuario.route.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── autorizacao.service.js
│   │   └── usuario.service.js
│   └── views/
│       └── home.html
├── env.txt
├── index.js
├── package.json
├── README.md
└── swagger.js
```

---

## 🔐 Autenticação
A autenticação é baseada em **JWT**.  
Rota de login retorna:  
- token de acesso  
- dados do usuário autenticado  

Middleware `auth` protege rotas privadas.

---

## 🔌 Endpoints principais

### Autenticação

#### **POST /api/v1/auth**
Autentica o usuário e gera um token JWT.
- **Body**: `{ "usuario": "john.doe", "senha": "YWRtaW4=" }`
- **Response**: `{ "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }`

### Usuários (rotas protegidas - requerem token JWT)

#### **POST /api/v1/usuario**
Cria um novo usuário.
- **Body**: `{ "nome": "John Doe", "email": "johndoe@johndoe.com", "senha": "YWRtaW4=", "usuario": "john.doe" }`

#### **GET /api/v1/usuario**
Lista todos os usuários cadastrados.

#### **GET /api/v1/usuario/:id**
Busca um usuário específico pelo ID.

#### **PUT /api/v1/usuario**
Atualiza as informações de um usuário.
- **Body**: `{ "usuario": "john.doe", "nome": "John Doe", "email": "johndoe@johndoe.com", "senha": "bm92YVNlbmhhMTIz", "active": "S" }`

#### **DELETE /api/v1/usuario/:id**
Remove um usuário pelo ID.

---

## 💡 Casos de Uso

### Caso 1: Autenticação de Usuário

**Cenário**: Um usuário precisa se autenticar para obter um token JWT.

```bash
curl -X POST http://localhost:3000/api/v1/auth \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "john.doe",
    "senha": "YWRtaW4="
  }'
```

**Resposta**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Caso 2: Criar um Novo Usuário

**Cenário**: Um administrador autenticado deseja cadastrar um novo usuário no sistema.

```bash
curl -X POST http://localhost:3000/api/v1/usuario \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "nome": "Maria Silva",
    "email": "maria.silva@email.com",
    "senha": "c2VuaGFTZWd1cmE=",
    "usuario": "maria.silva"
  }'
```

**Resposta**:
```json
{
  "status": "sucesso",
  "message": "Usuário cadastrado com sucesso!"
}
```

---

### Caso 3: Listar Todos os Usuários

**Cenário**: Um administrador deseja visualizar todos os usuários cadastrados.

```bash
curl -X GET http://localhost:3000/api/v1/usuario \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Resposta**:
```json
[
  {
    "id": 1,
    "nome": "John Doe",
    "email": "johndoe@johndoe.com",
    "data_criacao": "2024-09-12T03:00:00Z",
    "data_alteracao": "2024-09-12T03:00:00Z"
  },
  {
    "id": 2,
    "nome": "Maria Silva",
    "email": "maria.silva@email.com",
    "data_criacao": "2024-09-15T10:30:00Z",
    "data_alteracao": "2024-09-15T10:30:00Z"
  }
]
```

---

### Caso 4: Buscar Usuário Específico

**Cenário**: Buscar detalhes de um usuário pelo ID.

```bash
curl -X GET http://localhost:3000/api/v1/usuario/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Resposta**:
```json
{
  "id": 1,
  "nome": "John Doe",
  "email": "johndoe@johndoe.com",
  "usuario": "john.doe",
  "data_criacao": "2024-09-12T03:00:00Z",
  "data_alteracao": "2024-09-12T03:00:00Z"
}
```

---

### Caso 5: Atualizar Dados do Usuário

**Cenário**: Atualizar informações de um usuário existente.

```bash
curl -X PUT http://localhost:3000/api/v1/usuario \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "usuario": "john.doe",
    "nome": "John Doe Updated",
    "email": "john.updated@email.com",
    "senha": "bm92YVNlbmhh",
    "active": "S"
  }'
```

**Resposta**:
```json
{
  "status": "sucesso",
  "id": 1,
  "affectedRows": 1,
  "message": "Usuário atualizado com sucesso!"
}
```

---

### Caso 6: Remover Usuário

**Cenário**: Remover um usuário do sistema.

```bash
curl -X DELETE http://localhost:3000/api/v1/usuario/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Resposta**:
```json
{
  "id": 1,
  "status": "sucesso",
  "message": "Registro removido com sucesso!"
}
```

---

### Fluxo Completo de Uso

1. **Autenticar** usando `POST /api/v1/auth` para obter o token JWT
2. **Incluir o token** no header `Authorization: Bearer {token}` em todas as requisições protegidas
3. **Realizar operações** de CRUD (Create, Read, Update, Delete) nos usuários
4. O token JWT expira após um período definido - será necessário autenticar novamente

---

## ⚙️ Como rodar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/eliezereoc/api-serve-node
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copy o arquivo `.env.example` para `.env` e ajuste as configurações do banco de dados:
```bash
cp .env.example .env
```

Configure as variáveis no arquivo `.env`:
- `PORT_LISTEN`: Porta do servidor (padrão: 3000)
- `HOST_BD_STAGING` / `HOST_BD_PRODUCTION`: Host do MySQL
- `USER_BD_STAGING` / `USER_BD_PRODUCTION`: Usuário do banco
- `PASSWORD_BD_STAGING` / `PASSWORD_BD_PRODUCTION`: Senha do banco
- `DATABASE_NAME_STAGING` / `DATABASE_NAME_PRODUCTION`: Nome do banco
- `NODE_ENV`: Ambiente (STAGING ou PRODUCTION)
- `JWT_SECRET`: Chave secreta para JWT (gere uma nova em produção)

**Nota**: O arquivo `env.txt` é um backup da configuração anterior. Use `.env.example` como referência.

### 4. Configurar o banco de dados

**Opção A: Usando Migrations (Recomendado)**

Execute as migrations para criar automaticamente as tabelas do banco de dados:

```bash
# Para ambiente de STAGING
npm run migrate:staging

# Para ambiente de PRODUCTION
npm run migrate:production
```

As migrations criam automaticamente:
- Tabela `usuario` com todos os campos necessários
- Usuário admin padrão (usuário: `admin.admin`, senha: `adminadmin`)
- Índices e constraints

**Opção B: Usando scripts SQL manuais**

Execute os scripts SQL localizados em `docs/` para criar o banco de dados:
```bash
docs/script.sql
```

### 5. Rodar o servidor
```bash
npm start
```

Acesse a aplicação em:
```
http://localhost:3000
```

Documentação Swagger:
```
http://localhost:3000/api-docs
```

---

## 🧪 Testes Automatizados

O projeto utiliza **Jest** para testes automatizados com suporte completo a ES Modules. Com **60 testes** implementados cobrindo services, controllers e autenticação.

### 📊 Status dos Testes

```
Test Suites: 6 passed ✅
Tests:       63 passed ✅
Coverage:    56.32% do código
```

**Cobertura por módulo:**
- **auth.service**: 100% ✅
- **autorizacao.service**: 100% ✅
- **autorizacao.controller**: 100% ✅
- **usuario.service**: 89.28% ✅
- **usuario.controller**: 89.28% ✅
- **rate limiter**: 100% ✅

### Executar Testes

#### Modo Watch (desenvolvimento)
```bash
npm test
```
Testes executam automaticamente ao salvar arquivos. Pressione `q` para sair.

#### Rodar testes uma vez
```bash
npm test -- --no-watch --no-coverage
```

#### Apenas testes de um arquivo
```bash
npm test -- usuario.service.test.js
```

#### Com relatório de cobertura detalhado
```bash
npm test
```
(já incluído por padrão no script)

### Estrutura de Testes

Os testes estão organizados próximo aos arquivos que testam:
```
src/
├── limiter.test.js
├── services/
│   ├── auth.service.js
│   ├── auth.service.test.js
│   ├── autorizacao.service.js
│   ├── autorizacao.service.test.js
│   ├── usuario.service.js
│   └── usuario.service.test.js
├── controllers/
│   ├── autorizacao.controller.js
│   ├── autorizacao.controller.test.js
│   ├── usuario.controller.js
│   └── usuario.controller.test.js
```

### Testes Implementados

#### AuthService (6 testes)
- ✅ Criar token com payload correto
- ✅ Usar algoritmo HS256 e expiração 1h
- ✅ Verificar token com Bearer format
- ✅ Armazenar dados do usuário em req.user
- ✅ Retornar erro 401 para tokens inválidos
- ✅ Validar JWT_SECRET do environment

#### AutorizacaoService (4 testes)
- ✅ Autenticar usuário com sucesso
- ✅ Validar senha com bcrypt
- ✅ Retornar erro quando usuário não existe
- ✅ Retornar erro quando senha incorreta

#### UsuarioService (17 testes)
- ✅ Criar usuário com sucesso
- ✅ Validar email duplicado
- ✅ Validar usuário duplicado
- ✅ Reativar usuário inativo
- ✅ Hash de senha com bcrypt
- ✅ Listar usuários
- ✅ Buscar usuário por ID
- ✅ Deletar usuário
- ✅ Impedir autodeleta de conta
- ✅ Atualizar usuário
- ✅ Tratamento de erros de banco de dados

#### AutorizacaoController (11 testes)
- ✅ Autenticar e gerar token
- ✅ Validar campos obrigatórios
- ✅ Retornar erro 401 para autenticação inválida
- ✅ Retornar erro quando token não é criado
- ✅ Tratamento de exceções

#### UsuarioController (16 testes)
- ✅ Criar usuário com validação
- ✅ Listar usuários
- ✅ Buscar usuário específico
- ✅ Deletar usuário
- ✅ Atualizar usuário
- ✅ Tratamento de erros HTTP
- ✅ Validação de dados de entrada
- ✅ Chamar middleware next() em exceções

#### Rate Limiter (3 testes)
- ✅ Permitir até 10 requisições e bloquear a 11ª
- ✅ Retornar status 429 quando limite excedido
- ✅ Aplicar rate limit globalmente na rota raiz
- Proteção configurada para máximo de 10 requisições por segundo
- Resposta automática com status 429 (Too Many Requests)
- Previne ataques de força bruta e DDoS

### Exemplo de Teste

```javascript
describe('UsuarioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um usuário com sucesso', async () => {
    const usuario = {
      usuario: 'testuser',
      email: 'test@example.com',
      senha: Buffer.from('senha123').toString('base64'),
      nome: 'Test User'
    };

    UsuarioRepository.getUsuarioByEmail.mockResolvedValue([null]);
    UsuarioRepository.getUsuarioByUsuario.mockResolvedValue([null]);
    bcrypt.hash.mockResolvedValue('hashedPassword123');
    UsuarioRepository.createUsuario.mockResolvedValue({ status: 'sucesso' });

    const result = await UsuarioService.createUsuario(usuario);

    expect(result.status).toBe('sucesso');
    expect(result.code).toBe(200);
    expect(UsuarioRepository.createUsuario).toHaveBeenCalled();
  });
});
```

#### Teste de Rate Limiter

```javascript
describe('Rate Limiter Tests', () => {
  it('deve permitir até 10 requisições e bloquear a 11ª', async () => {
    const endpoint = '/';
    let successCount = 0;
    let blockedCount = 0;

    // Faz 15 requisições para garantir que ultrapassamos o limite de 10
    for (let i = 1; i <= 15; i++) {
      const response = await request(app).get(endpoint);

      if (response.status === 429) {
        blockedCount++;
      } else {
        successCount++;
      }
    }

    // Verifica que houve requisições bloqueadas
    expect(blockedCount).toBeGreaterThan(0);
    // Verifica que o bloqueio começou após aproximadamente 10 requisições
    expect(successCount).toBeGreaterThanOrEqual(8);
    expect(successCount).toBeLessThanOrEqual(10);
  });
});
```

### Cobertura de Código

O Jest gera automaticamente relatório de cobertura mostrando:
- **% Stmts** - Percentual de statements (linhas) executadas
- **% Branch** - Percentual de branches (if/else) executados
- **% Funcs** - Percentual de funções executadas
- **% Lines** - Percentual de linhas cobertas

Exemplo de relatório:
```
usuario.service.js | 89.28 | 82.14 | 100 | 89.09
```
= 89% do código está coberto por testes

### Mocks Utilizados

Os testes utilizam mocks para isolamento:
- **UsuarioRepository** - Operações de banco de dados
- **bcrypt** - Hash de senhas
- **JWT** - Criação e verificação de tokens
- **logger** - Logs globais
- **mysql2/promise** - Conexão com BD (desabilitada em testes)

### 💡 Boas Práticas Implementadas

1. **Isolamento** - Cada teste é independente
2. **Setup/Teardown** - `beforeEach()` limpa mocks
3. **Nomes descritivos** - Testes explicam o que testam
4. **Cobertura de casos extremos** - Erros, validações, exceções
5. **Mocks apropriados** - Sem dependências reais (BD, APIs)

### 🔧 Configuração

A configuração do Jest está em `jest.config.js`:
- ✅ Suporte a ES Modules
- ✅ Babel transpilation automática
- ✅ Cobertura automática
- ✅ Timeout configurado para operações assíncronas

---

## 📚 Documentação Interativa com Swagger

A API possui documentação interativa completa usando **Swagger UI**, permitindo visualizar e testar todos os endpoints diretamente no navegador.

### 🌐 Acessar Documentação

Após iniciar o servidor, acesse:
```
http://localhost:3000/api-docs
```

### 📋 Recursos Disponíveis

A documentação Swagger inclui:

#### ✅ Visualização Completa
- Lista de todos os endpoints disponíveis
- Métodos HTTP (GET, POST, PUT, DELETE)
- Parâmetros necessários (body, query, params)
- Exemplos de requisições e respostas
- Códigos de status HTTP

#### 🔐 Autenticação JWT
- Botão "Authorize" para inserir token JWT
- Formato: `Bearer {seu-token-aqui}`
- Token válido por 1 hora após autenticação
- Testa endpoints protegidos facilmente

#### 🧪 Testar Endpoints

1. **Autenticar** primeiro via `POST /api/v1/auth`:
   ```json
   {
     "usuario": "seu-usuario",
     "senha": "c2VuaGFCYXNlNjQ="
   }
   ```

2. **Copiar token** da resposta

3. **Clicar em "Authorize"** (cadeado no topo)

4. **Inserir token** no formato: `Bearer {token}`

5. **Testar endpoints** protegidos:
   - GET /api/v1/usuario - Listar usuários
   - POST /api/v1/usuario - Criar usuário
   - PUT /api/v1/usuario - Atualizar usuário
   - DELETE /api/v1/usuario/{id} - Deletar usuário

### 📝 Endpoints Documentados

#### Autenticação
- `POST /api/v1/auth` - Gerar token JWT

#### Usuários (Protegido 🔒)
- `GET /api/v1/usuario` - Listar todos os usuários
- `GET /api/v1/usuario/{id}` - Buscar usuário por ID
- `POST /api/v1/usuario` - Criar novo usuário
- `PUT /api/v1/usuario` - Atualizar usuário
- `DELETE /api/v1/usuario/{id}` - Deletar usuário

### 💡 Dicas de Uso

**Senha em Base64:**
- As senhas devem ser enviadas codificadas em Base64
- Exemplo: `senha123` → `c2VuaGExMjM=`
- Use: `echo -n "senha123" | base64` no terminal

**Testar Respostas:**
- Swagger mostra exemplos reais de respostas
- Status codes: 200 (sucesso), 401 (não autorizado), 404 (não encontrado)
- Mensagens de erro detalhadas

**Validações:**
- Campos obrigatórios marcados com `*`
- Formato dos dados esperados
- Restrições de tamanho e tipo

### 🔧 Configuração

A documentação Swagger é configurada em `swagger.js` com:
- Informações do projeto
- Versão da API
- Servidor base URL
- Schemas de dados
- Exemplos de requisições

---

## 🗄️ Banco de Dados

O projeto usa **MySQL** como banco de dados relacional.

### Gerenciamento com Migrations

O projeto utiliza **Knex.js** para gerenciar migrations do banco de dados, permitindo:
- ✅ Controle de versionamento do schema
- ✅ Rastreamento de alterações aplicadas
- ✅ Rollback de mudanças quando necessário
- ✅ Sincronização entre ambientes (staging/production)

### Comandos de Migration

#### Executar migrations pendentes
```bash
# Ambiente de STAGING (homologação)
npm run migrate:staging

# Ambiente de PRODUCTION (produção)
npm run migrate:production
```

#### Reverter última migration
```bash
# Staging
npm run migrate:rollback:staging

# Production
npm run migrate:rollback:production
```

#### Verificar status das migrations
```bash
# Ver quais migrations foram aplicadas
npm run migrate:status:staging
npm run migrate:status:production
```

#### Criar nova migration
```bash
npm run migrate:make nome_da_migration
```

Exemplo:
```bash
npm run migrate:make add_phone_to_usuario
```

Isso criará um novo arquivo em `migrations/` com o timestamp:
```
migrations/20251222120000_add_phone_to_usuario.js
```

### Estrutura de uma Migration

```javascript
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Código para aplicar a migration (criar/alterar tabelas)
  await knex.schema.alterTable('usuario', (table) => {
    table.string('telefone', 20).nullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Código para reverter a migration (rollback)
  await knex.schema.alterTable('usuario', (table) => {
    table.dropColumn('telefone');
  });
}
```

### Migrations Disponíveis

#### `20240911000000_create_usuario_table.js`
- Cria tabela `usuario` com campos:
  - `id` (auto-incremento, chave primária)
  - `nome` (VARCHAR 150)
  - `email` (VARCHAR 150, único)
  - `senha` (VARCHAR 150, hash bcrypt)
  - `usuario` (VARCHAR 50, único)
  - `active` (CHAR 1, padrão 'S')
  - `data_criacao` (TIMESTAMP)
  - `data_alteracao` (TIMESTAMP, nullable)
- Insere usuário admin padrão

### Scripts SQL Alternativos

Scripts SQL manuais ainda estão disponíveis em:
- `docs/script.sql` - Scripts de criação e alteração
- `docs/backupBd/` - Backups do banco de dados

### Configuração de Conexão

As configurações do banco são definidas no arquivo `knexfile.js` e utilizam variáveis de ambiente do `.env`:

**Staging (Homologação):**
- `HOST_BD_STAGING`
- `PORT_BD_STAGING`
- `USER_BD_STAGING`
- `PASSWORD_BD_STAGING`
- `DATABASE_NAME_STAGING`

**Production (Produção):**
- `HOST_BD_PRODUCTION`
- `PORT_BD_PRODUCTION`
- `USER_BD_PRODUCTION`
- `PASSWORD_BD_PRODUCTION`
- `DATABASE_NAME_PRODUCTION`

### Boas Práticas com Migrations

1. **Sempre teste em staging primeiro** antes de aplicar em production
2. **Nunca edite migrations já aplicadas** - crie uma nova migration para correções
3. **Inclua sempre o método `down()`** para permitir rollback
4. **Use transações** para operações complexas
5. **Documente alterações significativas** nos comentários da migration

---

## 🔒 Segurança

- **JWT** para autenticação e autorização
- **bcrypt** para hash de senhas
- **Helmet** para headers de segurança HTTP
- **CORS** configurado
- **express-rate-limit** para proteção contra ataques de força bruta

---

## 📝 Logs

O sistema utiliza **Winston** para gerenciamento de logs.  
Os logs são salvos na pasta `log/` conforme configuração no arquivo `.env`.

---

## 🤝 Como Contribuir

Contribuições são bem-vindas! Para contribuir com este projeto:

1. **Fork o repositório**
   ```bash
   git clone https://github.com/seu-usuario/api-serve-node.git
   ```

2. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/sua-feature
   ```

3. **Commit suas mudanças**
   ```bash
   git commit -m 'Adiciona sua feature'
   ```

4. **Push para a branch**
   ```bash
   git push origin feature/sua-feature
   ```

5. **Abra um Pull Request**

### Diretrizes para Contribuição

- Siga o código existente (ESLint)
- Escreva testes para novas funcionalidades
- Mantenha a cobertura de testes acima de 80%
- Atualize a documentação conforme necessário
- Use commits semânticos (feat:, fix:, docs:, etc.)

---

## 🛣️ Roadmap

Planos futuros para o projeto:

### Curto Prazo (v1.1.0)
- [ ] Adicionar suporte a OAuth2
- [ ] Implementar refresh tokens
- [ ] Adicionar validação de email
- [ ] Melhorar cobertura de testes para 90%

### Médio Prazo (v1.2.0)
- [ ] Implementar 2FA (autenticação de dois fatores)
- [ ] Adicionar endpoints de permissões e roles
- [ ] Implementar soft delete para usuários
- [ ] Adicionar paginação avançada

### Longo Prazo (v2.0.0)
- [ ] Migrar para TypeScript
- [ ] Adicionar GraphQL como alternativa REST
- [ ] Implementar websockets para notificações em tempo real
- [ ] Adicionar cache com Redis
- [ ] Implementar auditoria completa

---

## 👤 Autor

**Eliezer de Oliveira**

---

## 📄 Licença

ISC

---

---

# 🇺🇸 Node.js API Server  
REST API with JWT authentication, MySQL and organized architecture for scalable applications.

---

## ✅ Prerequisites

Before you start, make sure you have installed:

- **Node.js** (version 18 or higher) - [Download](https://nodejs.org/)
- **npm** (usually included with Node.js)
- **MySQL** (version 5.7 or higher) - [Download](https://www.mysql.com/downloads/)
- **Git** (optional, for version control) - [Download](https://git-scm.com/)

To verify they are installed, run:
```bash
node --version
npm --version
mysql --version
```

---

## 🇺🇸 About the project

This is a **complete REST API**, developed in **Node.js** with **JWT authentication**, validation, connection with **MySQL** database and an organized architecture, ready for use in real systems.

The purpose of this project is to serve as a foundation for corporate applications, allowing:
- User authentication and management  
- Integration with external services  
- Route and middleware standardization  
- Layered organization (controllers, services, repositories)  
- Easy expansion for new features  

The API was built following best practices:
- Clean and scalable structure  
- Clear separation of responsibilities  
- JWT tokens for authorization  
- MySQL with environment variables  
- Ready-to-use development scripts  

---

## 📦 Technologies used
- Node.js  
- Express  
- MySQL / mysql2  
- Knex.js (Database Migrations)  
- JWT (jsonwebtoken)  
- bcrypt  
- dotenv  
- Nodemon  
- Jest (automated testing)  
- Winston (logging)  
- Swagger (documentation)  
- Helmet (security)  
- CORS  

---

## 📁 Project structure

```
api-serve-node/
├── docs/
│   ├── script.sql
│   └── backupBd/
│       ├── backup.sql
│       └── db_api_dev.sql
├── log/
├── models/
├── src/
│   ├── controllers/
│   │   ├── autorizacao.controller.js
│   │   └── usuario.controller.js
│   ├── repositories/
│   │   ├── autorizacao.repository.js
│   │   ├── db.js
│   │   └── usuario.repository.js
│   ├── routes/
│   │   ├── autorizacao.route.js
│   │   └── usuario.route.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── autorizacao.service.js
│   │   └── usuario.service.js
│   └── views/
│       └── home.html
├── env.txt
├── index.js
├── package.json
├── README.md
└── swagger.js
```

---

## 🔐 Authentication
Authentication is based on **JWT**.  
Login route returns:  
- access token  
- authenticated user data  

`auth` middleware protects private routes.

---

## 🔌 Main endpoints

### Authentication

#### **POST /api/v1/auth**
Authenticates the user and generates a JWT token.
- **Body**: `{ "usuario": "john.doe", "senha": "YWRtaW4=" }`
- **Response**: `{ "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }`

### Users (protected routes - require JWT token)

#### **POST /api/v1/usuario**
Creates a new user.
- **Body**: `{ "nome": "John Doe", "email": "johndoe@johndoe.com", "senha": "YWRtaW4=", "usuario": "john.doe" }`

#### **GET /api/v1/usuario**
Lists all registered users.

#### **GET /api/v1/usuario/:id**
Searches for a specific user by ID.

#### **PUT /api/v1/usuario**
Updates user information.
- **Body**: `{ "usuario": "john.doe", "nome": "John Doe", "email": "johndoe@johndoe.com", "senha": "bm92YVNlbmhhMTIz", "active": "S" }`

#### **DELETE /api/v1/usuario/:id**
Removes a user by ID.

---

## 💡 Use cases

### Case 1: User Authentication

**Scenario**: A user needs to authenticate to obtain a JWT token.

```bash
curl -X POST http://localhost:3000/api/v1/auth \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "john.doe",
    "senha": "YWRtaW4="
  }'
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Case 2: Create a New User

**Scenario**: An authenticated administrator wants to register a new user in the system.

```bash
curl -X POST http://localhost:3000/api/v1/usuario \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "nome": "Maria Silva",
    "email": "maria.silva@email.com",
    "senha": "c2VuaGFTZWd1cmE=",
    "usuario": "maria.silva"
  }'
```

**Response**:
```json
{
  "status": "sucesso",
  "message": "Usuário cadastrado com sucesso!"
}
```

---

### Case 3: List All Users

**Scenario**: An administrator wants to view all registered users.

```bash
curl -X GET http://localhost:3000/api/v1/usuario \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response**:
```json
[
  {
    "id": 1,
    "nome": "John Doe",
    "email": "johndoe@johndoe.com",
    "data_criacao": "2024-09-12T03:00:00Z",
    "data_alteracao": "2024-09-12T03:00:00Z"
  },
  {
    "id": 2,
    "nome": "Maria Silva",
    "email": "maria.silva@email.com",
    "data_criacao": "2024-09-15T10:30:00Z",
    "data_alteracao": "2024-09-15T10:30:00Z"
  }
]
```

---

### Case 4: Search for a Specific User

**Scenario**: Search for user details by ID.

```bash
curl -X GET http://localhost:3000/api/v1/usuario/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response**:
```json
{
  "id": 1,
  "nome": "John Doe",
  "email": "johndoe@johndoe.com",
  "usuario": "john.doe",
  "data_criacao": "2024-09-12T03:00:00Z",
  "data_alteracao": "2024-09-12T03:00:00Z"
}
```

---

### Case 5: Update User Data

**Scenario**: Update information for an existing user.

```bash
curl -X PUT http://localhost:3000/api/v1/usuario \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "usuario": "john.doe",
    "nome": "John Doe Updated",
    "email": "john.updated@email.com",
    "senha": "bm92YVNlbmhh",
    "active": "S"
  }'
```

**Response**:
```json
{
  "status": "sucesso",
  "id": 1,
  "affectedRows": 1,
  "message": "Usuário atualizado com sucesso!"
}
```

---

### Case 6: Remove User

**Scenario**: Remove a user from the system.

```bash
curl -X DELETE http://localhost:3000/api/v1/usuario/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response**:
```json
{
  "id": 1,
  "status": "sucesso",
  "message": "Registro removido com sucesso!"
}
```

---

### Complete Usage Flow

1. **Authenticate** using `POST /api/v1/auth` to obtain the JWT token
2. **Include the token** in the `Authorization: Bearer {token}` header in all protected requests
3. **Perform CRUD operations** (Create, Read, Update, Delete) on users
4. The JWT token expires after a defined period - you will need to authenticate again

---

## ⚙️ How to run the project

### 1. Clone the repository
```bash
git clone https://github.com/eliezereoc/api-serve-node
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Copy the `.env.example` file to `.env` and adjust the database settings:
```bash
cp .env.example .env
```

Configure the variables in the `.env` file:
- `PORT_LISTEN`: Server port (default: 3000)
- `HOST_BD_STAGING` / `HOST_BD_PRODUCTION`: MySQL host
- `USER_BD_STAGING` / `USER_BD_PRODUCTION`: Database user
- `PASSWORD_BD_STAGING` / `PASSWORD_BD_PRODUCTION`: Database password
- `DATABASE_NAME_STAGING` / `DATABASE_NAME_PRODUCTION`: Database name
- `NODE_ENV`: Environment (STAGING or PRODUCTION)
- `JWT_SECRET`: Secret key for JWT (generate a new one in production)

**Note**: The `env.txt` file is a backup of the previous configuration. Use `.env.example` as a reference.

### 4. Configure the database

**Option A: Using Migrations (Recommended)**

Run migrations to automatically create database tables:

```bash
# For STAGING environment
npm run migrate:staging

# For PRODUCTION environment
npm run migrate:production
```

Migrations automatically create:
- `usuario` table with all necessary fields
- Default admin user (username: `admin.admin`, password: `admin`)
- Indexes and constraints

**Option B: Using manual SQL scripts**

Execute the SQL scripts located in `docs/` to create the database:
```bash
docs/script.sql
```

### 5. Run the server
```bash
npm start
```

Access the application at:
```
http://localhost:3000
```

Swagger documentation:
```
http://localhost:3000/api-docs
```

---

## 🧪 Automated Testing

The project uses **Jest** for automated testing with full ES Modules support. With **60 tests** implemented covering services, controllers, and authentication.

### 📊 Test Status

```
Test Suites: 6 passed ✅
Tests:       63 passed ✅
Coverage:    56.32% of code
```

**Coverage by module:**
- **auth.service**: 100% ✅
- **autorizacao.service**: 100% ✅
- **autorizacao.controller**: 100% ✅
- **usuario.service**: 89.28% ✅
- **usuario.controller**: 89.28% ✅
- **rate limiter**: 100% ✅

### Running Tests

#### Watch Mode (development)
```bash
npm test
```
Tests run automatically when saving files. Press `q` to quit.

#### Run tests once
```bash
npm test -- --no-watch --no-coverage
```

#### Only tests from one file
```bash
npm test -- usuario.service.test.js
```

#### With detailed coverage report
```bash
npm test
```
(already included by default in the script)

### Test Structure

Tests are organized next to the files they test:
```
src/
├── limiter.test.js
├── services/
│   ├── auth.service.js
│   ├── auth.service.test.js
│   ├── autorizacao.service.js
│   ├── autorizacao.service.test.js
│   ├── usuario.service.js
│   └── usuario.service.test.js
├── controllers/
│   ├── autorizacao.controller.js
│   ├── autorizacao.controller.test.js
│   ├── usuario.controller.js
│   └── usuario.controller.test.js
```

### Implemented Tests

#### AuthService (6 tests)
- ✅ Create token with correct payload
- ✅ Use HS256 algorithm and 1h expiration
- ✅ Verify token with Bearer format
- ✅ Store user data in req.user
- ✅ Return 401 error for invalid tokens
- ✅ Validate JWT_SECRET from environment

#### AutorizacaoService (4 tests)
- ✅ Authenticate user successfully
- ✅ Validate password with bcrypt
- ✅ Return error when user doesn't exist
- ✅ Return error when password is incorrect

#### UsuarioService (17 tests)
- ✅ Create user successfully
- ✅ Validate duplicate email
- ✅ Validate duplicate username
- ✅ Reactivate inactive user
- ✅ Password hash with bcrypt
- ✅ List users
- ✅ Search user by ID
- ✅ Delete user
- ✅ Prevent self-delete of account
- ✅ Update user
- ✅ Database error handling

#### AutorizacaoController (11 tests)
- ✅ Authenticate and generate token
- ✅ Validate required fields
- ✅ Return 401 error for invalid authentication
- ✅ Return error when token is not created
- ✅ Exception handling

#### UsuarioController (16 tests)
- ✅ Create user with validation
- ✅ List users
- ✅ Search specific user
- ✅ Delete user
- ✅ Update user
- ✅ HTTP error handling
- ✅ Input data validation
- ✅ Call next() middleware on exceptions

#### Rate Limiter (3 tests)
- ✅ Allow up to 10 requests and block the 11th
- ✅ Return status 429 when limit exceeded
- ✅ Apply rate limit globally on root route
- Protection configured for maximum of 10 requests per second
- Automatic response with status 429 (Too Many Requests)
- Prevents brute force attacks and DDoS

### Test Example

```javascript
describe('UsuarioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user successfully', async () => {
    const usuario = {
      usuario: 'testuser',
      email: 'test@example.com',
      senha: Buffer.from('senha123').toString('base64'),
      nome: 'Test User'
    };

    UsuarioRepository.getUsuarioByEmail.mockResolvedValue([null]);
    UsuarioRepository.getUsuarioByUsuario.mockResolvedValue([null]);
    bcrypt.hash.mockResolvedValue('hashedPassword123');
    UsuarioRepository.createUsuario.mockResolvedValue({ status: 'sucesso' });

    const result = await UsuarioService.createUsuario(usuario);

    expect(result.status).toBe('sucesso');
    expect(result.code).toBe(200);
    expect(UsuarioRepository.createUsuario).toHaveBeenCalled();
  });
});
```

#### Rate Limiter Test

```javascript
describe('Rate Limiter Tests', () => {
  it('should allow up to 10 requests and block the 11th', async () => {
    const endpoint = '/';
    let successCount = 0;
    let blockedCount = 0;

    // Make 15 requests to ensure we exceed the limit of 10
    for (let i = 1; i <= 15; i++) {
      const response = await request(app).get(endpoint);

      if (response.status === 429) {
        blockedCount++;
      } else {
        successCount++;
      }
    }

    // Verify that requests were blocked
    expect(blockedCount).toBeGreaterThan(0);
    // Verify that blocking started after approximately 10 requests
    expect(successCount).toBeGreaterThanOrEqual(8);
    expect(successCount).toBeLessThanOrEqual(10);
  });
});
```

### Code Coverage

Jest automatically generates a coverage report showing:
- **% Stmts** - Percentage of statements (lines) executed
- **% Branch** - Percentage of branches (if/else) executed
- **% Funcs** - Percentage of functions executed
- **% Lines** - Percentage of lines covered

Report example:
```
usuario.service.js | 89.28 | 82.14 | 100 | 89.09
```
= 89% of code is covered by tests

### Mocks Used

Tests use mocks for isolation:
- **UsuarioRepository** - Database operations
- **bcrypt** - Password hashing
- **JWT** - Token creation and verification
- **logger** - Global logs
- **mysql2/promise** - DB connection (disabled in tests)

### 💡 Best Practices Implemented

1. **Isolation** - Each test is independent
2. **Setup/Teardown** - `beforeEach()` clears mocks
3. **Descriptive names** - Tests explain what they test
4. **Edge case coverage** - Errors, validations, exceptions
5. **Appropriate mocks** - No real dependencies (DB, APIs)

### 🔧 Configuration

Jest configuration is in `jest.config.js`:
- ✅ ES Modules support
- ✅ Automatic Babel transpilation
- ✅ Automatic coverage
- ✅ Timeout configured for async operations

---

## 📚 Interactive Documentation with Swagger

The API has complete interactive documentation using **Swagger UI**, allowing you to view and test all endpoints directly in the browser.

### 🌐 Access Documentation

After starting the server, access:
```
http://localhost:3000/api-docs
```

### 📋 Available Features

Swagger documentation includes:

#### ✅ Complete View
- List of all available endpoints
- HTTP methods (GET, POST, PUT, DELETE)
- Required parameters (body, query, params)
- Request and response examples
- HTTP status codes

#### 🔐 JWT Authentication
- "Authorize" button to insert JWT token
- Format: `Bearer {your-token-here}`
- Token valid for 1 hour after authentication
- Easily test protected endpoints

#### 🧪 Test Endpoints

1. **Authenticate** first via `POST /api/v1/auth`:
   ```json
   {
     "usuario": "your-username",
     "senha": "c2VuaGFCYXNlNjQ="
   }
   ```

2. **Copy token** from response

3. **Click "Authorize"** (padlock at top)

4. **Insert token** in format: `Bearer {token}`

5. **Test protected endpoints**:
   - GET /api/v1/usuario - List users
   - POST /api/v1/usuario - Create user
   - PUT /api/v1/usuario - Update user
   - DELETE /api/v1/usuario/{id} - Delete user

### 📝 Documented Endpoints

#### Authentication
- `POST /api/v1/auth` - Generate JWT token

#### Users (Protected 🔒)
- `GET /api/v1/usuario` - List all users
- `GET /api/v1/usuario/{id}` - Search user by ID
- `POST /api/v1/usuario` - Create new user
- `PUT /api/v1/usuario` - Update user
- `DELETE /api/v1/usuario/{id}` - Delete user

### 💡 Usage Tips

**Base64 Password:**
- Passwords must be sent encoded in Base64
- Example: `senha123` → `c2VuaGExMjM=`
- Use: `echo -n "senha123" | base64` in terminal

**Test Responses:**
- Swagger shows real response examples
- Status codes: 200 (success), 401 (unauthorized), 404 (not found)
- Detailed error messages

**Validations:**
- Required fields marked with `*`
- Expected data format
- Size and type restrictions

### 🔧 Configuration

Swagger documentation is configured in `swagger.js` with:
- Project information
- API version
- Base URL server
- Data schemas
- Request examples

---

## 🗄️ Banco de Dados

O projeto usa **MySQL** como banco de dados relacional.

### Gerenciamento com Migrations

O projeto utiliza **Knex.js** para gerenciar migrations do banco de dados, permitindo:
- ✅ Controle de versionamento do schema
- ✅ Rastreamento de alterações aplicadas
- ✅ Rollback de mudanças quando necessário
- ✅ Sincronização entre ambientes (staging/production)

### Comandos de Migration

#### Executar migrations pendentes
```bash
# Ambiente de STAGING (homologação)
npm run migrate:staging

# Ambiente de PRODUCTION (produção)
npm run migrate:production
```

#### Reverter última migration
```bash
# Staging
npm run migrate:rollback:staging

# Production
npm run migrate:rollback:production
```

#### Verificar status das migrations
```bash
# Ver quais migrations foram aplicadas
npm run migrate:status:staging
npm run migrate:status:production
```

#### Criar nova migration
```bash
npm run migrate:make nome_da_migration
```

Exemplo:
```bash
npm run migrate:make add_phone_to_usuario
```

Isso criará um novo arquivo em `migrations/` com o timestamp:
```
migrations/20251222120000_add_phone_to_usuario.js
```

### Estrutura de uma Migration

```javascript
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Código para aplicar a migration (criar/alterar tabelas)
  await knex.schema.alterTable('usuario', (table) => {
    table.string('telefone', 20).nullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Código para reverter a migration (rollback)
  await knex.schema.alterTable('usuario', (table) => {
    table.dropColumn('telefone');
  });
}
```

### Migrations Disponíveis

#### `20240911000000_create_usuario_table.js`
- Cria tabela `usuario` com campos:
  - `id` (auto-incremento, chave primária)
  - `nome` (VARCHAR 150)
  - `email` (VARCHAR 150, único)
  - `senha` (VARCHAR 150, hash bcrypt)
  - `usuario` (VARCHAR 50, único)
  - `active` (CHAR 1, padrão 'S')
  - `data_criacao` (TIMESTAMP)
  - `data_alteracao` (TIMESTAMP, nullable)
- Insere usuário admin padrão

### Scripts SQL Alternativos

Scripts SQL manuais ainda estão disponíveis em:
- `docs/script.sql` - Scripts de criação e alteração
- `docs/backupBd/` - Backups do banco de dados

### Configuração de Conexão

As configurações do banco são definidas no arquivo `knexfile.js` e utilizam variáveis de ambiente do `.env`:

**Staging (Homologação):**
- `HOST_BD_STAGING`
- `PORT_BD_STAGING`
- `USER_BD_STAGING`
- `PASSWORD_BD_STAGING`
- `DATABASE_NAME_STAGING`

**Production (Produção):**
- `HOST_BD_PRODUCTION`
- `PORT_BD_PRODUCTION`
- `USER_BD_PRODUCTION`
- `PASSWORD_BD_PRODUCTION`
- `DATABASE_NAME_PRODUCTION`

### Boas Práticas com Migrations

1. **Sempre teste em staging primeiro** antes de aplicar em production
2. **Nunca edite migrations já aplicadas** - crie uma nova migration para correções
3. **Inclua sempre o método `down()`** para permitir rollback
4. **Use transações** para operações complexas
5. **Documente alterações significativas** nos comentários da migration

---

## 🔒 Segurança

- **JWT** para autenticação e autorização
- **bcrypt** para hash de senhas
- **Helmet** para headers de segurança HTTP
- **CORS** configurado
- **express-rate-limit** para proteção contra ataques de força bruta

---

## 📝 Logs

O sistema utiliza **Winston** para gerenciamento de logs.  
Os logs são salvos na pasta `log/` conforme configuração no arquivo `.env`.

---

## 👤 Autor

**Eliezer de Oliveira**

---

## 📄 Licença

ISC

---
---

# 🇺🇸 Node.js API Server  
REST API with JWT authentication, MySQL and organized architecture for scalable applications.

## 🇺🇸 About the project

This is a **complete REST API**, developed in **Node.js** with **JWT authentication**, validation, connection with **MySQL** database and an organized architecture, ready for use in real systems.

The purpose of this project is to serve as a foundation for corporate applications, allowing:
- User authentication and management  
- Integration with external services  
- Route and middleware standardization  
- Layered organization (controllers, services, repositories)  
- Easy expansion for new features  

The API was built following best practices:
- Clean and scalable structure  
- Clear separation of responsibilities  
- JWT tokens for authorization  
- MySQL with environment variables  
- Ready-to-use development scripts  

---

## 📦 Technologies used
- Node.js  
- Express  
- MySQL / mysql2  
- Knex.js (Database Migrations)  
- JWT (jsonwebtoken)  
- bcrypt  
- dotenv  
- Nodemon  
- Jest (automated testing)  
- Winston (logging)  
- Swagger (documentation)  
- Helmet (security)  
- CORS  

---

## 🔒 Security

- **JWT** for authentication and authorization
- **bcrypt** for password hashing
- **Helmet** for HTTP security headers
- **CORS** configured
- **express-rate-limit** for brute force attack protection

---

---

## 🤝 How to Contribute

Contributions are welcome! To contribute to this project:

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/api-serve-node.git
   ```

2. **Create a branch for your feature**
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add your feature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/your-feature
   ```

5. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style (ESLint)
- Write tests for new features
- Keep test coverage above 80%
- Update documentation as needed
- Use semantic commits (feat:, fix:, docs:, etc.)

---

## 🛣️ Roadmap

Future plans for the project:

### Short Term (v1.1.0)
- [ ] Add OAuth2 support
- [ ] Implement refresh tokens
- [ ] Add email validation
- [ ] Improve test coverage to 90%

### Mid Term (v1.2.0)
- [ ] Implement 2FA (two-factor authentication)
- [ ] Add permissions and roles endpoints
- [ ] Implement soft delete for users
- [ ] Add advanced pagination

### Long Term (v2.0.0)
- [ ] Migrate to TypeScript
- [ ] Add GraphQL as REST alternative
- [ ] Implement websockets for real-time notifications
- [ ] Add cache with Redis
- [ ] Implement complete audit trail

---

## 👤 Author

**Eliezer de Oliveira**

---

## 📄 License

ISC

---
---

# 🇺🇸 English Version

---

## 🗄️ Database

The project uses **MySQL** as a relational database.

### Migration Management

The project uses **Knex.js** to manage database migrations, allowing:
- ✅ Schema version control
- ✅ Track applied changes
- ✅ Rollback changes when needed
- ✅ Synchronization between environments (staging/production)

### Migration Commands

#### Run pending migrations
```bash
# STAGING environment (development)
npm run migrate:staging

# PRODUCTION environment
npm run migrate:production
```

#### Rollback last migration
```bash
# Staging
npm run migrate:rollback:staging

# Production
npm run migrate:rollback:production
```

#### Check migration status
```bash
# See which migrations have been applied
npm run migrate:status:staging
npm run migrate:status:production
```

#### Create new migration
```bash
npm run migrate:make migration_name
```

Example:
```bash
npm run migrate:make add_phone_to_usuario
```

This will create a new file in `migrations/` with timestamp:
```
migrations/20251222120000_add_phone_to_usuario.js
```

### Migration Structure

```javascript
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Code to apply migration (create/alter tables)
  await knex.schema.alterTable('usuario', (table) => {
    table.string('telefone', 20).nullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Code to revert migration (rollback)
  await knex.schema.alterTable('usuario', (table) => {
    table.dropColumn('telefone');
  });
}
```

### Available Migrations

#### `20240911000000_create_usuario_table.js`
- Creates `usuario` table with fields:
  - `id` (auto-increment, primary key)
  - `nome` (VARCHAR 150)
  - `email` (VARCHAR 150, unique)
  - `senha` (VARCHAR 150, bcrypt hash)
  - `usuario` (VARCHAR 50, unique)
  - `active` (CHAR 1, default 'S')
  - `data_criacao` (TIMESTAMP)
  - `data_alteracao` (TIMESTAMP, nullable)
- Inserts default admin user

### Alternative SQL Scripts

Manual SQL scripts are still available at:
- `docs/script.sql` - Creation and alteration scripts
- `docs/backupBd/` - Database backups

### Connection Configuration

Database settings are defined in `knexfile.js` and use environment variables from `.env`:

**Staging (Development):**
- `HOST_BD_STAGING`
- `PORT_BD_STAGING`
- `USER_BD_STAGING`
- `PASSWORD_BD_STAGING`
- `DATABASE_NAME_STAGING`

**Production:**
- `HOST_BD_PRODUCTION`
- `PORT_BD_PRODUCTION`
- `USER_BD_PRODUCTION`
- `PASSWORD_BD_PRODUCTION`
- `DATABASE_NAME_PRODUCTION`

### Migration Best Practices

1. **Always test in staging first** before applying to production
2. **Never edit already applied migrations** - create a new migration for fixes
3. **Always include the `down()` method** to allow rollback
4. **Use transactions** for complex operations
5. **Document significant changes** in migration comments

### Why Use Migrations?

**Before (Manual SQL):**
```sql
-- Each developer runs SQL manually
-- Hard to track what's been applied
-- Risk of missing changes in production
-- No rollback capability
```

**After (Knex Migrations):**
```bash
# One command applies all pending changes
npm run migrate:staging

# Easy rollback if something goes wrong
npm run migrate:rollback:staging

# See exactly what's been applied
npm run migrate:status:staging
```

### Migration Workflow Example

1. **Create new feature needing database change:**
```bash
npm run migrate:make add_user_roles
```

2. **Edit the generated migration file:**
```javascript
export async function up(knex) {
  await knex.schema.alterTable('usuario', (table) => {
    table.enum('role', ['admin', 'user', 'guest']).defaultTo('user');
  });
}

export async function down(knex) {
  await knex.schema.alterTable('usuario', (table) => {
    table.dropColumn('role');
  });
}
```

3. **Test in staging:**
```bash
npm run migrate:staging
```

4. **If all good, apply to production:**
```bash
npm run migrate:production
```

5. **If something goes wrong, rollback:**
```bash
npm run migrate:rollback:staging
```

---
