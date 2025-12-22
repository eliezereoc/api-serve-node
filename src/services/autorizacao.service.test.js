import autorizacaoService from '../services/autorizacao.service.js';
import autorizacaoRepository from '../repositories/autorizacao.repository.js';
import bcrypt from 'bcrypt';

// Mock global do logger
global.logger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Mock do repositório
jest.mock('../repositories/autorizacao.repository.js');

// Mock do bcrypt
jest.mock('bcrypt');

describe('AutorizacaoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsuarioAuth', () => {
    it('deve retornar usuário autenticado com sucesso', async () => {
      const usuario = {
        usuario: 'john.doe',
        senha: Buffer.from('senha123').toString('base64')
      };

      const usuarioAutenticado = {
        id: 1,
        usuario: 'john.doe',
        nome: 'John Doe',
        email: 'john@example.com',
        senha: '$2a$10$hashedPassword123'
      };

      autorizacaoRepository.getUsuarioAuth.mockResolvedValue(usuarioAutenticado);
      bcrypt.compare.mockResolvedValue(true);

      const result = await autorizacaoService.getUsuarioAuth(usuario);

      expect(result.status).toBe('ok');
      expect(result.usuario).toEqual(usuarioAutenticado);
      expect(bcrypt.compare).toHaveBeenCalledWith('senha123', usuarioAutenticado.senha);
    });

    it('deve retornar erro quando usuário não existe', async () => {
      const usuario = {
        usuario: 'inexistente',
        senha: Buffer.from('senha123').toString('base64')
      };

      autorizacaoRepository.getUsuarioAuth.mockResolvedValue({
        status: 'erro'
      });

      const result = await autorizacaoService.getUsuarioAuth(usuario);

      expect(result.status).toBe('erro');
      expect(result.code).toBe(401);
      expect(result.message).toBe('Usuário  ou senha inválidos.');
    });

    it('deve retornar erro quando senha está incorreta', async () => {
      const usuario = {
        usuario: 'john.doe',
        senha: Buffer.from('senhaErrada').toString('base64')
      };

      const usuarioAutenticado = {
        id: 1,
        usuario: 'john.doe',
        nome: 'John Doe',
        email: 'john@example.com',
        senha: '$2a$10$hashedPassword123'
      };

      autorizacaoRepository.getUsuarioAuth.mockResolvedValue(usuarioAutenticado);
      bcrypt.compare.mockResolvedValue(false);

      const result = await autorizacaoService.getUsuarioAuth(usuario);

      expect(result.status).toBe('erro');
      expect(result.code).toBe(401);
      expect(result.message).toBe('Usuário  ou senha inválidos.');
    });

    it('deve decodificar senha base64 corretamente', async () => {
      const senhaOriginal = 'minhaSenha123!@#';
      const senhaBase64 = Buffer.from(senhaOriginal).toString('base64');
      
      const usuario = {
        usuario: 'john.doe',
        senha: senhaBase64
      };

      const usuarioAutenticado = {
        id: 1,
        usuario: 'john.doe',
        senha: '$2a$10$hashedPassword123'
      };

      autorizacaoRepository.getUsuarioAuth.mockResolvedValue(usuarioAutenticado);
      bcrypt.compare.mockResolvedValue(true);

      await autorizacaoService.getUsuarioAuth(usuario);

      expect(bcrypt.compare).toHaveBeenCalledWith(senhaOriginal, usuarioAutenticado.senha);
    });
  });
});
