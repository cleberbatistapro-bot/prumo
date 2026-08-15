-- Agenda — plataforma-irmã. Banco próprio de verdade: se corromper, o Fluxo nem fica sabendo.
CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  person_email TEXT NOT NULL,     -- chave de contrato com as outras irmãs (não é FK de banco nenhum)
  person_name  TEXT NOT NULL,
  title        TEXT NOT NULL,
  start_at     TEXT NOT NULL,     -- ISO datetime
  end_at       TEXT,
  location     TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_person ON events(person_email, start_at);
