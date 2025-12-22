import autorizacaoController from '../controllers/autorizacao.controller.js';
import autorizacaoService from '../services/autorizacao.service.js';
import authService from '../services/auth.service.js';

// Mock global do logger
global.logger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Mock dos serviços
jest.mock('../services/autorizacao.service.js');
jest.mock('../services/auth.service.js');

describe('AutorizacaoController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    next = jest.fn();
    jest.clearAllMocks();
    process.env.APP_NAME = 'API Test';
  });

  describe('verificaUsuario', () => {
    it('deve retornar erro 400 quando campo usuario não é fornecido', async () => {
      req.body = {
        senha: 'senhaEncoded'
      };

      await autorizacaoController.verificaUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Campos usuário e senha são obrigatorios!'
      });
    });

    it('deve retornar erro 400 quando campo senha não é fornecido', async () => {
      req.body = {
        usuario: 'john.doe'
      };

      await autorizacaoController.verificaUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Campos usuário e senha são obrigatorios!'
      });
    });

    it('deve retornar erro 400 quando ambos campos estão faltando', async () => {
      req.body = {};

      await autorizacaoController.verificaUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve retornar token com sucesso após autenticação válida', async () => {
      const usuario = {
        usuario: 'john.doe',
        senha: Buffer.from('senha123').toString('base64')
      };

      req.body = usuario;

      const usuarioAutenticado = {
        id: 1,
        usuario: 'john.doe',
        nome: 'John Doe',
        email: 'john@example.com'
      };

      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

      autorizacaoService.getUsuarioAuth.mockResolvedValue({
        status: 'ok',
        usuario: usuarioAutenticado
      });

      authService.criarToken.mockResolvedValue(token);

      await autorizacaoController.verificaUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ access_token: token });
    });

    it('deve retornar erro 401 quando autenticação falha', async () => {
      req.body = {
        usuario: 'john.doe',
        senha: 'senhaErrada'
      };

      const erroAutenticacao = {
        status: 'erro',
        code: 401,
        message: 'Usuário ou senha inválidos.'
      };

      autorizacaoService.getUsuarioAuth.mockResolvedValue(erroAutenticacao);

      await autorizacaoController.verificaUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith(erroAutenticacao);
      expect(authService.criarToken).not.toHaveBeenCalled();
    });

    it('deve retornar erro quando token não é criado', async () => {
      const usuario = {
        usuario: 'john.doe',
        senha: 'senhaValida'
      };

      req.body = usuario;

      autorizacaoService.getUsuarioAuth.mockResolvedValue({
        status: 'ok',
        usuario: { id: 1, usuario: 'john.doe' }
      });

      authService.criarToken.mockResolvedValue('');

      await autorizacaoController.verificaUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Falha na autenticação: token não encontrado'
      });
    });

    it('deve retornar erro quando token é undefined', async () => {
      const usuario = {
        usuario: 'john.doe',
        senha: 'senhaValida'
      };

      req.body = usuario;

      autorizacaoService.getUsuarioAuth.mockResolvedValue({
        status: 'ok',
        usuario: { id: 1, usuario: 'john.doe' }
      });

      authService.criarToken.mockResolvedValue(undefined);

      await autorizacaoController.verificaUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Falha na autenticação: token não encontrado'
      });
    });

    it('deve retornar erro 500 quando ocorre exceção', async () => {
      req.body = {
        usuario: 'john.doe',
        senha: 'senha123'
      };

      const erro = new Error('Database connection failed');
      autorizacaoService.getUsuarioAuth.mockRejectedValue(erro);

      await autorizacaoController.verificaUsuario(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve chamar getUsuarioAuth com dados corretos', async () => {
      const usuario = {
        usuario: 'john.doe',
        senha: Buffer.from('senha123').toString('base64')
      };

      req.body = usuario;

      autorizacaoService.getUsuarioAuth.mockResolvedValue({
        status: 'ok',
        usuario: { id: 1 }
      });

      authService.criarToken.mockResolvedValue('token123');

      await autorizacaoController.verificaUsuario(req, res, next);

      expect(autorizacaoService.getUsuarioAuth).toHaveBeenCalledWith({
        usuario: usuario.usuario,
        senha: usuario.senha
      });
    });

    it('deve chamar criarToken com dados do usuário autenticado', async () => {
      req.body = {
        usuario: 'john.doe',
        senha: 'senhaEncoded'
      };

      const usuarioAutenticado = {
        id: 5,
        usuario: 'john.doe',
        nome: 'John Doe',
        email: 'john@example.com'
      };

      autorizacaoService.getUsuarioAuth.mockResolvedValue({
        status: 'ok',
        usuario: usuarioAutenticado
      });

      authService.criarToken.mockResolvedValue('token123');

      await autorizacaoController.verificaUsuario(req, res, next);

      expect(authService.criarToken).toHaveBeenCalledWith(usuarioAutenticado);
    });
  });
});
