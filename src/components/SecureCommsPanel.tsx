import { useState, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  LockClosedIcon,
  MicrophoneIcon,
  PaperClipIcon,
  XMarkIcon,
  UserIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  sender: string;
  rank: string;
  content: string;
  timestamp: Date;
  encrypted: boolean;
  type: 'text' | 'audio' | 'location' | 'file';
}

interface User {
  id: string;
  name: string;
  rank: string;
  status: 'online' | 'idle' | 'typing' | 'offline';
}

interface SecureCommsPanelProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export const SecureCommsPanel = ({ isOpen, onToggle }: SecureCommsPanelProps) => {
  const [message, setMessage] = useState('');
  const [isPTT, setIsPTT] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Sgt. Reyes',
      rank: 'SGT',
      content: 'Alpha team in position. North perimeter secure.',
      timestamp: new Date(Date.now() - 300000),
      encrypted: true,
      type: 'text'
    },
    {
      id: '2',
      sender: 'Lt. Chen',
      rank: 'LT',
      content: 'Copy that. Maintain radio silence until further notice.',
      timestamp: new Date(Date.now() - 240000),
      encrypted: true,
      type: 'text'
    }
  ]);

  const [users] = useState<User[]>([
    { id: '1', name: 'Sgt. Reyes', rank: 'SGT', status: 'online' },
    { id: '2', name: 'Lt. Chen', rank: 'LT', status: 'online' },
    { id: '3', name: 'Cpl. Johnson', rank: 'CPL', status: 'idle' },
    { id: '4', name: 'Pvt. Williams', rank: 'PVT', status: 'offline' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-primary';
      case 'idle': return 'bg-warning-amber';
      case 'typing': return 'bg-accent';
      case 'offline': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'Cdr. Martinez',
      rank: 'CDR',
      content: message,
      timestamp: new Date(),
      encrypted: true,
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => onToggle(!isOpen)}
        className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-50 p-3 rounded-l-lg border-l border-t border-b border-border tactical-panel transition-all duration-300 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary" />
      </button>

      {/* Sliding Panel */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-background border-l border-border z-40 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col tactical-panel rounded-none border-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <LockClosedIcon className="w-5 h-5 text-primary" />
              <h3 className="font-orbitron font-bold text-primary">SECURE COMMS</h3>
            </div>
            <button 
              onClick={() => onToggle(false)}
              className="p-1 rounded hover:bg-card transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Online Users */}
          <div className="p-4 border-b border-border">
            <div className="text-xs text-muted-foreground mb-2">ACTIVE UNITS</div>
            <div className="space-y-2">
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-mono">{user.rank}. {user.name.split(' ')[1]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-primary">{msg.rank}. {msg.sender.split(' ')[1]}</span>
                  {msg.encrypted && (
                    <LockClosedIcon className="w-3 h-3 text-accent" title="AES-256 + Signal Protocol" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="bg-card rounded-lg p-3 text-sm">
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-2 mb-3">
              <button
                onMouseDown={() => setIsPTT(true)}
                onMouseUp={() => setIsPTT(false)}
                onMouseLeave={() => setIsPTT(false)}
                className={`p-2 rounded-full transition-colors ${
                  isPTT ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <MicrophoneIcon className="w-4 h-4" />
              </button>
              
              <button className="p-2 rounded hover:bg-card transition-colors">
                <PaperClipIcon className="w-4 h-4 text-muted-foreground" />
              </button>
              
              <button className="p-2 rounded hover:bg-card transition-colors">
                <MapPinIcon className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type secure message..."
                className="flex-1 bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={sendMessage}
                className="btn-tactical"
              >
                SEND
              </button>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2 flex items-center space-x-1">
              <LockClosedIcon className="w-3 h-3" />
              <span>End-to-end encrypted • AES-256</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => onToggle(false)}
        />
      )}
    </>
  );
};