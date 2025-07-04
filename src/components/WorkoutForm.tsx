
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface WorkoutFormProps {
  onWorkoutAdded?: () => void;
}

export const WorkoutForm = ({ onWorkoutAdded }: WorkoutFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    duration_minutes: '',
    calories_burned: '',
    difficulty: 'Intermediate',
    notes: '',
    body_parts: [] as string[]
  });

  const bodyPartOptions = [
    'Upper Body', 'Lower Body', 'Core', 'Cardio', 'Full Body'
  ];

  const handleBodyPartChange = (bodyPart: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        body_parts: [...prev.body_parts, bodyPart]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        body_parts: prev.body_parts.filter(bp => bp !== bodyPart)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          name: formData.name,
          duration_minutes: parseInt(formData.duration_minutes),
          calories_burned: parseInt(formData.calories_burned),
          difficulty: formData.difficulty,
          notes: formData.notes || null,
          body_parts: formData.body_parts
        });

      if (error) throw error;

      toast.success('Workout logged successfully!');
      setFormData({
        name: '',
        duration_minutes: '',
        calories_burned: '',
        difficulty: 'Intermediate',
        notes: '',
        body_parts: []
      });
      onWorkoutAdded?.();
    } catch (error) {
      console.error('Error logging workout:', error);
      toast.error('Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Log New Workout
        </CardTitle>
        <CardDescription>
          Record your workout session details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Morning Run"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value }))}
                placeholder="30"
                required
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calories">Calories Burned</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories_burned}
                onChange={(e) => setFormData(prev => ({ ...prev, calories_burned: e.target.value }))}
                placeholder="250"
                required
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Body Parts Worked</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {bodyPartOptions.map((bodyPart) => (
                <div key={bodyPart} className="flex items-center space-x-2">
                  <Checkbox
                    id={bodyPart}
                    checked={formData.body_parts.includes(bodyPart)}
                    onCheckedChange={(checked) => handleBodyPartChange(bodyPart, checked as boolean)}
                  />
                  <Label htmlFor={bodyPart} className="text-sm">{bodyPart}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="How did the workout feel? Any observations..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging Workout...' : 'Log Workout'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
