import { useEffect, useState } from "react";
import { Calendar, Clock, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mission } from "./MissionDisplay";

interface ActiveMissionDisplayProps {
  mission: Mission;
  studentId: string;
}

export default function ActiveMissionDisplay({ mission, studentId }: ActiveMissionDisplayProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Target Date: November 30, 2025
    const targetDate = new Date("2025-11-25T23:59:59").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft("MISSION EXPIRED");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/50 bg-card/50 backdrop-blur">
          <CardContent className="flex items-center gap-4 p-6">
            <Shield className="w-8 h-8 text-primary animate-pulse" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
              <p className="text-lg font-bold text-primary">ACTIVE AGENT</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/50 bg-card/50 backdrop-blur md:col-span-2">
          <CardContent className="flex items-center gap-4 p-6">
            <Clock className="w-8 h-8 text-destructive" />
            <div className="w-full">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Time Remaining</p>
              <p className="text-2xl font-mono font-bold text-destructive tracking-widest">
                {timeLeft}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Mission Dossier */}
      <div className="border-l-2 border-primary pl-6 space-y-6">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tighter text-foreground mb-2">
            {mission.title}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-mono">DEADLINE: 2025-11-30</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-secondary/20 p-6 rounded-lg border border-border">
            <h3 className="text-sm font-bold uppercase tracking-wider text-chart-3 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Technical Objectives
            </h3>
            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {mission.task}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-secondary/20 p-6 rounded-lg border border-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Assigned Identity
              </h3>
              <p className="text-lg font-mono text-primary">{studentId}</p>
            </div>

            <div className="bg-secondary/20 p-6 rounded-lg border border-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Reccomended Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {mission.techStack.split(',').map((tech, i) => (
                  <Badge key={i} variant="outline" className="border-primary/50 text-primary">
                    {tech.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}