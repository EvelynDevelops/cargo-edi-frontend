import React from "react";
import CrossIcon from "../../public/icons/CrossIcon";

interface CargoFormHeaderProps {
  index: number;
  onDelete?: () => void;
}

const CargoFormHeader: React.FC<CargoFormHeaderProps> = ({ index, onDelete }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-semibold">Cargo Item #{index + 1}</h3>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="text-gray-700 transition"
        >
          <CrossIcon className="w-6 h-6 hover:scale-110 hover:font-bold" />
        </button>
      )}
    </div>
  );
};

export default CargoFormHeader; 