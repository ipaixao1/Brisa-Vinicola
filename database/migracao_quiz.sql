-- Migração: guarda as respostas do quiz no usuário.
-- Rode UMA vez em bancos que já existem (o schema.sql novo já inclui a coluna).
USE brisa_vinicola;
ALTER TABLE users ADD COLUMN quiz_answers JSON NULL;
