function Frame() {
  return <div className="bg-white h-[32px] shrink-0 w-[4px]" />;
}

function Frame1() {
  return <div className="bg-[#333] h-[32px] shrink-0 w-[4px]" />;
}

function Frame2() {
  return <div className="absolute bg-[#333] h-[32px] left-[48.5px] top-0 w-[2px]" />;
}

export default function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative size-full">
      {[...Array(4).keys()].map((_, i) => (
        <Frame key={i} />
      ))}
      {[...Array(16).keys()].map((_, i) => (
        <Frame1 key={i} />
      ))}
      <Frame2 />
    </div>
  );
}