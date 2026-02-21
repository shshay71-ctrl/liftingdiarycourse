"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Dumbbell } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MOCK_WORKOUTS = [
  {
    id: 1,
    name: "Morning Strength Session",
    exercises: ["Bench Press", "Squat", "Deadlift"],
    duration: "52 min",
  },
  {
    id: 2,
    name: "Upper Body Hypertrophy",
    exercises: ["Overhead Press", "Pull-ups", "Rows"],
    duration: "45 min",
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Workout Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          View your workouts by date.
        </p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Date Picker */}
        <div className="shrink-0">
          <h2 className="text-lg font-semibold mb-4">Select Date</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && setDate(d)}
            className="rounded-md border"
          />
        </div>

        {/* Workout List */}
        <div className="flex-1 space-y-4">
          <h2 className="text-lg font-semibold">
            Workouts for {format(date, "do MMM yyyy")}
          </h2>

          {MOCK_WORKOUTS.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <Dumbbell className="size-10 opacity-40" />
              <p>No workouts logged for this date.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {MOCK_WORKOUTS.map((workout) => (
                <Card key={workout.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{workout.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{workout.exercises.join(" · ")}</span>
                    <span>{workout.duration}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
