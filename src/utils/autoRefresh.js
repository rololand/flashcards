import { useEffect, useRef } from "react";

const STORAGE_KEY = "app_last_activity_ts";

export function useAutoRefreshAfterIdle({
  refreshAfter = 60 * 60 * 1000, // 1 minuta = 60 000
} = {}) {

  const refreshedRef = useRef(false);

  useEffect(() => {

    const now = () => Date.now();

    const saveActivity = () => {
      localStorage.setItem(STORAGE_KEY, now().toString());
    };

    const shouldRefresh = () => {
      const last = Number(localStorage.getItem(STORAGE_KEY));
      if (!last) return false;
      return now() - last >= refreshAfter;
    };

    const refreshOnce = (source) => {
      if (refreshedRef.current) return;

      if (shouldRefresh()) {
        refreshedRef.current = true;
        window.location.reload();
      }
    };

    // 🔹 1. Cold start (iOS kill, reload PWA, hard refresh)
    refreshOnce("startup");

    // 🔹 2. Visibility (tab change, background, app switch)
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveActivity();
      } else {
        refreshOnce("visibility");
      }
    };

    // 🔹 3. Focus / blur (desktop, alt+tab)
    const onBlur = () => saveActivity();
    const onFocus = () => refreshOnce("focus");

    // 🔹 4. Real user activity (idle detection)
    const onUserActivity = () => refreshOnce("user-activity");

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    // mouse / keyboard / touch
    window.addEventListener("mousemove", onUserActivity);
    window.addEventListener("keydown", onUserActivity);
    window.addEventListener("touchstart", onUserActivity);

    // initial activity mark
    saveActivity();

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("mousemove", onUserActivity);
      window.removeEventListener("keydown", onUserActivity);
      window.removeEventListener("touchstart", onUserActivity);
    };
  }, [refreshAfter]);
}
