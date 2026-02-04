import { X } from 'lucide-react';

interface FriendInviteModalProps {
  friendName: string;
  friendAvatar: string;
  onAccept: () => void;
  onDecline: () => void;
  theme?: 'bw' | 'bo';
}

export default function FriendInviteModal({
  friendName,
  friendAvatar,
  onAccept,
  onDecline,
  theme = 'bw'
}: FriendInviteModalProps) {
  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-[16px] pb-[24px]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onDecline} />

      {/* Modal content - matching profile modal styling */}
      <div 
        className="content-stretch flex flex-col gap-[48px] items-center overflow-clip pb-[24px] pt-[12px] px-[24px] relative w-full max-w-[393px] rounded-[32px] bg-[#1a1a1a] z-10"
        style={{
          boxShadow: theme === 'bo'
            ? 'inset 0 0 40px rgba(255, 68, 0, 0.08), 0 -10px 60px rgba(0, 0, 0, 0.5)'
            : 'inset 0 0 40px rgba(255, 255, 255, 0.04), 0 -10px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onDecline}
          className="absolute top-6 right-6 z-20 text-white/60 hover:text-white transition-colors"
        >
          <X className="size-6" strokeWidth={1.5} />
        </button>

        {/* Handle */}
        <div className="bg-white h-[5px] rounded-[100px] shrink-0 w-[70px]" />
        
        {/* Friend Profile Section */}
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full">
          {/* Profile Picture */}
          <div className="pointer-events-none relative rounded-[24px] shrink-0 size-[88px]">
            <div aria-hidden="true" className="absolute inset-0 rounded-[24px]">
              <div className="absolute bg-white inset-0 rounded-[24px]" />
              <img alt="" className="absolute max-w-none object-cover rounded-[24px] size-full" src={friendAvatar} />
            </div>
            <div 
              aria-hidden="true" 
              className="absolute border-4 border-solid inset-0 rounded-[24px]"
              style={{
                borderColor: theme === 'bo' ? 'rgba(255, 68, 0, 0.8)' : 'rgba(136, 136, 136, 0.8)'
              }}
            />
          </div>
          
          {/* Name */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <p className="font-['DM_Mono',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-center text-white w-full whitespace-pre-wrap">
              {friendName}
            </p>
            <p className="font-['DM_Mono',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-center text-white/60 w-full whitespace-pre-wrap">
              is nearby and wants to walk together
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-0 relative shrink-0 w-full">
          <div className="absolute inset-[-1px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 313 1">
              <line stroke="#333333" x2="313" y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onDecline}
            className="flex-1 bg-[#2a2a2a] text-white/60 px-6 py-3.5 rounded-full font-['DM_Mono',sans-serif] font-light uppercase tracking-wide hover:bg-[#333] transition-all border border-[#333]"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className={`flex-1 px-6 py-3.5 rounded-full font-['DM_Mono',sans-serif] font-regular uppercase tracking-wide hover:brightness-90 transition-all ${theme === 'bo' ? 'text-white' : 'text-[#1a1a1a]'}`}
            style={{
              backgroundColor: accentColor
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}