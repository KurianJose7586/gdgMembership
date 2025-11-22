import { useState } from "react";
import { AlertTriangle, Code, Skull, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface Mission {
  title: string;
  lore: string;
  antagonist: string;
  task: string;
  techStack: string;
  isNew?: boolean;
}

interface MissionDisplayProps {
  mission: Mission;
  studentId: string;
  onReject: () => void;
  onAccept: () => void;
}

export default function MissionDisplay({ mission, studentId, onReject, onAccept }: MissionDisplayProps) {
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto p-8", isShaking && "animate-shake")}>
      <div className="border-4 border-primary rounded-lg shadow-2xl overflow-hidden" style={{
        boxShadow: '0 0 30px rgba(0, 255, 65, 0.4)'
      }}>
        <div className="bg-card p-8 space-y-8">
          {/* ... Header Section ... */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Badge 
                data-testid="badge-student-id"
                className="mb-3 text-xs uppercase tracking-wider"
                variant="outline"
              >
                Agent: {studentId}
              </Badge>
              <h1 
                data-testid="text-mission-title"
                className="text-3xl font-bold uppercase tracking-wide text-primary mb-2"
              >
                {mission.title}
              </h1>
              <div className="h-1 w-24 bg-primary/50" />
            </div>
            <Code className="w-8 h-8 text-primary flex-shrink-0" />
          </div>

          {/* ... Mission Details ... */}
          <div className="space-y-6">
            <div className="border-l-4 border-chart-3 pl-6 py-2">
              <div className="flex items-center gap-2 mb-3">
                <Scroll className="w-5 h-5 text-chart-3" />
                <h2 className="text-xl font-semibold uppercase tracking-wider text-chart-3">
                  The Lore
                </h2>
              </div>
              <p className="text-foreground/90 leading-relaxed">
                {mission.lore}
              </p>
            </div>

            <div className="border-l-4 border-destructive pl-6 py-2">
              <div className="flex items-center gap-2 mb-3">
                <Skull className="w-5 h-5 text-destructive" />
                <h2 className="text-xl font-semibold uppercase tracking-wider text-destructive">
                  The Antagonist
                </h2>
              </div>
              <p className="text-foreground/90 leading-relaxed">
                {mission.antagonist}
              </p>
            </div>

            <div className="border-4 border-primary rounded-lg p-6 bg-primary/5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold uppercase tracking-wider text-primary">
                  Your Mission
                </h2>
              </div>
              <p className="text-foreground text-lg leading-relaxed mb-4">
                {mission.task}
              </p>
              <div className="mt-4">
                <span className="text-sm uppercase tracking-wider text-muted-foreground block mb-2">
                  Recommended Tech Stack:
                </span>
                <div className="flex flex-wrap gap-2">
                  {mission.techStack.split(',').map((tech, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="text-xs"
                    >
                      {tech.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  data-testid="button-accept-mission"
                  onClick={triggerShake}
                  className="w-full uppercase font-semibold text-lg py-6 hover:scale-[1.02] transition-transform"
                >
                  Accept Mission
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-2 border-primary bg-black/95 text-primary-foreground">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl uppercase font-bold text-primary">
                    Confirm Protocol Initialization
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400 text-md">
                    <p className="mb-2">By accepting this mission, you are binding your neural link to the Chaos Architect mainframe.</p> 
                    <p>Deadline for submission is <span className="text-primary font-bold">November 30th, 2025</span>.</p>
                    <p className="mt-2 italic">Failure is not an option. Are you ready to proceed?</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-primary/50 hover:bg-primary/20 hover:text-primary">
                    Abort
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={onAccept}
                    className="bg-primary text-black font-bold hover:bg-primary/80"
                  >
                    INITIALIZE UPLINK
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  data-testid="button-not-worthy"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground hover:text-red-500 transition-colors"
                >
                  I am not worthy (Reject Mission)
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-2 border-destructive bg-black/95 text-destructive-foreground">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl uppercase font-bold text-destructive flex items-center gap-2">
                    <Skull className="w-6 h-6" /> WARNING: PERMANENT EXILE
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-red-300 text-md font-mono">
                    <p className="mb-4">Rejecting a mission is a sign of weakness.</p>
                    <p className="mb-4 font-bold">If you proceed, your email will be PERMANENTLY BANNED from the system. You will never receive another mission.</p>
                    <p>Are you absolutely sure you want to quit?</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-gray-500 text-gray-400 hover:text-white">
                    I changed my mind
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={onReject}
                    className="bg-destructive text-white font-bold hover:bg-destructive/80"
                  >
                    YES, I QUIT
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}