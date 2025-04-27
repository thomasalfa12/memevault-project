import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { abi } from "../../../constant/contract-abi";
import { CONTRACT_ADDRESS } from "../../../constant/contract-address";

// Provider didefinisikan SEKALI di luar handler
const provider = new ethers.JsonRpcProvider(
  "https://sepolia.base.org"
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    res.status(400).json({ error: "Invalid meme id" });
    return;
  }

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    const meme = await contract.getMeme(id);

    res.status(200).json({
      title: meme[0],
      goalAmount: meme[1].toString(),
      currentAmount: meme[2].toString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch meme details" });
  }
}
