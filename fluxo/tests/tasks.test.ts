import { describe, it, expect } from "vitest";
import { shapeTask } from "../functions/_lib/tasks";
import type { TaskRow, ChainRow } from "../functions/_lib/tasks";

const TODAY = "2026-08-16";

function makeTask(overrides: Partial<TaskRow> = {}): TaskRow {
  return {
    id: 1, title: "Tarefa de teste", stage: "Fila", tool: null,
    due_date: "2026-08-20", opened_at: "2026-08-10", stage_entered_at: "2026-08-14",
    current_position: 0, done: 0, ...overrides,
  };
}
function makeChain(rows: Partial<ChainRow>[]): ChainRow[] {
  return rows.map((r, i) => ({
    task_id: 1, position: i, user_id: i + 1, step_label: `Etapa ${i}`, name: `Pessoa ${i}`,
    due_date: null, tool: null, ...r,
  }));
}

describe("shapeTask — status pelo prazo", () => {
  it("verde quando falta mais de 2 dias", () => {
    const t = shapeTask(makeTask({ due_date: "2026-08-22" }), makeChain([{}]), TODAY);
    expect(t.status).toBe("green");
    expect(t.daysLeft).toBe(6);
  });
  it("âmbar quando faltam 0-2 dias", () => {
    const t = shapeTask(makeTask({ due_date: "2026-08-17" }), makeChain([{}]), TODAY);
    expect(t.status).toBe("amber");
    expect(t.daysLeft).toBe(1);
  });
  it("vermelho quando já passou do prazo", () => {
    const t = shapeTask(makeTask({ due_date: "2026-08-10" }), makeChain([{}]), TODAY);
    expect(t.status).toBe("red");
    expect(t.daysLeft).toBe(-6);
  });
  it("done vira status 'done' mesmo com prazo estourado", () => {
    const t = shapeTask(makeTask({ due_date: null, done: 1 }), makeChain([{}]), TODAY);
    expect(t.status).toBe("done");
  });
});

describe("shapeTask — prazo por etapa da corrente (não mais só da tarefa)", () => {
  it("usa o prazo da etapa ATUAL quando ela tem um prazo próprio", () => {
    const chain = makeChain([
      { due_date: "2026-08-30" }, // posição 0 — não é a atual
      { due_date: "2026-08-17" }, // posição 1 — é a atual, âmbar
    ]);
    const t = shapeTask(makeTask({ current_position: 1, due_date: "2026-08-30" }), chain, TODAY);
    expect(t.dueDate).toBe("2026-08-17");
    expect(t.status).toBe("amber");
  });
  it("cai pro prazo da tarefa quando a etapa não tem prazo próprio (dado antigo do seed)", () => {
    const chain = makeChain([{ due_date: null }]);
    const t = shapeTask(makeTask({ due_date: "2026-08-22" }), chain, TODAY);
    expect(t.dueDate).toBe("2026-08-22");
  });
});

describe("shapeTask — estado de cada elo da corrente", () => {
  it("marca quem já passou como 'done', quem está agora como 'current', o resto 'pending'", () => {
    const chain = makeChain([{}, {}, {}]);
    const t = shapeTask(makeTask({ current_position: 1, due_date: "2026-08-25" }), chain, TODAY);
    expect(t.chain.map((c) => c.state)).toEqual(["done", "current", "pending"]);
  });
  it("marca a etapa atual como 'late' quando a tarefa está atrasada", () => {
    const chain = makeChain([{}, {}]);
    const t = shapeTask(makeTask({ current_position: 1, due_date: "2026-08-01" }), chain, TODAY);
    expect(t.chain[1].state).toBe("late");
    expect(t.chain[0].state).toBe("done");
  });
  it("tarefa entregue: todo mundo 'done'", () => {
    const chain = makeChain([{}, {}]);
    const t = shapeTask(makeTask({ current_position: 1, done: 1 }), chain, TODAY);
    expect(t.chain.map((c) => c.state)).toEqual(["done", "done"]);
  });
});

describe("shapeTask — dono da tarefa (quem está com ela agora)", () => {
  it("owner é a pessoa na posição atual", () => {
    const chain = makeChain([{ name: "Ana" }, { name: "Carla" }]);
    const t = shapeTask(makeTask({ current_position: 1 }), chain, TODAY);
    expect(t.owner?.name).toBe("Carla");
  });
  it("tarefa entregue: owner é a última pessoa da corrente", () => {
    const chain = makeChain([{ name: "Ana" }, { name: "Carla" }]);
    const t = shapeTask(makeTask({ current_position: 1, done: 1 }), chain, TODAY);
    expect(t.owner?.name).toBe("Carla");
  });
});

describe("shapeTask — dias parado na etapa atual", () => {
  it("calcula quantos dias se passaram desde que entrou na etapa", () => {
    const t = shapeTask(makeTask({ stage_entered_at: "2026-08-12" }), makeChain([{}]), TODAY);
    expect(t.heldDays).toBe(4);
  });
  it("nunca fica negativo (data futura por engano não vira dia negativo)", () => {
    const t = shapeTask(makeTask({ stage_entered_at: "2026-08-20" }), makeChain([{}]), TODAY);
    expect(t.heldDays).toBe(0);
  });
});
