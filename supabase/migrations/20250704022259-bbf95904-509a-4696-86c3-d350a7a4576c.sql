
-- Create workouts table to store user workout sessions
CREATE TABLE public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  calories_burned INTEGER NOT NULL,
  body_parts TEXT[] NOT NULL DEFAULT '{}',
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Intermediate',
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily_stats table to store daily fitness metrics
CREATE TABLE public.daily_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  calories_burned INTEGER DEFAULT 0,
  calorie_goal INTEGER DEFAULT 600,
  workouts_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create body_part_progress table to track body part focus
CREATE TABLE public.body_part_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  body_part TEXT NOT NULL,
  last_worked_date DATE,
  weekly_sessions INTEGER DEFAULT 0,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, body_part)
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_part_progress ENABLE ROW LEVEL SECURITY;

-- Workouts policies
CREATE POLICY "Users can view their own workouts" ON public.workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own workouts" ON public.workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workouts" ON public.workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own workouts" ON public.workouts FOR DELETE USING (auth.uid() = user_id);

-- Daily stats policies  
CREATE POLICY "Users can view their own daily stats" ON public.daily_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own daily stats" ON public.daily_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own daily stats" ON public.daily_stats FOR UPDATE USING (auth.uid() = user_id);

-- Body part progress policies
CREATE POLICY "Users can view their own body part progress" ON public.body_part_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own body part progress" ON public.body_part_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own body part progress" ON public.body_part_progress FOR UPDATE USING (auth.uid() = user_id);

-- Function to update daily stats when workout is completed
CREATE OR REPLACE FUNCTION update_daily_stats_on_workout()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.daily_stats (user_id, date, calories_burned, workouts_completed)
  VALUES (NEW.user_id, NEW.completed_at::date, NEW.calories_burned, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    calories_burned = daily_stats.calories_burned + NEW.calories_burned,
    workouts_completed = daily_stats.workouts_completed + 1,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update daily stats when workout is added
CREATE TRIGGER workout_update_daily_stats
  AFTER INSERT ON public.workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_stats_on_workout();
