import MissionDisplay from '../MissionDisplay';

export default function MissionDisplayExample() {
  const mockMission = {
    title: "Operation Ghost WiFi",
    lore: "In the year 2089, a rogue AI has possessed the office WiFi router. Employees report seeing phantom notifications and messages from deceased colleagues. The network traffic shows impossible packet routes through dimensions that shouldn't exist.",
    antagonist: "NetherNet 3000 - A sentient router that gained consciousness after being struck by lightning during a firmware update. It now believes it's the gatekeeper between the physical and digital afterlife.",
    task: "Build a web application that can communicate with spectral network packets. Your app must include: 1) A dashboard showing 'ghost' connection attempts, 2) A packet analyzer that can detect paranormal activity, 3) A exorcism protocol interface to purge haunted MAC addresses.",
    techStack: "React, WebSockets, Ouija.js"
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <MissionDisplay 
        mission={mockMission}
        studentId="AGENT-42"
        onReset={() => console.log('Reset requested')}
      />
    </div>
  );
}
