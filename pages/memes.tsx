import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { abi } from "../constant/contract-abi";
import { CONTRACT_ADDRESS } from "../constant/contract-address";
import Link from "next/link";

interface Meme {
  title: string;
  goalAmount: bigint;
  currentAmount: bigint;
}

export default function MemesPage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: totalSupply, refetch } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "totalSupply",
  });

  // Manual polling setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    async function fetchMemes() {
      if (!totalSupply) return;

      const memeList: Meme[] = [];
      for (let i = 0; i < Number(totalSupply); i++) {
        const res = await fetchMeme(i);
        if (res) memeList.push(res);
      }
      setMemes(memeList);
      setLoading(false);
    }

    fetchMemes();
  }, [totalSupply]);

  async function fetchMeme(memeId: number): Promise<Meme | null> {
    try {
      const response = await fetch(`/api/meme/${memeId}`);
      if (!response.ok) throw new Error("Failed to fetch meme");
      const data = await response.json();
      return {
        title: data.title,
        goalAmount: BigInt(data.goalAmount),
        currentAmount: BigInt(data.currentAmount),
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  if (loading) return <div className="text-center p-10">Loading memes...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Meme List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {memes.map((meme, index) => {
          const progress = Number(
            (meme.currentAmount * 100n) / meme.goalAmount
          );

          return (
            <div
              key={index}
              className="p-4 rounded-2xl shadow-md bg-white flex flex-col"
            >
              <h2 className="text-xl font-semibold mb-2">{meme.title}</h2>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{ width: `${progress > 100 ? 100 : progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {(Number(meme.currentAmount) / 1e18).toFixed(4)} /{" "}
                {(Number(meme.goalAmount) / 1e18).toFixed(4)} ETH
              </p>
              <Link
                href={`/contribute/${index}`}
                className="mt-auto bg-blue-500 text-white rounded-xl p-2 text-center hover:bg-blue-600 transition"
              >
                Contribute
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
