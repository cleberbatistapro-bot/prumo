-- Dados de demonstração — Fase Recrutador. Senha única (demo): Prumo@123
DELETE FROM audit_log;
DELETE FROM sessions;
DELETE FROM attendance_days;
DELETE FROM performance_monthly;
DELETE FROM task_chain;
DELETE FROM tasks;
DELETE FROM users;

INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Ana Ribeiro', 'ana@prumo.demo', '135baa97a343d29ef6b80ec6b1e409d29596921090379e767d0fa6d48db4803e', 'a69e5dceec600952661e09c6df9f877f', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Carla Dias', 'carla@prumo.demo', '9861771bb49b66a0d0c34323dd8345961ee8fccc5b9671a4fa9285bc65106e2b', '288a57f5d8edd07c9cee35457acee1bd', 'coordenador');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Você', 'gerente@prumo.demo', 'dcbf384cca1be7702e1e7bb9c74336601c32009cd2389370b3dcd6052f58cc9a', '8105266518856d4e50db6bfc39d6e5a3', 'gerente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Pedro Alves', 'pedro@prumo.demo', '61044033403b6ff3de9cf5e7ecbdcee07d506ed18adb9129ee83f3168136aad4', 'e705f0d88f07e1656ad0c979e821aff8', 'coordenador');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Diana Souza', 'diana@prumo.demo', '4745cd50f2f8471a520e04c3a5667c6f672d9feee175e1c1c6e5f45a7442f463', '4835c76875f86aa22c43075ea21a8751', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Márcia Reis', 'marcia@prumo.demo', '418e032e099bda16c37fbc1174cf30f73ba37782b795a1f2c347c504550a9f08', 'e891f0086e54a5404444224717266601', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Bruno Melo', 'bruno@prumo.demo', 'ab9d481cf8dfcf2197ac8e08bd7f19e6f93168b24e94b599818954ceb34daedc', 'f8fd0d079f6834029ff76f48b0f26b9f', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Marcelo Nunes', 'marcelo@prumo.demo', 'de2227fcdb891b9f946e76e0a12f08be64a75b694d9c352649559665a183d7c5', '7b49d04e3edd83d3e95aeee6fc7c0913', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Carlos Lima', 'carlos@prumo.demo', '2d54a260d8dace333792bc5430e542e5f0025af23bf727104e25f44ddad0745c', 'c9cc967c17f369e33b064eeb87a7e93a', 'assistente');
