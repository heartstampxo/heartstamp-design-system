import svgPaths from "./svg-67otkann5d";

export default function SecondaryGhostDarkMood() {
  return (
    <div className="bg-[rgba(245,245,244,0.08)] content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[8px] relative rounded-[25px] size-full" data-name="Secondary ghost dark mood">
      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="Icon / Eye">
        <div className="absolute inset-[20.83%_8.33%]" data-name="Vector">
          <div className="absolute inset-[-7.14%_-5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 12">
              <g id="Vector">
                <path d={svgPaths.p20e1e300} stroke="var(--stroke-0, #F5F5F4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p2b557200} stroke="var(--stroke-0, #F5F5F4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#f5f5f4] text-[15px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20px]">Button</p>
      </div>
    </div>
  );
}