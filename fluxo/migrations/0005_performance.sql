-- Bloco 4 do mapa mestre: Desempenho Individual — o diferencial da régua da própria média.
-- Cada linha é um mês fechado; "baseline" (média dela) é calculada no servidor como a
-- média dos meses anteriores ao mais recente — nunca comparação entre colegas.

CREATE TABLE IF NOT EXISTS performance_monthly (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id           INTEGER NOT NULL REFERENCES users(id),
  month             TEXT NOT NULL,          -- rótulo curto, ex. 'Mar'
  month_order       INTEGER NOT NULL,       -- ordem cronológica (0 = mais antigo)
  on_time_pct       REAL NOT NULL,          -- entregas no prazo (%)
  tasks_delivered   INTEGER NOT NULL,       -- tarefas entregues
  avg_exec_days     REAL NOT NULL,          -- tempo médio de execução (dias)
  checkin_avg_min   INTEGER NOT NULL,       -- pontualidade média do mês (min desde 00:00)
  signal_title      TEXT,                   -- só preenchido no mês mais recente
  signal_text       TEXT,
  UNIQUE (user_id, month_order)
);

-- Últimos 10 dias de ponto, para o mini-gráfico de pontualidade recente.
CREATE TABLE IF NOT EXISTS attendance_days (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL REFERENCES users(id),
  day_index    INTEGER NOT NULL,   -- 0..9, 9 = dia mais recente
  checkin_min  INTEGER NOT NULL,
  UNIQUE (user_id, day_index)
);

CREATE INDEX IF NOT EXISTS idx_perf_user ON performance_monthly(user_id, month_order);
CREATE INDEX IF NOT EXISTS idx_attend_user ON attendance_days(user_id, day_index);
