import Link from "next/link"

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 120%, rgba(194,65,12,0.15) 0%, transparent 70%)",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-8 py-6 md:px-16">
        <p className="font-(family-name:--font-bebas) text-2xl tracking-widest text-orange-600">
          POWERLOG
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm text-zinc-400 transition hover:text-zinc-50"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded bg-orange-600 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-orange-500"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="relative z-10 px-8 md:px-16">
        <div className="flex min-h-[85vh] flex-col justify-end pb-20">
          <p className="font-(family-name:--font-dm-mono) mb-4 text-xs uppercase tracking-[0.3em] text-zinc-500">
            Powerlifting tracker
          </p>

          <h1 className="font-(family-name:--font-bebas) text-[clamp(5rem,14vw,14rem)] leading-none text-zinc-50">
            TRACK EVERY
            <br />
            <span
              style={{
                WebkitTextStroke: "2px rgb(194 65 12)",
                color: "transparent",
              }}
            >
              KILO.
            </span>
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-relaxed text-zinc-400">
            Stop logging your lifts in notes apps. PowerLog tracks your sets, calculates estimated 1RM automatically, and shows your strength progress over time.
          </p>

          <div className="mt-10 flex items-center gap-6">
            <Link
              href="/register"
              className="rounded bg-orange-600 px-8 py-3 font-semibold text-zinc-950 transition hover:bg-orange-500"
            >
              Start tracking
            </Link>
            <Link
              href="/login"
              className="text-sm text-zinc-500 transition hover:text-zinc-200"
            >
              Already have an account →
            </Link>
          </div>
        </div>

        <div className="border-t border-zinc-800 py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div>
              <p className="font-(family-name:--font-bebas) text-6xl text-orange-600">
                SETS
              </p>
              <p className="mt-3 text-zinc-500">
                Log every set with weight, reps, and RPE. Fast input, no friction between you and the bar.
              </p>
            </div>
            <div>
              <p className="font-(family-name:--font-bebas) text-6xl text-zinc-50">
                VOLUME
              </p>
              <p className="mt-3 text-zinc-500">
                See total training volume across every session. Watch the numbers grow over time.
              </p>
            </div>
            <div>
              <p className="font-(family-name:--font-bebas) text-6xl text-zinc-50">
                PRs
              </p>
              <p className="mt-3 text-zinc-500">
                Estimated 1RM calculated automatically from every set. Your PRs are always up to date.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}