
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaloriesChart } from "@/components/CaloriesChart";
import { BodyPartRecommendations } from "@/components/BodyPartRecommendations";
import { WorkoutTracker } from "@/components/WorkoutTracker";
import { StatsOverview } from "@/components/StatsOverview";
import { Activity, Target, TrendingUp, Calendar } from "lucide-react";

const Index = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Fitness Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your progress and optimize your workout routine
          </p>
        </div>

        {/* Quick Stats */}
        <StatsOverview />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="calories" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Calories
            </TabsTrigger>
            <TabsTrigger value="bodyparts" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Focus Areas
            </TabsTrigger>
            <TabsTrigger value="workouts" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Workouts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CaloriesChart timeframe={selectedTimeframe} />
              <BodyPartRecommendations />
            </div>
          </TabsContent>

          <TabsContent value="calories">
            <CaloriesChart timeframe={selectedTimeframe} detailed={true} />
          </TabsContent>

          <TabsContent value="bodyparts">
            <BodyPartRecommendations detailed={true} />
          </TabsContent>

          <TabsContent value="workouts">
            <WorkoutTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
