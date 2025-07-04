
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Target, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { useFitnessData } from "@/hooks/useFitnessData";

interface BodyPartRecommendationsProps {
  detailed?: boolean;
}

export const BodyPartRecommendations = ({ detailed = false }: BodyPartRecommendationsProps) => {
  const { bodyPartProgress, recentWorkouts } = useFitnessData();

  // Default body parts if none exist in database
  const defaultBodyParts = [
    {
      name: "Upper Body",
      progress: 0,
      lastWorked: "Never",
      priority: "high" as const,
      exercises: ["Push-ups", "Pull-ups", "Shoulder Press"],
      nextSession: "Today"
    },
    {
      name: "Core",
      progress: 0,
      lastWorked: "Never",
      priority: "medium" as const,
      exercises: ["Planks", "Russian Twists", "Mountain Climbers"],
      nextSession: "Tomorrow"
    },
    {
      name: "Lower Body",
      progress: 0,
      lastWorked: "Never",
      priority: "high" as const,
      exercises: ["Squats", "Lunges", "Calf Raises"],
      nextSession: "Today"
    },
    {
      name: "Cardio",
      progress: 0,
      lastWorked: "Never",
      priority: "low" as const,
      exercises: ["Running", "Cycling", "Jump Rope"],
      nextSession: "Day after tomorrow"
    },
  ];

  const calculateLastWorked = (bodyPart: string) => {
    if (!recentWorkouts) return "Never";
    
    const lastWorkout = recentWorkouts.find(workout => 
      workout.body_parts.includes(bodyPart)
    );
    
    if (!lastWorkout) return "Never";
    
    const daysDiff = Math.floor(
      (new Date().getTime() - new Date(lastWorkout.completed_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysDiff === 0) return "Today";
    if (daysDiff === 1) return "Yesterday";
    return `${daysDiff} days ago`;
  };

  const calculateProgress = (bodyPart: string) => {
    if (!recentWorkouts) return 0;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentWorkoutsForBodyPart = recentWorkouts.filter(workout => 
      workout.body_parts.includes(bodyPart) && 
      new Date(workout.completed_at) >= weekAgo
    );
    
    // Assume 3 sessions per week is 100%
    return Math.min((recentWorkoutsForBodyPart.length / 3) * 100, 100);
  };

  const bodyParts = bodyPartProgress && bodyPartProgress.length > 0 
    ? bodyPartProgress.map(bp => ({
        name: bp.body_part,
        progress: calculateProgress(bp.body_part),
        lastWorked: calculateLastWorked(bp.body_part),
        priority: bp.priority as 'low' | 'medium' | 'high',
        exercises: getExercisesForBodyPart(bp.body_part),
        nextSession: getNextSession(bp.priority)
      }))
    : defaultBodyParts.map(bp => ({
        ...bp,
        progress: calculateProgress(bp.name),
        lastWorked: calculateLastWorked(bp.name)
      }));

  function getExercisesForBodyPart(bodyPart: string) {
    const exerciseMap: { [key: string]: string[] } = {
      "Upper Body": ["Push-ups", "Pull-ups", "Shoulder Press"],
      "Core": ["Planks", "Russian Twists", "Mountain Climbers"],
      "Lower Body": ["Squats", "Lunges", "Calf Raises"],
      "Cardio": ["Running", "Cycling", "Jump Rope"],
      "Full Body": ["Burpees", "Mountain Climbers", "Jumping Jacks"]
    };
    return exerciseMap[bodyPart] || ["General Exercise"];
  }

  function getNextSession(priority: string) {
    switch (priority) {
      case 'high': return "Today";
      case 'medium': return "Tomorrow";
      case 'low': return "Day after tomorrow";
      default: return "This week";
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <Target className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const highPriorityParts = bodyParts.filter(part => part.priority === 'high');

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Body Part Focus Recommendations
        </CardTitle>
        <CardDescription>
          Optimize your workout routine based on your training history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bodyParts.map((part, index) => (
          <div key={part.name} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">{part.name}</h3>
                <Badge className={getPriorityColor(part.priority)}>
                  {getPriorityIcon(part.priority)}
                  {part.priority} priority
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                Last: {part.lastWorked}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Weekly Progress</span>
                <span className="font-medium">{Math.round(part.progress)}%</span>
              </div>
              <Progress value={part.progress} className="h-2" />
            </div>

            {detailed && (
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Recommended exercises:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {part.exercises.map((exercise) => (
                      <Badge key={exercise} variant="outline" className="text-xs">
                        {exercise}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Next session: {part.nextSession}
                  </span>
                  {part.priority === 'high' && (
                    <Button size="sm" variant="outline">
                      Plan Workout
                    </Button>
                  )}
                </div>
              </div>
            )}

            {index < bodyParts.length - 1 && <Separator />}
          </div>
        ))}

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Today's Recommendation
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            {highPriorityParts.length > 0 ? (
              <>Focus on <strong>{highPriorityParts.map(p => p.name).join(' and ')}</strong> today. 
              You haven't trained these areas recently and they're showing high priority status.</>
            ) : (
              "Great job keeping up with your routine! Consider a full body workout today."
            )}
          </p>
          <Button size="sm" className="w-full">
            Start Recommended Workout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
