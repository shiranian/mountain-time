import React from "react";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const BurnButton = ({ tokenId }: { tokenId: bigint; onClose: () => void }) => {
  const { address } = useAccount();

  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "M3Token",
    functionName: "burn",
    args: [address, tokenId],
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <button className="btn btn-primary" disabled={isLoading || isMining} onClick={() => writeAsync()}>
      {isLoading ? "Burning..." : `Burn`}
    </button>
  );
};

export default BurnButton;
