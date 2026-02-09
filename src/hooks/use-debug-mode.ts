import { useState, useCallback, useEffect } from "react";

const LS_KEY = "icoatlas:debug";

function readDebug(): boolean {
  try {
    return localStorage.getItem(LS_KEY) === "1";
  } catch {
    return false;
  }
}

export function useDebugMode() {
  const [enabled, setEnabled] = useState(readDebug);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === LS_KEY) setEnabled(e.newValue === "1");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try { localStorage.setItem(LS_KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  }, []);

  const enable = useCallback(() => {
    setEnabled(true);
    try { localStorage.setItem(LS_KEY, "1"); } catch {}
  }, []);

  const disable = useCallback(() => {
    setEnabled(false);
    try { localStorage.setItem(LS_KEY, "0"); } catch {}
  }, []);

  return { enabled, toggle, enable, disable };
}
