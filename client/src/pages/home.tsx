import { useState, useEffect } from "react";
import MissionInput from "@/components/MissionInput";
import LoadingAnimation from "@/components/LoadingAnimation";
import MissionDisplay, { type Mission } from "@/components/MissionDisplay";
import ActiveMissionDisplay from "@/components/ActiveMissionDisplay";
import CyberpunkBackground from "@/components/CyberpunkBackground";
import MatrixRain from "@/components/MatrixRain";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, XCircle } from "lucide-react"; // Added icons for ban screen

type AppState = "input" | "loading" | "display" | "banned"; // Added banned state
type MissionMode = "offer" | "active";

export default function Home() {
  const [state, setState] = useState<AppState>("input");
  const [mode, setMode] = useState<MissionMode>("offer");
  const [email, setEmail] = useState("");
  const [mission, setMission] = useState<Mission | null>(null);
  const [isEasterEggActive, setIsEasterEggActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const secretCode = "vanshikaprakash";
    let inputBuffer = "";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key) return; 

      inputBuffer += e.key.toLowerCase();
      
      if (inputBuffer.length > secretCode.length) {
        inputBuffer = inputBuffer.slice(-secretCode.length);
      }

      if (inputBuffer === secretCode) {
        setIsEasterEggActive(true);
        toast({
          title: "🦄 SYSTEM OVERRIDE INITIATED 🦄",
          description: "Developer God Mode Unlocked: Vanshika is watching...",
          className: "border-pink-500 text-pink-500 bg-black",
          duration: 5000,
        });
        document.documentElement.style.setProperty('--primary', '300 100% 50%');
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toast]);

  const handleSubmit = async (inputEmail: string) => {
    setEmail(inputEmail);
    setState("loading");

    try {
      const response = await fetch('/api/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail }),
      });

      const data = await response.json();

      // Handle Ban specifically
      if (response.status === 403 && data.error === "Banned") {
        setState("banned");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch mission');
      }
      
      const fetchedMission: Mission = {
        title: data.title,
        lore: data.lore,
        antagonist: data.antagonist,
        task: data.task,
        techStack: data.techStack,
        isNew: data.isNew,
      };
      
      setMission(fetchedMission);
      setMode(fetchedMission.isNew ? "offer" : "active");
      setState("display");
    } catch (error: any) {
      console.error('Error fetching mission:', error);
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: error.message,
      });
      setState("input");
    }
  };

  const handleReject = async () => {
    setState("loading");
    try {
      const response = await fetch('/api/mission/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject mission');
      }

      // Immediately ban them on the frontend
      setState("banned");

    } catch (error: any) {
      console.error('Error rejecting mission:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not reject mission. You are stuck with it for now.",
      });
      setState("display");
    }
  };

  const handleAccept = () => {
    setMode("active");
  };

  return (
    <div className="min-h-screen relative">
      <MatrixRain />
      <CyberpunkBackground isEasterEggActive={isEasterEggActive} />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {state === "input" && (
          <MissionInput onSubmit={handleSubmit} isLoading={false} />
        )}
        
        {state === "loading" && <LoadingAnimation />}
        
        {state === "banned" && (
          <div className="w-full max-w-2xl mx-auto p-8">
            <div className="border-4 border-destructive bg-black/90 rounded-lg p-10 shadow-[0_0_50px_rgba(220,38,38,0.5)] text-center space-y-6">
              <div className="flex justify-center">
                <ShieldAlert className="w-24 h-24 text-destructive animate-pulse" />
              </div>
              <h1 className="text-5xl font-bold text-destructive uppercase tracking-widest">
                ACCESS REVOKED
              </h1>
              <div className="h-px w-full bg-destructive/50" />
              <p className="text-xl text-red-400 font-mono">
                IDENTITY: {email}
                <br />
                STATUS: EXILED
              </p>
              <p className="text-muted-foreground">
                You rejected the call. The Chaos Architect has permanently deleted your credentials from the mainframe. There is no return.
              </p>
              <div className="pt-6">
                <button 
                  onClick={() => window.location.reload()}
                  className="text-xs text-destructive/50 hover:text-destructive uppercase tracking-widest transition-colors"
                >
                  [ TERMINATE SESSION ]
                </button>
              </div>
            </div>
          </div>
        )}

        {state === "display" && mission && (
          <>
            {mode === "offer" ? (
              <MissionDisplay 
                mission={mission} 
                studentId={email} 
                onReject={handleReject}
                onAccept={handleAccept}
              />
            ) : (
              <ActiveMissionDisplay 
                mission={mission}
                studentId={email}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}