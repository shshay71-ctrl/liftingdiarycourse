"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.coerce.date(),
});

export async function createWorkoutAction(params: {
  name: string;
  date: string;
}) {
  const parsed = createWorkoutSchema.safeParse(params);

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  await createWorkout(parsed.data.name, parsed.data.date);
}
