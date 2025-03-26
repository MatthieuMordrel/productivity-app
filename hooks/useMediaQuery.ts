import { useEffect, useState } from "react";

// Custom hook to check if a media query matches the current viewport
export const useMediaQuery = (query: string): boolean => {
  // Set initial state by checking media query immediately
  const [matches, setMatches] = useState(() =>
    // Check if window is defined (for SSR)
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    // Return early if window is not defined (for SSR)
    if (typeof window === "undefined") return;

    // Create a new MediaQueryList object using the query parameter which is a string representing a media query
    // If the query matches the current viewport, the matches state is set to true, otherwise false
    const media = window.matchMedia(query);
    setMatches(media.matches);

    // Use the MediaQueryList's change event instead of resize
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]); // Only re-run if query changes

  return matches;
};

// Preset media query for desktop
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
