"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useEffect } from "react";
import { initializeBrowserCameraPolyfills } from "./camera-utils";

export default function ClassesLayout({ children }) {
  // Initialize camera polyfills on component mount
  useEffect(() => {
    // Initialize browser-specific fixes for video elements
    initializeBrowserCameraPolyfills();
    
    // Log browser and device info for debugging
    const userAgent = navigator.userAgent;
    const browserInfo = {
      userAgent,
      isChrome: /Chrome/.test(userAgent) && !/Edge|Edg/.test(userAgent),
      isFirefox: /Firefox/.test(userAgent),
      isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
      isEdge: /Edge|Edg/.test(userAgent),
      isIOS: /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream,
      isAndroid: /Android/.test(userAgent)
    };
    console.log("Browser information:", browserInfo);
  }, []);

  return <DashboardLayout>{children}</DashboardLayout>;
}
