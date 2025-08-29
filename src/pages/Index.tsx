import { useState, useEffect } from 'react';
import { CommandHeader } from '@/components/CommandHeader';
import { SurveillanceGrid } from '@/components/SurveillanceGrid';
import { ThreatAnalysisPanel } from '@/components/ThreatAnalysisPanel';
import { SecureCommsPanel } from '@/components/SecureCommsPanel';
import { StatusFooter } from '@/components/StatusFooter';
import { MiniMap } from '@/components/MiniMap';

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
        <div className="col-span-6 xl:col-span-7">
          <SurveillanceGrid />
        </div>
        
        {/* Threat Analysis - Center/Right */}
        <div className="col-span-6 xl:col-span-5 space-y-4">
          <ThreatAnalysisPanel />
          
          {/* Mini Map */}
          <div className="h-64">
            <MiniMap />
          </div>
        </div>
        
        {/* Secure Communications - Sliding Panel */}
        <SecureCommsPanel isOpen={commsOpen} onToggle={setCommsOpen} />
      </main>
      
      <StatusFooter />
    </div>
  );
};

export default Index;