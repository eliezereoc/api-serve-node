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
- JWT  
- bcrypt  
- dotenv  
- Nodemon  
- JavaScript/TypeScript (se aplicável)  

---

## 📁 Estrutura do projeto

/src
│── controllers
│── services
│── repositories
│── middlewares
│── routes
│── database
├── .env.example
├── server.js


---

## 🔐 Autenticação
A autenticação é baseada em **JWT**.  
Rota de login retorna:  
- token de acesso  
- dados do usuário autenticado  

Middleware `auth` protege rotas privadas.

---

## 🔌 Endpoints principais

### **POST /auth/login**
Autentica o usuário e gera um token JWT.

### **POST /users**
Cria um novo usuário.

### **GET /users**
Lista usuários (rota protegida).

### **GET /users/:id**
Busca um usuário pelo ID.

*(Ajuste conforme seu código atual — posso personalizar depois)*

---

## ⚙️ Como rodar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/eliezereoc/api-serve-node

### 2. Instalar as dependências
npm install

### 3. Criar o arquivo
cp .env.example .env

### 4. Rodar o servidor
npm run dev

http://localhost:3000
