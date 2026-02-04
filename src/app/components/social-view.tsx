import { useState } from 'react';
import svgPaths from "@/imports/svg-u0b0duaeub";
import imgFrame73 from "figma:asset/5e57bdbeef9424b6821c727c30e788b8e31d6a71.png";
import imgFrame74 from "figma:asset/fc73edf2dd6ce93f3e7f332bccdb20d6aaecc66f.png";
import imgFrame75 from "figma:asset/2d62b2f92672bf7733e7c445649e7aa3c6fbf9cd.png";
import UserProfileModal from '@/app/components/user-profile-modal';

interface User {
  id: number;
  name: string;
  avatar: string;
  goal: number;
  distance: number; // in meters
  position: { x: number; y: number };
  walks: number;
  isFriend: boolean;
}

export default function SocialView() {
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Marc Lille',
      avatar: imgFrame73,
      goal: 10000,
      distance: 50,
      position: { x: 76, y: 693 },
      walks: 23,
      isFriend: false,
    },
    {
      id: 2,
      name: 'Sarah Chen',
      avatar: imgFrame74,
      goal: 8000,
      distance: 120,
      position: { x: 61, y: 107 },
      walks: 45,
      isFriend: false,
    },
    {
      id: 3,
      name: 'Alex Rivera',
      avatar: imgFrame75,
      goal: 12000,
      distance: 200,
      position: { x: 305, y: 261 },
      walks: 67,
      isFriend: true,
    },
  ]);

  const handleFriendRequest = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isFriend: !user.isFriend } : user
    ));
  };

  const handleWalkTogether = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      alert(`Starting a walk with ${user.name}!`);
      setSelectedUser(null);
    }
  };

  return (
    <div className="bg-[#1a1a1a] relative size-full overflow-hidden">
      {/* Animated radar circles - Outermost */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[931.5px] top-[calc(50%+0.5px)]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 931.5 931.5">
          <circle 
            cx="465.75" 
            cy="465.75" 
            fill="#1A1A1A" 
            opacity="0.7" 
            r="465.25" 
            stroke="#333333"
            className="animate-radar-pulse-3"
          />
        </svg>
      </div>
      
      {/* Middle circle */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[621px] top-1/2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 621 621">
          <circle 
            cx="310.5" 
            cy="310.5" 
            fill="#1A1A1A" 
            opacity="0.7" 
            r="310" 
            stroke="#333333"
            className="animate-radar-pulse-2"
          />
        </svg>
      </div>
      
      {/* Inner circle */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[414px] top-1/2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 414 414">
          <circle 
            cx="207" 
            cy="207" 
            fill="#1A1A1A" 
            fillOpacity="0.3" 
            opacity="0.7" 
            r="206.5" 
            stroke="#333333"
          />
        </svg>
      </div>
      
      {/* Innermost circle - animated first */}
      <div className="absolute left-[-10px] size-[414px] top-[219px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 414 414">
          <circle 
            cx="207" 
            cy="207" 
            fill="#1A1A1A" 
            opacity="0.7" 
            r="206.5" 
            stroke="#333333"
            className="animate-radar-pulse-1"
          />
        </svg>
      </div>
      
      {/* Center indicator (you) */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#f40] border-[2.461px] border-solid border-white left-[calc(50%+0.5px)] rounded-[9.997px] shadow-[0px_0px_10px_0px_rgba(66,133,244,0.5)] size-[19.994px] top-1/2 animate-pulse" />
      
      {/* Glow around center */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[rgba(255,68,0,0.3)] left-[calc(50%+0.5px)] rounded-[2000px] shadow-[0px_0px_20px_5px_rgba(255,68,0,0.6)] size-[24px] top-1/2 animate-pulse" />
      
      {/* User avatars */}
      {users.map((user, index) => (
        <div key={user.id}>
          {/* Avatar */}
          <button
            className="absolute rounded-[15px] size-[58px] cursor-pointer transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] animate-fade-in"
            style={{
              left: `${user.position.x}px`,
              top: `${user.position.y}px`,
              animationDelay: `${index * 200}ms`,
            }}
            onMouseEnter={() => setHoveredUser(user)}
            onMouseLeave={() => setHoveredUser(null)}
            onClick={() => setSelectedUser(user)}
          >
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
              <div className="absolute bg-white inset-0 rounded-[15px]" />
              <img 
                alt={user.name} 
                className="absolute max-w-none object-cover rounded-[15px] size-full" 
                src={user.avatar} 
              />
            </div>
            {user.isFriend && (
              <div className="absolute -right-1 -top-1 bg-green-500 border-2 border-[#1a1a1a] rounded-full size-4" />
            )}
          </button>
          
          {/* Hover tooltip */}
          {hoveredUser?.id === user.id && (
            <div 
              className="absolute animate-fade-in z-10"
              style={{
                left: `${user.position.x + 29}px`,
                top: `${user.position.y - 90}px`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="bg-[#2a2a2a] p-[10px] rounded-[8px] shadow-lg">
                <div className="font-['JetBrains_Mono',sans-serif] text-[14px] text-white whitespace-nowrap space-y-1">
                  <p className="leading-[normal]">{user.name}</p>
                  <p className="leading-[normal] text-[rgba(255,255,255,0.75)]">
                    Goal: {user.goal.toLocaleString('de-DE')} steps
                  </p>
                  <p className="leading-[normal]">--</p>
                  <p className="leading-[normal] underline cursor-pointer">
                    View profile &gt;
                  </p>
                </div>
              </div>
              {/* Speech bubble arrow */}
              <div className="absolute left-1/2 -bottom-2 -translate-x-1/2">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M5 8L0 0H10L5 8Z" fill="#2a2a2a" />
                </svg>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Header text */}
      <p className="-translate-x-1/2 absolute font-['DM_Mono',sans-serif] leading-[normal] left-1/2 text-[#bbb] text-[14px] text-center top-[72px]">
        Close to you
      </p>
      
      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onFriendRequest={handleFriendRequest}
          onWalkTogether={handleWalkTogether}
        />
      )}
    </div>
  );
}