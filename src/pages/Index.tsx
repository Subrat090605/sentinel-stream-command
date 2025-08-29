import { useState, useEffect } from 'react';
import { CommandHeader } from '@/components/CommandHeader';
import { SurveillanceGrid } from '@/components/SurveillanceGrid';
import { ThreatAnalysisPanel } from '@/components/ThreatAnalysisPanel';
import { SecureCommsPanel } from '@/components/SecureCommsPanel';
import { StatusFooter } from '@/components/StatusFooter';
import { MiniMap } from '@/components/MiniMap';
import { SoldierSupportPanel } from '@/components/SoldierSupportPanel';

const Index = () => {
  const [missionTime, setMissionTime] = useState(0);
  const [commsOpen, setCommsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CommandHeader missionTime={missionTime} />
      
      <main className="flex-1 p-4 grid grid-cols-12 gap-4 relative">
        {/* Surveillance Grid - Left Side */}
        <div className="col-span-8 space-y-4">
          <div className="h-[400px]">
            <SurveillanceGrid />
          </div>
          
          {/* Tactical Map */}
          <div className="h-64">
            <MiniMap />
          </div>
        </div>
        
        {/* Right Side Dashboard */}
        <div className="col-span-4 space-y-4">
          {/* Threat Analysis Dashboard */}
          <div className="h-[320px]">
            <ThreatAnalysisPanel />
          </div>
          
          {/* Soldier Support Panel */}
          <div className="h-[344px]">
            <SoldierSupportPanel />
          </div>
        </div>
        
        {/* Secure Communications - Larger Sliding Panel */}
        <SecureCommsPanel isOpen={commsOpen} onToggle={setCommsOpen} />
      </main>
      
      <StatusFooter />
    </div>
  );
};

export default Index;