"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type UploadButtonProps = {
  onClick: () => void;
};

export default function UploadButton({ onClick }: UploadButtonProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // atau skeleton placeholder

  return (
    <motion.button
      initial={{ opacity: 0 }}
      onClick={onClick}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-3 bg-purple-600 text-white rounded-lg"
    >
      Upload Meme 🚀
    </motion.button>
  );
}
