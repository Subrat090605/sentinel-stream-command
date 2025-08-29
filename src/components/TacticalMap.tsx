import { useEffect, useRef, useState } from 'react';
import { 
  MapPinIcon, 
  UserGroupIcon, 
  EyeIcon, 
  FireIcon,
  ExclamationTriangleIcon,
  SignalIcon,
  ClockIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface MapPoint {
  id: string;
  type: 'threat' | 'friendly' | 'camera';
  name: string;
  lat: number;
  lng: number;
  status?: string;
}

interface HeatMapData {
  id: string;
  type: 'activity' | 'threat' | 'movement';
  intensity: number;
  lat: number;
  lng: number;
  radius: number;
}

interface MapView {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export const TacticalMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heatMapRef = useRef<HTMLCanvasElement>(null);
  const [mapPoints] = useState<MapPoint[]>([
    { id: 'threat-1', type: 'threat', name: 'Active Threat', lat: 35.6762, lng: 139.6503 },
    { id: 'threat-2', type: 'threat', name: 'Suspicious Activity', lat: 35.6768, lng: 139.6512 },
    { id: 'friendly-1', type: 'friendly', name: 'Alpha Team', lat: 35.6765, lng: 139.6510 },
    { id: 'friendly-2', type: 'friendly', name: 'Bravo Team', lat: 35.6758, lng: 139.6498 },
    { id: 'friendly-3', type: 'friendly', name: 'Charlie Team', lat: 35.6772, lng: 139.6508 },
    { id: 'camera-1', type: 'camera', name: 'CAM-01', lat: 35.6760, lng: 139.6505 },
    { id: 'camera-2', type: 'camera', name: 'CAM-02', lat: 35.6770, lng: 139.6515 },
    { id: 'camera-3', type: 'camera', name: 'CAM-03', lat: 35.6755, lng: 139.6490 },
    { id: 'camera-4', type: 'camera', name: 'CAM-04', lat: 35.6768, lng: 139.6495 },
  ]);

  const [heatMapData] = useState<HeatMapData[]>([
    { id: 'heat-1', type: 'activity', intensity: 0.8, lat: 35.6762, lng: 139.6503, radius: 50 },
    { id: 'heat-2', type: 'threat', intensity: 0.9, lat: 35.6768, lng: 139.6512, radius: 40 },
    { id: 'heat-3', type: 'movement', intensity: 0.6, lat: 35.6765, lng: 139.6510, radius: 60 },
    { id: 'heat-4', type: 'activity', intensity: 0.4, lat: 35.6758, lng: 139.6498, radius: 30 },
  ]);

  const [selectedHeatMap, setSelectedHeatMap] = useState<'activity' | 'threat' | 'movement'>('activity');
  const [tacticalMapView, setTacticalMapView] = useState<MapView>({ zoom: 1, offsetX: 0, offsetY: 0 });
  const [heatMapView, setHeatMapView] = useState<MapView>({ zoom: 1, offsetX: 0, offsetY: 0 });
  
  // Mouse interaction states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeMap, setActiveMap] = useState<'tactical' | 'heat'>('tactical');

  // Mouse event handlers for tactical map
  const handleTacticalMapMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setActiveMap('tactical');
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTacticalMapMouseMove = (e: React.MouseEvent) => {
    if (isDragging && activeMap === 'tactical') {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setTacticalMapView(prev => ({
        ...prev,
        offsetX: prev.offsetX + deltaX,
        offsetY: prev.offsetY + deltaY
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleTacticalMapMouseUp = () => {
    setIsDragging(false);
  };

  const handleTacticalMapWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(3, tacticalMapView.zoom * zoomFactor));
    
    setTacticalMapView(prev => ({
      ...prev,
      zoom: newZoom
    }));
  };

  // Mouse event handlers for heat map
  const handleHeatMapMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setActiveMap('heat');
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleHeatMapMouseMove = (e: React.MouseEvent) => {
    if (isDragging && activeMap === 'heat') {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setHeatMapView(prev => ({
        ...prev,
        offsetX: prev.offsetX + deltaX,
        offsetY: prev.offsetY + deltaY
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleHeatMapMouseUp = () => {
    setIsDragging(false);
  };

  const handleHeatMapWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(3, heatMapView.zoom * zoomFactor));
    
    setHeatMapView(prev => ({
      ...prev,
      zoom: newZoom
    }));
  };

  // Global mouse up handler
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawTacticalMap = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply transformations
      ctx.save();
      ctx.translate(tacticalMapView.offsetX, tacticalMapView.offsetY);
      ctx.scale(tacticalMapView.zoom, tacticalMapView.zoom);

      // Draw grid background
      ctx.strokeStyle = 'rgba(0, 255, 115, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      
      for (let i = 0; i <= canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw map points
      mapPoints.forEach((point) => {
        // Convert lat/lng to canvas coordinates (simplified)
        const x = ((point.lng - 139.645) / 0.01) * canvas.width;
        const y = canvas.height - ((point.lat - 35.674) / 0.004) * canvas.height;

        ctx.save();
        
        switch (point.type) {
          case 'threat':
            ctx.fillStyle = '#ff4c4c';
            ctx.shadowColor = '#ff4c4c';
            ctx.shadowBlur = 10;
            break;
          case 'friendly':
            ctx.fillStyle = '#00ff73';
            ctx.shadowColor = '#00ff73';
            ctx.shadowBlur = 8;
            break;
          case 'camera':
            ctx.fillStyle = '#3399ff';
            ctx.shadowColor = '#3399ff';
            ctx.shadowBlur = 6;
            break;
        }

        // Draw point
        ctx.beginPath();
        ctx.arc(x, y, point.type === 'threat' ? 6 : 4, 0, 2 * Math.PI);
        ctx.fill();

        // Draw pulse effect for threats
        if (point.type === 'threat') {
          ctx.strokeStyle = '#ff4c4c';
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, 2 * Math.PI);
          ctx.stroke();
        }

        ctx.restore();
      });

      // Draw connections between friendly units
      const friendlyUnits = mapPoints.filter(p => p.type === 'friendly');
      if (friendlyUnits.length > 1) {
        ctx.strokeStyle = 'rgba(0, 255, 115, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        
        for (let i = 0; i < friendlyUnits.length - 1; i++) {
          const from = friendlyUnits[i];
          const to = friendlyUnits[i + 1];
          
          const x1 = ((from.lng - 139.645) / 0.01) * canvas.width;
          const y1 = canvas.height - ((from.lat - 35.674) / 0.004) * canvas.height;
          const x2 = ((to.lng - 139.645) / 0.01) * canvas.width;
          const y2 = canvas.height - ((to.lat - 35.674) / 0.004) * canvas.height;
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        
        ctx.setLineDash([]);
      }

      ctx.restore();
    };

    drawTacticalMap();
    
    const interval = setInterval(drawTacticalMap, 100);
    return () => clearInterval(interval);
  }, [mapPoints, tacticalMapView]);

  useEffect(() => {
    const canvas = heatMapRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawHeatMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply transformations
      ctx.save();
      ctx.translate(heatMapView.offsetX, heatMapView.offsetY);
      ctx.scale(heatMapView.zoom, heatMapView.zoom);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      
      for (let i = 0; i <= canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw heat map data
      const filteredHeatData = heatMapData.filter(heat => heat.type === selectedHeatMap);
      
      filteredHeatData.forEach((heat) => {
        const x = ((heat.lng - 139.645) / 0.01) * canvas.width;
        const y = canvas.height - ((heat.lat - 35.674) / 0.004) * canvas.height;

        // Create gradient for heat map
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, heat.radius);
        
        switch (heat.type) {
          case 'activity':
            gradient.addColorStop(0, `rgba(255, 165, 0, ${heat.intensity})`);
            gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
            break;
          case 'threat':
            gradient.addColorStop(0, `rgba(255, 0, 0, ${heat.intensity})`);
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            break;
          case 'movement':
            gradient.addColorStop(0, `rgba(0, 255, 255, ${heat.intensity})`);
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
            break;
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, heat.radius, 0, 2 * Math.PI);
        ctx.fill();
      });

      ctx.restore();
    };

    drawHeatMap();
    
    const interval = setInterval(drawHeatMap, 200);
    return () => clearInterval(interval);
  }, [heatMapData, selectedHeatMap, heatMapView]);

  const resetTacticalMap = () => {
    setTacticalMapView({ zoom: 1, offsetX: 0, offsetY: 0 });
  };

  const resetHeatMap = () => {
    setHeatMapView({ zoom: 1, offsetX: 0, offsetY: 0 });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-orbitron font-bold text-primary">
          TACTICAL OPERATIONS MAP
        </h2>
        
        <div className="flex items-center space-x-4">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTacticalMapView(prev => ({ ...prev, zoom: Math.max(0.5, prev.zoom - 0.25) }))}
              className="p-2 bg-card rounded hover:bg-accent transition-colors"
            >
              <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground rotate-180" />
            </button>
            <span className="text-sm font-mono text-muted-foreground min-w-[40px] text-center">
              {Math.round(tacticalMapView.zoom * 100)}%
            </span>
            <button
              onClick={() => setTacticalMapView(prev => ({ ...prev, zoom: Math.min(3, prev.zoom + 0.25) }))}
              className="p-2 bg-card rounded hover:bg-accent transition-colors"
            >
              <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={resetTacticalMap}
              className="px-3 py-2 bg-card rounded hover:bg-accent transition-colors text-xs"
            >
              RESET
            </button>
          </div>

          {/* Time Display */}
          <div className="flex items-center space-x-2 text-sm">
            <ClockIcon className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-muted-foreground">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Two Halves */}
      <div className="flex-1 flex">
        {/* Left Half - Tactical Map */}
        <div className="w-1/2 p-4 border-r border-border">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-orbitron font-bold text-primary">
                TACTICAL OVERVIEW
              </h3>
              
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-destructive rounded-full" />
                  <span className="text-muted-foreground">THREATS</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-muted-foreground">FRIENDLY</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-muted-foreground">CAMERAS</span>
                </div>
              </div>
            </div>

            {/* Tactical Map Canvas */}
            <div 
              className="relative bg-black/50 rounded border border-border overflow-hidden flex-1 cursor-grab active:cursor-grabbing"
              onMouseDown={handleTacticalMapMouseDown}
              onMouseMove={handleTacticalMapMouseMove}
              onMouseUp={handleTacticalMapMouseUp}
              onWheel={handleTacticalMapWheel}
            >
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="w-full h-full"
              />
              
              {/* Radar sweep effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary/30 rounded-full animate-ping" />
              </div>

              {/* Zoom indicator */}
              <div className="absolute top-2 right-2 bg-black/80 rounded px-2 py-1 text-xs text-white">
                {Math.round(tacticalMapView.zoom * 100)}%
              </div>
            </div>

            {/* Tactical Map Legend */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <ExclamationTriangleIcon className="w-3 h-3 text-destructive" />
                <span className="text-muted-foreground">
                  {mapPoints.filter(p => p.type === 'threat').length} THREATS
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <UserGroupIcon className="w-3 h-3 text-primary" />
                <span className="text-muted-foreground">
                  {mapPoints.filter(p => p.type === 'friendly').length} UNITS
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <EyeIcon className="w-3 h-3 text-accent" />
                <span className="text-muted-foreground">
                  {mapPoints.filter(p => p.type === 'camera').length} CAMERAS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Half - Heat Maps */}
        <div className="w-1/2 p-4">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-orbitron font-bold text-primary">
                HEAT MAP ANALYSIS
              </h3>
              
              <div className="flex items-center space-x-2">
                {/* Heat Map Type Selector */}
                <div className="flex bg-card rounded border border-border">
                  {[
                    { key: 'activity', label: 'ACTIVITY', color: 'text-orange-400' },
                    { key: 'threat', label: 'THREAT', color: 'text-red-400' },
                    { key: 'movement', label: 'MOVEMENT', color: 'text-cyan-400' }
                  ].map((type) => (
                    <button
                      key={type.key}
                      onClick={() => setSelectedHeatMap(type.key as any)}
                      className={`px-3 py-1 text-xs font-mono transition-colors ${
                        selectedHeatMap === type.key 
                          ? 'bg-primary text-primary-foreground' 
                          : `text-muted-foreground hover:text-foreground ${type.color}`
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                {/* Heat Map Zoom Controls */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setHeatMapView(prev => ({ ...prev, zoom: Math.max(0.5, prev.zoom - 0.25) }))}
                    className="p-1 bg-card rounded hover:bg-accent transition-colors"
                  >
                    <MagnifyingGlassIcon className="w-3 h-3 text-muted-foreground rotate-180" />
                  </button>
                  <button
                    onClick={() => setHeatMapView(prev => ({ ...prev, zoom: Math.min(3, prev.zoom + 0.25) }))}
                    className="p-1 bg-card rounded hover:bg-accent transition-colors"
                  >
                    <MagnifyingGlassIcon className="w-3 h-3 text-muted-foreground" />
                  </button>
                  <button
                    onClick={resetHeatMap}
                    className="px-2 py-1 bg-card rounded hover:bg-accent transition-colors text-xs"
                  >
                    RESET
                  </button>
                </div>
              </div>
            </div>

            {/* Heat Map Canvas */}
            <div 
              className="relative bg-black/50 rounded border border-border overflow-hidden flex-1 cursor-grab active:cursor-grabbing"
              onMouseDown={handleHeatMapMouseDown}
              onMouseMove={handleHeatMapMouseMove}
              onMouseUp={handleHeatMapMouseUp}
              onWheel={handleHeatMapWheel}
            >
              <canvas
                ref={heatMapRef}
                width={400}
                height={300}
                className="w-full h-full"
              />

              {/* Zoom indicator */}
              <div className="absolute top-2 right-2 bg-black/80 rounded px-2 py-1 text-xs text-white">
                {Math.round(heatMapView.zoom * 100)}%
              </div>
            </div>

            {/* Heat Map Stats */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <FireIcon className="w-3 h-3 text-orange-400" />
                <span className="text-muted-foreground">
                  {heatMapData.filter(h => h.type === 'activity').length} HOT ZONES
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <ExclamationTriangleIcon className="w-3 h-3 text-red-400" />
                <span className="text-muted-foreground">
                  {heatMapData.filter(h => h.type === 'threat').length} THREAT AREAS
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <SignalIcon className="w-3 h-3 text-cyan-400" />
                <span className="text-muted-foreground">
                  {heatMapData.filter(h => h.type === 'movement').length} MOVEMENT PATTERNS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-card/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-muted-foreground">SYSTEMS ONLINE</span>
            </div>
            <div className="flex items-center space-x-2">
              <SignalIcon className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">GPS ACTIVE</span>
            </div>
            <div className="flex items-center space-x-2">
              <EyeIcon className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">SURVEILLANCE ACTIVE</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-xs">
            <span className="text-muted-foreground">
              LAST UPDATE: {new Date().toLocaleTimeString()}
            </span>
            <span className="text-muted-foreground">
              TACTICAL ZOOM: {Math.round(tacticalMapView.zoom * 100)}%
            </span>
            <span className="text-muted-foreground">
              HEAT ZOOM: {Math.round(heatMapView.zoom * 100)}%
            </span>
            <span className="text-muted-foreground">
              HEAT MAP: {selectedHeatMap.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
