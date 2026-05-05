function Switch1() {
  return <div className="bg-white rounded-[9999px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[20px]" data-name="Switch" />;
}

export default function Switch() {
  return (
    <div className="bg-[rgba(36,36,35,0.1)] content-stretch flex items-center px-[2px] relative rounded-[9999px] size-full" data-name="Switch">
      <Switch1 />
    </div>
  );
}