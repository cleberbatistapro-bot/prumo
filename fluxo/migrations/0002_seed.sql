-- Dados de demonstração — Fase Recrutador. Senha única (demo): Prumo@123
DELETE FROM audit_log;
DELETE FROM sessions;
DELETE FROM users;

INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Ana Ribeiro', 'ana@prumo.demo', 'f824dc54b2f4e1096717dd6022675cfd750c9559e8808fddcb2544cdaea483c7', '58367e8e1b79c0da8c5087b72f37c41f', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Carla Dias', 'carla@prumo.demo', '4bcdadeace42d3a850550349e55f972e90083fb01915ee46d5076a4de49ce27d', 'a34517fc3719b2c5fa0933c792a46931', 'coordenador');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Você', 'gerente@prumo.demo', 'd676e3e4049b82b167d6788dda2589693f8ad13e4a3797e3fd7905344f893eee', 'f469f10fa066b5ee5badd740d2324590', 'gerente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Pedro Alves', 'pedro@prumo.demo', '1b73b5f3f2d9efed865e7b4dd888cea3e8d1fb8c435a527d31be6f25e0d20734', '5f44c55c2e9f1c3c8166aa38788a3b59', 'coordenador');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Diana Souza', 'diana@prumo.demo', 'bb00cae582169879d3bcdf2818df7408833cee82adcf56dd1144806168ab2c12', 'e5ab7cd961618a9ca80fb20e8d51c0ef', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Márcia Reis', 'marcia@prumo.demo', '74fecf394fbddbca4b71cb9d9688d87928225a5147f2ecf134f827a1706e23c4', '5444d8e3bdc0bfb92e0f863c63c3e11a', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Bruno Melo', 'bruno@prumo.demo', '006eb006ca779abba16a4aec9b4da491ee56add2a9d7bc227aa2731bfcfcb713', '3289d724993251bbb78574d36118426d', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Marcelo Nunes', 'marcelo@prumo.demo', '1ff71476da6e5ef724dfaedc7805a978886d62fb8a932729b6adde35986a697a', 'a333ec5463c0f9e6873baa86572a2040', 'assistente');
INSERT INTO users (name, email, password_hash, salt, role) VALUES ('Carlos Lima', 'carlos@prumo.demo', '71a9caeb907423e6cc84fdabd4d8122b708c49b7652fb32d51a228f2b7139ac7', '87e34924f7ab018055284bd3f3cab2bb', 'assistente');
