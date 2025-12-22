# API Server Node.js  
REST API com autenticação JWT, MySQL e arquitetura organizada para aplicações escaláveis.

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
- JWT (jsonwebtoken)  
- bcrypt  
- dotenv  
- Nodemon  
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
- **Body**: `{ "usuario": "john.doe", "nome": "John Doe", "email": "johndoe@johndoe.com", "senha": "novaSenha123", "active": "S" }`

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
Test Suites: 5 passed ✅
Tests:       60 passed ✅
Coverage:    56.32% do código
```

**Cobertura por módulo:**
- **auth.service**: 100% ✅
- **autorizacao.service**: 100% ✅
- **autorizacao.controller**: 100% ✅
- **usuario.service**: 89.28% ✅
- **usuario.controller**: 89.28% ✅

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

O projeto utiliza **MySQL** como banco de dados relacional.  
Scripts SQL para criação das tabelas estão disponíveis em `docs/script.sql`.  
Backups do banco de dados estão em `docs/backupBd/`.

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
- JWT (jsonwebtoken)  
- bcrypt  
- dotenv  
- Nodemon  
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
- **Body**: `{ "usuario": "john.doe", "nome": "John Doe", "email": "johndoe@johndoe.com", "senha": "novaSenha123", "active": "S" }`

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

## 📚 Interactive Documentation

The API has interactive documentation using **Swagger**, accessible at `/api-docs`. 
Through it you can test all endpoints directly in the browser.

---

## 🗄️ Database

The project uses **MySQL** as a relational database.  
SQL scripts for creating tables are available in `docs/script.sql`.  
Database backups are in `docs/backupBd/`.

---

## 🔒 Security

- **JWT** for authentication and authorization
- **bcrypt** for password hashing
- **Helmet** for HTTP security headers
- **CORS** configured
- **express-rate-limit** for brute force attack protection

---

## 📝 Logs

The system uses **Winston** for log management.  
Logs are saved in the `log/` folder according to the configuration in the `.env` file.

---

## 👤 Author

**Eliezer de Oliveira**

---

## 📄 License

ISC
