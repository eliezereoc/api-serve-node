import authService from '../services/auth.service.js';
import jwt from 'jsonwebtoken';

// Mock global do logger
global.logger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Mock do JWT
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe('criarToken', () => {
    it('deve criar token com sucesso', async () => {
      const usuario = {
        id: 1,
        usuario: 'john.doe',
        nome: 'John Doe',
        email: 'john@example.com'
      };

      const tokenMock = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      jwt.sign.mockReturnValue(tokenMock);

      const result = await authService.criarToken(usuario);

      expect(result).toBe(tokenMock);
      expect(jwt.sign).toHaveBeenCalled();
    });

    it('deve incluir payload correto no token', async () => {
      const usuario = {
        id: 1,
        usuario: 'john.doe',
        nome: 'John Doe',
        email: 'john@example.com'
      };

      const tokenMock = 'token123';
      jwt.sign.mockReturnValue(tokenMock);

      await authService.criarToken(usuario);

      const callArgs = jwt.sign.mock.calls[0];
      const payload = callArgs[0];

      expect(payload.id).toBe(usuario.id);
      expect(payload.usuario).toBe(usuario.usuario);
      expect(payload.nome).toBe(usuario.nome);
      expect(payload.email).toBe(usuario.email);
    });

    it('deve usar algoritmo HS256 e expiração de 1h', async () => {
      const usuario = {
        id: 1,
        usuario: 'test',
        nome: 'Test User',
        email: 'test@example.com'
      };

      jwt.sign.mockReturnValue('token');

      await authService.criarToken(usuario);

      const callArgs = jwt.sign.mock.calls[0];
      const options = callArgs[2];

      expect(options.algorithm).toBe('HS256');
      expect(options.expiresIn).toBe('1h');
    });

    it('deve usar JWT_SECRET do environment', async () => {
      const usuario = {
        id: 1,
        usuario: 'test',
        nome: 'Test',
        email: 'test@example.com'
      };

      jwt.sign.mockReturnValue('token');

      await authService.criarToken(usuario);

      const callArgs = jwt.sign.mock.calls[0];
      const secret = callArgs[1];

      expect(secret).toBe(process.env.JWT_SECRET);
    });
  });

  describe('auth middleware', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        headers: {}
      };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis()
      };
      next = jest.fn();
    });

    it('deve retornar erro quando token não é fornecido', async () => {
      req.headers.authorization = undefined;

      await authService.auth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ erro: 'Informe um Token válido!' });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro quando token não tem formato Bearer', async () => {
      req.headers.authorization = 'InvalidToken123';
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid token'));
      });

      await authService.auth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({ erro: 'Informe um Token válido!' });
    });

    it('deve extrair token do formato Bearer corretamente', async () => {
      const tokenValue = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      req.headers.authorization = `Bearer ${tokenValue}`;

      const mockUser = { id: 1, usuario: 'john.doe' };
      jwt.verify.mockImplementation((token, secret, callback) => {
        expect(token).toBe(tokenValue);
        callback(null, mockUser);
      });

      await authService.auth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(mockUser);
    });

    it('deve funcionar com token sem prefixo Bearer', async () => {
      const tokenValue = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      req.headers.authorization = tokenValue;

      const mockUser = { id: 1, usuario: 'john.doe' };
      jwt.verify.mockImplementation((token, secret, callback) => {
        expect(token).toBe(tokenValue);
        callback(null, mockUser);
      });

      await authService.auth(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve armazenar dados do usuário em req.user após verificação', async () => {
      req.headers.authorization = 'Bearer token123';

      const mockUser = {
        id: 1,
        usuario: 'john.doe',
        nome: 'John Doe'
      };

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockUser);
      });

      await authService.auth(req, res, next);

      expect(req.user).toEqual(mockUser);
    });

    it('deve retornar erro 401 quando token é inválido', async () => {
      req.headers.authorization = 'Bearer invalidToken';

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid signature'));
      });

      await authService.auth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({ erro: 'Informe um Token válido!' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
