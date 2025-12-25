import { useEffect } from "react";

const STORAGE_KEY = "app_last_inactive_time";

export function useAutoRefreshAfterIdle({
  refreshAfter = 20 * 60 * 1000,
  logout = false,
  onLogout,
  onlyStandalone = false,
} = {}) {
  useEffect(() => {
    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;

    if (onlyStandalone && !isStandalone) return;

    const checkAndRefresh = (source) => {
      const lastInactive = localStorage.getItem(STORAGE_KEY);
      if (!lastInactive) return;

      const diff = Date.now() - Number(lastInactive);

      if (diff >= refreshAfter) {
        if (logout) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          onLogout?.();
        }

        // HARD reload – jak pull-to-refresh
        window.location.reload();
      }
    };

    // ✅ 1. Sprawdzenie przy starcie (iOS często zabija proces)
    checkAndRefresh("startup");

    // ✅ 2. iOS / Android – app idzie w tło
    const handlePageHide = () => {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    };

    // ✅ 3. iOS / Android – powrót do appki
    const handlePageShow = () => {
      checkAndRefresh("pageshow");
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [refreshAfter, logout, onLogout, onlyStandalone]);
}
