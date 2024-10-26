import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">
              Pomodoro Calendar
            </Link>
          </div>
          <div>
            <Link
              href={{ pathname: "/productivity" }}
              className="text-primary transition-colors hover:text-secondary"
            >
              Productivity Rhythms
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
