import request from 'supertest';
import app from '../index.js';

describe('Rate Limiter Tests', () => {
  // Aumenta o timeout do teste já que faremos muitas requisições
  jest.setTimeout(30000);

  beforeEach(async () => {
    // Aguarda 1.5 segundos entre testes para resetar o limiter (janela de 1 segundo em teste)
    await new Promise(resolve => setTimeout(resolve, 1500));
  });

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
        // Qualquer status diferente de 429 significa que passou pelo limiter
        successCount++;
      }
    }

    // Verifica que houve requisições bloqueadas
    expect(blockedCount).toBeGreaterThan(0);
    // Verifica que o bloqueio começou após aproximadamente 10 requisições
    expect(successCount).toBeGreaterThanOrEqual(8);
    expect(successCount).toBeLessThanOrEqual(10);
    
    console.log(`✅ Rate Limiter funcionando: ${successCount} permitidas, ${blockedCount} bloqueadas`);
  });

  it('deve retornar status 429 quando o limite for excedido', async () => {
    const endpoint = '/';
    
    // Faz requisições sequencialmente até ultrapassar o limite de 10
    const responses = [];
    for (let i = 0; i < 15; i++) {
      const response = await request(app).get(endpoint);
      responses.push(response);
    }
    
    // Filtra as respostas com status 429
    const blockedRequests = responses.filter(res => res.status === 429);
    
    // Deve ter pelo menos uma requisição bloqueada
    expect(blockedRequests.length).toBeGreaterThan(0);
    
    console.log(`✅ ${blockedRequests.length} requisições retornaram 429 Too Many Requests`);
  });

  it('deve aplicar o rate limit globalmente na rota raiz', async () => {
    const endpoint = '/';
    const responses = [];
    
    // Faz várias requisições no mesmo endpoint
    for (let i = 0; i < 15; i++) {
      const response = await request(app).get(endpoint);
      responses.push(response);
    }
    
    // Verifica se alguma foi bloqueada (status 429)
    const hasRateLimitResponse = responses.some(res => res.status === 429);
    const successfulRequests = responses.filter(res => res.status !== 429).length;
    
    expect(hasRateLimitResponse).toBe(true);
    expect(successfulRequests).toBeGreaterThanOrEqual(8);
    expect(successfulRequests).toBeLessThanOrEqual(10);
    
    console.log(`✅ Rate limit aplicado em ${endpoint}: ${successfulRequests} permitidas, ${responses.length - successfulRequests} bloqueadas`);
  });
});
