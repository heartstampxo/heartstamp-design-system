export default function Filled() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center px-[12px] py-[10px] relative rounded-[32px] size-full" data-name="Filled">
      <div aria-hidden="true" className="absolute border border-[rgba(36,36,35,0.1)] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <p className="flex-[1_0_0] font-['DM_Sans:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic overflow-hidden relative text-[#242423] text-[15px] text-ellipsis whitespace-nowrap">Email</p>
    </div>
  );
}