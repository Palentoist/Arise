import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TaskCategory, TaskDifficulty } from "@shared/schema";

const formSchema = z.object({
  name: z.string().min(3, { message: "Task name must be at least 3 characters" }),
  category: z.nativeEnum(TaskCategory),
  xpReward: z.coerce.number().int().min(1).max(100),
  difficulty: z.nativeEnum(TaskDifficulty),
  completionTarget: z.coerce.number().int().min(1).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateTask() {
  const { createTask } = useTasks();
  const [isTargetRequired, setIsTargetRequired] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: TaskCategory.STRENGTH,
      xpReward: 20,
      difficulty: TaskDifficulty.MEDIUM,
    },
  });
  
  const onSubmit = (data: FormValues) => {
    createTask(data);
    form.reset();
  };
  
  const handleCategoryChange = (value: TaskCategory) => {
    setIsTargetRequired(
      value === TaskCategory.RUNNING || 
      value === TaskCategory.READING || 
      value === TaskCategory.MEDITATION
    );
  };
  
  return (
    <div className="bg-card rounded-lg p-5 system-border">
      <h2 className="text-lg font-display font-bold mb-4 flex items-center">
        <PlusCircle className="text-primary mr-2 h-5 w-5" />
        CREATE CUSTOM TASK
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-400">Task Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. 30 Squats" 
                      className="bg-background border-border focus:border-primary" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-400">Category</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCategoryChange(value as TaskCategory);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background border-border focus:border-primary">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TaskCategory.STRENGTH}>Strength</SelectItem>
                      <SelectItem value={TaskCategory.ENDURANCE}>Endurance</SelectItem>
                      <SelectItem value={TaskCategory.RUNNING}>Running</SelectItem>
                      <SelectItem value={TaskCategory.READING}>Reading</SelectItem>
                      <SelectItem value={TaskCategory.MEDITATION}>Meditation</SelectItem>
                      <SelectItem value={TaskCategory.DISCIPLINE}>Discipline</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="xpReward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-400">XP Reward</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={100} 
                      className="bg-background border-border focus:border-primary" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-400">Difficulty</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background border-border focus:border-primary">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TaskDifficulty.EASY}>Easy</SelectItem>
                      <SelectItem value={TaskDifficulty.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={TaskDifficulty.HARD}>Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isTargetRequired && (
              <FormField
                control={form.control}
                name="completionTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-400">
                      Target {form.watch("category") === TaskCategory.RUNNING ? "(km)" : "(minutes)"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1}
                        className="bg-background border-border focus:border-primary" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-1 h-4 w-4" /> Add Task
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
