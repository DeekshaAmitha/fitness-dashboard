
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Target, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface BodyPartRecommendationsProps {
  detailed?: boolean;
}

export const BodyPartRecommendations = ({ detailed = false }: BodyPartRecommendationsProps) => {
  const bodyParts = [
    {
      name: "Upper Body",
      progress: 65,
      lastWorked: "2 days ago",
      priority: "high",
      exercises: ["Push-ups", "Pull-ups", "Shoulder Press"],
      nextSession: "Today"
    },
    {
      name: "Core",
      progress: 80,
      lastWorked: "1 day ago",
      priority: "medium",
      exercises: ["Planks", "Russian Twists", "Mountain Climbers"],
      nextSession: "Tomorrow"
    },
    {
      name: "Lower Body",
      progress: 45,
      lastWorked: "4 days ago",
      priority: "high",
      exercises: ["Squats", "Lunges", "Calf Raises"],
      nextSession: "Today"
    },
    {
      name: "Cardio",
      progress: 90,
      lastWorked: "Today",
      priority: "low",
      exercises: ["Running", "Cycling", "Jump Rope"],
      nextSession: "Day after tomorrow"
    },
  ];

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
                <span className="font-medium">{part.progress}%</span>
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
            Focus on <strong>Upper Body</strong> and <strong>Lower Body</strong> today. 
            You haven't trained these areas recently and they're showing high priority status.
          </p>
          <Button size="sm" className="w-full">
            Start Recommended Workout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
