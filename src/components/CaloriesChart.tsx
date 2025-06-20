
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useState } from 'react';

interface CaloriesChartProps {
  timeframe: string;
  detailed?: boolean;
}

export const CaloriesChart = ({ timeframe, detailed = false }: CaloriesChartProps) => {
  const [chartType, setChartType] = useState('bar');

  const weeklyData = [
    { day: 'Mon', calories: 450, goal: 600 },
    { day: 'Tue', calories: 320, goal: 600 },
    { day: 'Wed', calories: 580, goal: 600 },
    { day: 'Thu', calories: 420, goal: 600 },
    { day: 'Fri', calories: 680, goal: 600 },
    { day: 'Sat', calories: 520, goal: 600 },
    { day: 'Sun', calories: 390, goal: 600 },
  ];

  const monthlyData = [
    { week: 'Week 1', calories: 2850, goal: 4200 },
    { week: 'Week 2', calories: 3200, goal: 4200 },
    { week: 'Week 3', calories: 3890, goal: 4200 },
    { week: 'Week 4', calories: 3650, goal: 4200 },
  ];

  const currentData = timeframe === 'week' ? weeklyData : monthlyData;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Calories Burned
              <span className="text-sm font-normal text-muted-foreground">
                ({timeframe === 'week' ? 'This Week' : 'This Month'})
              </span>
            </CardTitle>
            <CardDescription>
              Track your daily calorie burn progress
            </CardDescription>
          </div>
          {detailed && (
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey={timeframe === 'week' ? 'day' : 'week'} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="calories" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="goal" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey={timeframe === 'week' ? 'day' : 'week'} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="calories" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }} />
                <Line type="monotone" dataKey="goal" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Calories Burned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span>Daily Goal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
