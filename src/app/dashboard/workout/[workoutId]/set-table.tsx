"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteSetAction, updateSetAction, addSetAction } from "./actions";
import { SetRow, EditState } from "./types";

const editSetSchema = z.object({
  reps: z.string().optional(),
  weight: z.string().optional(),
  weightUnit: z.enum(["kg", "lbs"]),
});

type EditSetFormValues = z.infer<typeof editSetSchema>;

interface SetRowEditFormProps {
  set: SetRow;
  onSave: () => void;
  onCancel: () => void;
}

function SetRowEditForm({ set, onSave, onCancel }: SetRowEditFormProps) {
  const router = useRouter();

  const form = useForm<EditSetFormValues>({
    resolver: zodResolver(editSetSchema),
    defaultValues: {
      reps: set.reps != null ? String(set.reps) : undefined,
      weight: set.weight ?? undefined,
      weightUnit: set.weightUnit ?? "kg",
    },
  });

  async function onSubmit(values: EditSetFormValues) {
    const repsNum = values.reps ? parseInt(values.reps, 10) : null;
    const reps = repsNum && !isNaN(repsNum) && repsNum > 0 ? repsNum : null;
    const weightNum = values.weight ? parseFloat(values.weight) : null;
    const weight = weightNum && !isNaN(weightNum) && weightNum > 0 ? String(weightNum) : null;
    await updateSetAction({
      setId: set.id,
      reps,
      weight,
      weightUnit: values.weightUnit,
    });
    router.refresh();
    onSave();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end gap-2 py-1"
      >
        <span className="w-8 text-sm text-muted-foreground shrink-0">
          {set.setNumber}
        </span>

        <FormField
          control={form.control}
          name="reps"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="number"
                  placeholder="Reps"
                  min="1"
                  className="h-7 text-sm"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="number"
                  placeholder="Weight"
                  min="0.5"
                  step="0.5"
                  className="h-7 text-sm"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weightUnit"
          render={({ field }) => (
            <FormItem className="w-16">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-7 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lbs">lbs</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="sm"
          className="h-7 text-sm shrink-0"
          disabled={form.formState.isSubmitting}
        >
          Save
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-sm shrink-0"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </form>
    </Form>
  );
}

interface NewSetRowFormProps {
  workoutExerciseId: string;
  nextSetNumber: number;
  lastSet: SetRow | null;
  onSave: () => void;
  onCancel: () => void;
}

function NewSetRowForm({ workoutExerciseId, nextSetNumber, lastSet, onSave, onCancel }: NewSetRowFormProps) {
  const router = useRouter();

  const form = useForm<EditSetFormValues>({
    resolver: zodResolver(editSetSchema),
    defaultValues: {
      reps: lastSet?.reps != null ? String(lastSet.reps) : undefined,
      weight: lastSet?.weight ?? undefined,
      weightUnit: lastSet?.weightUnit ?? "kg",
    },
  });

  async function onSubmit(values: EditSetFormValues) {
    const repsNum = values.reps ? parseInt(values.reps, 10) : null;
    const reps = repsNum && !isNaN(repsNum) && repsNum > 0 ? repsNum : null;
    const weightNum = values.weight ? parseFloat(values.weight) : null;
    const weight = weightNum && !isNaN(weightNum) && weightNum > 0 ? String(weightNum) : null;
    await addSetAction({
      workoutExerciseId,
      reps,
      weight,
      weightUnit: values.weightUnit,
    });
    router.refresh();
    onSave();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end gap-2 py-1"
      >
        <span className="w-8 text-sm text-muted-foreground shrink-0">
          {nextSetNumber}
        </span>

        <FormField
          control={form.control}
          name="reps"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="number"
                  placeholder="Reps"
                  min="1"
                  className="h-7 text-sm"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="number"
                  placeholder="Weight"
                  min="0.5"
                  step="0.5"
                  className="h-7 text-sm"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weightUnit"
          render={({ field }) => (
            <FormItem className="w-16">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-7 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lbs">lbs</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="sm"
          className="h-7 text-sm shrink-0"
          disabled={form.formState.isSubmitting}
        >
          Save
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-sm shrink-0"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </form>
    </Form>
  );
}

interface SetTableProps {
  sets: SetRow[];
  workoutExerciseId: string;
  editState: EditState;
  onEditStateChange: (state: EditState) => void;
}

export function SetTable({ sets, workoutExerciseId, editState, onEditStateChange }: SetTableProps) {
  const router = useRouter();

  async function handleDelete(setId: string) {
    await deleteSetAction(setId);
    router.refresh();
  }

  const isAddingHere =
    editState?.kind === "add" && editState.workoutExerciseId === workoutExerciseId;

  const lastSet = sets.length > 0 ? sets[sets.length - 1] : null;

  const showHeader = sets.length > 0 || isAddingHere;

  return (
    <div className="mb-2">
      {showHeader && (
        <div className="grid grid-cols-[2rem_1fr_1fr_3.5rem_2rem] gap-2 text-xs font-medium text-muted-foreground px-1 mb-1">
          <span>Set</span>
          <span>Reps</span>
          <span>Weight</span>
          <span>Unit</span>
          <span />
        </div>
      )}

      <div className="space-y-1">
        {sets.map((set) =>
          editState?.kind === "edit" && editState.setId === set.id ? (
            <SetRowEditForm
              key={set.id}
              set={set}
              onSave={() => onEditStateChange(null)}
              onCancel={() => onEditStateChange(null)}
            />
          ) : (
            <div
              key={set.id}
              className="grid grid-cols-[2rem_1fr_1fr_3.5rem_2rem] gap-2 items-center px-1 py-1 rounded hover:bg-muted cursor-pointer text-sm"
              onClick={() => onEditStateChange({ kind: "edit", setId: set.id })}
            >
              <span className="text-muted-foreground">{set.setNumber}</span>
              <span>{set.reps ?? "—"}</span>
              <span>{set.weight ?? "—"}</span>
              <span className="text-muted-foreground">{set.weightUnit ?? "—"}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(set.id);
                }}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Delete set"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        )}

        {isAddingHere ? (
          <NewSetRowForm
            workoutExerciseId={workoutExerciseId}
            nextSetNumber={sets.length + 1}
            lastSet={lastSet}
            onSave={() => onEditStateChange(null)}
            onCancel={() => onEditStateChange(null)}
          />
        ) : (
          <div
            className="grid grid-cols-[2rem_1fr_1fr_3.5rem_2rem] gap-2 items-center px-1 py-1 rounded hover:bg-muted cursor-pointer text-sm text-muted-foreground"
            onClick={() => onEditStateChange({ kind: "add", workoutExerciseId })}
          >
            <span>+</span>
            <span>Add set</span>
            <span>—</span>
            <span>—</span>
            <span />
          </div>
        )}
      </div>
    </div>
  );
}
