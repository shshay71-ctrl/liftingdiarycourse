import { format } from "date-fns";
import { Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCalendar } from "./dashboard-calendar";
import { getWorkoutsForDate } from "@/data/workouts";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const date = dateParam ? new Date(`${dateParam}T00:00:00`) : new Date();

  const workouts = await getWorkoutsForDate(date);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Workout Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your workouts by date.
        </p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Date Picker */}
        <div className="shrink-0">
          <h2 className="text-lg font-semibold mb-4">Select Date</h2>
          <DashboardCalendar selectedDate={date} />
        </div>

        {/* Workout List */}
        <div className="flex-1 max-w-[30rem] space-y-4">
          <h2 className="text-lg font-semibold">
            Workouts for {format(date, "do MMM yyyy")}
          </h2>

          {workouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <Dumbbell className="size-10 opacity-40" />
              <p>No workouts logged for this date</p>
            </div>
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
                  <Card key={workout.id} className="py-0">
                    <CardContent className="flex flex-col px-4 py-6 text-sm gap-1">
                      <span className="font-medium">{workout.name}</span>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>{workout.exerciseNames.join(" · ")}</span>
                        {duration && <span className="shrink-0">{duration}</span>}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
