import { useEffect, useState } from "react";
import { Loader2, Zap } from "lucide-react";

export default function LoadingAnimation() {
  const [dots, setDots] = useState("");
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    const scanInterval = setInterval(() => {
      setScanLine((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 30);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(scanInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div className="border-4 border-primary rounded-lg p-10 shadow-2xl relative overflow-hidden" style={{
        boxShadow: '0 0 30px rgba(0, 255, 65, 0.4)'
      }}>
        <div 
          className="absolute left-0 right-0 h-0.5 bg-primary/50 blur-sm"
          style={{
            top: `${scanLine}%`,
            transition: 'top 0.03s linear'
          }}
        />
        
        <div className="flex flex-col items-center justify-center gap-8 py-12 relative z-10">
          <Zap className="w-16 h-16 text-primary animate-pulse" />
          
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-primary">
              Hacking into mainframe{dots}
            </h2>
            <p className="text-muted-foreground text-sm uppercase tracking-wider">
              Accessing chaos database
            </p>
          </div>

          <div className="flex gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-primary animate-pulse"
                style={{
                  animationDelay: `${i * 200}ms`
                }}
              />
            ))}
          </div>

          <Loader2 
            data-testid="loading-spinner"
            className="w-12 h-12 text-accent animate-spin mt-4" 
          />
        </div>
      </div>
    </div>
  );
}
