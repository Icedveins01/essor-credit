// app/loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-[100] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-emerald-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-emerald-700 font-semibold text-2xl tracking-wide">Essor Crédit</p>
          <p className="text-zinc-500 text-sm mt-1">Chargement en cours...</p>
        </div>
      </div>
    </div>
  );
}