"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkoutExerciseWithSets, EditState } from "./types";
import { ExerciseCard } from "./exercise-card";
import { AddExercisePanel } from "./add-exercise-panel";

interface ExerciseListProps {
  workoutId: string;
  initialExercises: WorkoutExerciseWithSets[];
  availableExercises: { id: string; name: string }[];
}

export function ExerciseList({
  workoutId,
  initialExercises,
  availableExercises,
}: ExerciseListProps) {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [editState, setEditState] = useState<EditState>(null);
  const router = useRouter();

  function handleAdded() {
    router.refresh();
    setShowAddPanel(false);
  }

  function handleExistingSelected(workoutExerciseId: string) {
    setShowAddPanel(false);
    setEditState({ kind: "add", workoutExerciseId });
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Exercises</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddPanel((prev) => !prev)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Exercise
        </Button>
      </div>

      {showAddPanel && (
        <div className="mb-4">
          <AddExercisePanel
            workoutId={workoutId}
            availableExercises={availableExercises}
            currentExercises={initialExercises.map((e) => ({
              exerciseId: e.exerciseId,
              workoutExerciseId: e.workoutExerciseId,
            }))}
            onClose={() => setShowAddPanel(false)}
            onAdded={handleAdded}
            onExistingSelected={handleExistingSelected}
          />
        </div>
      )}

      {initialExercises.length === 0 && !showAddPanel && (
        <p className="text-muted-foreground text-sm">
          No exercises yet. Click &quot;Add Exercise&quot; to get started.
        </p>
      )}

      <div className="space-y-4">
        {initialExercises.map((we) => (
          <ExerciseCard
            key={we.workoutExerciseId}
            workoutExercise={we}
            editState={editState}
            onEditStateChange={setEditState}
          />
        ))}
      </div>
    </div>
  );
}
