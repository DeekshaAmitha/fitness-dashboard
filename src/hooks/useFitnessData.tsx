
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useFitnessData = () => {
  const { user } = useAuth();

  // Fetch daily stats
  const { data: dailyStats, refetch: refetchDailyStats } = useQuery({
    queryKey: ['dailyStats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch recent workouts
  const { data: recentWorkouts, refetch: refetchWorkouts } = useQuery({
    queryKey: ['recentWorkouts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch weekly calories data
  const { data: weeklyCalories, refetch: refetchWeeklyCalories } = useQuery({
    queryKey: ['weeklyCalories', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 6);
      
      const { data, error } = await supabase
        .from('daily_stats')
        .select('date, calories_burned, calorie_goal')
        .eq('user_id', user.id)
        .gte('date', weekAgo.toISOString().split('T')[0])
        .lte('date', today.toISOString().split('T')[0])
        .order('date');

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch body part progress
  const { data: bodyPartProgress, refetch: refetchBodyPartProgress } = useQuery({
    queryKey: ['bodyPartProgress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('body_part_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const refreshAllData = () => {
    refetchDailyStats();
    refetchWorkouts();
    refetchWeeklyCalories();
    refetchBodyPartProgress();
  };

  return {
    dailyStats,
    recentWorkouts,
    weeklyCalories,
    bodyPartProgress,
    refreshAllData,
  };
};
