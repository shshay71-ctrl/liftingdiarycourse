"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { DayButton } from "react-day-picker";
import type React from "react";

function DayButtonWithDot(props: React.ComponentProps<typeof DayButton>) {
  return (
    <div className="relative">
      <CalendarDayButton {...props} />
      {props.modifiers.hasWorkout && (
        <span className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary" />
      )}
    </div>
  );
}

export function DashboardCalendar({
  selectedDate,
  workoutDates,
}: {
  selectedDate: Date;
  workoutDates: Date[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarIcon />
          {format(selectedDate, "do MMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(d) => {
            if (d) {
              router.push(`/dashboard?date=${format(d, "yyyy-MM-dd")}`);
              setOpen(false);
            }
          }}
          modifiers={{ hasWorkout: workoutDates }}
          components={{ DayButton: DayButtonWithDot }}
        />
      </PopoverContent>
    </Popover>
  );
}
