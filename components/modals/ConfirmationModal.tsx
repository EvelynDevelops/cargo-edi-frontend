import React from 'react';
import type { ICargoFormData } from '@/types/cargo';
import CargoCard from '@/components/shared/CargoCard';
import { Button } from "@/components/shared/Button";

/**
 * @property {boolean} isOpen - Whether the modal is open
 * @property {Function} onClose - Callback function to close the modal
 * @property {Function} onConfirm - Callback function to handle confirmation
 * @property {ICargoFormData[]} cargoItems - Array of cargo items to display
 */
interface IConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updatedItems: ICargoFormData[]) => void;
  cargoItems: ICargoFormData[];
}


const ConfirmationModal: React.FC<IConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  cargoItems,
}) => {

  const handleConfirm = () => {
    // Pass cargo items to onConfirm callback
    onConfirm(cargoItems);
    onClose(); // Close the modal after confirmation
  };

  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  // Calculate total number of packages across all cargo items
  const totalPackages = cargoItems.reduce(
    (sum, item) => sum + (item.packageCount || 0),
    0
  );

  // Calculate estimated number of EDI segments
  const estimatedSegments = cargoItems.reduce((total, item) => {
    // Base segments for each cargo item
    let segments = 3;
    
    // Additional segments for optional fields
    if (item.containerNumber) segments += 2;
    if (item.masterBillNumber) segments += 2;
    if (item.houseBillNumber) segments += 2;
    
    return total + segments;
  }, 0);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-[90vw] h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Confirm Cargo Information</h2>
          <p className="text-gray-600 mt-1">Please review the cargo information before generating EDI.</p>
        </div>

        {/* Modal content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Cargo summary section */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Cargo Items Summary:</h3>
            <div className="text-m text-gray-600">
              <ul className="list-disc pl-5 space-y-1">
                <li>Number of cargo items: <strong>{cargoItems.length}</strong></li>
                <li>Total number of packages: <strong>{totalPackages}</strong></li>
                <li>Estimated number of EDI segments to be generated: <strong>{estimatedSegments}</strong></li>
              </ul>
            </div>
          </div>

          {/* Grid of cargo cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cargoItems.map((item, index) => (
              <CargoCard
                key={index}
                data={item}
                index={index}
                readOnly={true}
              />
            ))}
          </div>
        </div>

        {/* Modal footer with action buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            type="button"
          >
            Back to Edit
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            type="button"
          >
            Confirm & Generate EDI
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 