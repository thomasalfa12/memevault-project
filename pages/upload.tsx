"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWriteContract } from "wagmi";
import { abi } from "../constant/contract-abi";
import { CONTRACT_ADDRESS } from "../constant/contract-address";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();

  // Handle image file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !goalAmount.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }

    const ethValue = parseFloat(goalAmount);
    if (ethValue <= 0) {
      toast.error("Goal amount must be greater than 0!");
      return;
    }

    const parsedGoal = BigInt(ethValue * 1e18); // Convert to BigInt

    try {
      setIsLoading(true);

      // Debugging log to check parameters
      console.log("Submitting transaction with parameters:");
      console.log("Title:", title.trim());
      console.log("Goal Amount (parsed):", parsedGoal);

      // Send the transaction to the blockchain
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "createMeme",
        args: [title.trim(), parsedGoal], // You can add image URL here if needed
      });

      console.log("Transaction response:", tx);

      let countdown = 3;
      const countdownToast = toast.loading(`Redirecting in ${countdown}...`);

      const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          toast.loading(`Redirecting in ${countdown}...`, {
            id: countdownToast,
          });
        } else {
          clearInterval(interval);
          toast.dismiss(countdownToast);
          router.push("/memes"); // Redirect to the meme list page
        }
      }, 1000);
    } catch (err: any) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload meme. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full"
      >
        <h1 className="text-3xl font-bold mb-6 text-purple-700 text-center">
          Upload Your Meme 🚀
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Image Upload */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-xl p-4 hover:bg-purple-50 transition">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="meme"
                width={500}
                height={500}
                className="rounded-xl"
              />
            ) : (
              <UploadCloud className="w-12 h-12 text-purple-400 mb-2" />
            )}
            <label className="text-purple-600 cursor-pointer font-medium">
              {imagePreview ? "Change Image" : "Select Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isLoading}
              />
            </label>
          </div>

          {/* Title */}
          <input
            type="text"
            placeholder="Meme Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-purple-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            disabled={isLoading}
            required
          />

          {/* Goal Amount */}
          <input
            type="number"
            step="0.0001"
            placeholder="Goal Amount (in ETH)"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="border border-purple-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            disabled={isLoading}
            required
            min={0.0001}
          />

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 text-white rounded-full py-3 font-semibold shadow-md hover:bg-purple-700 transition disabled:bg-purple-300 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Meme"
            )}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}
