import React from 'react';
import { useForm } from '@/hooks/useForm';
import { ICargoFormData } from '@/types/cargo';
import { validateForm } from '@/utils/cargoValidation';

interface ICargoFormProps {
  initialData: ICargoFormData;
  onSubmit: (data: ICargoFormData) => Promise<void>;
}

/**
 * Example component using the useForm hook
 */
export default function CargoForm({ initialData, onSubmit }: ICargoFormProps) {
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm<ICargoFormData>({
    initialValues: initialData,
    validate: validateForm,
    onSubmit
  });

  return (
    <div className="space-y-4">
      {/* Cargo Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cargo Type
        </label>
        <select
          value={values.cargoType || ''}
          onChange={(e) => handleChange('cargoType', e.target.value)}
          onBlur={() => handleBlur('cargoType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="">Select type</option>
          <option value="FCL">FCL</option>
          <option value="LCL">LCL</option>
        </select>
        {errors.cargoType && (
          <p className="mt-1 text-sm text-red-600">{errors.cargoType}</p>
        )}
      </div>

      {/* Package Count */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Package Count
        </label>
        <input
          type="number"
          value={values.packageCount || ''}
          onChange={(e) => handleChange('packageCount', parseInt(e.target.value))}
          onBlur={() => handleBlur('packageCount')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.packageCount && (
          <p className="mt-1 text-sm text-red-600">{errors.packageCount}</p>
        )}
      </div>

      {/* Container Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Container Number
        </label>
        <input
          type="text"
          value={values.containerNumber}
          onChange={(e) => handleChange('containerNumber', e.target.value)}
          onBlur={() => handleBlur('containerNumber')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.containerNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.containerNumber}</p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
} 