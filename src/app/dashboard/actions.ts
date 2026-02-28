"use server";

import { z } from "zod";
import { deleteWorkout } from "@/data/workouts";

const deleteWorkoutSchema = z.object({
  id: z.string().uuid(),
});

export async function deleteWorkoutAction(id: string) {
  const parsed = deleteWorkoutSchema.safeParse({ id });

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  await deleteWorkout(parsed.data.id);
}
