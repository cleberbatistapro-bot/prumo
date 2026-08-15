-- Dados de demonstração — Fase Recrutador. Senha única (demo): Prumo@123
DELETE FROM audit_log;
DELETE FROM sessions;
DELETE FROM users;

INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Ana Ribeiro', 'ana@prumo.demo', 'f6f9d1848303bfa31c01c437c16e50ec82ce5cf3738952cb5dd41f0045320909', 'faa6b6387c21ac2d9e8667233781d183', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Carla Dias', 'carla@prumo.demo', 'a41e25dd8499f382bf293838fae47cf306da1f4cf684b2ee0888494c50934060', 'c70318efd5116221abce379a379e6581', 'coordenador');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Você', 'gerente@prumo.demo', '1f800ea64388fdd05b09fa6f40089192b9aa3c7c7c3567d50420ecabfb2c692f', '627b210b8903d8c3133dd1ed188dd65d', 'gerente');
