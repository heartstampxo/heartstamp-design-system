import svgPaths from "./svg-7fz9djry1w";

function FirstName() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="First Name">
      <p className="font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#242423] text-[15px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        Name
      </p>
      <div className="bg-white relative rounded-[25px] shrink-0 w-full" data-name="Input">
        <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[25px]" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[10px] relative w-full">
            <p className="flex-[1_0_0] font-['DM_Sans:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic overflow-hidden relative text-[#6e6d6a] text-[15px] text-ellipsis whitespace-nowrap">Your Name</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FirstName1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="First Name">
      <p className="font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#242423] text-[15px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        Category
      </p>
      <div className="bg-white relative rounded-[25px] shrink-0 w-full" data-name="Input">
        <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[25px]" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[10px] relative w-full">
            <p className="flex-[1_0_0] font-['DM_Sans:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic overflow-hidden relative text-[#6e6d6a] text-[15px] text-ellipsis whitespace-nowrap">Design Request</p>
            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon / ChevronDown">
              <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
                <div className="absolute inset-[-16.63%_-8.31%_-16.62%_-8.31%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33 5.33">
                    <path d={svgPaths.p2e4aa280} id="Vector" stroke="var(--stroke-0, #242423)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[104px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex items-start justify-between pb-[8px] pt-[12px] px-[16px] relative size-full">
        <div className="flex flex-[1_0_0] flex-col font-['DM_Sans:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#a9a8a4] text-[15px]">
          <p className="leading-[20px]">Enter address</p>
        </div>
      </div>
    </div>
  );
}

function Address() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="address">
      <p className="font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#242423] text-[15px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        Tell us more
      </p>
      <Button />
    </div>
  );
}

function Form() {
  return (
    <div className="relative shrink-0 w-full" data-name="form">
      <div className="content-stretch flex flex-col gap-[20px] items-start pt-[24px] px-[24px] relative w-full">
        <FirstName />
        <FirstName1 />
        <Address />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-start min-h-px min-w-px relative" data-name="button">
      <div className="flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[25px]" data-name="Button">
        <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[25px]" />
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[8px] items-center justify-center px-[20px] py-[8px] relative size-full">
            <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#242423] text-[15px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
              <p className="leading-[20px]">Cancel</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#be1d2c] flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[25px]" data-name="Button">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[8px] items-center justify-center px-[20px] py-[8px] relative size-full">
            <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[15px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
              <p className="leading-[20px]">Submit Feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomActionBar() {
  return (
    <div className="h-[68px] relative shrink-0 w-full" data-name="Bottom action bar">
      <div aria-hidden="true" className="absolute border-[rgba(36,36,35,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[24px] relative size-full">
          <Button1 />
        </div>
      </div>
    </div>
  );
}

export default function FormExample() {
  return (
    <div className="bg-white relative rounded-[16px] size-full" data-name="Form Example">
      <div className="content-stretch flex flex-col gap-[32px] items-start overflow-clip relative rounded-[inherit] size-full">
        <Form />
        <BottomActionBar />
        <div className="absolute opacity-70 overflow-clip right-[24px] rounded-[2px] size-[16px] top-[24px]" data-name="Icon / X">
          <div className="absolute inset-1/4" data-name="Vector">
            <div className="absolute inset-[-8.31%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33 9.33">
                <path d={svgPaths.p2d1e680} id="Vector" stroke="var(--stroke-0, #242423)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}