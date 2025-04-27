"use client";

// components/MemeUploadModal.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface MemeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

export default function MemeUploadModal({
  isOpen,
  onClose,
  onUploaded,
}: MemeUploadModalProps) {
  const [title, setTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleUpload() {
    setLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          goalAmount,
        }),
      });

      if (!res.ok) throw new Error("Failed to upload meme");

      toast.success("Meme uploaded successfully! 🎉");
      onUploaded(); // panggil fungsi refetch memes
      onClose(); // tutup modal
      setTitle("");
      setGoalAmount("");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed 😢");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Upload New Meme</h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded-lg mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Goal Amount (in ETH)"
          className="w-full border p-2 rounded-lg mb-4"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
        />

        <div className="flex gap-4">
          <button
            onClick={handleUpload}
            disabled={loading}
            className="flex-1 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 p-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
