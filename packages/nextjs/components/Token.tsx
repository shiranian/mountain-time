import React from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { M3Token } from "~~/types/M3Token";

const Token = ({ token: { name, image, tokenId, description }, onClick }: { token: M3Token; onClick: () => void }) => {
  const { address } = useAccount();
  const { data } = useScaffoldContractRead({
    contractName: "M3Token",
    functionName: "balanceOf",
    args: [address, tokenId],
  });

  return (
    <div className="rounded-lg bg-gray-900 shadow-md flex flex-col justify-center position: relative" onClick={onClick}>
      <div className="token-count top-2 right-2 bg-gray-800 rounded-full px-2 py-0.5 text-s text-white absolute">
        {data ? data.toString() : "???"}
      </div>

      <div className="bg-url(card-texture.jpg) w-full h-full absolute top-0 left-0 z-0 opacity-20" />

      {image ? (
        <Image
          src={image}
          alt={name}
          width="150"
          height="180"
          className="mx-auto mt-4 rounded-lg border-brown-400 border-2 object-fit=cover"
        />
      ) : (
        <div className="fallback-image">{/* placeholder content */}</div>
      )}

      <h2 className="mt-4 text-center font-serif text-lg font-bold text-white-200">{tokenId.toString()}</h2>

      <h2 className="mt-4 text-center font-serif text-lg font-bold text-white-200">{name}</h2>

      <p className="text-center text-sm text-gray-100 mt-2">{description}</p>
    </div>
  );
};

export default Token;
