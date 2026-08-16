-- Eventos de demonstração — Agenda.
DELETE FROM events;

INSERT INTO events (person_email, person_name, title, start_at, end_at, location) VALUES ('gerente@prumo.demo', 'Você', 'Reunião de alinhamento semanal', '2026-08-16T12:00', '2026-08-16T12:45', 'Sala virtual');
INSERT INTO events (person_email, person_name, title, start_at, end_at, location) VALUES ('gerente@prumo.demo', 'Você', '1:1 com Carla Dias', '2026-08-17T17:00', '2026-08-17T17:30', 'Sala virtual');
INSERT INTO events (person_email, person_name, title, start_at, end_at, location) VALUES ('gerente@prumo.demo', 'Você', 'Revisão do fechamento mensal', '2026-08-19T13:00', '2026-08-19T14:00', 'Sala virtual');
INSERT INTO events (person_email, person_name, title, start_at, end_at, location) VALUES ('carla@prumo.demo', 'Carla Dias', '1:1 com Gerente', '2026-08-17T17:00', '2026-08-17T17:30', 'Sala virtual');
INSERT INTO events (person_email, person_name, title, start_at, end_at, location) VALUES ('carla@prumo.demo', 'Carla Dias', 'Aprovação de reembolsos', '2026-08-16T19:00', '2026-08-16T19:30', 'Sala virtual');
INSERT INTO events (person_email, person_name, title, start_at, end_at, location) VALUES ('ana@prumo.demo', 'Ana Ribeiro', 'Consolidação — planilha de vendas', '2026-08-16T14:00', '2026-08-16T15:00', 'Foco');
INSERT INTO events (person_email, person_name, title, start_at, end_at, location) VALUES ('ana@prumo.demo', 'Ana Ribeiro', 'Onboarding — novo processo de organização', '2026-08-18T18:00', '2026-08-18T18:30', 'Sala virtual');
