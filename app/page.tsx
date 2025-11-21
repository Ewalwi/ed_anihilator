"use client";

import Loader from "@/src/components/elements/loader";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() =>{
    const load = () => setIsLoading(true);
    load();
    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-4 py-2 px-4">
      {isLoading && (
        <Loader />
      )}
    </div>
  );
}
