import { useCallback, useEffect } from "react";

export const useTitle = () => {
  const setTitle = useCallback((newTitle: string) => {
    document.title = newTitle;
  }, []);

  useEffect(() => {
    return () => {
      document.title = "Pomodoro Tracker"; // Reset title on unmount
    };
  }, []);

  return setTitle;
};
