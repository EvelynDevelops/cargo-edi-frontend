"use client";

import React from "react";
import { ICargoFormData } from "@/types/cargo";


/**
 * Props for the CargoCard component
 * @property {ICargoFormData} data - The cargo data to display
 * @property {number} index - The index of the cargo item in the list
 * @property {boolean} readOnly - Whether the card is in read-only mode
 */
interface ICargoCardProps {
  data: ICargoFormData;
  index: number;
  readOnly?: boolean;
}

/**
 * CargoCard component displays cargo information in a card format
 */
const CargoCard: React.FC<ICargoCardProps> = ({ data, index, readOnly = true }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl px-4 sm:px-6 py-4 shadow-sm space-y-2 relative w-full">
      {/* Card header with cargo item number */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 bg-gray-100 px-4 py-2 -mx-4 sm:-mx-6 -mt-4 rounded-t-xl">
        Cargo Item #{data.id}
      </h3>
      
      {/* Cargo information fields */}
      <div className="space-y-2">
        {/* Cargo Type field */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
          <span className="font-medium text-sm sm:text-base">Cargo Type:</span>
          <input
            type="text"
            value={data.cargoType}
            disabled={readOnly}
            className="border border-gray-300 rounded px-2 py-0.5 w-full sm:w-48 h-6 bg-gray-50 text-gray-700 text-sm sm:text-base"
          />
        </div>
        
        {/* Number of Packages field */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
          <span className="font-medium text-sm sm:text-base">Number of Packages:</span>
          <input
            type="number"
            value={data.packageCount}
            disabled={readOnly}
            className="border border-gray-300 rounded px-2 py-0.5 w-full sm:w-48 h-6 bg-gray-50 text-gray-700 text-sm sm:text-base"
          />
        </div>
        
        {/* Container number field */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
          <span className="font-medium text-sm sm:text-base">Container number:</span>
          <input
            type="text"
            value={data.containerNumber || ""}
            disabled={readOnly}
            className="border border-gray-300 rounded px-2 py-0.5 w-full sm:w-48 h-6 bg-gray-50 text-gray-700 text-sm sm:text-base"
          />
        </div>
        
        {/* Master Bill Number field */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
          <span className="font-medium text-sm sm:text-base">Master Bill number:</span>
          <input
            type="text"
            value={data.masterBillNumber || ""}
            disabled={readOnly}
            className="border border-gray-300 rounded px-2 py-0.5 w-full sm:w-48 h-6 bg-gray-50 text-gray-700 text-sm sm:text-base"
          />
        </div>
        
        {/* House Bill Number field */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
          <span className="font-medium text-sm sm:text-base">House Bill number:</span>
          <input
            type="text"
            value={data.houseBillNumber || ""}
            disabled={readOnly}
            className="border border-gray-300 rounded px-2 py-0.5 w-full sm:w-48 h-6 bg-gray-50 text-gray-700 text-sm sm:text-base"
          />
        </div>
      </div>
    </div>
  );
};

export default CargoCard; 
