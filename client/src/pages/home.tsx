import { useState, useEffect } from "react";
import MissionInput from "@/components/MissionInput";
import LoadingAnimation from "@/components/LoadingAnimation";
import MissionDisplay, { type Mission } from "@/components/MissionDisplay";
import ActiveMissionDisplay from "@/components/ActiveMissionDisplay";
import CyberpunkBackground from "@/components/CyberpunkBackground";
import MatrixRain from "@/components/MatrixRain";
import { useToast } from "@/hooks/use-toast";

type AppState = "input" | "loading" | "display";
type MissionMode = "offer" | "active";

export default function Home() {
  const [state, setState] = useState<AppState>("input");
  const [mode, setMode] = useState<MissionMode>("offer");
  const [email, setEmail] = useState("");
  const [mission, setMission] = useState<Mission | null>(null);
  const { toast } = useToast();

  // EASTER EGG LOGIC
  useEffect(() => {
    const secretCode = "vanshikaprakash";
    let inputBuffer = "";

    const handleKeyDown = (e: KeyboardEvent) => {
      // --- FIX START ---
      // Guard clause: If e.key doesn't exist (e.g. autofill), stop immediately
      if (!e.key) return; 
      // --- FIX END ---

      inputBuffer += e.key.toLowerCase();
      
      // Keep buffer size manageable
      if (inputBuffer.length > secretCode.length) {
        inputBuffer = inputBuffer.slice(-secretCode.length);
      }

      if (inputBuffer === secretCode) {
        toast({
          title: "🦄 SYSTEM OVERRIDE INITIATED 🦄",
          description: "Developer God Mode Unlocked: Vanshika is watching...",
          className: "border-pink-500 text-pink-500 bg-black",
          duration: 5000,
        });
        // Optional: Add a fun visual effect here, like changing the primary color temporarily
        document.documentElement.style.setProperty('--primary', '300 100% 50%'); // Neon Pink
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

  const handleReset = () => {
    setState("input");
    setEmail("");
    setMission(null);
    setMode("offer");
  };

  const handleAccept = () => {
    setMode("active");
  };

  return (
    <div className="min-h-screen relative">
      <MatrixRain />
      <CyberpunkBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {state === "input" && (
          <MissionInput onSubmit={handleSubmit} isLoading={false} />
        )}
        
        {state === "loading" && <LoadingAnimation />}
        
        {state === "display" && mission && (
          <>
            {mode === "offer" ? (
              <MissionDisplay 
                mission={mission} 
                studentId={email} 
                onReset={handleReset}
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