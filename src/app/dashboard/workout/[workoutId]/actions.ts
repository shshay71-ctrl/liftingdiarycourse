"use server";

import { z } from "zod";
import { updateWorkout } from "@/data/workouts";
import {
  addExerciseToWorkout,
  createExercise,
  removeExerciseFromWorkout,
  addSet,
  updateSet,
  deleteSet,
} from "@/data/exercises";

const updateWorkoutSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Name is required"),
  date: z.coerce.date(),
});

export async function updateWorkoutAction(params: {
  id: string;
  name: string;
  date: string;
}) {
  const parsed = updateWorkoutSchema.safeParse(params);

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  await updateWorkout(parsed.data.id, parsed.data.name, parsed.data.date);
}

const addExerciseToWorkoutSchema = z.object({
  workoutId: z.string().min(1),
  exerciseId: z.string().min(1),
});

export async function addExerciseToWorkoutAction(params: {
  workoutId: string;
  exerciseId: string;
}) {
  const parsed = addExerciseToWorkoutSchema.safeParse(params);

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  return await addExerciseToWorkout(parsed.data.workoutId, parsed.data.exerciseId);
}

const createExerciseAndAddSchema = z.object({
  workoutId: z.string().min(1),
  name: z.string().min(1).max(100),
});

export async function createExerciseAndAddToWorkoutAction(params: {
  workoutId: string;
  name: string;
}) {
  const parsed = createExerciseAndAddSchema.safeParse(params);

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const newExercise = await createExercise(parsed.data.name);
  const workoutExercise = await addExerciseToWorkout(parsed.data.workoutId, newExercise.id);

  return { exerciseId: newExercise.id, workoutExerciseId: workoutExercise.id, name: newExercise.name };
}

const removeExerciseFromWorkoutSchema = z.string().min(1);

export async function removeExerciseFromWorkoutAction(workoutExerciseId: string) {
  const parsed = removeExerciseFromWorkoutSchema.safeParse(workoutExerciseId);

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  await removeExerciseFromWorkout(parsed.data);
}

const addSetSchema = z.object({
  workoutExerciseId: z.string().min(1),
  reps: z.number().int().min(1, "Reps must be a positive number").nullable(),
  weight: z
    .string()
    .nullable()
    .refine(
      (v) => v === null || parseFloat(v) > 0,
      "Weight must be a positive number"
    ),
  weightUnit: z.enum(["kg", "lbs"]),
});

export async function addSetAction(params: {
  workoutExerciseId: string;
  reps: number | null;
  weight: string | null;
  weightUnit: "kg" | "lbs";
}) {
  const parsed = addSetSchema.safeParse(params);

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  return await addSet(
    parsed.data.workoutExerciseId,
    parsed.data.reps,
    parsed.data.weight,
    parsed.data.weightUnit
  );
}

const updateSetSchema = z.object({
  setId: z.string().min(1),
  reps: z.number().int().min(1, "Reps must be a positive number").nullable(),
  weight: z
    .string()
    .nullable()
    .refine(
      (v) => v === null || parseFloat(v) > 0,
      "Weight must be a positive number"
    ),
  weightUnit: z.enum(["kg", "lbs"]),
});

export async function updateSetAction(params: {
  setId: string;
  reps: number | null;
  weight: string | null;
  weightUnit: "kg" | "lbs";
}) {
  const parsed = updateSetSchema.safeParse(params);

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  await updateSet(
    parsed.data.setId,
    parsed.data.reps,
    parsed.data.weight,
    parsed.data.weightUnit
  );
}

const deleteSetSchema = z.string().min(1);

export async function deleteSetAction(setId: string) {
  const parsed = deleteSetSchema.safeParse(setId);

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  await deleteSet(parsed.data);
}
