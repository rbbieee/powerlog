import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-black selection:bg-red-500/30 overflow-hidden relative">
      {/* Background gradients for the "Apple-like" subtle glow effect */}
      <div
        className="pointer-events-none absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full opacity-10 blur-[150px]"
        style={{
          background: "radial-gradient(circle, rgba(220, 38, 38, 1) 0%, transparent 70%)",
        }}
      />

      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <Link href="/">
            <p className="font-semibold text-lg tracking-tight text-white flex items-center gap-2 transition-opacity hover:opacity-80">
              <span className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
              PowerLog
            </p>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 text-center relative z-10">
        <div className="glass-panel p-12 max-w-lg w-full">
          <p className="text-[10rem] font-bold tracking-tighter text-white/5 leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none">
            404
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white relative z-10">
            Page Not Found
          </h1>
          <p className="mt-4 text-zinc-400 relative z-10">
            This page doesn't exist. Maybe it got dropped like a failed lift.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto rounded-full bg-red-600 px-6 py-3 text-sm font-medium text-white shadow-[0_0_15px_rgba(220,38,38,0.25)] transition-all hover:bg-red-500 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto text-sm font-medium text-zinc-400 transition-colors hover:text-white px-6 py-3"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}