import CyberpunkBackground from '../CyberpunkBackground';

export default function CyberpunkBackgroundExample() {
  return (
    <div className="min-h-screen relative">
      <CyberpunkBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Background Preview</h1>
          <p className="text-muted-foreground">This shows the cyberpunk effects</p>
        </div>
      </div>
    </div>
  );
}
