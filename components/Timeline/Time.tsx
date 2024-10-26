"use client";

import moment from "moment";
import { useEffect, useState } from "react";

export const Time = () => {
  const [currentDateTime, setCurrentDateTime] = useState(moment());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(moment());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-between bg-primary p-2 text-lg font-semibold text-foreground text-white">
      <span>{currentDateTime.format("dddd, MMMM D, YYYY")}</span>
      <span>{currentDateTime.format("HH:mm:ss")}</span>
    </div>
  );
};
