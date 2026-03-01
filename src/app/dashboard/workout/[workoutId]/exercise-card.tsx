"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { removeExerciseFromWorkoutAction } from "./actions";
import { WorkoutExerciseWithSets, EditState } from "./types";
import { SetTable } from "./set-table";

interface ExerciseCardProps {
  workoutExercise: WorkoutExerciseWithSets;
  editState: EditState;
  onEditStateChange: (state: EditState) => void;
}

export function ExerciseCard({ workoutExercise, editState, onEditStateChange }: ExerciseCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleRemove() {
    setIsDeleting(true);
    try {
      await removeExerciseFromWorkoutAction(workoutExercise.workoutExerciseId);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  const isEditing =
    (editState?.kind === "edit" && workoutExercise.sets.some((s) => s.id === editState.setId)) ||
    (editState?.kind === "add" && editState.workoutExerciseId === workoutExercise.workoutExerciseId);

  return (
    <Card className={isEditing ? "border-primary border-2" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{workoutExercise.exerciseName}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove exercise?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove &quot;{workoutExercise.exerciseName}&quot; and delete all its
                  sets from this workout. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRemove}>
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <SetTable
          sets={workoutExercise.sets}
          workoutExerciseId={workoutExercise.workoutExerciseId}
          editState={editState}
          onEditStateChange={onEditStateChange}
        />
      </CardContent>
    </Card>
  );
}
