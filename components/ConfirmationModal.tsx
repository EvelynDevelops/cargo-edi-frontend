import React from 'react';
import type { CargoFormData } from '@/components/CargoFormItem';
import CargoCard from '@/components/CargoCard';

/**
 * Props for the ConfirmationModal component
 * @property {boolean} isOpen - Whether the modal is open
 * @property {Function} onClose - Callback function to close the modal
 * @property {Function} onConfirm - Callback function to handle confirmation
 * @property {CargoFormData[]} cargoItems - Array of cargo items to display
 */
type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updatedItems: CargoFormData[]) => void;
  cargoItems: CargoFormData[];
};

/**
 * ConfirmationModal component displays a modal for reviewing cargo information
 * before generating EDI messages. It shows a summary of cargo items and
 * allows users to confirm or go back to edit.
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  cargoItems,
}) => {
  /**
   * Handle confirm button click - passes cargo items to onConfirm callback
   * and closes the modal
   */
  const handleConfirm = () => {
    // Pass cargo items to onConfirm callback
    onConfirm(cargoItems);
    onClose(); // Close the modal after confirmation
  };

  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  // Calculate total number of packages across all cargo items
  const totalPackages = cargoItems.reduce(
    (sum, item) => sum + item.package_count,
    0
  );

  // Calculate estimated number of EDI segments
  const estimatedSegments = cargoItems.reduce((total, item) => {
    // Base segments for each cargo item
    let segments = 3;
    
    // Additional segments for optional fields
    if (item.container_number) segments += 2;
    if (item.master_bill_number) segments += 2;
    if (item.house_bill_number) segments += 2;
    
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
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back to Edit
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Confirm & Generate EDI
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 