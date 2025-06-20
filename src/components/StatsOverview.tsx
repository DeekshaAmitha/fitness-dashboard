
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, Trophy, Clock } from "lucide-react";

export const StatsOverview = () => {
  const todayCalories = 420;
  const calorieGoal = 600;
  const weeklyProgress = 75;
  const currentStreak = 5;

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
            <Progress value={(todayCalories / calorieGoal) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {calorieGoal - todayCalories} calories to goal
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
          <Target className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{weeklyProgress}%</div>
          <div className="space-y-2 mt-2">
            <Progress value={weeklyProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Great progress this week!
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
            Upper Body
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">
            Based on your routine
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
