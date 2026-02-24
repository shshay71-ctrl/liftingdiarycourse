import { db } from "@/db";
import { workouts, workoutExercises, exercises } from "@/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function createWorkout(name: string, date: Date) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.insert(workouts).values({
    name,
    date,
    userId,
  });
}

export async function getWorkoutsForDate(date: Date) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      startedAt: workouts.startedAt,
      completedAt: workouts.completedAt,
      exerciseName: exercises.name,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.date, dayStart),
        lt(workouts.date, dayEnd),
      )
    )
    .orderBy(workouts.createdAt, workoutExercises.order);

  const workoutMap = new Map<
    string,
    {
      id: string;
      name: string;
      startedAt: Date | null;
      completedAt: Date | null;
      exerciseNames: string[];
    }
  >();

  for (const row of rows) {
    if (!workoutMap.has(row.workoutId)) {
      workoutMap.set(row.workoutId, {
        id: row.workoutId,
        name: row.workoutName,
        startedAt: row.startedAt,
        completedAt: row.completedAt,
        exerciseNames: [],
      });
    }
    if (row.exerciseName) {
      workoutMap.get(row.workoutId)!.exerciseNames.push(row.exerciseName);
    }
  }

  return Array.from(workoutMap.values());
}

export async function getWorkoutById(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
    .limit(1);

  return result[0] ?? null;
}

export async function updateWorkout(id: string, name: string, date: Date) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db
    .update(workouts)
    .set({ name, date, updatedAt: new Date() })
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)));
}
