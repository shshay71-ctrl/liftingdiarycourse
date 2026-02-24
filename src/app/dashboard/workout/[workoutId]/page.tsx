import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./edit-workout-form";

interface EditWorkoutPageProps {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const { workoutId } = await params;
  const workout = await getWorkoutById(workoutId);

  if (!workout) {
    notFound();
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Workout</h1>
        <p className="text-muted-foreground mt-1">
          Update your workout details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditWorkoutForm
            workoutId={workout.id}
            defaultName={workout.name}
            defaultDate={workout.date.toISOString()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
