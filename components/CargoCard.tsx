"use client";

import React, { useState, useEffect } from "react";
import { CargoFormData } from "@/components/CargoFormItem";

/**
 * Props for the CargoCard component
 * @property {CargoFormData} data - The cargo data to display
 * @property {number} index - The index of the cargo item in the list
 * @property {Function} onUpdate - Optional callback function to update cargo data
 * @property {boolean} readOnly - Whether the card is in read-only mode
 */
type Props = {
  data: CargoFormData;
  index: number;
  onUpdate?: (index: number, updatedData: CargoFormData) => void;
  readOnly?: boolean;
};

/**
 * CargoCard component displays cargo information in a card format
 * It can be used in both editable and read-only modes
 */
const CargoCard: React.FC<Props> = ({ data, index, onUpdate, readOnly = false }) => {
  // State to track whether the card is in editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State to store the edited data before saving
  const [editedData, setEditedData] = useState<CargoFormData>({ ...data });

  // Update local state when external data changes
  useEffect(() => {
    setEditedData({ ...data });
  }, [data]);

  /**
   * Handle edit button click - enables editing mode
   */
  const handleEdit = () => {
    setIsEditing(true);
  };

  /**
   * Handle save button click - saves changes and exits editing mode
   */
  const handleSave = () => {
    if (onUpdate) {
      // Pass the index and updated data to the parent component
      onUpdate(index, editedData);
    }
    setIsEditing(false);
  };

  /**
   * Handle input field changes
   * @param {keyof CargoFormData} field - The field being updated
   * @param {string | number} value - The new value for the field
   */
  const handleChange = (field: keyof CargoFormData, value: string | number) => {
    setEditedData({
      ...editedData,
      [field]: value,
    });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl px-6 py-4 shadow-sm space-y-2 relative">
      
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
            value={isEditing ? editedData.cargo_type : data.cargo_type}
            onChange={(e) => handleChange("cargo_type", e.target.value)}
            disabled={!isEditing || readOnly}
            className={`border border-gray-300 rounded px-2 py-0.5 w-48 h-6 ${!isEditing || readOnly ? "bg-gray-50 text-gray-700" : ""}`}
          />
        </div>
        
        {/* Number of Packages field */}
        <div className="flex items-center justify-between">
          <span className="font-medium whitespace-nowrap mr-4">Packages:</span>
          <input
            type="number"
            min="1"
            value={isEditing ? editedData.number_of_packages : data.number_of_packages}
            onChange={(e) => handleChange("number_of_packages", parseInt(e.target.value) || 1)}
            disabled={!isEditing || readOnly}
            className={`border border-gray-300 rounded px-2 py-0.5 w-48 h-6 ${!isEditing || readOnly ? "bg-gray-50 text-gray-700" : ""}`}
          />
        </div>
        
        {/* Container Number field */}
        <div className="flex items-center justify-between">
          <span className="font-medium whitespace-nowrap mr-4">Container number:</span>
          <input
            type="text"
            value={isEditing ? (editedData.container_number || "") : (data.container_number || "")}
            onChange={(e) => handleChange("container_number", e.target.value)}
            disabled={!isEditing || readOnly}
            className={`border border-gray-300 rounded px-2 py-0.5 w-48 h-6 ${!isEditing || readOnly ? "bg-gray-50 text-gray-700" : ""}`}
          />
        </div>
        
        {/* Master Bill of Lading Number field */}
        <div className="flex items-center justify-between">
          <span className="font-medium whitespace-nowrap mr-4">Master Bill number:</span>
          <input
            type="text"
            value={isEditing ? (editedData.master_bill_of_lading_number || "") : (data.master_bill_of_lading_number || "")}
            onChange={(e) => handleChange("master_bill_of_lading_number", e.target.value)}
            disabled={!isEditing || readOnly}
            className={`border border-gray-300 rounded px-2 py-0.5 w-48 h-6 ${!isEditing || readOnly ? "bg-gray-50 text-gray-700" : ""}`}
          />
        </div>
        
        {/* House Bill of Lading Number field */}
        <div className="flex items-center justify-between">
          <span className="font-medium whitespace-nowrap mr-4">House Bill number:</span>
          <input
            type="text"
            value={isEditing ? (editedData.house_bill_of_lading_number || "") : (data.house_bill_of_lading_number || "")}
            onChange={(e) => handleChange("house_bill_of_lading_number", e.target.value)}
            disabled={!isEditing || readOnly}
            className={`border border-gray-300 rounded px-2 py-0.5 w-48 h-6 ${!isEditing || readOnly ? "bg-gray-50 text-gray-700" : ""}`}
          />
        </div>
      </div>
    </div>
  );
};

export default CargoCard;
