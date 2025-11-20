import MatrixRain from '../MatrixRain';

export default function MatrixRainExample() {
  return (
    <div className="min-h-screen relative">
      <MatrixRain />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Matrix Rain Effect</h1>
          <p className="text-muted-foreground">Falling code animation</p>
        </div>
      </div>
    </div>
  );
}
