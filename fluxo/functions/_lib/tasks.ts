export const STAGES = ["Fila", "Execução", "Revisão", "Entregue"] as const;

export interface TaskRow {
  id: number;
  title: string;
  stage: string;
  tool: string | null;
  due_date: string | null;
  opened_at: string;
  stage_entered_at: string;
  current_position: number;
  done: number;
}

export interface ChainRow {
  task_id: number;
  position: number;
  user_id: number;
  step_label: string;
  name: string;
}

function daysBetween(fromIso: string, toIso: string): number {
  const a = new Date(fromIso + "T00:00:00Z").getTime();
  const b = new Date(toIso + "T00:00:00Z").getTime();
  return Math.round((b - a) / 86_400_000);
}

export function shapeTask(row: TaskRow, chain: ChainRow[], todayIso: string) {
  const myChain = chain.filter((c) => c.task_id === row.id).sort((a, b) => a.position - b.position);
  const done = !!row.done;
  const daysLeft = row.due_date ? daysBetween(todayIso, row.due_date) : null;
  const status = done ? "done" : daysLeft === null ? "green" : daysLeft < 0 ? "red" : daysLeft <= 2 ? "amber" : "green";
  const heldDays = Math.max(0, daysBetween(row.stage_entered_at, todayIso));
  const owner = done ? myChain[myChain.length - 1] : myChain[row.current_position];
  return {
    id: row.id,
    title: row.title,
    stage: row.stage,
    tool: row.tool,
    dueDate: row.due_date,
    openedAt: row.opened_at,
    currentPosition: row.current_position,
    done,
    status,
    daysLeft,
    heldDays,
    owner: owner ? { userId: owner.user_id, name: owner.name, step: owner.step_label } : null,
    chain: myChain.map((c) => ({
      position: c.position,
      userId: c.user_id,
      name: c.name,
      step: c.step_label,
      state: done ? "done" : c.position < row.current_position ? "done" : c.position === row.current_position ? (status === "red" ? "late" : "current") : "pending",
    })),
  };
}

export function todayIsoUTC(): string {
  return new Date().toISOString().slice(0, 10);
}
