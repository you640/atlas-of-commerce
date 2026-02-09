import { useState, useCallback, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { useDebugMode } from "@/hooks/use-debug-mode";
import DebugFab from "@/components/debug/DebugFab";
import DebugPanel from "@/components/debug/DebugPanel";
import { getLastRequest } from "@/lib/debug-store";

const Index = () => {
  const { enabled: debugEnabled, toggle: toggleDebug } = useDebugMode();
  const [panelOpen, setPanelOpen] = useState(false);
  const heroRef = useRef<{ replay: () => void } | null>(null);

  const handleDebugCommand = useCallback(() => {
    toggleDebug();
  }, [toggleDebug]);

  const handleReplay = useCallback(() => {
    const lastReq = getLastRequest();
    if (lastReq) {
      // We'll trigger search by setting the query — for now we inform user
      setPanelOpen(false);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Header onLogoLongPress={debugEnabled ? undefined : handleDebugCommand} />
      <HeroSection onDebugCommand={handleDebugCommand} />
      {debugEnabled && (
        <>
          <DebugFab onClick={() => setPanelOpen(true)} />
          <DebugPanel
            open={panelOpen}
            onClose={() => setPanelOpen(false)}
            onReplay={handleReplay}
          />
        </>
      )}
    </div>
  );
};

export default Index;
