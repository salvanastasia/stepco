function Frame3() {
  return (
    <div className="h-[10px] relative shrink-0 w-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 10">
        <g id="Frame 95">
          <circle cx="5" cy="5" fill="var(--fill-0, #222222)" id="Ellipse 7" r="5" />
          <circle cx="11" cy="5" fill="var(--fill-0, white)" id="Ellipse 6" r="5" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#2a2a2a] content-stretch flex gap-[10px] h-[32px] items-center justify-center p-[10px] relative rounded-[8px] shrink-0 w-[80px]">
      <Frame3 />
      <p className="font-['DM_Mono:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">{`B&W`}</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="h-[10px] relative shrink-0 w-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 10">
        <g id="Frame 95">
          <circle cx="5" cy="5" fill="var(--fill-0, #222222)" id="Ellipse 7" r="5" />
          <circle cx="11" cy="5" fill="var(--fill-0, #FF4400)" id="Ellipse 6" r="5" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[10px] h-[32px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0 w-[80px]">
      <Frame4 />
      <p className="font-['DM_Mono:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">{`B&O`}</p>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-[#111] relative rounded-[10px] size-full">
      <div className="content-stretch flex gap-[2px] items-center overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Frame1 />
        <Frame2 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-[-0.5px] pointer-events-none rounded-[10.5px]" />
    </div>
  );
}