import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <header className="flex items-center justify-between px-8 py-5 md:px-16">
        <Link href="/">
          <p className="font-(family-name:--font-bebas) text-2xl tracking-widest text-orange-600">
            POWERLOG
          </p>
        </Link>
      </header>

      <main className="flex flex-1 items-center px-8 md:px-16">
        <div>
          <p className="font-(family-name:--font-bebas) text-[clamp(6rem,20vw,18rem)] leading-none text-zinc-800">
            404
          </p>
          <h1 className="font-(family-name:--font-bebas) text-4xl text-zinc-50 md:text-5xl">
            PAGE NOT FOUND
          </h1>
          <p className="mt-3 text-zinc-500">
            This page does not exist. Maybe it got dropped like a failed lift.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <Link
              href="/dashboard"
              className="rounded bg-orange-600 px-6 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-orange-500"
            >
              Go to dashboard
            </Link>
            <Link
              href="/"
              className="text-sm text-zinc-500 transition hover:text-zinc-200"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}