-- Tarefas de demonstração — Fase Recrutador. Gerado com datas relativas a 2026-08-16.
DELETE FROM task_chain;
DELETE FROM tasks;

INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)
  VALUES ('Consolidar planilhas de vendas', 'Fila', 'Proc Fácil', '2026-08-22', '2026-08-15', '2026-08-15', 0, 0, (SELECT id FROM users WHERE email = 'carla@prumo.demo'));
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Consolidar planilhas de vendas'), 0, (SELECT id FROM users WHERE email = 'ana@prumo.demo'), 'Consolidação');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Consolidar planilhas de vendas'), 1, (SELECT id FROM users WHERE email = 'carla@prumo.demo'), 'Revisão');

INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)
  VALUES ('Levantar documentos fiscais', 'Fila', NULL, '2026-08-20', '2026-08-16', '2026-08-16', 0, 0, (SELECT id FROM users WHERE email = 'carla@prumo.demo'));
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Levantar documentos fiscais'), 0, (SELECT id FROM users WHERE email = 'pedro@prumo.demo'), 'Levantamento');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Levantar documentos fiscais'), 1, (SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 'Organização');

INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)
  VALUES ('Organizar arquivos do projeto Alfa', 'Execução', 'Organizador', '2026-08-17', '2026-08-13', '2026-08-13', 0, 0, (SELECT id FROM users WHERE email = 'carla@prumo.demo'));
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Organizar arquivos do projeto Alfa'), 0, (SELECT id FROM users WHERE email = 'ana@prumo.demo'), 'Organização');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Organizar arquivos do projeto Alfa'), 1, (SELECT id FROM users WHERE email = 'diana@prumo.demo'), 'Revisão');

INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)
  VALUES ('Padronizar nomes de contratos', 'Execução', 'Renomeador', '2026-08-18', '2026-08-14', '2026-08-14', 0, 0, (SELECT id FROM users WHERE email = 'carla@prumo.demo'));
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Padronizar nomes de contratos'), 0, (SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 'Padronização');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Padronizar nomes de contratos'), 1, (SELECT id FROM users WHERE email = 'carla@prumo.demo'), 'Conferência');

INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)
  VALUES ('Montar base de fornecedores', 'Execução', NULL, '2026-08-21', '2026-08-14', '2026-08-14', 0, 0, (SELECT id FROM users WHERE email = 'carla@prumo.demo'));
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Montar base de fornecedores'), 0, (SELECT id FROM users WHERE email = 'ana@prumo.demo'), 'Montagem');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Montar base de fornecedores'), 1, (SELECT id FROM users WHERE email = 'carlos@prumo.demo'), 'Validação');

INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)
  VALUES ('Relatório mensal — Cliente X', 'Revisão', 'Dash Top', '2026-08-15', '2026-08-07', '2026-08-10', 3, 0, (SELECT id FROM users WHERE email = 'carla@prumo.demo'));
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Relatório mensal — Cliente X'), 0, (SELECT id FROM users WHERE email = 'marcelo@prumo.demo'), 'Coleta');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Relatório mensal — Cliente X'), 1, (SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 'Consolidação');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Relatório mensal — Cliente X'), 2, (SELECT id FROM users WHERE email = 'carlos@prumo.demo'), 'Análise');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Relatório mensal — Cliente X'), 3, (SELECT id FROM users WHERE email = 'diana@prumo.demo'), 'Revisão');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Relatório mensal — Cliente X'), 4, (SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 'Aprovação');

INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)
  VALUES ('Revisão do dashboard financeiro', 'Revisão', 'Dash Top', '2026-08-14', '2026-08-06', '2026-08-07', 1, 0, (SELECT id FROM users WHERE email = 'carla@prumo.demo'));
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Revisão do dashboard financeiro'), 0, (SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 'Consolidação');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Revisão do dashboard financeiro'), 1, (SELECT id FROM users WHERE email = 'carlos@prumo.demo'), 'Análise');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Revisão do dashboard financeiro'), 2, (SELECT id FROM users WHERE email = 'diana@prumo.demo'), 'Revisão');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Revisão do dashboard financeiro'), 3, (SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 'Aprovação');

INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)
  VALUES ('Conferência de reembolsos', 'Revisão', NULL, '2026-08-16', '2026-08-11', '2026-08-12', 1, 0, (SELECT id FROM users WHERE email = 'carla@prumo.demo'));
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Conferência de reembolsos'), 0, (SELECT id FROM users WHERE email = 'pedro@prumo.demo'), 'Triagem');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Conferência de reembolsos'), 1, (SELECT id FROM users WHERE email = 'carla@prumo.demo'), 'Conferência');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Conferência de reembolsos'), 2, (SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 'Aprovação');

INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)
  VALUES ('Aprovar planilha consolidada', 'Revisão', NULL, '2026-08-17', '2026-08-12', '2026-08-13', 1, 0, (SELECT id FROM users WHERE email = 'carla@prumo.demo'));
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Aprovar planilha consolidada'), 0, (SELECT id FROM users WHERE email = 'ana@prumo.demo'), 'Montagem');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Aprovar planilha consolidada'), 1, (SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 'Aprovação');

INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)
  VALUES ('Checar organização de arquivos', 'Revisão', NULL, '2026-08-19', '2026-08-13', '2026-08-14', 1, 0, (SELECT id FROM users WHERE email = 'carla@prumo.demo'));
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Checar organização de arquivos'), 0, (SELECT id FROM users WHERE email = 'ana@prumo.demo'), 'Organização');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Checar organização de arquivos'), 1, (SELECT id FROM users WHERE email = 'diana@prumo.demo'), 'Conferência');

INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)
  VALUES ('Fechamento semanal', 'Entregue', NULL, NULL, '2026-08-08', '2026-08-14', 1, 1, (SELECT id FROM users WHERE email = 'carla@prumo.demo'));
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Fechamento semanal'), 0, (SELECT id FROM users WHERE email = 'ana@prumo.demo'), 'Apuração');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Fechamento semanal'), 1, (SELECT id FROM users WHERE email = 'carla@prumo.demo'), 'Fechamento');

INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)
  VALUES ('Base de clientes atualizada', 'Entregue', NULL, NULL, '2026-08-08', '2026-08-14', 1, 1, (SELECT id FROM users WHERE email = 'carla@prumo.demo'));
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Base de clientes atualizada'), 0, (SELECT id FROM users WHERE email = 'ana@prumo.demo'), 'Atualização');
INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES ((SELECT id FROM tasks WHERE title = 'Base de clientes atualizada'), 1, (SELECT id FROM users WHERE email = 'carlos@prumo.demo'), 'Validação');

