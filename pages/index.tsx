"use client";

import { useRouter } from "next/router"; // Tambahkan useRouter untuk navigasi
import MemeUploadModal from "../components/MemeUploadModal";
import { useIsClient } from "../hooks/useIsClient";
import { useAccount, useContractRead } from "wagmi";
import { useState, useEffect } from "react";
import { abi } from "../constant/contract-abi";
import { CONTRACT_ADDRESS } from "../constant/contract-address";
import ContributeModal from "../components/ContributeModal";
import StepCard from "../components/StepCard";
import UploadButton from "../components/UploadButton";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter(); // Gunakan router untuk navigasi
  const isClient = useIsClient(); // 🛡️ tambahan buat cek client
  const { isConnected } = useAccount();

  const [selectedMemeId, setSelectedMemeId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: totalSupplyData, refetch } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "totalSupply",
  });

  useEffect(() => {
    if (!totalSupplyData) return;

    const fetchMemes = async () => {
      setIsLoading(true);
      try {
        // Pastikan untuk menambahkan logic untuk mengambil meme jika diperlukan
        // const total = Number(totalSupplyData);
        // const results = await Promise.all(
        //   Array.from({ length: total }, (_, i) => fetchMeme(i))
        // );
        // setMemes(results);
      } catch (error) {
        console.error("Error fetching memes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemes();
  }, [totalSupplyData]);

  const openModal = (memeId: number) => {
    setSelectedMemeId(memeId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMemeId(null);
    setIsModalOpen(false);
  };

  // Ganti openUploadModal untuk menggunakan router.push untuk navigasi ke halaman upload
  const openUploadModal = () => {
    router.push("/upload"); // Pindahkan pengguna ke halaman /upload.tsx
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleUploaded = async () => {
    await refetch(); // 🔥 Refresh totalSupply dan refresh memes
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-6">
      {/* Hero Section */}
      <section className="text-center py-16">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-purple-800 mb-6 flex justify-center items-center gap-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Lock className="w-14 h-14 text-purple-700" />
          MemeVault
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-purple-600 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Lock your meme. Set a crypto goal. Reveal the laughter with the
          community!
        </motion.p>
      </section>

      {/* Main Section */}
      <section className="flex flex-col items-center justify-center px-4 py-8">
        {isConnected ? (
          <>
            {/* Upload Button */}
            <UploadButton onClick={openUploadModal} />

            {/* Steps */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <StepCard number="1" title="Upload your meme" emoji="📸" />
              <StepCard number="2" title="Set your crypto goal" emoji="🎯" />
              <StepCard
                number="3"
                title="Invite friends to contribute"
                emoji="🤝"
              />
              <StepCard number="4" title="Unlock the laughter!" emoji="😂" />
            </div>
          </>
        ) : (
          <motion.div
            className="mt-8 text-purple-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Please connect your wallet to continue.
          </motion.div>
        )}
      </section>

      {/* Modals */}
      {selectedMemeId !== null && (
        <ContributeModal
          isOpen={isModalOpen}
          onClose={closeModal}
          memeId={selectedMemeId}
        />
      )}

      {isUploadModalOpen && (
        <MemeUploadModal
          isOpen={isUploadModalOpen}
          onClose={closeUploadModal}
          onUploaded={handleUploaded}
        />
      )}
    </main>
  );
}
