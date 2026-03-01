import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";
import { getWorkoutExercisesWithSets, getAllExercises } from "@/data/exercises";
import { EditWorkoutForm } from "./edit-workout-form";
import { ExerciseList } from "./exercise-list";

interface EditWorkoutPageProps {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const { workoutId } = await params;

  const [workout, workoutExercises, allExercises] = await Promise.all([
    getWorkoutById(workoutId),
    getWorkoutExercisesWithSets(workoutId),
    getAllExercises(),
  ]);

  if (!workout) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Workout</h1>
        <p className="text-muted-foreground mt-1">
          Log your exercises and sets.
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

      <ExerciseList
        workoutId={workout.id}
        initialExercises={workoutExercises}
        availableExercises={allExercises}
      />
    </div>
  );
}
