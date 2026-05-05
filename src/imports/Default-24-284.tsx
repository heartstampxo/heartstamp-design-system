function Text() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Text">
      <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#6e6d6a] text-[15px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        password
      </p>
    </div>
  );
}

export default function Default() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[16px] py-[4px] relative rounded-[8px] size-full" data-name="default">
      <Text />
    </div>
  );
}