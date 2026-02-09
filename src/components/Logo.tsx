import { Cog, Globe } from "lucide-react";
import { useRef, useCallback } from "react";

interface LogoProps {
  onLongPress?: () => void;
}

const LONG_PRESS_MS = 2000;

const Logo = ({ onLongPress }: LogoProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePointerDown = useCallback(() => {
    if (!onLongPress) return;
    timerRef.current = setTimeout(() => {
      onLongPress();
      timerRef.current = null;
    }, LONG_PRESS_MS);
  }, [onLongPress]);

  const handlePointerUp = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return (
    <div
      className="flex items-center gap-3 animate-logo-pulse select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="relative w-12 h-12">
        {/* Globe with gradient effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-80" />
        <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
          <Globe className="w-6 h-6 text-primary" />
        </div>
        {/* Cog overlay */}
        <Cog className="absolute -bottom-1 -right-1 w-5 h-5 text-secondary" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-metallic">IČO ATLAS</span>
        <span className="text-[10px] text-muted-foreground tracking-widest">BUSINESS DATA</span>
      </div>
    </div>
  );
};

export default Logo;
