export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-blue-600/20 dark:border-cyan-400/20 border-t-blue-600 dark:border-t-cyan-400 animate-spin" />
        <div className="absolute w-6 h-6 rounded-full bg-blue-600/10 dark:bg-cyan-400/10 animate-ping" />
      </div>
      <p className="text-xs font-mono tracking-widest text-slate-500 uppercase">
        Synthesizing Transmission...
      </p>
    </div>
  );
}
