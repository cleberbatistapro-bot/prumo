export interface MonthRow {
  month: string;
  month_order: number;
  on_time_pct: number;
  tasks_delivered: number;
  avg_exec_days: number;
  checkin_avg_min: number;
  signal_title: string | null;
  signal_text: string | null;
}

const avg = (nums: number[]) => nums.reduce((a, b) => a + b, 0) / nums.length;
const round1 = (n: number) => Math.round(n * 10) / 10;
const fmtHM = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(Math.round(min % 60)).padStart(2, "0")}`;

/** Flag de desvio: "higherIsBetter" define se subir é bom (entregas, tarefas) ou ruim (execução, atraso). */
function flagFor(delta: number, higherIsBetter: boolean, redAt: number, amberAt: number, greenAt: number) {
  const d = higherIsBetter ? delta : -delta;
  if (d <= -redAt) return "red";
  if (d < 0 && Math.abs(d) >= amberAt) return "amber";
  if (d >= greenAt) return "green";
  return "neutral";
}

export function shapeMember(name: string, role: string, id: number, months: MonthRow[]) {
  const sorted = [...months].sort((a, b) => a.month_order - b.month_order);
  const current = sorted[sorted.length - 1];
  const base = sorted.slice(0, -1);

  const baseOnTime = avg(base.map((m) => m.on_time_pct));
  const baseTasks = avg(base.map((m) => m.tasks_delivered));
  const baseExec = avg(base.map((m) => m.avg_exec_days));
  const baseCheckin = avg(base.map((m) => m.checkin_avg_min));

  const kpis = [
    {
      key: "checkin", label: "Pontualidade (entrada)", icon: "clock",
      value: fmtHM(current.checkin_avg_min), base: fmtHM(baseCheckin),
      deltaMin: Math.round(current.checkin_avg_min - baseCheckin),
      flag: flagFor(current.checkin_avg_min - baseCheckin, false, 30, 10, 5),
    },
    {
      key: "on_time", label: "Entregas no prazo", icon: "check",
      value: `${Math.round(current.on_time_pct)}%`, base: `${Math.round(baseOnTime)}%`,
      deltaPP: round1(current.on_time_pct - baseOnTime),
      flag: flagFor(current.on_time_pct - baseOnTime, true, 10, 3, 5),
    },
    {
      key: "tasks", label: "Tarefas entregues", icon: "box",
      value: `${current.tasks_delivered}`, base: `${Math.round(baseTasks)}`,
      delta: Math.round(current.tasks_delivered - baseTasks),
      flag: flagFor(current.tasks_delivered - baseTasks, true, 5, 1, 3),
    },
    {
      key: "exec", label: "Tempo médio de execução", icon: "timer",
      value: `${current.avg_exec_days.toFixed(1).replace(".", ",")} d`, base: `${baseExec.toFixed(1).replace(".", ",")} d`,
      deltaDays: round1(current.avg_exec_days - baseExec),
      flag: flagFor(current.avg_exec_days - baseExec, false, 2, 0, 0.3),
    },
  ];

  const flags = kpis.map((k) => k.flag);
  const sit = flags.includes("red") ? "red" : flags.every((f) => f === "green" || f === "neutral") && flags.includes("green") ? "green" : "teal";

  return {
    id, name, role, sit,
    signal: { tone: sit, title: current.signal_title, text: current.signal_text },
    kpis,
    chart: {
      months: sorted.map((m) => m.month),
      series: sorted.map((m) => Math.round(m.on_time_pct)),
      band: [Math.round(Math.min(...base.map((m) => m.on_time_pct))), Math.round(Math.max(...base.map((m) => m.on_time_pct)))],
      center: Math.round(baseOnTime),
      tone: sit,
      lastLabel: `${Math.round(current.on_time_pct)}%`,
    },
  };
}
