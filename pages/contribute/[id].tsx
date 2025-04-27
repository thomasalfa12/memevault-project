"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { abi } from "../../constant/contract-abi";
import { CONTRACT_ADDRESS } from "../../constant/contract-address";
import { parseEther } from "viem";
import { toast } from "react-hot-toast";

export default function ContributePage() {
  const router = useRouter();
  const { id } = router.query;

  const [meme, setMeme] = useState<any>(null);
  const [amount, setAmount] = useState<string>("");

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    async function fetchMeme() {
      try {
        const res = await fetch(`/api/meme/${id}`);
        const data = await res.json();
        setMeme(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load meme details");
      }
    }

    fetchMeme();
  }, [id]);

  async function handleContribute() {
    if (!amount) {
      toast.error("Please enter an amount!");
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "contribute",
        args: [BigInt(id as string)],
        value: parseEther(amount),
      });
      toast.success("Transaction sent!");
    } catch (err) {
      console.error(err);
      toast.error("Contribution failed");
    }
  }

  if (!meme) {
    return <div className="text-center p-10">Loading meme details...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">{meme.title}</h1>

        <div className="mb-4">
          <div className="text-gray-600 text-sm">
            🎯 Goal: {Number(meme.goalAmount) / 1e18} ETH
          </div>
          <div className="text-gray-600 text-sm">
            💰 Raised: {Number(meme.currentAmount) / 1e18} ETH
          </div>
        </div>

        {isSuccess ? (
          <div className="text-green-600 font-semibold text-center mb-4">
            ✅ Contribution successful!
          </div>
        ) : (
          <>
            <input
              type="number"
              placeholder="Amount (ETH)"
              className="w-full border p-2 rounded-lg mb-4"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isPending}
            />
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              onClick={handleContribute}
              disabled={isPending}
            >
              {isPending ? "Contributing..." : "Contribute"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
