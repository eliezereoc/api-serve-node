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
Renomeie o arquivo `env.txt` para `.env` e ajuste as configurações do banco de dados:
```bash
cp env.txt .env
```

Configure as variáveis no arquivo `.env`:
- `PORT_LISTEN`: Porta do servidor (padrão: 3000)
- `HOST_BD_STAGING` / `HOST_BD_PRODUCTION`: Host do MySQL
- `USER_BD_STAGING` / `USER_BD_PRODUCTION`: Usuário do banco
- `PASSWORD_BD_STAGING` / `PASSWORD_BD_PRODUCTION`: Senha do banco
- `DATABASE_NAME_STAGING` / `DATABASE_NAME_PRODUCTION`: Nome do banco
- `NODE_ENV`: Ambiente (STAGING ou PRODUCTION)
- `JWT_SECRET`: Chave secreta para JWT

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

## 📚 Documentação Interativa

A API possui documentação interativa usando **Swagger**, acessível em `/api-docs`. 
Através dela você pode testar todos os endpoints diretamente no navegador.

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
