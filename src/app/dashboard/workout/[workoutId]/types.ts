export type EditState =
  | { kind: "edit"; setId: string }
  | { kind: "add"; workoutExerciseId: string }
  | null;

export type SetRow = {
  id: string;
  setNumber: number;
  reps: number | null;
  weight: string | null;
  weightUnit: "kg" | "lbs" | null;
};

export type WorkoutExerciseWithSets = {
  workoutExerciseId: string;
  exerciseId: string;
  exerciseName: string;
  order: number;
  sets: SetRow[];
};
