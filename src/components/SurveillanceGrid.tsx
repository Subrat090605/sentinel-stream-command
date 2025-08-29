import { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowsPointingOutIcon,
  EyeIcon,
  EyeSlashIcon
 } from '@heroicons/react/24/outline';

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  gps: string;
  isNightVision: boolean;
  isActive: boolean;
  detections: Detection[];
}

interface Detection {
  id: string;
  type: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
}

export const SurveillanceGrid = () => {
  const [gridSize, setGridSize] = useState<'2x2' | '3x3' | '1x1'>('2x2');
  const [autoRotate, setAutoRotate] = useState(false);
  const [expandedFeed, setExpandedFeed] = useState<string | null>(null);
  const [feeds, setFeeds] = useState<CameraFeed[]>([
    {
      id: 'CAM-01',
      name: 'NORTH PERIMETER',
      location: 'GATE ALPHA',
      gps: '35.6762°N, 139.6503°E',
      isNightVision: false,
      isActive: true,
      detections: [
        { id: '1', type: 'Person', confidence: 92, bbox: { x: 120, y: 80, width: 60, height: 120 } }
      ]
    },
    {
      id: 'CAM-02',
      name: 'EAST CORRIDOR',
      location: 'SECTOR-B',
      gps: '35.6765°N, 139.6510°E',
      isNightVision: true,
      isActive: true,
      detections: []
    },
    {
      id: 'CAM-03',
      name: 'SOUTH YARD',
      location: 'CHECKPOINT-2',
      gps: '35.6758°N, 139.6498°E',
      isNightVision: false,
      isActive: true,
      detections: [
        { id: '2', type: 'Vehicle', confidence: 87, bbox: { x: 200, y: 150, width: 100, height: 60 } }
      ]
    },
    {
      id: 'CAM-04',
      name: 'WEST ENTRANCE',
      location: 'MAIN GATE',
      gps: '35.6760°N, 139.6495°E',
      isNightVision: false,
      isActive: false,
      detections: []
    }
  ]);

  const getGridClass = () => {
    switch (gridSize) {
      case '1x1': return 'grid-cols-1';
      case '2x2': return 'grid-cols-2';
      case '3x3': return 'grid-cols-3';
      default: return 'grid-cols-2';
    }
  };

  const simulateDetection = () => {
    // Simulate random AI detections
    setFeeds(prev => prev.map(feed => ({
      ...feed,
      detections: Math.random() > 0.7 ? [
        {
          id: Date.now().toString(),
          type: ['Person', 'Vehicle', 'Motion'][Math.floor(Math.random() * 3)],
          confidence: Math.floor(Math.random() * 30 + 70),
          bbox: {
            x: Math.random() * 200,
            y: Math.random() * 100,
            width: 60 + Math.random() * 40,
            height: 80 + Math.random() * 60
          }
        }
      ] : []
    })));
  };

  useEffect(() => {
    const interval = setInterval(simulateDetection, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tactical-panel p-4 h-full">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-orbitron font-bold text-primary">
          SURVEILLANCE GRID
        </h2>
        
        <div className="flex items-center space-x-2">
          {/* Grid Size Toggle */}
          <div className="flex bg-card rounded border border-border">
            {['1x1', '2x2', '3x3'].map((size) => (
              <button
                key={size}
                onClick={() => setGridSize(size as any)}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  gridSize === size 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          
          {/* Auto Rotate */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded transition-colors ${
              autoRotate ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {autoRotate ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className={`grid ${getGridClass()} gap-4 h-[calc(100%-80px)]`}>
        {feeds.slice(0, gridSize === '1x1' ? 1 : gridSize === '2x2' ? 4 : 9).map((feed) => (
          <div 
            key={feed.id} 
            className="relative bg-black rounded border border-border overflow-hidden group cursor-pointer"
            onClick={() => setExpandedFeed(expandedFeed === feed.id ? null : feed.id)}
          >
            {/* Simulated Video Feed */}
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 relative">
              {/* Video overlay effect */}
              <div className="video-overlay" />
              
              {/* Detection Bounding Boxes */}
              {feed.detections.map((detection) => (
                <div
                  key={detection.id}
                  className="absolute border-2 border-destructive bg-destructive/20"
                  style={{
                    left: `${detection.bbox.x}px`,
                    top: `${detection.bbox.y}px`,
                    width: `${detection.bbox.width}px`,
                    height: `${detection.bbox.height}px`,
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-destructive text-white text-xs px-1 py-0.5 rounded">
                    {detection.type}: {detection.confidence}%
                  </div>
                </div>
              ))}
              
              {/* Scanline effect */}
              <div className="scanline absolute inset-0" />
            </div>

            {/* Feed Info Overlay */}
            <div className="absolute top-2 left-2 bg-black/80 rounded p-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${feed.isActive ? 'bg-primary animate-pulse' : 'bg-destructive'}`} />
                <span className="font-mono text-primary font-bold">{feed.id}</span>
                {feed.isNightVision && (
                  <EyeIcon className="w-3 h-3 text-accent" title="Night Vision" />
                )}
              </div>
              <div className="text-foreground font-medium">{feed.name}</div>
              <div className="text-muted-foreground">{feed.location}</div>
              <div className="text-muted-foreground font-mono text-xs">{feed.gps}</div>
            </div>

            {/* Expand Button */}
            <button className="absolute top-2 right-2 p-1 bg-black/80 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowsPointingOutIcon className="w-4 h-4 text-foreground" />
            </button>

            {/* Threat Alert */}
            {feed.detections.length > 0 && (
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-destructive text-white text-xs font-bold px-2 py-1 rounded threat-glow">
                  THREAT DETECTED
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};