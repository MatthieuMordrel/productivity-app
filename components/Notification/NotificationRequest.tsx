"use client";

import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function NotificationRequest() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    const supported = "Notification" in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);

      const checkPermission = () => {
        setPermission(Notification.permission);
      };

      document.addEventListener("visibilitychange", checkPermission);
      return () =>
        document.removeEventListener("visibilitychange", checkPermission);
    }
  }, []);

  const showSettingsGuidance = () => {
    // Detect browser
    const isChrome = navigator.userAgent.includes("Chrome");
    const isFirefox = navigator.userAgent.includes("Firefox");
    const isSafari = navigator.userAgent.includes("Safari") && !isChrome;
    const isEdge = navigator.userAgent.includes("Edg");

    let guidance =
      "Hi ! I cannot directly update your notifications preferences anymore, but it's really easy ! See the following instructions:\n\n";

    if (isChrome || isEdge) {
      guidance +=
        "1. Click the lock icon 🔒 in the address bar\n" +
        "2. Click 'Notifications' in the dropdown\n" +
        "3. Toggle according to your preference";
    } else if (isFirefox) {
      guidance +=
        "1. Click the site information button (shield icon) in the address bar\n" +
        "2. Go to 'Permissions'\n" +
        "3. Find 'Send Notifications' and adjust the setting";
    } else if (isSafari) {
      guidance +=
        "1. Click Safari in the menu bar\n" +
        "2. Select 'Preferences'\n" +
        "3. Go to 'Websites' tab\n" +
        "4. Find 'Notifications' in the sidebar";
    } else {
      guidance +=
        "Please check your browser settings to manage notification permissions.";
    }

    alert(guidance);
  };

  const handleNotificationToggle = useCallback(async () => {
    try {
      if (permission === "default") {
        // First time request - show native browser prompt
        const result = await Notification.requestPermission();
        setPermission(result);

        if (result === "granted") {
          new Notification("Notifications Enabled!", {
            body: "You'll now receive notifications when important events occur.",
            icon: "/favicon.ico",
          });
        }
      } else {
        // For both "granted" and "denied" states, show guidance
        showSettingsGuidance();
      }
    } catch (error) {
      console.error("Error handling notification permission:", error);
    }
  }, [permission]);

  if (!isSupported) return null;

  return (
    <Button
      onClick={handleNotificationToggle}
      variant="ghost"
      size="icon"
      className="hover:bg-background/50 relative"
      title={
        permission === "default"
          ? "Click to enable notifications"
          : permission === "granted"
            ? "Notifications enabled (click for settings)"
            : "Notifications disabled (click for settings)"
      }
    >
      {permission === "granted" ? (
        <Bell className="h-4 w-4" />
      ) : (
        <BellOff className="h-4 w-4" />
      )}
    </Button>
  );
}
