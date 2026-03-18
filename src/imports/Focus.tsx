export default function Focus() {
  return (
    <div className="bg-white relative rounded-[32px] size-full" data-name="Focus">
      <div className="content-stretch flex gap-[8px] items-center overflow-clip px-[12px] py-[10px] relative rounded-[inherit] size-full">
        <p className="flex-[1_0_0] font-['DM_Sans:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic overflow-hidden relative text-[#6e6d6a] text-[15px] text-ellipsis whitespace-nowrap">Email</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#242423] border-solid inset-0 pointer-events-none rounded-[32px]" />
    </div>
  );
}