import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import CurrentNetwork from "./CurrentNetwork";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-white shadow-md fixed top-0 z-50">
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-bold text-purple-700 hover:opacity-80 transition"
      >
        MemeFund
      </Link>

      {/* Right - Wallet & Network */}
      <div className="flex items-center gap-4">
        <CurrentNetwork />
        <ConnectButton />
      </div>
    </nav>
  );
}
