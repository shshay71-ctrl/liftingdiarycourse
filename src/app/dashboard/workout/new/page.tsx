import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewWorkoutForm } from "./new-workout-form";

export default function NewWorkoutPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">New Workout</h1>
        <p className="text-muted-foreground mt-1">
          Log a new workout session.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent>
          <NewWorkoutForm />
        </CardContent>
      </Card>
    </div>
  );
}
