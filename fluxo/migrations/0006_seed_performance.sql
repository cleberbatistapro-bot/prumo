-- Demonstração — Desempenho Individual. 6 meses fechados + 10 dias de ponto, por pessoa.
DELETE FROM attendance_days;
DELETE FROM performance_monthly;

INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 'Mar', 0, 95, 22, 2.6, 514, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 'Abr', 1, 96, 20, 2.4, 510, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 'Mai', 2, 93, 21, 2.5, 516, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 'Jun', 3, 96, 22, 2.6, 512, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 'Jul', 4, 95, 20, 2.4, 518, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 'Ago', 5, 72, 14, 4.2, 556, '3 indicadores abaixo da linha de base da Diana neste mês', 'A Diana costuma estar dentro da média o ano inteiro. Neste mês, pontualidade, prazo e tempo de execução caíram abaixo do padrão dela. Não é um problema de desempenho — é um sinal de que algo mudou. Antes de qualquer cobrança, vale uma conversa em particular para entender: sobrecarga, algo pessoal, ou uma tarefa que não ficou clara.');
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 0, 510);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 1, 516);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 2, 512);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 3, 520);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 4, 515);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 5, 513);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 6, 542);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 7, 560);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 8, 550);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'diana@prumo.demo'), 9, 556);

INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 'Mar', 0, 93, 18, 3.2, 497, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 'Abr', 1, 91, 17, 3, 493, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 'Mai', 2, 92, 19, 3.1, 496, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 'Jun', 3, 93, 18, 3.2, 497, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 'Jul', 4, 91, 18, 3, 492, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 'Ago', 5, 93, 19, 3, 491, 'Bruno seguiu dentro do padrão dele o mês inteiro', 'Todos os indicadores estão na faixa habitual do Bruno. Consistência é resultado — ele entrega no ritmo esperado, sem oscilações. Nenhuma ação necessária; o painel só confirma que está tudo em ordem.');
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 0, 492);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 1, 498);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 2, 494);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 3, 496);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 4, 491);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 5, 493);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 6, 497);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 7, 492);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 8, 490);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'bruno@prumo.demo'), 9, 491);

INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 'Mar', 0, 92, 22, 2.9, 502, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 'Abr', 1, 90, 20, 2.5, 498, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 'Mai', 2, 91, 19, 2.7, 500, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 'Jun', 3, 88, 18, 2.8, 497, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 'Jul', 4, 89, 21, 2.6, 503, NULL, NULL);
INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)
  VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 'Ago', 5, 99, 27, 1.9, 478, 'Márcia superou a própria média em todos os indicadores', 'Este mês a Márcia entregou mais, mais no prazo e mais rápido do que o costume dela — e vem numa curva de melhora há três meses. Esse é o tipo de sinal que costuma passar despercebido no remoto. Vale reconhecer de forma concreta e considerar para novas responsabilidades.');
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 0, 490);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 1, 485);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 2, 492);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 3, 482);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 4, 478);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 5, 480);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 6, 475);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 7, 483);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 8, 478);
INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES ((SELECT id FROM users WHERE email = 'marcia@prumo.demo'), 9, 476);

