import { describe, it, expect } from "vitest";
import { shapeMember } from "../functions/_lib/performance";
import type { MonthRow } from "../functions/_lib/performance";

function months(partial: Omit<MonthRow, "month" | "month_order" | "signal_title" | "signal_text">[]): MonthRow[] {
  const labels = ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"];
  return partial.map((m, i) => ({
    month: labels[i], month_order: i, signal_title: i === partial.length - 1 ? "sinal do mês" : null,
    signal_text: i === partial.length - 1 ? "texto do mês" : null, ...m,
  }));
}

describe("shapeMember — a régua é sempre a própria média (nunca ranking)", () => {
  it("baseline (média dela) é a média dos 5 meses ANTERIORES ao atual, nunca o mês atual", () => {
    const m = shapeMember("Diana Souza", "assistente", 1, months([
      { on_time_pct: 95, tasks_delivered: 22, avg_exec_days: 2.6, checkin_avg_min: 514 },
      { on_time_pct: 96, tasks_delivered: 20, avg_exec_days: 2.4, checkin_avg_min: 510 },
      { on_time_pct: 93, tasks_delivered: 21, avg_exec_days: 2.5, checkin_avg_min: 516 },
      { on_time_pct: 96, tasks_delivered: 22, avg_exec_days: 2.6, checkin_avg_min: 512 },
      { on_time_pct: 95, tasks_delivered: 20, avg_exec_days: 2.4, checkin_avg_min: 518 },
      { on_time_pct: 72, tasks_delivered: 14, avg_exec_days: 4.2, checkin_avg_min: 556 }, // mês atual, bem pior
    ]));
    const onTime = m.kpis.find((k) => k.key === "on_time")!;
    expect(onTime.value).toBe("72%");
    expect(onTime.base).toBe("95%"); // média dos 5 primeiros, não do conjunto todo
    expect(onTime.flag).toBe("red");
  });

  it("caso estável (Bruno): tudo dentro do padrão dele vira tom neutro, sem alarme", () => {
    const m = shapeMember("Bruno Melo", "assistente", 2, months([
      { on_time_pct: 93, tasks_delivered: 18, avg_exec_days: 3.2, checkin_avg_min: 497 },
      { on_time_pct: 91, tasks_delivered: 17, avg_exec_days: 3.0, checkin_avg_min: 493 },
      { on_time_pct: 92, tasks_delivered: 19, avg_exec_days: 3.1, checkin_avg_min: 496 },
      { on_time_pct: 93, tasks_delivered: 18, avg_exec_days: 3.2, checkin_avg_min: 497 },
      { on_time_pct: 91, tasks_delivered: 18, avg_exec_days: 3.0, checkin_avg_min: 492 },
      { on_time_pct: 93, tasks_delivered: 19, avg_exec_days: 3.0, checkin_avg_min: 491 },
    ]));
    expect(m.sit).toBe("teal");
  });

  it("caso de melhora (Márcia): supera a própria média vira sinal verde, não vermelho de ninguém", () => {
    const m = shapeMember("Márcia Reis", "assistente", 3, months([
      { on_time_pct: 92, tasks_delivered: 22, avg_exec_days: 2.9, checkin_avg_min: 502 },
      { on_time_pct: 90, tasks_delivered: 20, avg_exec_days: 2.5, checkin_avg_min: 498 },
      { on_time_pct: 91, tasks_delivered: 19, avg_exec_days: 2.7, checkin_avg_min: 500 },
      { on_time_pct: 88, tasks_delivered: 18, avg_exec_days: 2.8, checkin_avg_min: 497 },
      { on_time_pct: 89, tasks_delivered: 21, avg_exec_days: 2.6, checkin_avg_min: 503 },
      { on_time_pct: 99, tasks_delivered: 27, avg_exec_days: 1.9, checkin_avg_min: 478 },
    ]));
    expect(m.sit).toBe("green");
    expect(m.kpis.find((k) => k.key === "on_time")!.flag).toBe("green");
  });

  it("nunca compara duas pessoas entre si — cada shapeMember só enxerga os próprios meses", () => {
    const diana = shapeMember("Diana", "assistente", 1, months([
      { on_time_pct: 95, tasks_delivered: 22, avg_exec_days: 2.6, checkin_avg_min: 514 },
      { on_time_pct: 95, tasks_delivered: 22, avg_exec_days: 2.6, checkin_avg_min: 514 },
      { on_time_pct: 72, tasks_delivered: 14, avg_exec_days: 4.2, checkin_avg_min: 556 },
    ]));
    const bruno = shapeMember("Bruno", "assistente", 2, months([
      { on_time_pct: 93, tasks_delivered: 18, avg_exec_days: 3.0, checkin_avg_min: 497 },
      { on_time_pct: 93, tasks_delivered: 18, avg_exec_days: 3.0, checkin_avg_min: 497 },
      { on_time_pct: 93, tasks_delivered: 18, avg_exec_days: 3.0, checkin_avg_min: 497 },
    ]));
    // nenhum dos dois objetos carrega qualquer referência ao outro
    expect(JSON.stringify(diana)).not.toContain("Bruno");
    expect(JSON.stringify(bruno)).not.toContain("Diana");
  });
});
