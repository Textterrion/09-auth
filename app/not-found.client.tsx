"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotFoundTimer() {
  const router = useRouter();

  const [seconds, setSeconds] = useState<number>(5);

  useEffect(() => {
    if (seconds === 0) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds, router]);

  return <strong>Redirecting in {seconds} seconds...</strong>;
}