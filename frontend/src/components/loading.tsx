"use client";
import Spinner from "@app/components/spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white/20 z-50 fixed inset-0">
      <div className="text-center flex items-center justify-center gap-2">
        <Spinner size={20} color="border-black" />
        <p className="text-black text-lg">Loading...</p>
      </div>
    </div>
  );
}
