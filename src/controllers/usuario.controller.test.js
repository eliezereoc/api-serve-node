import UsuarioController from '../controllers/usuario.controller.js';
import UsuarioService from '../services/usuario.service.js';

// Mock global do logger
global.logger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Mock do serviço
jest.mock('../services/usuario.service.js');

describe('UsuarioController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: { id: 1, usuario: 'admin' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('createUsuario', () => {
    it('deve retornar 200 quando usuário é criado com sucesso', async () => {
      req.body = {
        usuario: 'testuser',
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'senhaEncoded'
      };

      UsuarioService.createUsuario.mockResolvedValue({
        status: 'sucesso',
        code: 200,
        message: 'Usuário cadastrado com sucesso!'
      });

      await UsuarioController.createUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve retornar 409 quando email já existe', async () => {
      req.body = {
        usuario: 'testuser',
        nome: 'Test User',
        email: 'existing@example.com',
        senha: 'senhaEncoded'
      };

      UsuarioService.createUsuario.mockResolvedValue({
        status: 'erro',
        code: 409,
        message: 'E-mail já está em uso.'
      });

      await UsuarioController.createUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve chamar next() se dados obrigatórios faltam', async () => {
      req.body = {
        usuario: 'testuser'
        // falta nome, email e senha
      };

      await UsuarioController.createUsuario(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve retornar erro 409 quando usuário já existe', async () => {
      req.body = {
        usuario: 'existinguser',
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'senhaEncoded'
      };

      UsuarioService.createUsuario.mockResolvedValue({
        status: 'erro',
        code: 409,
        message: 'Usuário já cadastrado.'
      });

      await UsuarioController.createUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe('getUsuarios', () => {
    it('deve retornar lista de usuários com status 200', async () => {
      const usuarios = [
        { id: 1, usuario: 'user1', email: 'user1@example.com', nome: 'User 1' },
        { id: 2, usuario: 'user2', email: 'user2@example.com', nome: 'User 2' }
      ];

      UsuarioService.getUsuarios.mockResolvedValue(usuarios);

      await UsuarioController.getUsuarios(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(usuarios);
    });

    it('deve retornar status 404 quando não há usuários', async () => {
      UsuarioService.getUsuarios.mockResolvedValue([]);

      await UsuarioController.getUsuarios(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve chamar next com erro quando ocorre exceção', async () => {
      const erro = new Error('Database error');
      UsuarioService.getUsuarios.mockRejectedValue(erro);

      await UsuarioController.getUsuarios(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('getUsuario', () => {
    it('deve retornar usuário específico com status 200', async () => {
      const usuario = [
        {
          id: 1,
          usuario: 'john.doe',
          email: 'john@example.com',
          nome: 'John Doe'
        }
      ];

      req.params.id = 1;

      UsuarioService.getUsuario.mockResolvedValue(usuario);

      await UsuarioController.getUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(usuario);
      expect(UsuarioService.getUsuario).toHaveBeenCalledWith(1);
    });

    it('deve retornar status 404 quando usuário não existe', async () => {
      req.params.id = 999;

      UsuarioService.getUsuario.mockResolvedValue([]);

      await UsuarioController.getUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve chamar next com erro quando ocorre exceção', async () => {
      req.params.id = 1;

      const erro = new Error('Database error');
      UsuarioService.getUsuario.mockRejectedValue(erro);

      await UsuarioController.getUsuario(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('deleteUsuario', () => {
    it('deve deletar usuário com sucesso retornando status 200', async () => {
      req.params.id = 2;
      req.user = { id: 1 };

      UsuarioService.deleteUsuario.mockResolvedValue({
        status: 'sucesso',
        message: 'Usuário excluído com sucesso.'
      });

      await UsuarioController.deleteUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(UsuarioService.deleteUsuario).toHaveBeenCalledWith(2, 1);
    });

    it('deve retornar erro 403 ao tentar deletar própria conta', async () => {
      req.params.id = 1;
      req.user = { id: 1 };

      UsuarioService.deleteUsuario.mockResolvedValue({
        status: 'erro',
        code: 403,
        message: 'Você não pode excluir sua própria conta.'
      });

      await UsuarioController.deleteUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deve retornar erro 404 quando usuário não existe', async () => {
      req.params.id = 999;
      req.user = { id: 1 };

      UsuarioService.deleteUsuario.mockResolvedValue({
        status: 'erro',
        code: 404,
        message: 'Usuário não encontrado.'
      });

      await UsuarioController.deleteUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deve chamar next com erro quando ocorre exceção', async () => {
      req.params.id = 2;
      req.user = { id: 1 };

      const erro = new Error('Database error');
      UsuarioService.deleteUsuario.mockRejectedValue(erro);

      await UsuarioController.deleteUsuario(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('updateUsuario', () => {
    it('deve atualizar usuário com sucesso retornando status 200', async () => {
      req.body = {
        usuario: 'john.doe',
        nome: 'John Doe Updated',
        email: 'john.updated@example.com',
        senha: 'novaSenha',
        active: 'S'
      };

      UsuarioService.updateUsuario.mockResolvedValue({
        status: 'sucesso',
        message: 'Usuário foi alterado com sucesso.'
      });

      await UsuarioController.updateUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(UsuarioService.updateUsuario).toHaveBeenCalledWith(req.body);
    });

    it('deve retornar erro 400 quando campo usuario está faltando', async () => {
      req.body = {
        nome: 'John Doe Updated',
        email: 'john.updated@example.com',
        senha: 'novaSenha',
        active: 'S'
      };

      await UsuarioController.updateUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve retornar erro 404 quando usuário não encontrado', async () => {
      req.body = {
        usuario: 'inexistente',
        nome: 'Test',
        email: 'test@example.com',
        senha: 'senha',
        active: 'S'
      };

      UsuarioService.updateUsuario.mockResolvedValue({
        status: 'erro',
        code: 404,
        message: 'Usuário não encontrado.'
      });

      await UsuarioController.updateUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deve retornar sucesso com json quando usuário é atualizado', async () => {
      req.body = {
        usuario: 'john.doe',
        nome: 'John Doe Updated',
        email: 'john.updated@example.com',
        senha: 'novaSenha',
        active: 'S'
      };

      UsuarioService.updateUsuario.mockResolvedValue({
        status: 'sucesso',
        message: 'Usuário foi alterado com sucesso.'
      });

      await UsuarioController.updateUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('deve chamar next com erro quando ocorre exceção', async () => {
      req.body = {
        usuario: 'john.doe',
        nome: 'John',
        email: 'john@example.com',
        senha: 'senha',
        active: 'S'
      };

      const erro = new Error('Database error');
      UsuarioService.updateUsuario.mockRejectedValue(erro);

      await UsuarioController.updateUsuario(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
