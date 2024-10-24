import { useCallback, useEffect, useRef } from "react";

// Define the type for the callback function
type ResizeCallback = (entry: ResizeObserverEntry) => void;

/**
 * Custom hook to observe and react to size changes of a DOM element
 * @param callback Function to be called when the observed element resizes
 * @returns An object with a ref to be attached to the element we want to observe
 */
export const useResizeObserver = (callback: ResizeCallback) => {
  // Create a ref to store the DOM element we want to observe
  const ref = useRef<HTMLElement | null>(null);

  // Create a memoized callback to avoid unnecessary re-renders
  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create a ResizeObserver instance
    const resizeObserver = new ResizeObserver((entries) => {
      memoizedCallback(entries[0]);
    });

    // Start observing the element
    resizeObserver.observe(element);

    // Cleanup function to disconnect the observer when component unmounts
    return () => {
      resizeObserver.disconnect();
    };
  }, [memoizedCallback]);

  // Return an object with the ref
  return { ref };
};
