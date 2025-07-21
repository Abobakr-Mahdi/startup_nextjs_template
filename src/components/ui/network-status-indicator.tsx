"use client";

import { useTranslations } from "next-intl";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { TIMINGS } from "@/constants";
import { AlertTriangle } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export function NetworkStatusIndicator() {
  const t = useTranslations("network");
  const { isOnline } = useNetworkStatus();
  const [visible, setVisible] = useState(false);

  // Control visibility with animation timing
  useEffect(() => {
    if (!isOnline) {
      // Show immediately when going offline
      setVisible(true);
    } else {
      // Delay hiding when going online to allow for animation

      const timer = setTimeout(
        () => setVisible(false),
        TIMINGS.NETWORK_STATUS_TRANSITION
      );
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  return (
    <AnimatePresence mode="wait">
      {visible ? (
        <div
          className={cn(
            "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-md shadow-md transition-all duration-300",
            {
              "bg-destructive text-destructive-foreground opacity-100":
                !isOnline,
              "bg-green-700 translate-y-2": isOnline,
            }
          )}
        >
          <p className="text-sm font-medium flex items-center gap-2">
            <span
              className={cn("inline-block w-2 h-2 rounded-full", {
                "bg-destructive-foreground animate-pulse": true,
                "bg-primary-foreground": isOnline,
              })}
            />
            {!isOnline && <AlertTriangle className="w-5 h-5 text-white" />}
            {t(isOnline ? "online" : "offline")}
          </p>
        </div>
      ) : (
        <div />
      )}
    </AnimatePresence>
  );
}
