/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Criação da tabela usuario (apenas se não existir)
  const tableExists = await knex.schema.hasTable('usuario');
  
  if (!tableExists) {
    await knex.schema.createTable('usuario', (table) => {
      table.increments('id').primary();
      table.string('nome', 150).notNullable();
      table.string('email', 150).notNullable().unique();
      table.string('senha', 150).notNullable();
      table.string('usuario', 50).notNullable().unique();
      table.string('active', 1).defaultTo('S');
      table.timestamp('data_criacao').defaultTo(knex.fn.now());
      table.timestamp('data_alteracao').nullable().defaultTo(null);
      
      // Constraint para unique email
      table.unique(['email'], { indexName: 'email_unico' });
    });
  }

  // Inserir usuário admin padrão (apenas se não existir)
  const adminExists = await knex('usuario')
    .where({ usuario: 'admin.admin' })
    .first();
    
  if (!adminExists) {
    await knex('usuario').insert({
      nome: 'Admin',
      email: 'admin@admin.com',
      senha: '$2b$10$WKSqg4.cu8E9MSMWfJt1S.NU8atk0rU51crKhRIbIX4K8YfviUrQy',
      active: 'S',
      usuario: 'admin.admin'
    });
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('usuario');
}
