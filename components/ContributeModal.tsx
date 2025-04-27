import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { abi } from "../constant/contract-abi";
import { CONTRACT_ADDRESS } from "../constant/contract-address";
import { parseEther } from "viem";
import toast from "react-hot-toast";

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  memeId: number;
}

export default function ContributeModal({
  isOpen,
  onClose,
  memeId,
}: ContributeModalProps) {
  const [amount, setAmount] = useState<string>("");

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isSuccess, isError } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Contribution successful! 🎉");
      onClose();
    }
    if (isError) {
      toast.error("Transaction failed 😢");
    }
  }, [isSuccess, isError, onClose]);

  const handleContribute = () => {
    if (!amount) {
      toast.error("Please enter an amount!");
      return;
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "contribute",
      args: [BigInt(memeId)],
      value: parseEther(amount),
    });
    toast.success("Transaction sent! ✈️");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold text-purple-700 mb-4">
                  Contribute to Meme #{memeId}
                </Dialog.Title>

                <div className="mt-2 space-y-4">
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    placeholder="Amount in ETH"
                    className="w-full border border-purple-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isPending}
                  />

                  <button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
                    onClick={handleContribute}
                    disabled={isPending}
                  >
                    {isPending ? "Processing..." : "Contribute"}
                  </button>
                </div>

                <button
                  className="mt-4 w-full text-gray-500 text-sm"
                  onClick={onClose}
                  disabled={isPending}
                >
                  Cancel
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
