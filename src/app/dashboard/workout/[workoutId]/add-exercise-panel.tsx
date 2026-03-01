"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  addExerciseToWorkoutAction,
  createExerciseAndAddToWorkoutAction,
} from "./actions";

interface AddExercisePanelProps {
  workoutId: string;
  availableExercises: { id: string; name: string }[];
  currentExercises: { exerciseId: string; workoutExerciseId: string }[];
  onClose: () => void;
  onAdded: () => void;
  onExistingSelected: (workoutExerciseId: string) => void;
}

export function AddExercisePanel({
  workoutId,
  availableExercises,
  currentExercises,
  onClose,
  onAdded,
  onExistingSelected,
}: AddExercisePanelProps) {
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = availableExercises.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  const exactMatch = availableExercises.find(
    (e) => e.name.toLowerCase() === query.toLowerCase()
  );

  const showCreate = query.trim().length > 0 && !exactMatch;

  async function handleSelectExercise(exerciseId: string) {
    const existing = currentExercises.find((e) => e.exerciseId === exerciseId);
    if (existing) {
      onExistingSelected(existing.workoutExerciseId);
      return;
    }
    setIsSubmitting(true);
    try {
      await addExerciseToWorkoutAction({ workoutId, exerciseId });
      onAdded();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateExercise() {
    const name = query.trim();
    if (!name) return;
    setIsSubmitting(true);
    try {
      await createExerciseAndAddToWorkoutAction({ workoutId, name });
      onAdded();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Add Exercise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Search exercises..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          disabled={isSubmitting}
        />

        {(filtered.length > 0 || showCreate) && (
          <div className="border rounded-md max-h-48 overflow-y-auto">
            {filtered.map((exercise) => (
              <button
                key={exercise.id}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => handleSelectExercise(exercise.id)}
                disabled={isSubmitting}
              >
                {exercise.name}
              </button>
            ))}
            {showCreate && (
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground border-t"
                onClick={handleCreateExercise}
                disabled={isSubmitting}
              >
                Create &quot;{query.trim()}&quot;
              </button>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
