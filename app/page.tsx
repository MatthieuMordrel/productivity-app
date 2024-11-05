"use client";

import { Button } from "@/components/ui/button";
import { useSessionsContext } from "@/contexts/SessionsContext";
import { ArrowRight, Calendar, Clock, Sliders } from "lucide-react";
import Link from "next/link";
import { DragDropContext } from "react-beautiful-dnd";

// Define the type for the feature items
type FeatureItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function HomePage() {
  const { handleDragEnd } = useSessionsContext();

  // Feature items
  const features: FeatureItem[] = [
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Structured Daily Planning",
      description:
        "Organize your day with customizable Work, Pause, and Break sessions.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Task Scheduling",
      description:
        "Assign specific tasks to work sessions for improved focus and productivity.",
    },
    {
      icon: <Sliders className="h-10 w-10 text-primary" />,
      title: "Customizable Rhythms",
      description:
        "Choose from various productivity techniques like Pomodoro, 52/17, or 90-minute cycles.",
    },
  ];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex min-h-screen flex-col">
        {/* Header */}

        <div className="flex-grow">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-background to-muted py-20 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
                  Master Your Day, Boost Your Productivity
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-xl">
                  Plan your day with structured schedules. Balance work and
                  breaks for peak efficiency.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                  <Button variant="default" asChild size="lg">
                    <Link href="/calendar" className="relative">
                      <span className="">Try It Now</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/productivity">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="mb-12 text-center text-3xl font-extrabold">
                Core Features
              </h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-card p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="rounded-lg bg-primary/20 py-20 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="mb-6 text-3xl font-extrabold">
                  Ready to Boost Your Productivity?
                </h2>
                <p className="mx-auto mb-10 max-w-2xl text-xl">
                  Start planning your day with our intuitive calendar and
                  discover the power of structured schedules.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    variant="default"
                    className="w-full sm:w-auto"
                  >
                    <Link href="/calendar">Get Started</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Link href="/productivity">
                      Explore Productivity Techniques
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DragDropContext>
  );
}
