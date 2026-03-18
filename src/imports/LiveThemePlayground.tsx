import svgPaths from "./svg-fxvht9varj";

function Heading() {
  return (
    <div className="h-[17.594px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Stack_Sans_Text:Bold',sans-serif] font-bold leading-[17.6px] left-0 text-[#242423] text-[16px] top-0 whitespace-nowrap">Live Theme Playground</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20.797px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[20.8px] left-0 text-[#6e6d6a] text-[13px] top-[-0.5px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        Pick brand colors and watch them cascade across every HeartStamp component in real time. Copy the generated CSS to apply globally.
      </p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[42.391px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Icon">
          <path d={svgPaths.p18897900} id="Vector" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M7.5 5.625V8.125" id="Vector_2" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M7.5 10.625H7.50625" id="Vector_3" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function PageTheming() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-start left-[78.95px] top-[24.3px] w-[57.797px]" data-name="PageTheming">
      <p className="font-['Cousine:Regular',sans-serif] leading-[19.2px] not-italic relative shrink-0 text-[#242423] text-[12px] whitespace-nowrap">theme.ts</p>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[41.594px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[20.8px] left-0 text-[#242423] text-[13px] top-[-0.5px] w-[752px]" style={{ fontVariationSettings: "'opsz' 9" }}>{`Changes here are local to this demo. Copy the generated CSS snippet below and paste it into your root stylesheet, or update the values in `}</p>
        <PageTheming />
        <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[20.8px] left-[136.74px] text-[#242423] text-[13px] top-[20.3px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>{` directly.`}</p>
      </div>
    </div>
  );
}

function Callout() {
  return (
    <div className="bg-[rgba(245,158,11,0.08)] h-[63.594px] relative rounded-[8px] shrink-0 w-full" data-name="Callout">
      <div aria-hidden="true" className="absolute border border-[rgba(245,158,11,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex gap-[10px] items-start pb-px pt-[11px] px-[15px] relative size-full">
        <Icon />
        <Text />
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container />
      <Callout />
    </div>
  );
}

function Text1() {
  return <div className="absolute bg-[#ff5f56] left-[14px] rounded-[4.5px] size-[9px] top-[11.75px]" data-name="Text" />;
}

function Text2() {
  return <div className="absolute bg-[#febc2e] left-[29px] rounded-[4.5px] size-[9px] top-[11.75px]" data-name="Text" />;
}

function Text3() {
  return <div className="absolute bg-[#27c840] left-[44px] rounded-[4.5px] size-[9px] top-[11.75px]" data-name="Text" />;
}

function Text4() {
  return (
    <div className="absolute h-[16.5px] left-[65px] top-[8px] w-[699.938px]" data-name="Text">
      <p className="absolute font-['Cousine:Regular',sans-serif] leading-[16.5px] left-0 not-italic text-[#6e6d6a] text-[11px] top-0 whitespace-nowrap">live-preview · #BE1D2C / #242423 · light</p>
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute h-[15px] left-[770.94px] top-[8.75px] w-[33.063px]" data-name="Text">
      <p className="absolute font-['DM_Sans:SemiBold','Noto_Sans_Symbols2:Regular',sans-serif] font-semibold leading-[15px] left-0 text-[#27c840] text-[10px] top-0 whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        ● LIVE
      </p>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[rgba(36,36,35,0.1)] h-[33.5px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(36,36,35,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Text1 />
      <Text2 />
      <Text3 />
      <Text4 />
      <Text5 />
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[#be1d2c] relative rounded-[8px] shrink-0 size-[36px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[15.75px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['DM_Sans:Bold',sans-serif] leading-[15.75px] left-0 not-italic text-[#6e6d6a] text-[10.5px] top-[0.5px] tracking-[0.525px] uppercase whitespace-nowrap">Brand Primary</p>
    </div>
  );
}

function Code() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Code">
      <p className="absolute font-['Cousine:Bold',sans-serif] leading-[18px] left-0 not-italic text-[#242423] text-[12px] top-0 whitespace-nowrap">#BE1D2C</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Container6 />
      <Code />
    </div>
  );
}

function Code1() {
  return (
    <div className="content-stretch flex h-[12px] items-start relative shrink-0 w-[48.164px]" data-name="Code">
      <p className="font-['Cousine:Regular',sans-serif] leading-[15px] not-italic relative shrink-0 text-[#a78bfa] text-[10px] whitespace-nowrap">--accent</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-[91.234px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative w-full">
        <Frame />
        <Code1 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[59.75px] relative shrink-0 w-[137.234px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-start relative size-full">
        <Container4 />
        <Container5 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[#242423] relative rounded-[8px] shrink-0 size-[36px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[15.75px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['DM_Sans:Bold',sans-serif] leading-[15.75px] left-0 not-italic text-[#6e6d6a] text-[10.5px] top-[0.5px] tracking-[0.525px] uppercase whitespace-nowrap">Brand Secondary</p>
    </div>
  );
}

function Code2() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Code">
      <p className="absolute font-['Cousine:Bold',sans-serif] leading-[18px] left-0 not-italic text-[#242423] text-[12px] top-0 whitespace-nowrap">#242423</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full">
      <Container10 />
      <Code2 />
    </div>
  );
}

function Code3() {
  return (
    <div className="content-stretch flex h-[12px] items-start relative shrink-0 w-[66.227px]" data-name="Code">
      <p className="font-['Cousine:Regular',sans-serif] leading-[15px] not-italic relative shrink-0 text-[#a78bfa] text-[10px] whitespace-nowrap">--secondary</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-[117px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative w-full">
        <Frame1 />
        <Code3 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[59.75px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] h-full items-start relative">
        <Container8 />
        <Container9 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[16px] h-[60px] items-start relative shrink-0" data-name="Container">
      <Container3 />
      <Container7 />
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[43.031px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] left-0 text-[#6e6d6a] text-[11px] top-0 whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          Preview:
        </p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#242423] flex-[1_0_0] h-[30px] min-h-px min-w-px relative rounded-[20px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[18px] left-[37px] text-[12px] text-center text-white top-[6px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          ☀️ Light
        </p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[30px] relative rounded-[20px] shrink-0 w-[71.063px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[18px] left-[36px] text-[#6e6d6a] text-[12px] text-center top-[6px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          🌙 Dark
        </p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[8px] h-[30px] items-center relative shrink-0 w-[203.594px]" data-name="Container">
      <Text6 />
      <Button />
      <Button1 />
    </div>
  );
}

function PageTheming2() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="PageTheming">
      <div aria-hidden="true" className="absolute border-[rgba(36,36,35,0.06)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[32px] py-[24px] relative w-full">
          <Container2 />
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute h-[22.5px] left-[21px] top-[21px] w-[288px]" data-name="Container">
      <p className="absolute font-['DM_Sans:Bold',sans-serif] leading-[22.5px] left-0 not-italic text-[#242423] text-[15px] top-[0.5px] whitespace-nowrap">Sign in</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[18.75px] left-[21px] top-[47.5px] w-[288px]" data-name="Container">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[18.75px] left-0 text-[#6e6d6a] text-[12.5px] top-[-1px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        Enter your credentials to continue.
      </p>
    </div>
  );
}

function Lbl() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Lbl">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[19.5px] left-0 text-[#242423] text-[13px] top-0 whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Email
      </p>
    </div>
  );
}

function Inp() {
  return (
    <div className="bg-white h-[44.5px] relative rounded-[32px] shrink-0 w-full" data-name="Inp">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[10px] relative size-full">
          <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#6e6d6a] text-[15px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
            you@example.com
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[32px]" />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[68px] items-start left-[21px] top-[82.25px] w-[288px]" data-name="Container">
      <Lbl />
      <Inp />
    </div>
  );
}

function Lbl1() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Lbl">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[19.5px] left-0 text-[#242423] text-[13px] top-0 whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Password
      </p>
    </div>
  );
}

function Inp1() {
  return (
    <div className="bg-white h-[44.5px] relative rounded-[32px] shrink-0 w-full" data-name="Inp">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[10px] relative size-full">
          <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#6e6d6a] text-[15px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
            ••••••••
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[32px]" />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[68px] items-start left-[21px] top-[162.25px] w-[288px]" data-name="Container">
      <Lbl1 />
      <Inp1 />
    </div>
  );
}

function Btn() {
  return (
    <div className="bg-[#be1d2c] flex-[1_0_0] h-[35.5px] min-h-px min-w-px relative rounded-[25px]" data-name="Btn">
      <div aria-hidden="true" className="absolute border border-[#be1d2c] border-solid inset-0 pointer-events-none rounded-[25px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[17px] py-[8px] relative size-full">
          <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[19.5px] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            Sign in
          </p>
        </div>
      </div>
    </div>
  );
}

function Btn1() {
  return (
    <div className="h-[35.5px] relative rounded-[25px] shrink-0 w-[76.5px]" data-name="Btn">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[25px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[17px] py-[8px] relative size-full">
        <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[19.5px] relative shrink-0 text-[#242423] text-[13px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          Cancel
        </p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[35.5px] items-start left-[21px] top-[246.25px] w-[288px]" data-name="Container">
      <Btn />
      <Btn1 />
    </div>
  );
}

function Container13() {
  return (
    <div className="bg-white h-[430.5px] relative rounded-[12px] shrink-0 w-[330px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.2)]" />
      <Container14 />
      <Container15 />
      <Container16 />
      <Container17 />
      <Container18 />
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute h-[15.75px] left-[17px] top-[17px] w-[296px]" data-name="Container">
      <p className="absolute font-['DM_Sans:Bold',sans-serif] leading-[15.75px] left-0 not-italic text-[#6e6d6a] text-[10.5px] top-[0.5px] tracking-[0.63px] uppercase whitespace-nowrap">Buttons</p>
    </div>
  );
}

function Btn2() {
  return (
    <div className="absolute bg-[#be1d2c] content-stretch flex h-[30px] items-center justify-center left-0 px-[13px] py-[6px] rounded-[25px] top-0 w-[69.93px]" data-name="Btn">
      <div aria-hidden="true" className="absolute border border-[#be1d2c] border-solid inset-0 pointer-events-none rounded-[25px]" />
      <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Primary
      </p>
    </div>
  );
}

function Btn3() {
  return (
    <div className="absolute bg-[#242423] content-stretch flex h-[30px] items-center justify-center left-[77.93px] px-[13px] py-[6px] rounded-[25px] top-0 w-[87.195px]" data-name="Btn">
      <div aria-hidden="true" className="absolute border border-[#242423] border-solid inset-0 pointer-events-none rounded-[25px]" />
      <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Secondary
      </p>
    </div>
  );
}

function Btn4() {
  return (
    <div className="absolute content-stretch flex h-[30px] items-center justify-center left-[173.13px] px-[13px] py-[6px] rounded-[25px] top-0 w-[67.086px]" data-name="Btn">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[25px]" />
      <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#242423] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Outline
      </p>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute h-[30px] left-[17px] top-[44.75px] w-[296px]" data-name="Container">
      <Btn2 />
      <Btn3 />
      <Btn4 />
    </div>
  );
}

function Btn5() {
  return (
    <div className="absolute bg-[#be1d2c] content-stretch flex h-[30px] items-center justify-center left-0 opacity-50 px-[13px] py-[6px] rounded-[25px] top-0 w-[75.141px]" data-name="Btn">
      <div aria-hidden="true" className="absolute border border-[#be1d2c] border-solid inset-0 pointer-events-none rounded-[25px]" />
      <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Disabled
      </p>
    </div>
  );
}

function Btn6() {
  return (
    <div className="absolute content-stretch flex h-[30px] items-center justify-center left-[83.14px] p-px rounded-[25px] top-0 w-[55.508px]" data-name="Btn">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[25px]" />
      <p className="decoration-solid font-['DM_Sans:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#be1d2c] text-[12px] text-center underline whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Link style
      </p>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute h-[30px] left-[17px] top-[82.75px] w-[296px]" data-name="Container">
      <Btn5 />
      <Btn6 />
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-white h-[129.75px] relative rounded-[12px] shrink-0 w-[330px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.2)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container21 />
        <Container22 />
        <Container23 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute h-[15.75px] left-[17px] top-[17px] w-[296px]" data-name="Container">
      <p className="absolute font-['DM_Sans:Bold',sans-serif] leading-[15.75px] left-0 not-italic text-[#6e6d6a] text-[10.5px] top-[0.5px] tracking-[0.63px] uppercase whitespace-nowrap">Badges</p>
    </div>
  );
}

function Bdg() {
  return (
    <div className="absolute bg-[#be1d2c] content-stretch flex h-[22.5px] items-center left-0 px-[9px] py-[2px] rounded-[999px] top-0 w-[56.625px]" data-name="Bdg">
      <p className="font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[16.5px] relative shrink-0 text-[11px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Default
      </p>
    </div>
  );
}

function Bdg1() {
  return (
    <div className="absolute bg-[rgba(36,36,35,0.1)] content-stretch flex h-[22.5px] items-center left-[64.63px] px-[9px] py-[2px] rounded-[999px] top-0 w-[75.586px]" data-name="Bdg">
      <p className="font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[16.5px] relative shrink-0 text-[#242423] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Secondary
      </p>
    </div>
  );
}

function Bdg2() {
  return (
    <div className="absolute content-stretch flex h-[22.5px] items-center left-[148.21px] px-[10px] py-[3px] rounded-[999px] top-0 w-[58.805px]" data-name="Bdg">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[16.5px] relative shrink-0 text-[#242423] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Outline
      </p>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute h-[22.5px] left-[17px] top-[44.75px] w-[296px]" data-name="Container">
      <Bdg />
      <Bdg1 />
      <Bdg2 />
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute h-[15.75px] left-[17px] top-[79.25px] w-[296px]" data-name="Container">
      <p className="absolute font-['DM_Sans:Bold',sans-serif] leading-[15.75px] left-0 not-italic text-[#6e6d6a] text-[10.5px] top-[0.5px] tracking-[0.63px] uppercase whitespace-nowrap">Controls</p>
    </div>
  );
}

function Container30() {
  return <div className="bg-white h-[20px] rounded-[999px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.2)] shrink-0 w-full" data-name="Container" />;
}

function Container29() {
  return (
    <div className="absolute bg-[rgba(36,36,35,0.1)] content-stretch flex flex-col h-[24px] items-start left-0 pl-[2px] pr-[18px] pt-[2px] rounded-[999px] top-0 w-[40px]" data-name="Container">
      <Container30 />
    </div>
  );
}

function Swt() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[40px]" data-name="Swt">
      <Container29 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Icon">
          <path d={svgPaths.p1098da98} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container31() {
  return (
    <div className="bg-[#be1d2c] flex-[1_0_0] h-[16px] min-h-px min-w-px relative rounded-[4px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#be1d2c] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[2px] relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Cbx() {
  return (
    <div className="absolute content-stretch flex items-center left-[52px] size-[16px] top-[4px]" data-name="Cbx">
      <Container31 />
    </div>
  );
}

function Lbl2() {
  return (
    <div className="absolute h-[19.5px] left-[80px] top-[0.25px] w-[88.813px]" data-name="Lbl">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[19.5px] left-0 text-[#242423] text-[13px] top-0 whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Enable feature
      </p>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute h-[24px] left-[17px] top-[103px] w-[296px]" data-name="Container">
      <Swt />
      <Cbx />
      <Lbl2 />
    </div>
  );
}

function Container24() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[12px] w-[330px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.2)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container25 />
        <Container26 />
        <Container27 />
        <Container28 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[15.75px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['DM_Sans:Bold',sans-serif] leading-[15.75px] left-0 not-italic text-[#6e6d6a] text-[10.5px] top-[0.5px] tracking-[0.63px] uppercase whitespace-nowrap">Alert</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_18_8603)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #242423)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667V8" id="Vector_2" stroke="var(--stroke-0, #242423)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333H8.00667" id="Vector_3" stroke="var(--stroke-0, #242423)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_18_8603">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[19.5px] left-0 text-[#242423] text-[13px] top-0 whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Theme applied
      </p>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[19.5px] left-0 text-[#6e6d6a] text-[13px] top-0 whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        Brand colors are cascading live.
      </p>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[41px] relative shrink-0 w-[189.773px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Container35 />
        <Container36 />
      </div>
    </div>
  );
}

function Alrt() {
  return (
    <div className="bg-[rgba(36,36,35,0.1)] h-[67px] relative rounded-[8px] shrink-0 w-full" data-name="Alrt">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex gap-[12px] items-start pb-px pl-[17px] pr-px pt-[13px] relative size-full">
        <Icon2 />
        <Container34 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="bg-white h-[124.75px] relative rounded-[12px] shrink-0 w-[330px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.2)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-px pt-[17px] px-[17px] relative size-full">
        <Container33 />
        <Alrt />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[430.5px] items-start relative shrink-0 w-[330px]" data-name="Container">
      <Container20 />
      <Container24 />
      <Container32 />
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Container">
      <div className="content-start flex flex-wrap gap-[20px] items-start px-[69px] py-[24px] relative w-full">
        <Container13 />
        <Container19 />
      </div>
    </div>
  );
}

function PageTheming1() {
  return (
    <div className="relative rounded-[12px] shrink-0 w-full" data-name="PageTheming">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative w-full">
          <Container1 />
          <PageTheming2 />
          <Container12 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

export default function LiveThemePlayground() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative size-full" data-name="Live Theme Playground">
      <Frame2 />
      <PageTheming1 />
    </div>
  );
}