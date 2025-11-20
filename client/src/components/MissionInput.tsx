import { useState } from "react";
import { Terminal, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MissionInputProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
}

export default function MissionInput({ onSubmit, isLoading }: MissionInputProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit(email.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div className="border-4 border-primary rounded-lg p-10 shadow-2xl" style={{
        boxShadow: '0 0 30px rgba(0, 255, 65, 0.4)'
      }}>
        <div className="flex items-center justify-center gap-3 mb-8">
          <Terminal className="w-10 h-10 text-primary" />
          {/* ADDED: hover-glitch class */}
          <h1 className="text-4xl font-bold text-center uppercase tracking-wider hover-glitch cursor-default">
            Chaos Architect
          </h1>
        </div>
        
        <div className="mb-6">
          <p className="text-center text-muted-foreground text-sm uppercase tracking-wider mb-2">
            Secure Access Terminal
          </p>
          <p className="text-center text-foreground/80 text-base">
            Enter your registered email to access your mission
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="student-email" 
              className="block text-sm uppercase tracking-wider mb-3 text-primary flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Registered Email
            </label>
            <Input
              id="student-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@example.com"
              className="bg-transparent border-0 border-b-2 border-primary rounded-none text-lg py-3 px-0 focus-visible:ring-0 focus-visible:border-accent placeholder:text-muted-foreground/50"
              disabled={isLoading}
              autoComplete="email"
              required
            />
          </div>

          {/* ADDED: hover-glitch class */}
          <Button
            type="submit"
            disabled={!email.trim() || isLoading}
            className="w-full uppercase font-bold text-base px-8 py-6 shadow-lg hover-glitch transition-all"
            style={{
              boxShadow: email.trim() && !isLoading ? '0 0 20px rgba(0, 255, 65, 0.5)' : undefined
            }}
          >
            Initialize Mission
          </Button>
        </form>
      </div>
    </div>
  );
}