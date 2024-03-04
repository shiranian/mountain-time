import BurnButton from "./BurnButton";
import MintButton from "./MintButton";
import ReactModal from "react-modal";
import { M3Token } from "~~/types/M3Token";

const Modal = ({
  open,
  selectedToken,
  onClose,
}: {
  open: boolean;
  selectedToken: M3Token | null;
  onClose: () => void;
}) => {
  if (!open || !selectedToken) return null; // Early return if modal closed or no token

  return (
    <ReactModal
      isOpen={open}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          zIndex: 20,
        },
        content: {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "300vw",
          maxHeight: "300vh",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <div className="bg-white rounded-lg p-4 grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <img src={selectedToken.image} alt={selectedToken.name} className="w-full h-full object-cover mb-4" />
        </div>
        <div className="col-span-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">{selectedToken.name}</h2>
          <p className="text-sm mb-4 text-gray-900">{selectedToken.description}</p>
          <p>Element: {selectedToken?.attributes.find(attribute => attribute.trait_type === "Element")?.value}</p>

          <p>Color: {selectedToken?.attributes.find(attribute => attribute.trait_type === "Color")?.value}</p>

          <p>Energy: {selectedToken?.attributes.find(attribute => attribute.trait_type === "Energy")?.value}</p>

          <p>Rarity: {selectedToken?.attributes.find(attribute => attribute.trait_type === "Rarity")?.value}</p>
          <div className="flex justify-center gap-4">
            <MintButton tokenId={selectedToken?.tokenId} onSuccess={onClose} />
            <BurnButton tokenId={selectedToken.tokenId} onSuccess={onClose} />
            {/* Trade */}
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export default Modal;
