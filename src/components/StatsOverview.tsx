
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, Trophy, Clock } from "lucide-react";
import { useFitnessData } from "@/hooks/useFitnessData";

export const StatsOverview = () => {
  const { dailyStats, recentWorkouts, bodyPartProgress } = useFitnessData();

  const todayCalories = dailyStats?.calories_burned || 0;
  const calorieGoal = dailyStats?.calorie_goal || 600;
  const weeklyProgress = Math.min((todayCalories / calorieGoal) * 100, 100);
  
  // Calculate streak from recent workouts
  const calculateStreak = () => {
    if (!recentWorkouts || recentWorkouts.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      const hasWorkout = recentWorkouts.some(workout => 
        new Date(workout.completed_at).toDateString() === dateStr
      );
      
      if (hasWorkout) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  // Get today's focus from body part progress
  const getTodayFocus = () => {
    if (!bodyPartProgress || bodyPartProgress.length === 0) return "Full Body";
    
    const highPriorityParts = bodyPartProgress
      .filter(bp => bp.priority === 'high')
      .sort((a, b) => new Date(a.last_worked_date || '1970-01-01').getTime() - new Date(b.last_worked_date || '1970-01-01').getTime());
    
    return highPriorityParts[0]?.body_part || "Full Body";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Calories</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{todayCalories}</div>
          <div className="space-y-2 mt-2">
            <Progress value={weeklyProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {Math.max(0, calorieGoal - todayCalories)} calories to goal
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Goal</CardTitle>
          <Target className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{Math.round(weeklyProgress)}%</div>
          <div className="space-y-2 mt-2">
            <Progress value={weeklyProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {weeklyProgress >= 100 ? 'Goal achieved!' : 'Keep pushing!'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{currentStreak}</div>
          <p className="text-xs text-muted-foreground mt-2">
            days in a row
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Focus Today</CardTitle>
          <Clock className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            {getTodayFocus()}
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">
            Based on your routine
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
