import Link from "next/link"

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(200, 85, 61, 0.06) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(200, 85, 61, 0.04) 0%, transparent 50%)`,
        }}
      />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
          PowerLog
        </p>
        <Link
          href="/login"
          className="text-sm text-zinc-500 transition hover:text-zinc-200"
        >
          Log in →
        </Link>
      </header>

      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-24 pt-4">
        <div className="overflow-hidden">
          <p className="font-(family-name:--font-dm-mono) text-[clamp(0.65rem,1.2vw,0.8rem)] uppercase tracking-[0.3em] text-zinc-600">
            Powerlifting tracker
          </p>

          <div className="mt-5 space-y-1">
            <div className="flex items-baseline gap-4">
              <h1 className="font-(family-name:--font-bebas) text-[clamp(4rem,10vw,9rem)] leading-none text-zinc-50">
                EVERY
              </h1>
              <span
                className="font-(family-name:--font-bebas) text-[clamp(4rem,10vw,9rem)] leading-none"
                style={{
                  WebkitTextStroke: "2px rgb(113 113 122)",
                  color: "transparent",
                }}
              >
                KILO.
              </span>
            </div>

            <div className="flex items-baseline gap-4 pl-[clamp(2rem,5vw,6rem)]">
              <span
                className="font-(family-name:--font-bebas) text-[clamp(4rem,10vw,9rem)] leading-none"
                style={{
                  WebkitTextStroke: "2px rgb(234 88 12)",
                  color: "transparent",
                }}
              >
                EVERY
              </span>
              <h1 className="font-(family-name:--font-bebas) text-[clamp(4rem,10vw,9rem)] leading-none text-zinc-50">
                SET.
              </h1>
            </div>

            <div className="flex items-baseline gap-4">
              <h1 className="font-(family-name:--font-bebas) text-[clamp(4rem,10vw,9rem)] leading-none text-orange-500">
                EVERY PR.
              </h1>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xs">
              <p className="text-base leading-relaxed text-zinc-400">
                Stop tracking your lifts in notes apps. PowerLog is built around how powerlifters actually train.
              </p>
              <div className="mt-6 flex items-center gap-5">
                <Link
                  href="/register"
                  className="rounded bg-orange-600 px-6 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-orange-500"
                >
                  Get started
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-zinc-500 transition hover:text-zinc-200"
                >
                  Log in
                </Link>
              </div>
            </div>

            <div className="flex gap-8 sm:gap-12">
              <div className="text-right">
                <p className="font-(family-name:--font-bebas) text-5xl text-zinc-50">3</p>
                <p className="font-(family-name:--font-dm-mono) mt-0.5 text-xs uppercase tracking-widest text-zinc-600">
                  Big lifts
                </p>
              </div>
              <div className="text-right">
                <p className="font-(family-name:--font-bebas) text-5xl text-zinc-50">∞</p>
                <p className="font-(family-name:--font-dm-mono) mt-0.5 text-xs uppercase tracking-widest text-zinc-600">
                  Sessions
                </p>
              </div>
              <div className="text-right">
                <p className="font-(family-name:--font-bebas) text-5xl text-orange-500">PR</p>
                <p className="font-(family-name:--font-dm-mono) mt-0.5 text-xs uppercase tracking-widest text-zinc-600">
                  Every time
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-zinc-800/60 pt-8">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="font-(family-name:--font-dm-mono) text-xs uppercase tracking-widest text-zinc-600">
                01 - Sets
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Log weight, reps, and RPE fast. No friction between you and the bar.
              </p>
            </div>
            <div>
              <p className="font-(family-name:--font-dm-mono) text-xs uppercase tracking-widest text-zinc-600">
                02 - Volume
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Total training volume calculated across every session automatically.
              </p>
            </div>
            <div>
              <p className="font-(family-name:--font-dm-mono) text-xs uppercase tracking-widest text-zinc-600">
                03 - PRs
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Personal records tracked for bench, squat, and deadlift over time.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}