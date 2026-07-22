import Link from "next/link"

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden selection:bg-red-500/30">
      {/* Background gradients for the "Apple-like" subtle glow effect */}
      <div
        className="pointer-events-none absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(220, 38, 38, 1) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-10 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(225, 29, 72, 1) 0%, transparent 70%)",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <p className="font-semibold text-lg tracking-tight text-white flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
          PowerLog
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-md border border-white/10 transition-all hover:bg-white/20 hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400 mb-8 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
          The new standard for lifting
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6">
          Track Every <br />
          <span className="bg-gradient-to-br from-red-400 to-red-600 bg-clip-text text-transparent">
            Kilo.
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-zinc-400 mb-10 font-light">
          Stop logging your lifts in notes apps. PowerLog tracks your sets, calculates estimated 1RM automatically, and shows your strength progress over time.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto rounded-full bg-red-600 px-8 py-3.5 text-base font-medium text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:bg-red-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
          >
            Start Tracking
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-full px-8 py-3.5 text-base font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Sign in to account →
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="glass-panel p-8 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Sets</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Log every set with weight, reps, and RPE. Fast input, no friction between you and the bar.
            </p>
          </div>
          
          <div className="glass-panel p-8 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Volume</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              See total training volume across every session. Watch the numbers grow over time.
            </p>
          </div>

          <div className="glass-panel p-8 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">PRs</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Estimated 1RM calculated automatically from every set. Your PRs are always up to date.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}