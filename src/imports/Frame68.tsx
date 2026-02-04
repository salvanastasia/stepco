import svgPaths from "./svg-mo876a6qjj";
import { imgGroup } from "./svg-7980b";

interface ThemeToggleProps {
  theme: 'bw' | 'bo';
  onThemeChange: (theme: 'bw' | 'bo') => void;
}

function GroupBW() {
  return (
    <div className="absolute inset-[-305%_-140.91%_-297.51%_-127.27%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[28px_30.5px] mask-size-[22px_10px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 81 70.251">
        <g id="Group">
          <path d={svgPaths.p17b0b400} fill="var(--fill-0, white)" id="Vector" />
          <path d="M28 0.5H39V69.5H28V0.5Z" fill="var(--fill-0, #222222)" id="Vector_2" />
          <path d={svgPaths.p5cf1a80} fill="var(--fill-0, white)" id="Vector_3" />
          <path d="M40 0.5H51V69.5H40V0.5Z" fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.p127aa580} fill="var(--fill-0, white)" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroupBW() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <GroupBW />
    </div>
  );
}

function FrameBW() {
  return (
    <div className="h-[10px] overflow-clip relative shrink-0 w-[22px]" data-name="Frame">
      <ClipPathGroupBW />
    </div>
  );
}

function GroupBO() {
  return (
    <div className="absolute contents left-0 top-[-30px]">
      <div className="absolute bg-[#222] h-[69px] left-0 top-[-30px] w-[11px]" />
      <div className="absolute bg-[#f40] h-[69px] left-[11px] top-[-30px] w-[11px]" />
    </div>
  );
}

function FrameBO() {
  return (
    <div className="bg-white h-[10px] overflow-clip relative rounded-[10px] shrink-0 w-[22px]">
      <GroupBO />
    </div>
  );
}

export default function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  return (
    <div className="bg-[#111] relative rounded-[10px]">
      <div className="content-stretch flex gap-[2px] items-center overflow-clip p-[2px] relative rounded-[inherit]">
        {/* Sliding background */}
        <div 
          className="absolute bg-[#2a2a2a] h-[32px] rounded-[8px] w-[80px] transition-transform duration-300 ease-out"
          style={{
            transform: theme === 'bw' ? 'translateX(2px)' : 'translateX(84px)',
            top: '2px',
            left: '0px'
          }}
        />
        
        {/* B&W Button */}
        <button
          onClick={() => onThemeChange('bw')}
          className="content-stretch flex gap-[10px] h-[32px] items-center justify-center p-[10px] relative rounded-[8px] shrink-0 w-[80px] z-10"
        >
          <div className="h-[10px] relative shrink-0 w-[16px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 10">
              <g id="Frame 95">
                <circle cx="5" cy="5" fill={theme === 'bw' ? '#111111' : '#222222'} id="Ellipse 7" r="5" style={{ transition: 'fill 0.3s ease' }} />
                <circle cx="11" cy="5" fill="var(--fill-0, white)" id="Ellipse 6" r="5" />
              </g>
            </svg>
          </div>
          <p className="font-['DM_Mono:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">{`B&W`}</p>
        </button>
        
        {/* B&O Button */}
        <button
          onClick={() => onThemeChange('bo')}
          className="content-stretch flex gap-[10px] h-[32px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0 w-[80px] z-10"
        >
          <div className="h-[10px] relative shrink-0 w-[16px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 10">
              <g id="Frame 95">
                <circle cx="5" cy="5" fill={theme === 'bo' ? '#111111' : '#222222'} id="Ellipse 7" r="5" style={{ transition: 'fill 0.3s ease' }} />
                <circle cx="11" cy="5" fill="var(--fill-0, #FF4400)" id="Ellipse 6" r="5" />
              </g>
            </svg>
          </div>
          <p className="font-['DM_Mono:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">{`B&O`}</p>
        </button>
      </div>
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-[-0.5px] pointer-events-none rounded-[10.5px]" />
    </div>
  );
}