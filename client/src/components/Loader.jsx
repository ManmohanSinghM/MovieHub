const Loader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        {/* Red Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
        <p className="text-gray-400 text-sm tracking-widest uppercase animate-pulse">
          Loading Library...
        </p>
      </div>
    </div>
  );
};

export default Loader;