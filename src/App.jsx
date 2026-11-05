import React, { useState, useEffect } from "react";
import {
  Activity,
  Flame,
  Utensils,
  Dumbbell,
  Clock,
  RotateCcw,
  AlertTriangle,
  Play,
  Pause,
  CheckCircle2,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const INITIAL_MACROS = {
  calories: { current: 1840, target: 2600, unit: "kcal", color: "#10b981" },
  protein: { current: 145, target: 190, unit: "g", color: "#06b6d4" },
  carbs: { current: 190, target: 280, unit: "g", color: "#f59e0b" },
  fats: { current: 52, target: 70, unit: "g", color: "#ec4899" }
};

const INITIAL_MEALS = [
  {
    id: "m-1",
    name: "Grilled Chicken & Jasmine Rice",
    portionsLeft: 4,
    totalPortions: 5,
    prepDate: "2026-11-02",
    macros: { calories: 520, protein: 48, carbs: 62, fats: 8 },
    status: "fresh"
  },
  {
    id: "m-2",
    name: "Spiced Paneer & Quinoa Bowl",
    portionsLeft: 1,
    totalPortions: 4,
    prepDate: "2026-10-31",
    macros: { calories: 480, protein: 32, carbs: 45, fats: 20 },
    status: "expiring-soon"
  },
  {
    id: "m-3",
    name: "Lean Beef & Sweet Potato Mash",
    portionsLeft: 3,
    totalPortions: 3,
    prepDate: "2026-11-03",
    macros: { calories: 590, protein: 52, carbs: 55, fats: 14 },
    status: "fresh"
  }
];

const INITIAL_WORKOUT = [
  { id: "w-1", exercise: "Barbell Bench Press", sets: 4, reps: "8-10", weight: 205, completed: true },
  { id: "w-2", exercise: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: 75, completed: true },
  { id: "w-3", exercise: "Weighted Dips", sets: 3, reps: "12", weight: 45, completed: false },
  { id: "w-4", exercise: "Cable Overhead Tricep Extension", sets: 4, reps: "12-15", weight: 65, completed: false }
];

const WEEKLY_ADHERENCE = [
  { day: "Mon", calories: 2540, protein: 185 },
  { day: "Tue", calories: 2610, protein: 192 },
  { day: "Wed", calories: 2480, protein: 178 },
  { day: "Thu", calories: 2650, protein: 195 },
  { day: "Fri", calories: 2590, protein: 188 },
  { day: "Sat", calories: 2720, protein: 182 },
  { day: "Sun", calories: 2420, protein: 175 }
];

export default function App() {
  const [macros, setMacros] = useState(() => {
    const saved = localStorage.getItem("fitpulse_macros");
    return saved ? JSON.parse(saved) : INITIAL_MACROS;
  });

  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem("fitpulse_meals");
    return saved ? JSON.parse(saved) : INITIAL_MEALS;
  });

  const [workout, setWorkout] = useState(() => {
    const saved = localStorage.getItem("fitpulse_workout");
    return saved ? JSON.parse(saved) : INITIAL_WORKOUT;
  });

  const [timerSeconds, setTimerSeconds] = useState(90);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    localStorage.setItem("fitpulse_macros", JSON.stringify(macros));
  }, [macros]);

  useEffect(() => {
    localStorage.setItem("fitpulse_meals", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem("fitpulse_workout", JSON.stringify(workout));
  }, [workout]);

  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const consumeMeal = (mealId) => {
    const meal = meals.find((m) => m.id === mealId);
    if (!meal || meal.portionsLeft <= 0) return;

    setMeals((prev) =>
      prev.map((m) =>
        m.id === mealId ? { ...m, portionsLeft: m.portionsLeft - 1 } : m
      )
    );

    setMacros((prev) => ({
      calories: { ...prev.calories, current: prev.calories.current + meal.macros.calories },
      protein: { ...prev.protein, current: prev.protein.current + meal.macros.protein },
      carbs: { ...prev.carbs, current: prev.carbs.current + meal.macros.carbs },
      fats: { ...prev.fats, current: prev.fats.current + meal.macros.fats }
    }));
  };

  const toggleWorkoutSet = (id) => {
    setWorkout((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const resetAllData = () => {
    setMacros(INITIAL_MACROS);
    setMeals(INITIAL_MEALS);
    setWorkout(INITIAL_WORKOUT);
    localStorage.clear();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              FitPulse <span className="text-emerald-400">&amp; PrepOS</span>
            </h1>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time performance tracking • Progressive overload &amp; batch nutrition
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetAllData}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-400 bg-zinc-900 hover:text-white hover:bg-zinc-800 border border-zinc-800 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
          </button>
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Sync Engine Active
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800/80 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                <Flame className="w-5 h-5 text-emerald-400" /> Daily Target Rings
              </h2>
              <span className="text-xs text-zinc-500">Live Recalculation</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(macros).map(([key, data]) => {
                const percentage = Math.min(Math.round((data.current / data.target) * 100), 100);
                return (
                  <div key={key} className="bg-zinc-950/50 border border-zinc-800/60 p-4 rounded-xl relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                      <span className="capitalize text-xs font-medium text-zinc-400">{key}</span>
                      <span className="text-xs font-semibold text-zinc-300">{percentage}%</span>
                    </div>
                    <div className="text-xl font-bold text-white tracking-tight">
                      {data.current}{" "}
                      <span className="text-xs font-normal text-zinc-500">/ {data.target} {data.unit}</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: data.color
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800/80 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-zinc-200">
                <TrendingUp className="w-4 h-4 text-cyan-400" /> Weekly Adherence Curve
              </h3>
              <span className="text-xs text-zinc-500">Calories (kcal)</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEKLY_ADHERENCE}>
                  <defs>
                    <linearGradient id="calorieGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#52525b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#52525b" fontSize={11} tickLine={false} domain={[2000, 3000]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#calorieGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800/80 rounded-2xl p-6 shadow-xl flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                  <Utensils className="w-5 h-5 text-cyan-400" /> Meal Prep Inventory
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Click to log portions directly into macros</p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-zinc-800 rounded-md border border-zinc-700 text-zinc-300">
                {meals.reduce((acc, m) => acc + m.portionsLeft, 0)} Portions Left
              </span>
            </div>

            <div className="space-y-4 flex-1">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 transition space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm text-zinc-100">{meal.name}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Prepped {meal.prepDate}</p>
                    </div>
                    {meal.status === "expiring-soon" ? (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        <AlertTriangle className="w-3 h-3" /> Eat Soon
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                        Fresh
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-1 text-center py-2 bg-zinc-900/50 rounded-lg text-xs border border-zinc-800/40">
                    <div>
                      <div className="text-zinc-500 text-[10px]">Cals</div>
                      <div className="font-semibold text-zinc-200">{meal.macros.calories}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[10px]">Protein</div>
                      <div className="font-semibold text-cyan-400">{meal.macros.protein}g</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[10px]">Carbs</div>
                      <div className="font-semibold text-amber-400">{meal.macros.carbs}g</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[10px]">Fats</div>
                      <div className="font-semibold text-pink-400">{meal.macros.fats}g</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-zinc-400 font-medium">
                      {meal.portionsLeft} / {meal.totalPortions} containers
                    </span>
                    <button
                      onClick={() => consumeMeal(meal.id)}
                      disabled={meal.portionsLeft <= 0}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        meal.portionsLeft > 0
                          ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-zinc-950 border border-cyan-500/30"
                          : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-transparent"
                      }`}
                    >
                      Log 1 Portion <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800/80 rounded-2xl p-6 shadow-xl flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                  <Dumbbell className="w-5 h-5 text-amber-400" /> Push Session (Hypertrophy)
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Track RPE and log progressive overload</p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                {workout.filter((w) => w.completed).length} / {workout.length} Done
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {workout.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleWorkoutSet(item.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    item.completed
                      ? "bg-emerald-950/20 border-emerald-500/30 text-zinc-300"
                      : "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 text-zinc-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      className={`w-5 h-5 ${item.completed ? "text-emerald-400" : "text-zinc-600"}`}
                    />
                    <div>
                      <h4 className={`text-sm font-medium ${item.completed ? "line-through text-zinc-400" : ""}`}>
                        {item.exercise}
                      </h4>
                      <p className="text-xs text-zinc-500">
                        {item.sets} sets × {item.reps} reps @ {item.weight} lbs
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800">
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400">Inter-set Rest</div>
                    <div className="text-lg font-mono font-bold text-white">
                      {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, "0")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTimerActive(!timerActive)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition border border-zinc-700"
                  >
                    {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setTimerActive(false);
                      setTimerSeconds(90);
                    }}
                    className="px-2.5 py-2 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
                  >
                    90s
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}