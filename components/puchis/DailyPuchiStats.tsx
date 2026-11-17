import { useSyncExternalStore } from "react";
import { BarChart3 } from "lucide-react";

type DailyPuchiStatsProps = {
  history: readonly number[];
};

function localDayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 60_000);
  window.addEventListener("focus", onChange);
  return () => {
    clearInterval(timer);
    window.removeEventListener("focus", onChange);
  };
}

function getSnapshot() {
  return localDayKey(new Date());
}

function getServerSnapshot() {
  return null;
}

export default function DailyPuchiStats({ history }: DailyPuchiStatsProps) {
  const today = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const counts = new Map<string, number>();

  for (const time of history) {
    const key = localDayKey(new Date(time));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const days = today === null ? [] : (() => {
    const [year, month, day] = today.split("-").map(Number);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(year, month, day - 6 + index, 12);
      return { date, count: counts.get(localDayKey(date)) ?? 0 };
    });
  })();
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const maximum = Math.max(1, ...days.map((day) => day.count));

  return (
    <section aria-labelledby="daily-puchis-title">
      <div className="mb-3 flex min-h-11 items-center gap-2">
        <h2 id="daily-puchis-title" className="text-lg font-semibold tracking-tight">Daily puchis</h2>
      </div>
      <div className="card-surface">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Last 7 days</p>
            <p className="mt-1 text-xs leading-5 text-[#766d69]">
              Session puchis only; the sample total isn&apos;t included.
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F9ECEE] text-[#A35C69]">
            <BarChart3 aria-hidden="true" size={20} strokeWidth={1.8} />
          </div>
        </div>
        {today === null ? (
          <p className="mt-6 text-sm text-[#766d69]">Loading daily stats…</p>
        ) : (
          <>
            <p className="mt-5 text-sm text-[#766d69]">
              <span className="text-2xl font-semibold tracking-tight text-[#302C2C]">{total}</span> {total === 1 ? "puchi" : "puchis"} added
            </p>
            <div aria-hidden="true" className="mt-5 grid grid-cols-7 gap-1 sm:gap-3">
              {days.map(({ date, count }) => (
                <div key={localDayKey(date)} className="flex min-w-0 flex-col items-center">
                  <span className="text-xs font-medium text-[#705c5d]">{count}</span>
                  <div className="mt-2 flex h-28 w-full items-end justify-center border-b border-[#EDE6E1] sm:h-36">
                    <div
                      className={`w-full max-w-9 rounded-t-lg ${count ? "bg-[#B66D79]" : "bg-[#EAD9D8]"}`}
                      style={{ height: count ? `${Math.max(4, (count / maximum) * 100)}%` : "2px" }}
                    />
                  </div>
                  <span className="mt-2 text-[10px] text-[#766d69] sm:text-xs">
                    {date.toLocaleDateString(undefined, { weekday: "short" })}
                  </span>
                  <span className="text-[10px] text-[#766d69] sm:text-xs">{date.getDate()}</span>
                </div>
              ))}
            </div>
            <div className="sr-only">
              <table>
                <caption>Puchis added per day over the last seven days</caption>
                <thead><tr><th scope="col">Date</th><th scope="col">Puchis</th></tr></thead>
                <tbody>
                  {days.map(({ date, count }) => (
                    <tr key={localDayKey(date)}>
                      <th scope="row">{date.toLocaleDateString(undefined, { dateStyle: "full" })}</th>
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
