import { useState, useEffect } from 'react';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ShieldCheckIcon, 
  UserIcon, 
  LockClosedIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FingerPrintIcon,
  SignalIcon
} from '@heroicons/react/24/outline';

interface LoginPageProps {
  onLogin: (credentials: { username: string; rank: string }) => void;
}

interface User {
  username: string;
  rank: string;
  clearance: string;
  department: string;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [securityLevel, setSecurityLevel] = useState('SECURE');
  const [connectionStatus, setConnectionStatus] = useState('ESTABLISHING');

  // Simulated authorized users
  const authorizedUsers: User[] = [
    { username: 'martinez', rank: 'CDR', clearance: 'TOP SECRET', department: 'COMMAND' },
    { username: 'reyes', rank: 'SGT', clearance: 'SECRET', department: 'SURVEILLANCE' },
    { username: 'chen', rank: 'LT', clearance: 'SECRET', department: 'INTELLIGENCE' },
    { username: 'johnson', rank: 'CPL', clearance: 'CONFIDENTIAL', department: 'SUPPORT' },
    { username: 'williams', rank: 'PVT', clearance: 'CONFIDENTIAL', department: 'SUPPORT' }
  ];

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const connectionInterval = setInterval(() => {
      setConnectionStatus('SECURE');
    }, 2000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(connectionInterval);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const user = authorizedUsers.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      password === 'sentinel2024'
    );

    if (user) {
      // Simulate security check
      await new Promise(resolve => setTimeout(resolve, 500));
      onLogin({ username: user.username, rank: user.rank });
    } else {
      setError('INVALID CREDENTIALS - ACCESS DENIED');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUsername('martinez');
    setPassword('sentinel2024');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 115, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 115, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Scanning Line Effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        
        {/* Radar Sweep */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary/20 rounded-full animate-ping" />
      </div>

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <ShieldCheckIcon className="w-12 h-12 text-primary animate-pulse" />
            <h1 className="text-3xl font-orbitron font-bold text-primary">
              SENTINEL STREAM
            </h1>
          </div>
          <p className="text-muted-foreground text-sm font-mono">
            SECURE COMMAND INTERFACE
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-black/40 backdrop-blur-sm border border-primary/20 rounded-lg p-6 shadow-2xl">
          {/* Security Status */}
          <div className="flex items-center justify-between mb-6 p-3 bg-primary/10 rounded border border-primary/20">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-green-400">{securityLevel}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SignalIcon className="w-3 h-3 text-blue-400" />
              <span className="text-xs font-mono text-blue-400">{connectionStatus}</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-2">
                OPERATOR ID
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-primary/30 rounded-md text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
                  placeholder="ENTER USERNAME"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-2">
                ACCESS CODE
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-black/50 border border-primary/30 rounded-md text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
                  placeholder="ENTER PASSWORD"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-destructive/20 border border-destructive/30 rounded-md">
                <ExclamationTriangleIcon className="w-4 h-4 text-destructive" />
                <span className="text-xs font-mono text-destructive">{error}</span>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-mono font-bold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>VERIFYING ACCESS...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <FingerPrintIcon className="w-4 h-4" />
                  <span>AUTHENTICATE</span>
                </div>
              )}
            </button>
          </form>

          {/* Demo Login */}
          <div className="mt-4 pt-4 border-t border-primary/20">
            <button
              onClick={handleDemoLogin}
              className="w-full py-2 text-xs font-mono text-muted-foreground hover:text-white transition-colors"
            >
              LOAD DEMO CREDENTIALS
            </button>
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-6 text-center space-y-2">
          <div className="text-xs font-mono text-muted-foreground">
            {currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            CLASSIFIED SYSTEM - AUTHORIZED PERSONNEL ONLY
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            AES-256 ENCRYPTION | SECURE CONNECTION
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-destructive" />
            <span className="text-xs font-mono text-destructive">
              UNAUTHORIZED ACCESS ATTEMPTS WILL BE LOGGED AND REPORTED
            </span>
          </div>
        </div>
      </div>

      {/* Side Panel - System Status */}
      <div className="absolute right-8 top-8 w-64 bg-black/40 backdrop-blur-sm border border-primary/20 rounded-lg p-4">
        <h3 className="text-sm font-orbitron font-bold text-primary mb-3">
          SYSTEM STATUS
        </h3>
        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Encryption:</span>
            <span className="text-green-400">AES-256</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Protocol:</span>
            <span className="text-blue-400">TLS 1.3</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Firewall:</span>
            <span className="text-green-400">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Surveillance:</span>
            <span className="text-green-400">ONLINE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Threat Level:</span>
            <span className="text-yellow-400">MODERATE</span>
          </div>
        </div>
      </div>

      {/* Authorized Users Panel */}
      <div className="absolute left-8 top-8 w-64 bg-black/40 backdrop-blur-sm border border-primary/20 rounded-lg p-4">
        <h3 className="text-sm font-orbitron font-bold text-primary mb-3">
          AUTHORIZED PERSONNEL
        </h3>
        <div className="space-y-1 text-xs font-mono">
          {authorizedUsers.map((user) => (
            <div key={user.username} className="flex items-center justify-between">
              <span className="text-muted-foreground">{user.rank}. {user.username.toUpperCase()}</span>
              <span className="text-accent">{user.clearance}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2 border-t border-primary/20">
          <div className="text-xs text-muted-foreground">
            Default Password: sentinel2024
          </div>
        </div>
      </div>
    </div>
  );
};
