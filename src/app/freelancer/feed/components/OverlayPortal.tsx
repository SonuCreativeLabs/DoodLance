"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface OverlayPortalProps {
  children: React.ReactNode;
}

export default function OverlayPortal({ children }: OverlayPortalProps) {
  const [mounted, setMounted] = useState(false);
  const el = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Set mounted to true when component mounts on the client side
    setMounted(true);
    
    // Create the portal container
    el.current = document.createElement('div');
    document.body.appendChild(el.current);
    
    // Clean up on unmount
    return () => {
      if (el.current) {
        document.body.removeChild(el.current);
      }
    };
  }, []);

  // Only render the portal after the component has mounted on the client side
  if (!mounted || !el.current) return null;
  
  return createPortal(children, el.current);
}
