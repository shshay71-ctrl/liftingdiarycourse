import Link from "next/link";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardCalendar } from "./dashboard-calendar";
import { WorkoutDeleteButton } from "./workout-delete-button";
import { getWorkoutsForDate, getWorkoutDatesForMonth } from "@/data/workouts";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const date = dateParam ? new Date(`${dateParam}T00:00:00`) : new Date();

  const [workouts, workoutDates] = await Promise.all([
    getWorkoutsForDate(date),
    getWorkoutDatesForMonth(date),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Workout Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          View your workouts by date.
        </p>
      </div>

      <div className="max-w-[30rem] space-y-4">
        <DashboardCalendar selectedDate={date} workoutDates={workoutDates} />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Workouts for {format(date, "do MMM yyyy")}
          </h2>
          <Button asChild size="icon" className="sm:hidden shrink-0">
            <Link href={`/dashboard/workout/new?date=${format(date, "yyyy-MM-dd")}`}>
              <Plus className="size-4" />
            </Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link href={`/dashboard/workout/new?date=${format(date, "yyyy-MM-dd")}`}>
              <Plus className="size-4" />
              New Workout
            </Link>
          </Button>
        </div>

        {workouts.length === 0 ? (
          <Card className="py-0">
            <CardContent className="px-4 py-6 text-sm text-center text-muted-foreground">
              No workouts logged for this date
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {workouts.map((workout) => {
              const duration =
                workout.startedAt && workout.completedAt
                  ? `${Math.round(
                      (workout.completedAt.getTime() - workout.startedAt.getTime()) / 60000
                    )} min`
                  : null;

              return (
                <div key={workout.id} className="relative">
                  <Link href={`/dashboard/workout/${workout.id}`} className="block">
                    <Card className="py-0 hover:bg-accent transition-colors cursor-pointer">
                      <CardContent className="flex flex-col px-4 py-6 text-sm gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{workout.name}</span>
                          <span className="size-7" />
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>{workout.exerciseNames.join(" · ")}</span>
                          {duration && <span className="shrink-0">{duration}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <div className="absolute top-1/2 right-4 -translate-y-1/2">
                    <WorkoutDeleteButton workoutId={workout.id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
