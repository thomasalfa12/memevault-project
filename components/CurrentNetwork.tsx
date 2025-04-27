"use client";

import { useChainId } from "wagmi";
import { baseSepolia } from "wagmi/chains";

export default function CurrentNetwork() {
  const chainId = useChainId();

  const networkName =
    {
      84532: "Base Sepolia",
    }[chainId] || "Unknown Network";

  return (
    <div className="text-sm text-gray-600">
      🛰️ Network: <span className="font-semibold">{networkName}</span>
    </div>
  );
}
