"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setOnlineStatus } from "@/store/slices/ui-slice";

export function useNetworkStatus() {
  const dispatch = useDispatch();
  // Default to true to avoid hydration mismatch, will be updated after mount
  const [isOnline, setIsOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  const updateOnlineStatus = useCallback(() => {
    if (!mounted) return;

    const onlineStatus =
      typeof navigator !== "undefined" ? navigator.onLine : true;
    setIsOnline(onlineStatus);
    dispatch(setOnlineStatus(onlineStatus));
  }, [dispatch, mounted]);

  // Set mounted state once component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Update the initial state after mount
      updateOnlineStatus();

      // Add event listeners for online/offline events
      window.addEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus);
    }

    // Clean up event listeners
    return () => {
      if (mounted) {
        window.removeEventListener("online", updateOnlineStatus);
        window.removeEventListener("offline", updateOnlineStatus);
      }
    };
  }, [updateOnlineStatus, mounted]);

  return { isOnline, mounted };
}
