"use client";
import { motion } from "framer-motion";

type Meme = {
  id: number;
  title: string;
  goalAmount: bigint;
  currentAmount: bigint;
};

export default function MemeList({
  memes,
  openModal,
}: {
  memes: Meme[];
  openModal: (memeId: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {memes.map((meme, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 rounded-2xl shadow-md bg-white flex flex-col"
        >
          <div
            key={meme.id}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            onClick={() => openModal(meme.id)}
          >
            <h3 className="text-xl font-bold text-purple-700">{meme.title}</h3>
            <p className="text-gray-500 mt-2">
              Goal: {Number(meme.goalAmount) / 1e18} ETH
            </p>
            <p className="text-gray-500">
              Collected: {Number(meme.currentAmount) / 1e18} ETH
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
