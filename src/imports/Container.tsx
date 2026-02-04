import svgPaths from "./svg-4vhnuqk4iu";
import imgFrame90 from "figma:asset/a93e1af8b81207182506e0e93dab89bb9a844b76.png";
import imgFrame88 from "figma:asset/b3df9fbfaa860c517894d9a70f912d559d0e347d.png";

function Heading() {
  return (
    <div className="h-[28.001px] relative shrink-0 w-[143.271px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[20px] text-white top-[-0.15px]">Activity Details</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[23.992px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9955 13.9955">
            <path d={svgPaths.p13e530c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.99936" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9955 13.9955">
            <path d={svgPaths.p1574e080} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.99936" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="relative shrink-0 size-[23.992px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[67.988px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[23.992px] relative size-full">
          <Heading />
          <Button />
        </div>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24.002px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-white top-[-0.77px]">Today</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[181.5px] left-1/2 top-[calc(50%+0.25px)] w-[316px]">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgFrame90} />
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[201px] overflow-clip relative rounded-[10px] shrink-0 w-[314px]">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgFrame88} />
      <Frame2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#2a2a2a] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#3a3a3a] border-[0.615px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
        <Frame />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Container3 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[17.994px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[18px] left-[148.88px] text-[#999] text-[12px] text-center top-[-0.38px]">STEPS</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[48.004px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Archivo:Light',sans-serif] font-light leading-[48px] left-[149.11px] text-[48px] text-center text-white top-[-0.46px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        6.847
      </p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[20.993px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[21px] left-[148.88px] text-[#999] text-[14px] text-center top-[-0.77px]">steps</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[7.997px] h-[102.986px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph1 />
      <Paragraph2 />
      <Paragraph3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[17.994px] relative shrink-0 w-[93.576px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[18px] left-0 text-[#999] text-[12px] top-[-0.38px]">Goal Progress</p>
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[20.993px] relative shrink-0 w-[25.203px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[21px] left-0 text-[#999] text-[14px] top-[-0.77px] w-[26px] whitespace-pre-wrap">68%</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[20.993px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Paragraph4 />
          <Paragraph5 />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return <div className="bg-white h-[7.997px] shrink-0 w-full" data-name="Container" />;
}

function Container8() {
  return (
    <div className="bg-[#2a2a2a] h-[7.997px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[95.287px] relative size-full">
          <Container9 />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[7.997px] h-[36.988px] items-start relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Container8 />
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[#1a1a1a] h-[219.948px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[19.994px] items-start pt-[23.992px] px-[23.992px] relative size-full">
        <Container5 />
        <Container6 />
      </div>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[14.995px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[15px] left-[37.63px] text-[#999] text-[10px] text-center top-[-0.38px]">DISTANCE</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[20.003px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Archivo:Light',sans-serif] font-light leading-[20px] left-[37.79px] text-[20px] text-center text-white top-[-0.23px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        5.22
      </p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[14.995px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[15px] left-[37.62px] text-[#999] text-[10px] text-center top-[-0.38px]">km</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-[#1a1a1a] content-stretch flex flex-col gap-[7.997px] h-[93.979px] items-start left-0 pt-[15.995px] px-[15.995px] rounded-[12px] top-0 w-[107.244px]" data-name="Container">
      <Paragraph6 />
      <Paragraph7 />
      <Paragraph8 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[14.995px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[15px] left-[37.63px] text-[#999] text-[10px] text-center top-[-0.38px]">CALORIES</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[20.003px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Archivo:Light',sans-serif] font-light leading-[20px] left-[37.87px] text-[20px] text-center text-white top-[-0.23px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        274
      </p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[14.995px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[15px] left-[37.63px] text-[#999] text-[10px] text-center top-[-0.38px]">kcal</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute bg-[#1a1a1a] content-stretch flex flex-col gap-[7.997px] h-[93.979px] items-start left-[119.24px] pt-[15.995px] px-[15.995px] rounded-[12px] top-0 w-[107.244px]" data-name="Container">
      <Paragraph9 />
      <Paragraph10 />
      <Paragraph11 />
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[14.995px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[15px] left-[37.63px] text-[#999] text-[10px] text-center top-[-0.38px]">DURATION</p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[20.003px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Archivo:Light',sans-serif] font-light leading-[20px] left-[38.49px] text-[20px] text-center text-white top-[-0.23px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        1:08
      </p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[14.995px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[15px] left-[37.63px] text-[#999] text-[10px] text-center top-[-0.38px]">hours</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-[#1a1a1a] content-stretch flex flex-col gap-[7.997px] h-[93.979px] items-start left-[238.48px] pt-[15.995px] px-[15.995px] rounded-[12px] top-0 w-[107.244px]" data-name="Container">
      <Paragraph12 />
      <Paragraph13 />
      <Paragraph14 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[93.979px] relative shrink-0 w-full" data-name="Container">
      <Container11 />
      <Container12 />
      <Container13 />
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[23.992px] items-start p-[24px] relative w-full">
        <Paragraph />
        <Frame1 />
        <Container4 />
        <Container10 />
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-[#2a2a2a] content-stretch flex flex-col items-start relative rounded-tl-[24px] rounded-tr-[24px] size-full" data-name="Container">
      <Container1 />
      <Container2 />
    </div>
  );
}