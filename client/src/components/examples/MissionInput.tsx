import MissionInput from '../MissionInput';

export default function MissionInputExample() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <MissionInput 
        onSubmit={(id) => console.log('Mission initialized for:', id)}
        isLoading={false}
      />
    </div>
  );
}
