"use client";

import { useEffect, useState, useRef } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface CountdownTimerProps {
  durationMinutes: number;
  storageKey: string;
  onExpire: () => void;
  disabled?: boolean;
}

export default function CountdownTimer({
  durationMinutes,
  storageKey,
  onExpire,
  disabled = false,
}: CountdownTimerProps) {
  // Total duration in seconds (min 60 mins)
  const totalSeconds = Math.max(60, durationMinutes) * 60;
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    if (disabled) return;

    // Retrieve or initialize start timestamp in localStorage to resist page refreshes
    const storedStartTime = localStorage.getItem(`${storageKey}_start`);
    const now = Date.now();
    let startTime: number;

    if (storedStartTime) {
      startTime = parseInt(storedStartTime, 10);
    } else {
      startTime = now;
      localStorage.setItem(`${storageKey}_start`, startTime.toString());
    }

    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const initialRemaining = Math.max(0, totalSeconds - elapsedSeconds);
    setSecondsLeft(initialRemaining);

    if (initialRemaining <= 0 && !hasExpiredRef.current) {
      hasExpiredRef.current = true;
      onExpireRef.current();
      return;
    }

    const interval = setInterval(() => {
      const currentNow = Date.now();
      const currentElapsed = Math.floor((currentNow - startTime) / 1000);
      const remaining = Math.max(0, totalSeconds - currentElapsed);

      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        if (!hasExpiredRef.current) {
          hasExpiredRef.current = true;
          onExpireRef.current();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [totalSeconds, storageKey, disabled]);

  if (secondsLeft === null) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-500 font-mono text-sm animate-pulse">
        <Clock className="w-4 h-4" />
        <span>Memuat timer...</span>
      </div>
    );
  }

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const timeString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  const isUrgent = secondsLeft < 300; // < 5 mins
  const isWarning = secondsLeft < 900 && !isUrgent; // < 15 mins

  return (
    <div
      className={`flex items-center space-x-2.5 px-4 py-2 rounded-xl font-mono text-sm font-semibold transition-all duration-300 shadow-sm border ${
        secondsLeft === 0
          ? "bg-rose-100 border-rose-300 text-rose-800"
          : isUrgent
          ? "bg-red-500/10 border-red-400 text-red-600 animate-pulse ring-2 ring-red-400"
          : isWarning
          ? "bg-amber-500/10 border-amber-400 text-amber-700"
          : "bg-indigo-50 border-indigo-200 text-indigo-700"
      }`}
    >
      {isUrgent ? (
        <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1">
          <span className="text-xs uppercase tracking-wider font-sans font-medium text-slate-500">
            Sisa Waktu:
          </span>
          <span className="text-base tracking-wider font-bold">
            {secondsLeft === 0 ? "Waktu Habis!" : timeString}
          </span>
        </div>
      </div>
    </div>
  );
}
