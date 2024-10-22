import { useEffect, useState } from "react";

// Custom hook to check if a media query matches the current viewport
export function useMediaQuery(query: string): boolean {
  // State to track whether the media query matches
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create a MediaQueryList object
    const media = window.matchMedia(query);

    // Update state only if the match state has changed
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Event listener to update state when the match state changes
    const listener = () => setMatches(media.matches);

    // Add event listener for viewport changes
    window.addEventListener("resize", listener);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]); // Re-run effect if matches or query changes

  // Return the current match state
  return matches;
}
