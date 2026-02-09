interface DebugFabProps {
  onClick: () => void;
}

export default function DebugFab({ onClick }: DebugFabProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[80] w-12 h-12 rounded-full bg-muted/80 backdrop-blur border border-border/50 shadow-lg flex items-center justify-center text-xl hover:bg-muted transition-colors hover:scale-110 active:scale-95"
      title="Debug Ops Mode"
      aria-label="Open debug panel"
    >
      🧪
    </button>
  );
}
