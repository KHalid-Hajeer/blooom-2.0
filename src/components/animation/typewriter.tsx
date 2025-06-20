"use client";
import { useState, useEffect, useRef } from "react";

export default function Typewriter({
  text,
  speed = 50,
  delay = 0,
  onComplete = () => {},
}: {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}) {
  const [typedText, setTypedText] = useState("");
  const indexRef = useRef(0);
  const bufferRef = useRef("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (indexRef.current < text.length) {
          bufferRef.current += text.charAt(indexRef.current);
          setTypedText(bufferRef.current);
          indexRef.current += 1;
        } else {
          clearInterval(intervalRef.current!);
          onComplete();
        }
      }, speed);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, delay, onComplete]);

  return <span>{typedText}</span>;
}