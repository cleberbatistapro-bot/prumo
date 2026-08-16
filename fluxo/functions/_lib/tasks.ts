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
  due_date: string | null;
  tool: string | null;
}

function daysBetween(fromIso: string, toIso: string): number {
  const a = new Date(fromIso + "T00:00:00Z").getTime();
  const b = new Date(toIso + "T00:00:00Z").getTime();
  return Math.round((b - a) / 86_400_000);
}

export function shapeTask(row: TaskRow, chain: ChainRow[], todayIso: string) {
  const myChain = chain.filter((c) => c.task_id === row.id).sort((a, b) => a.position - b.position);
  const done = !!row.done;
  const currentStep = myChain[row.current_position];
  // prazo/ferramenta da etapa ATUAL da corrente manda; cai pro nível da tarefa
  // só pra manter compatibilidade com tarefas antigas do seed que não têm isso por etapa.
  const effectiveDueDate = currentStep?.due_date ?? row.due_date;
  const effectiveTool = currentStep?.tool ?? row.tool;
  const daysLeft = effectiveDueDate ? daysBetween(todayIso, effectiveDueDate) : null;
  const status = done ? "done" : daysLeft === null ? "green" : daysLeft < 0 ? "red" : daysLeft <= 2 ? "amber" : "green";
  const heldDays = Math.max(0, daysBetween(row.stage_entered_at, todayIso));
  const owner = done ? myChain[myChain.length - 1] : currentStep;
  return {
    id: row.id,
    title: row.title,
    stage: row.stage,
    tool: effectiveTool,
    dueDate: effectiveDueDate,
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
      dueDate: c.due_date,
      tool: c.tool,
      state: done ? "done" : c.position < row.current_position ? "done" : c.position === row.current_position ? (status === "red" ? "late" : "current") : "pending",
    })),
  };
}

export function todayIsoUTC(): string {
  return new Date().toISOString().slice(0, 10);
}
