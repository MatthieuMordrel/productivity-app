import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductivityRhythms() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Productivity Rhythms: Science-Backed Techniques
      </h1>

      <Button variant="link" asChild>
        <Link href="/" className="mb-6 inline-block text-primary">
          ← Back to Home
        </Link>
      </Button>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">The Pomodoro Technique</h2>
        <p className="mb-4">
          The Pomodoro Technique, developed by Francesco Cirillo, involves
          working in 25-minute focused sessions followed by short breaks.
        </p>
        <ul className="mb-4 list-inside list-disc">
          <li>Pomodoro Duration: 25 minutes</li>
          <li>Short Break: 5 minutes</li>
          <li>Long Break: 15-30 minutes (after 4 pomodoros)</li>
        </ul>
        <p>
          Research has shown that this technique can improve focus and reduce
          mental fatigue.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">The 52/17 Rule</h2>
        <p className="mb-4">
          Based on a study of productive employees, this rhythm suggests working
          for 52 minutes followed by a 17-minute break.
        </p>
        <ul className="mb-4 list-inside list-disc">
          <li>Work Duration: 52 minutes</li>
          <li>Break Duration: 17 minutes</li>
        </ul>
        <p>
          This rhythm aligns well with the body&apos;s natural ultradian rhythm
          and has been shown to increase productivity.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          90-Minute Ultradian Rhythm
        </h2>
        <p className="mb-4">
          Based on sleep researcher Nathan Kleitman&apos;s work, this rhythm
          suggests our minds naturally oscillate between higher and lower
          alertness in 90-minute cycles.
        </p>
        <ul className="mb-4 list-inside list-disc">
          <li>Work Duration: 90 minutes</li>
          <li>Break Duration: 20-30 minutes</li>
        </ul>
        <p>
          This method can be particularly effective for deep work and complex
          problem-solving tasks.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Customizing Your Rhythm</h2>
        <p className="mb-4">
          Remember, the best productivity rhythm is the one that works for you.
          Experiment with these scientifically-backed methods and adjust the
          durations to find your optimal work-break balance.
        </p>
        <p>
          In our Pomodoro Calendar app, you can customize your work sessions and
          breaks to match your preferred rhythm:
        </p>
        <ul className="list-inside list-disc">
          <li>pomodoroDuration: Set your ideal work session length</li>
          <li>pauseDuration: Adjust the duration of your short breaks</li>
          <li>breaks: Configure longer breaks between work sessions</li>
        </ul>
      </section>
    </div>
  );
}
