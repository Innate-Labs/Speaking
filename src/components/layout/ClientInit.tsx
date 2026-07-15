"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import {
  DEMO_MODE,
  DEMO_USER,
  initializeDemoSession,
} from "@/lib/demo-mode";

// 客户端初始化：从 localStorage 恢复用户态
export function ClientInit({ children }: { children: React.ReactNode }) {
  const initUser = useAppStore((s) => s.initUser);
  const resetSession = useAppStore((s) => s.resetSession);
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    if (DEMO_MODE) {
      if (initializeDemoSession()) resetSession();
      setUser(DEMO_USER);
      return;
    }
    initUser();
  }, [initUser, resetSession, setUser]);

  return <>{children}</>;
}
