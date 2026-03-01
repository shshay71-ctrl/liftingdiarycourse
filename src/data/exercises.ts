import { db } from "@/db";
import { exercises, workoutExercises, workouts, sets } from "@/db/schema";
import { eq, and, or, isNull, count } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getAllExercises() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const rows = await db
    .select({ id: exercises.id, name: exercises.name })
    .from(exercises)
    .where(or(eq(exercises.userId, userId), isNull(exercises.userId)))
    .orderBy(exercises.name);

  return rows;
}

export async function getWorkoutExercisesWithSets(workoutId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const rows = await db
    .select({
      workoutExerciseId: workoutExercises.id,
      exerciseId: exercises.id,
      exerciseName: exercises.name,
      order: workoutExercises.order,
      setId: sets.id,
      setNumber: sets.setNumber,
      reps: sets.reps,
      weight: sets.weight,
      weightUnit: sets.weightUnit,
    })
    .from(workoutExercises)
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .innerJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(
      and(
        eq(workoutExercises.workoutId, workoutId),
        eq(workouts.userId, userId)
      )
    )
    .orderBy(workoutExercises.order, sets.setNumber);

  // Group into WorkoutExerciseWithSets structure
  const exerciseMap = new Map<
    string,
    {
      workoutExerciseId: string;
      exerciseId: string;
      exerciseName: string;
      order: number;
      sets: {
        id: string;
        setNumber: number;
        reps: number | null;
        weight: string | null;
        weightUnit: "kg" | "lbs" | null;
      }[];
    }
  >();

  for (const row of rows) {
    if (!exerciseMap.has(row.workoutExerciseId)) {
      exerciseMap.set(row.workoutExerciseId, {
        workoutExerciseId: row.workoutExerciseId,
        exerciseId: row.exerciseId,
        exerciseName: row.exerciseName,
        order: row.order,
        sets: [],
      });
    }
    if (row.setId) {
      exerciseMap.get(row.workoutExerciseId)!.sets.push({
        id: row.setId,
        setNumber: row.setNumber!,
        reps: row.reps,
        weight: row.weight,
        weightUnit: row.weightUnit,
      });
    }
  }

  return Array.from(exerciseMap.values());
}

export async function addExerciseToWorkout(
  workoutId: string,
  exerciseId: string
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify workout ownership
  const workout = await db
    .select({ id: workouts.id })
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .limit(1);

  if (!workout[0]) {
    throw new Error("Workout not found or unauthorized");
  }

  // Compute next order
  const orderResult = await db
    .select({ count: count() })
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutId, workoutId));

  const nextOrder = (orderResult[0]?.count ?? 0);

  const inserted = await db
    .insert(workoutExercises)
    .values({ workoutId, exerciseId, order: nextOrder })
    .returning({ id: workoutExercises.id });

  return inserted[0];
}

export async function createExercise(name: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const inserted = await db
    .insert(exercises)
    .values({ name, userId })
    .returning({ id: exercises.id, name: exercises.name });

  return inserted[0];
}

export async function removeExerciseFromWorkout(workoutExerciseId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify ownership via join
  const result = await db
    .select({ workoutUserId: workouts.userId })
    .from(workoutExercises)
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(
      and(
        eq(workoutExercises.id, workoutExerciseId),
        eq(workouts.userId, userId)
      )
    )
    .limit(1);

  if (!result[0]) {
    throw new Error("Not found or unauthorized");
  }

  await db
    .delete(workoutExercises)
    .where(eq(workoutExercises.id, workoutExerciseId));
}

export async function addSet(
  workoutExerciseId: string,
  reps: number | null,
  weight: string | null,
  weightUnit: "kg" | "lbs"
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify ownership via join chain
  const ownership = await db
    .select({ userId: workouts.userId })
    .from(workoutExercises)
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(
      and(
        eq(workoutExercises.id, workoutExerciseId),
        eq(workouts.userId, userId)
      )
    )
    .limit(1);

  if (!ownership[0]) {
    throw new Error("Not found or unauthorized");
  }

  // Compute next setNumber
  const setCountResult = await db
    .select({ count: count() })
    .from(sets)
    .where(eq(sets.workoutExerciseId, workoutExerciseId));

  const nextSetNumber = (setCountResult[0]?.count ?? 0) + 1;

  const inserted = await db
    .insert(sets)
    .values({
      workoutExerciseId,
      setNumber: nextSetNumber,
      reps,
      weight: weight ?? null,
      weightUnit,
    })
    .returning();

  return inserted[0];
}

export async function updateSet(
  setId: string,
  reps: number | null,
  weight: string | null,
  weightUnit: "kg" | "lbs"
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify ownership via join chain
  const ownership = await db
    .select({ userId: workouts.userId })
    .from(sets)
    .innerJoin(workoutExercises, eq(workoutExercises.id, sets.workoutExerciseId))
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(and(eq(sets.id, setId), eq(workouts.userId, userId)))
    .limit(1);

  if (!ownership[0]) {
    throw new Error("Not found or unauthorized");
  }

  await db
    .update(sets)
    .set({ reps, weight: weight ?? null, weightUnit })
    .where(eq(sets.id, setId));
}

export async function deleteSet(setId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify ownership via join chain
  const ownership = await db
    .select({ userId: workouts.userId, workoutExerciseId: sets.workoutExerciseId })
    .from(sets)
    .innerJoin(workoutExercises, eq(workoutExercises.id, sets.workoutExerciseId))
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(and(eq(sets.id, setId), eq(workouts.userId, userId)))
    .limit(1);

  if (!ownership[0]) {
    throw new Error("Not found or unauthorized");
  }

  await db.delete(sets).where(eq(sets.id, setId));

  const remainingSets = await db
    .select({ id: sets.id })
    .from(sets)
    .where(eq(sets.workoutExerciseId, ownership[0].workoutExerciseId))
    .orderBy(sets.setNumber);

  for (let i = 0; i < remainingSets.length; i++) {
    await db
      .update(sets)
      .set({ setNumber: i + 1 })
      .where(eq(sets.id, remainingSets[i].id));
  }
}
