"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/stores/app-store";
import { DEMO_MODE, DEMO_USER } from "@/lib/demo-mode";

// 鉴权 hook：未登录跳转登录页
export function useRequireAuth() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const initUser = useAppStore((s) => s.initUser);
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    if (DEMO_MODE) {
      if (!useAppStore.getState().user) setUser(DEMO_USER);
      return;
    }
    initUser();
    const u = useAppStore.getState().user;
    if (!u) {
      router.replace("/login");
    }
  }, [router, initUser, setUser]);

  return DEMO_MODE ? DEMO_USER : user;
}
