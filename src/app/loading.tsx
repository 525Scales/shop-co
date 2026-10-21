export default function Loading() {
  return (
    <div className="container-x py-10" aria-busy="true">
      <div className="skeleton h-10 w-2/3 rounded-xl md:w-1/3" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (<div key={i}><div className="skeleton aspect-square rounded-[20px]" /><div className="skeleton mt-4 h-5 w-3/4 rounded-lg" /><div className="skeleton mt-2 h-5 w-1/3 rounded-lg" /></div>))}
      </div>
    </div>
  );
}
