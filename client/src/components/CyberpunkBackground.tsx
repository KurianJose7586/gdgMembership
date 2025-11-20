import { useEffect, useState } from "react";

interface CyberpunkBackgroundProps {
  isEasterEggActive?: boolean;
}

export default function CyberpunkBackground({ isEasterEggActive }: CyberpunkBackgroundProps) {
  const [lines, setLines] = useState<Array<{ id: number; left: number; duration: number; delay: number }>>([]);
  const [bows, setBows] = useState<Array<{ id: number; top: number; left: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const generateLines = () => {
      return Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 5,
      }));
    };
    setLines(generateLines());
  }, []);

  useEffect(() => {
    if (isEasterEggActive) {
      const generateBows = () => {
        return Array.from({ length: 25 }, (_, i) => ({
          id: i,
          top: Math.random() * 100,
          left: Math.random() * 100,
          duration: 4 + Math.random() * 4,
          delay: Math.random() * 5,
        }));
      };
      setBows(generateBows());
    }
  }, [isEasterEggActive]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Easter Egg Bows */}
      {isEasterEggActive && bows.map((bow) => (
        <div
          key={`bow-${bow.id}`}
          className="absolute text-2xl opacity-0"
          style={{
            top: `${bow.top}%`,
            left: `${bow.left}%`,
            animation: `bowFade ${bow.duration}s ease-in-out ${bow.delay}s infinite`,
            textShadow: '0 0 10px rgba(255, 105, 180, 0.5)'
          }}
        >
          🎀
        </div>
      ))}

      {lines.map((line) => (
        <div
          key={line.id}
          className="absolute top-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent opacity-40"
          style={{
            left: `${line.left}%`,
            height: '200px',
            animation: `fall ${line.duration}s linear ${line.delay}s infinite`,
          }}
        />
      ))}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary blur-sm"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 2}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl" />

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-200px);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
          }
        }

        @keyframes bowFade {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8) rotate(-10deg);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2) rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
}