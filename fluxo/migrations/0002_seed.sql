-- Dados de demonstração — Fase Recrutador. Senha única (demo): Prumo@123
DELETE FROM audit_log;
DELETE FROM sessions;
DELETE FROM attendance_days;
DELETE FROM performance_monthly;
DELETE FROM task_chain;
DELETE FROM tasks;
DELETE FROM users;

INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Ana Ribeiro', 'ana@prumo.demo', '4e321f1e5923dcf2cd15d83a3be51c964432206ef9f57e147961d6de9296413f', 'df881f7c6a2db6a343f8b1af956de6dd', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Carla Dias', 'carla@prumo.demo', '39abea6ab24940223227bf9402950eafe201e32b1f95d0a0bf6339199a0e1289', '32a3653a3fdad3521e82c203872e6fed', 'coordenador');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Você', 'gerente@prumo.demo', '287ce511d295555bced895dd16cb4d9fa2e0395a91e816c661a5d0413d6590bb', '466b433e411b82416a8b612a59d33631', 'gerente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Pedro Alves', 'pedro@prumo.demo', '0e18e330955577a63c058c11a55dbcd482ea78a514288eb80a1c2de50125632b', '978d6d09d9dd4c92617776859678f245', 'coordenador');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Diana Souza', 'diana@prumo.demo', 'd543b1a792e9dd43320c036dd1e4df3f952bdcbd4b814e66899d81506aa996fc', '8b665485eed748eb0790ef1af47cb667', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Márcia Reis', 'marcia@prumo.demo', '9e2f8f8f81a36eb8e507b4852ded35cf23538372ba155bc8465b611ed3ff7d16', '8e5d13737ce947a03186c817bc33f987', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Bruno Melo', 'bruno@prumo.demo', '28804f6ce122f758bcfec2593fd0db4627c86ae7b1e068ae0c36ee6b08f8eed8', '50c54a4543c56478ab6a193e4b08ee5d', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Marcelo Nunes', 'marcelo@prumo.demo', 'b9ad631480299c5f3ae76bed5b585353445bbfeeb8eb674f0e66c55715bc6a38', '99f0d258a518cdff3bb7737cb7cdb58f', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Carlos Lima', 'carlos@prumo.demo', 'ad91d7817534abe3c7ce0947bc958a4971a170bf3b867daf46cb29f4e13559ab', '63ca7c346873e213e2bec8d995294a52', 'assistente');
