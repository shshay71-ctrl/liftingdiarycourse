"use server";

import { z } from "zod";
import { updateWorkout } from "@/data/workouts";

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
