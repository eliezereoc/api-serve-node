// Mockar mysql2/promise durante testes para evitar erros de conexão
jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn().mockResolvedValue({
    execute: jest.fn().mockResolvedValue([[], []]),
    query: jest.fn().mockResolvedValue([[], []]),
    end: jest.fn().mockResolvedValue(undefined),
    ping: jest.fn().mockResolvedValue(undefined)
  }),
  createPool: jest.fn().mockResolvedValue({
    getConnection: jest.fn().mockResolvedValue({
      execute: jest.fn().mockResolvedValue([[], []]),
      query: jest.fn().mockResolvedValue([[], []]),
      release: jest.fn(),
      end: jest.fn().mockResolvedValue(undefined)
    }),
    end: jest.fn().mockResolvedValue(undefined)
  })
}), { virtual: true });

// Aumentar timeout global para testes
jest.setTimeout(10000);
