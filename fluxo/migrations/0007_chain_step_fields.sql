-- Cada pessoa da corrente passa a ter seu próprio prazo e ferramenta sugerida,
-- em vez de um prazo/ferramenta único pra tarefa toda.
ALTER TABLE task_chain ADD COLUMN due_date TEXT;
ALTER TABLE task_chain ADD COLUMN tool TEXT;
