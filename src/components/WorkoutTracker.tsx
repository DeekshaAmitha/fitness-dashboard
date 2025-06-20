
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Flame, Play, Pause, Square } from "lucide-react";
import { useState } from "react";

export const WorkoutTracker = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [currentWorkout, setCurrentWorkout] = useState<string | null>(null);

  const upcomingWorkouts = [
    {
      name: "Upper Body Strength",
      duration: "45 min",
      calories: "400-500",
      exercises: 8,
      difficulty: "Intermediate",
      date: "Today, 6:00 PM"
    },
    {
      name: "HIIT Cardio",
      duration: "30 min",
      calories: "350-450",
      exercises: 6,
      difficulty: "Advanced",
      date: "Tomorrow, 7:00 AM"
    },
    {
      name: "Lower Body Focus",
      duration: "50 min",
      calories: "450-550",
      exercises: 10,
      difficulty: "Intermediate",
      date: "Tomorrow, 8:00 PM"
    }
  ];

  const recentWorkouts = [
    {
      name: "Morning Cardio",
      date: "Today",
      duration: "25 min",
      caloriesBurned: 320,
      completed: true
    },
    {
      name: "Core Blast",
      date: "Yesterday",
      duration: "20 min",
      caloriesBurned: 180,
      completed: true
    },
    {
      name: "Full Body",
      date: "2 days ago",
      duration: "40 min",
      caloriesBurned: 450,
      completed: true
    }
  ];

  const startWorkout = (workoutName: string) => {
    setCurrentWorkout(workoutName);
    setIsWorkoutActive(true);
    setWorkoutTime(0);
  };

  const stopWorkout = () => {
    setIsWorkoutActive(false);
    setCurrentWorkout(null);
    setWorkoutTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Active Workout Card */}
      {isWorkoutActive && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Play className="h-5 w-5" />
              Active Workout: {currentWorkout}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-mono font-bold text-green-700">
                {formatTime(workoutTime)}
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  <Pause className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={stopWorkout}>
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Workouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Upcoming Workouts
            </CardTitle>
            <CardDescription>
              Your scheduled training sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingWorkouts.map((workout, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{workout.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {workout.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {workout.calories} cal
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {workout.exercises} exercises
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {workout.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => startWorkout(workout.name)}
                    disabled={isWorkoutActive}
                  >
                    Start
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  {workout.date}
                </div>
                {index < upcomingWorkouts.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Recent Workouts
            </CardTitle>
            <CardDescription>
              Your completed training sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentWorkouts.map((workout, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{workout.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{workout.duration}</span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-orange-500" />
                        {workout.caloriesBurned} cal
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Completed
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {workout.date}
                </div>
                {index < recentWorkouts.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
