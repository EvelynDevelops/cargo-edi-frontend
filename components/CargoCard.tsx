"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { CargoFormData } from "@/components/CargoFormItem";

/**
 * Props for the CargoCard component
 * @property {CargoFormData} data - The cargo data to display
 * @property {number} index - The index of the cargo item in the list
 * @property {boolean} readOnly - Whether the card is in read-only mode
 */
type Props = {
  data: CargoFormData;
  index: number;
  readOnly?: boolean;
};

/**
 * CargoCard component displays cargo information in a card format
 */
const CargoCard: React.FC<Props> = ({ data, index, readOnly = true }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl px-6 py-4 shadow-sm space-y-2 relative w-[420px]">
      {/* Card header with cargo item number */}
      <h3 className="text-lg font-semibold text-gray-800 bg-gray-100 px-4 py-2 -mx-6 -mt-4 rounded-t-xl">
        Cargo Item #{index + 1}
      </h3>
      
      {/* Cargo information fields */}
      <div className="space-y-2">
        {/* Cargo Type field */}
        <div className="flex items-center justify-between">
          <span className="font-medium whitespace-nowrap mr-4">Cargo Type:</span>
          <input
            type="text"
            value={data.cargo_type}
            disabled={readOnly}
            className="border border-gray-300 rounded px-2 py-0.5 w-48 h-6 bg-gray-50 text-gray-700"
          />
        </div>
        
        {/* Number of Packages field */}
        <div className="flex items-center justify-between">
          <span className="font-medium whitespace-nowrap mr-4">Number of Packages:</span>
          <input
            type="number"
            value={data.package_count}
            disabled={readOnly}
            className="border border-gray-300 rounded px-2 py-0.5 w-48 h-6 bg-gray-50 text-gray-700"
          />
        </div>
        
        {/* Container number field */}
        <div className="flex items-center justify-between">
          <span className="font-medium whitespace-nowrap mr-4">Container number:</span>
          <input
            type="text"
            value={data.container_number || ""}
            disabled={readOnly}
            className="border border-gray-300 rounded px-2 py-0.5 w-48 h-6 bg-gray-50 text-gray-700"
          />
        </div>
        
        {/* Master Bill Number field */}
        <div className="flex items-center justify-between">
          <span className="font-medium whitespace-nowrap mr-4">Master Bill number:</span>
          <input
            type="text"
            value={data.master_bill_number || ""}
            disabled={readOnly}
            className="border border-gray-300 rounded px-2 py-0.5 w-48 h-6 bg-gray-50 text-gray-700"
          />
        </div>
        
        {/* House Bill Number field */}
        <div className="flex items-center justify-between">
          <span className="font-medium whitespace-nowrap mr-4">House Bill number:</span>
          <input
            type="text"
            value={data.house_bill_number || ""}
            disabled={readOnly}
            className="border border-gray-300 rounded px-2 py-0.5 w-48 h-6 bg-gray-50 text-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default CargoCard; 
