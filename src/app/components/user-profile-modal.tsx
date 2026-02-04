import { Users, UserPlus, UserCheck } from 'lucide-react';

interface User {
  id: number;
  name: string;
  avatar: string;
  goal: number;
  distance: number;
  walks: number;
  isFriend: boolean;
}

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
  onFriendRequest: (userId: number) => void;
  onWalkTogether: (userId: number) => void;
}

export default function UserProfileModal({ user, onClose, onFriendRequest, onWalkTogether }: UserProfileModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in px-[16px] pb-[24px]">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="bg-[#111] relative rounded-[32px] w-full max-w-[393px] z-10 animate-slide-up">
        <div aria-hidden="true" className="absolute border border-[#1a1a1a] border-solid inset-0 pointer-events-none rounded-[32px]" />
        
        <div className="flex flex-col gap-[32px] items-center pb-[32px] pt-[12px] px-[24px] w-full">
          {/* Handle */}
          <div className="bg-white h-[5px] rounded-[100px] w-[70px]" />
          
          {/* Profile Section */}
          <div className="flex flex-col gap-[16px] items-center w-full">
            {/* Profile Picture */}
            <div className="pointer-events-none relative rounded-[24px] size-[120px]">
              <div aria-hidden="true" className="absolute inset-0 rounded-[24px]">
                <div className="absolute bg-white inset-0 rounded-[24px]" />
                <img 
                  alt={user.name} 
                  className="absolute max-w-none object-cover rounded-[24px] size-full" 
                  src={user.avatar} 
                />
              </div>
              <div aria-hidden="true" className="absolute border-4 border-[rgba(136,136,136,0.8)] border-solid inset-0 rounded-[24px]" />
              
              {/* Friend badge */}
              {user.isFriend && (
                <div className="absolute -right-2 -top-2 bg-green-500 border-4 border-[#111] rounded-full size-8 flex items-center justify-center">
                  <UserCheck className="size-4 text-white" strokeWidth={2.5} />
                </div>
              )}
            </div>
            
            {/* Name and info */}
            <div className="flex flex-col gap-[8px] items-center w-full">
              <p className="font-['DM_Mono'] leading-[normal] text-[20px] text-white">
                {user.name}
              </p>
              <div className="flex gap-[16px] items-center justify-center text-[rgba(255,255,255,0.75)]">
                <p className="font-['DM_Mono'] leading-[normal] text-[14px]">
                  {user.walks} walks
                </p>
                <div className="bg-[#333] rounded-full size-1" />
                <p className="font-['DM_Mono'] leading-[normal] text-[14px]">
                  {user.distance}m away
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="flex flex-col gap-[16px] items-start w-full">
            <p className="font-['DM_Mono'] leading-[normal] text-[#bbb] text-[14px]">STATS</p>
            
            <div className="flex flex-col gap-[12px] w-full">
              <div className="flex items-center justify-between w-full">
                <p className="font-['DM_Mono'] leading-[normal] text-[14px] text-white">
                  Daily Goal
                </p>
                <p className="font-['DM_Mono'] leading-[normal] text-[14px] text-[rgba(255,255,255,0.75)]">
                  {user.goal.toLocaleString('de-DE')} steps
                </p>
              </div>
              
              <div className="flex items-center justify-between w-full">
                <p className="font-['DM_Mono'] leading-[normal] text-[14px] text-white">
                  Total Walks
                </p>
                <p className="font-['DM_Mono'] leading-[normal] text-[14px] text-[rgba(255,255,255,0.75)]">
                  {user.walks}
                </p>
              </div>
              
              <div className="flex items-center justify-between w-full">
                <p className="font-['DM_Mono'] leading-[normal] text-[14px] text-white">
                  Distance
                </p>
                <p className="font-['DM_Mono'] leading-[normal] text-[14px] text-[rgba(255,255,255,0.75)]">
                  {user.distance < 1000 ? `${user.distance}m` : `${(user.distance / 1000).toFixed(1)}km`}
                </p>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-0 relative w-full">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 313 1">
                <line stroke="#333333" x2="313" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-[12px] w-full">
            <button
              onClick={() => onFriendRequest(user.id)}
              className={`flex items-center justify-center gap-[8px] w-full py-[14px] rounded-[12px] font-['DM_Mono'] text-[14px] uppercase transition-all ${
                user.isFriend
                  ? 'bg-[#2a2a2a] text-white hover:bg-[#333]'
                  : 'bg-white text-[#1a1a1a] hover:bg-[#f0f0f0]'
              }`}
            >
              {user.isFriend ? (
                <>
                  <UserCheck className="size-5" strokeWidth={2} />
                  Friends
                </>
              ) : (
                <>
                  <UserPlus className="size-5" strokeWidth={2} />
                  Add Friend
                </>
              )}
            </button>
            
            <button
              onClick={() => onWalkTogether(user.id)}
              disabled={!user.isFriend}
              className={`flex items-center justify-center gap-[8px] w-full py-[14px] rounded-[12px] font-['DM_Mono'] text-[14px] uppercase transition-all ${
                user.isFriend
                  ? 'bg-[#f40] text-white hover:bg-[#ff5511] shadow-[0_0_20px_rgba(255,68,0,0.3)]'
                  : 'bg-[#2a2a2a] text-[#666] cursor-not-allowed'
              }`}
            >
              <Users className="size-5" strokeWidth={2} />
              Walk Together
            </button>
            
            {!user.isFriend && (
              <p className="text-center text-[12px] text-[#666] font-['DM_Mono']">
                Add as friend to walk together
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}