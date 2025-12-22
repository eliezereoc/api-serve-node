import UsuarioService from '../services/usuario.service.js';
import UsuarioRepository from '../repositories/usuario.repository.js';
import bcrypt from 'bcrypt';

// Mock global do logger
global.logger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Mock do console.log para não poluir saída do teste
global.console = {
  ...console,
  log: jest.fn()
};

// Mock do repositório
jest.mock('../repositories/usuario.repository.js');

// Mock do bcrypt
jest.mock('bcrypt');

describe('UsuarioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUsuario', () => {
    it('deve criar um usuário com sucesso', async () => {
      const novoUsuario = {
        usuario: 'testuser',
        email: 'test@example.com',
        senha: Buffer.from('senha123').toString('base64'),
        nome: 'Test User'
      };

      UsuarioRepository.getUsuarioByEmail.mockResolvedValue([null]);
      UsuarioRepository.getUsuarioByUsuario.mockResolvedValue([null]);
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      UsuarioRepository.createUsuario.mockResolvedValue({ status: 'sucesso' });

      const result = await UsuarioService.createUsuario(novoUsuario);

      expect(result.status).toBe('sucesso');
      expect(result.code).toBe(200);
      expect(UsuarioRepository.createUsuario).toHaveBeenCalled();
    });

    it('deve retornar erro se email já existe e está ativo', async () => {
      const novoUsuario = {
        usuario: 'testuser',
        email: 'existing@example.com',
        senha: Buffer.from('senha123').toString('base64'),
        nome: 'Test User'
      };

      const usuarioExistente = {
        email: 'existing@example.com',
        active: 'S'
      };

      UsuarioRepository.getUsuarioByEmail.mockResolvedValue([usuarioExistente]);
      UsuarioRepository.getUsuarioByUsuario.mockResolvedValue([null]);

      const result = await UsuarioService.createUsuario(novoUsuario);

      expect(result.status).toBe('erro');
      expect(result.code).toBe(409);
    });

    it('deve retornar erro se usuário já existe e está ativo', async () => {
      const novoUsuario = {
        usuario: 'existinguser',
        email: 'test@example.com',
        senha: Buffer.from('senha123').toString('base64'),
        nome: 'Test User'
      };

      const usuarioExistente = {
        usuario: 'existinguser',
        active: 'S'
      };

      UsuarioRepository.getUsuarioByEmail.mockResolvedValue([null]);
      UsuarioRepository.getUsuarioByUsuario.mockResolvedValue([usuarioExistente]);

      const result = await UsuarioService.createUsuario(novoUsuario);

      expect(result.status).toBe('erro');
      expect(result.code).toBe(409);
    });

    it('deve reativar usuário inativo ao tentar criar com email inativo', async () => {
      const novoUsuario = {
        usuario: 'testuser',
        email: 'inactive@example.com',
        senha: Buffer.from('novaSenha').toString('base64'),
        nome: 'Test User'
      };

      const usuarioInativo = {
        email: 'inactive@example.com',
        active: 'N'
      };

      UsuarioRepository.getUsuarioByEmail.mockResolvedValue([usuarioInativo]);
      UsuarioRepository.getUsuarioByUsuario.mockResolvedValue([null]);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      UsuarioRepository.updateUsuario.mockResolvedValue({ status: 'sucesso' });

      const result = await UsuarioService.createUsuario(novoUsuario);

      expect(result.status).toBe('sucesso');
      expect(UsuarioRepository.updateUsuario).toHaveBeenCalled();
    });

    it('deve fazer hash da senha com bcrypt corretamente', async () => {
      const senhaOriginal = 'minhaSenha123!@#';
      const novoUsuario = {
        usuario: 'testuser',
        email: 'test@example.com',
        senha: Buffer.from(senhaOriginal).toString('base64'),
        nome: 'Test User'
      };

      UsuarioRepository.getUsuarioByEmail.mockResolvedValue([null]);
      UsuarioRepository.getUsuarioByUsuario.mockResolvedValue([null]);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      UsuarioRepository.createUsuario.mockResolvedValue({ status: 'sucesso' });

      await UsuarioService.createUsuario(novoUsuario);

      expect(bcrypt.hash).toHaveBeenCalledWith(senhaOriginal, 10);
    });
  });

  describe('getUsuarios', () => {
    it('deve retornar lista de usuários', async () => {
      const usuarios = [
        { id: 1, usuario: 'user1', email: 'user1@example.com' },
        { id: 2, usuario: 'user2', email: 'user2@example.com' }
      ];

      UsuarioRepository.getUsuarios.mockResolvedValue(usuarios);

      const result = await UsuarioService.getUsuarios();

      expect(result).toEqual(usuarios);
      expect(UsuarioRepository.getUsuarios).toHaveBeenCalled();
    });

    it('deve retornar array vazio quando não há usuários', async () => {
      UsuarioRepository.getUsuarios.mockResolvedValue([]);

      const result = await UsuarioService.getUsuarios();

      expect(result).toEqual([]);
    });
  });

  describe('getUsuario', () => {
    it('deve retornar usuário pelo ID', async () => {
      const usuario = { id: 1, usuario: 'john.doe', email: 'john@example.com' };

      UsuarioRepository.getUsuario.mockResolvedValue(usuario);

      const result = await UsuarioService.getUsuario(1);

      expect(result).toEqual(usuario);
      expect(UsuarioRepository.getUsuario).toHaveBeenCalledWith(1);
    });

    it('deve retornar null quando usuário não existe', async () => {
      UsuarioRepository.getUsuario.mockResolvedValue(null);

      const result = await UsuarioService.getUsuario(999);

      expect(result).toBeNull();
    });
  });

  describe('deleteUsuario', () => {
    it('deve deletar usuário com sucesso', async () => {
      UsuarioRepository.deleteUsuario.mockResolvedValue({ status: 'sucesso' });

      const result = await UsuarioService.deleteUsuario(2, 1);

      expect(result.status).toBe('sucesso');
      expect(result.message).toBe('Usuário excluído com sucesso.');
      expect(UsuarioRepository.deleteUsuario).toHaveBeenCalledWith(2);
    });

    it('deve retornar erro ao tentar deletar própria conta', async () => {
      const result = await UsuarioService.deleteUsuario(1, 1);

      expect(result.status).toBe('erro');
      expect(result.code).toBe(403);
      expect(result.message).toBe('Você não pode excluir sua própria conta.');
      expect(UsuarioRepository.deleteUsuario).not.toHaveBeenCalled();
    });

    it('deve retornar erro 404 quando usuário não existe', async () => {
      UsuarioRepository.deleteUsuario.mockResolvedValue({ status: 'erro' });

      const result = await UsuarioService.deleteUsuario(999, 1);

      expect(result.status).toBe('erro');
      expect(result.code).toBe(404);
      expect(result.message).toContain('não encontrado');
    });

    it('deve retornar erro 500 quando ocorre exceção', async () => {
      UsuarioRepository.deleteUsuario.mockRejectedValue(
        new Error('Database error')
      );

      const result = await UsuarioService.deleteUsuario(2, 1);

      expect(result.status).toBe('erro');
      expect(result.code).toBe(500);
      expect(result.message).toBe('Erro ao excluir usuário.');
    });
  });

  describe('updateUsuario', () => {
    it('deve atualizar usuário com sucesso', async () => {
      const usuarioAtualizar = {
        usuario: 'john.doe',
        email: 'newemail@example.com',
        nome: 'John Doe Updated'
      };

      UsuarioRepository.updateUsuario.mockResolvedValue({ status: 'sucesso' });

      const result = await UsuarioService.updateUsuario(usuarioAtualizar);

      expect(result.status).toBe('sucesso');
      expect(result.message).toBe('Usuário foi alterado com sucesso.');
      expect(UsuarioRepository.updateUsuario).toHaveBeenCalledWith(usuarioAtualizar);
    });

    it('deve retornar erro quando usuário não encontrado', async () => {
      const usuarioAtualizar = {
        usuario: 'inexistente',
        email: 'test@example.com'
      };

      UsuarioRepository.updateUsuario.mockResolvedValue({ status: 'erro' });

      const result = await UsuarioService.updateUsuario(usuarioAtualizar);

      expect(result.status).toBe('erro');
      expect(result.message).toBe('Usuario não encontrado ou inativo.');
    });

    it('deve retornar erro quando nenhum registro foi atualizado', async () => {
      const usuarioAtualizar = {
        usuario: 'john.doe',
        email: 'new@example.com'
      };

      UsuarioRepository.updateUsuario.mockResolvedValue({ status: 'null' });

      const result = await UsuarioService.updateUsuario(usuarioAtualizar);

      expect(result.status).toBe('erro');
      expect(result.message).toBe('Nenhum registro foi atualizado.');
    });

    it('deve retornar erro 500 quando ocorre exceção', async () => {
      const usuarioAtualizar = {
        usuario: 'john.doe',
        email: 'test@example.com'
      };

      UsuarioRepository.updateUsuario.mockRejectedValue(
        new Error('Database connection error')
      );

      const result = await UsuarioService.updateUsuario(usuarioAtualizar);

      expect(result.status).toBe('erro');
      expect(result.message).toBe('Erro ao alterar usuário.');
    });
  });
});
