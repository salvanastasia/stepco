import imgFrame73 from "figma:asset/5e57bdbeef9424b6821c727c30e788b8e31d6a71.png";
import imgFrame74 from "figma:asset/fc73edf2dd6ce93f3e7f332bccdb20d6aaecc66f.png";
import imgFrame75 from "figma:asset/2d62b2f92672bf7733e7c445649e7aa3c6fbf9cd.png";

function Container() {
  return <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#f40] border-[2.461px] border-solid border-white left-[calc(50%+0.5px)] rounded-[9.997px] shadow-[0px_0px_10px_0px_rgba(66,133,244,0.5)] size-[19.994px] top-1/2" data-name="Container" />;
}

function Container1() {
  return <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[rgba(255,68,0,0.1)] left-[calc(50%+0.5px)] rounded-[2000px] shadow-[0px_0px_10px_0px_rgba(244,116,66,0.5)] size-[40px] top-1/2" data-name="Container" />;
}

function Frame() {
  return (
    <div className="absolute left-[61px] rounded-[15px] size-[58px] top-[107px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
        <div className="absolute bg-white inset-0 rounded-[15px]" />
        <img alt="" className="absolute max-w-none object-cover rounded-[15px] size-full" src={imgFrame73} />
        <img alt="" className="absolute max-w-none object-cover rounded-[15px] size-full" src={imgFrame74} />
        <img alt="" className="absolute max-w-none object-cover rounded-[15px] size-full" src={imgFrame74} />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute left-[305px] rounded-[24px] size-[88px] top-[261px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[24px]">
        <div className="absolute bg-white inset-0 rounded-[24px]" />
        <img alt="" className="absolute max-w-none object-cover rounded-[24px] size-full" src={imgFrame73} />
        <img alt="" className="absolute max-w-none object-cover rounded-[24px] size-full" src={imgFrame75} />
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute left-[76px] rounded-[15px] size-[58px] top-[693px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
        <div className="absolute bg-white inset-0 rounded-[15px]" />
        <img alt="" className="absolute max-w-none object-cover rounded-[15px] size-full" src={imgFrame73} />
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#1a1a1a] relative size-full" data-name="2">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[931.5px] top-[calc(50%+0.5px)]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 931.5 931.5">
          <circle cx="465.75" cy="465.75" fill="var(--fill-0, #1A1A1A)" id="Ellipse 5" opacity="0.7" r="465.25" stroke="var(--stroke-0, #333333)" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[621px] top-1/2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 621 621">
          <circle cx="310.5" cy="310.5" fill="var(--fill-0, #333333)" id="Ellipse 4" opacity="0.2" r="310" stroke="var(--stroke-0, #EEEEEE)" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[414px] top-1/2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 414 414">
          <circle cx="207" cy="207" fill="var(--fill-0, #1A1A1A)" fillOpacity="0.3" id="Ellipse 3" opacity="0.7" r="206.5" stroke="var(--stroke-0, #333333)" />
        </svg>
      </div>
      <div className="absolute left-[-10px] size-[414px] top-[219px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 414 414">
          <circle cx="207" cy="207" fill="var(--fill-0, #1A1A1A)" id="Ellipse 1" opacity="0.7" r="206.5" stroke="var(--stroke-0, #333333)" />
        </svg>
      </div>
      <Container />
      <Container1 />
      <Frame />
      <Frame1 />
      <Frame2 />
      <p className="-translate-x-1/2 absolute font-['DM_Mono:Regular',sans-serif] leading-[normal] left-1/2 not-italic text-[#bbb] text-[14px] text-center top-[72px]">Close to you</p>
    </div>
  );
}