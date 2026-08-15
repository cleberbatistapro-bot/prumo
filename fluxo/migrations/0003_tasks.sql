-- Bloco 2 e 3 do mapa mestre: Fluxo — núcleo + corrente da tarefa.
-- Uma tarefa é um cartão na linha; task_chain é a sequência de pessoas por quem ela passa.

CREATE TABLE IF NOT EXISTS tasks (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  title              TEXT NOT NULL,
  stage              TEXT NOT NULL CHECK (stage IN ('Fila','Execução','Revisão','Entregue')),
  tool               TEXT,
  due_date           TEXT,                 -- ISO (YYYY-MM-DD); null quando done
  opened_at          TEXT NOT NULL,        -- ISO — quando a tarefa entrou na linha
  stage_entered_at   TEXT NOT NULL,        -- ISO — quando entrou na posição/etapa atual (para "há X dias")
  current_position   INTEGER NOT NULL DEFAULT 0,
  done               INTEGER NOT NULL DEFAULT 0,
  created_by         INTEGER REFERENCES users(id),
  created_at         TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS task_chain (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id     INTEGER NOT NULL REFERENCES tasks(id),
  position    INTEGER NOT NULL,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  step_label  TEXT NOT NULL,
  UNIQUE (task_id, position)
);

CREATE INDEX IF NOT EXISTS idx_tasks_stage ON tasks(stage);
CREATE INDEX IF NOT EXISTS idx_chain_task ON task_chain(task_id);
