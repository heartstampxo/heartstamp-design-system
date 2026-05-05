function Text() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Text">
      <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#242423] text-[15px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Account
      </p>
    </div>
  );
}

function Wrapper() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[29px] items-center justify-center px-[16px] py-[4px] relative rounded-[8px] shrink-0" data-name="Wrapper">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.06)] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)]" />
      <Text />
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Text">
      <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#242423] text-[15px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        password
      </p>
    </div>
  );
}

function HoverWrapper() {
  return (
    <div className="content-stretch flex flex-col h-[29px] items-center justify-center px-[16px] py-[4px] relative rounded-[8px] shrink-0" data-name="Hover_Wrapper">
      <Text1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Text">
      <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#6e6d6a] text-[15px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Notifications
      </p>
    </div>
  );
}

function Wrapper1() {
  return (
    <div className="content-stretch flex flex-col h-[29px] items-center justify-center px-[16px] py-[4px] relative rounded-[8px] shrink-0" data-name="Wrapper">
      <Text2 />
    </div>
  );
}

export default function Hover() {
  return (
    <div className="bg-[rgba(36,36,35,0.06)] content-stretch flex items-center justify-center p-[3px] relative rounded-[10px] size-full" data-name="Hover">
      <Wrapper />
      <HoverWrapper />
      <Wrapper1 />
    </div>
  );
}