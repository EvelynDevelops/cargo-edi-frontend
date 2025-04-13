import { useForm } from '../hooks/useForm';
import { validateForm } from '../utils/cargoValidation';
import { CargoFormData, CargoValidationErrors } from '../types/cargo';

interface Props {
  initialValues: CargoFormData;
  onSubmit: (values: CargoFormData) => Promise<void>;
}

export function CargoForm({ initialValues, onSubmit }: Props) {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm<CargoFormData>({
    initialValues,
    onSubmit,
    validate: (values: CargoFormData): CargoValidationErrors => validateForm(values)
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cargo Type
        </label>
        <select
          value={values.cargoType || ''}
          onChange={(e) => handleChange('cargoType', e.target.value || undefined)}
          onBlur={() => handleBlur('cargoType')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            touched.cargoType && errors.cargoType ? 'border-red-500' : ''
          }`}
        >
          <option value="">Select cargo type</option>
          <option value="FCL">FCL</option>
          <option value="LCL">LCL</option>
          <option value="FCX">FCX</option>
        </select>
        {touched.cargoType && errors.cargoType && (
          <p className="mt-1 text-sm text-red-600">{errors.cargoType}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Package Count
        </label>
        <input
          type="number"
          value={values.packageCount}
          onChange={(e) => handleChange('packageCount', parseInt(e.target.value))}
          onBlur={() => handleBlur('packageCount')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            touched.packageCount && errors.packageCount ? 'border-red-500' : ''
          }`}
        />
        {touched.packageCount && errors.packageCount && (
          <p className="mt-1 text-sm text-red-600">{errors.packageCount}</p>
        )}
      </div>

      {values.cargoType === 'FCL' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Container Number
          </label>
          <input
            type="text"
            value={values.containerNumber}
            onChange={(e) => handleChange('containerNumber', e.target.value)}
            onBlur={() => handleBlur('containerNumber')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              touched.containerNumber && errors.containerNumber
                ? 'border-red-500'
                : ''
            }`}
          />
          {touched.containerNumber && errors.containerNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.containerNumber}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Master Bill Number
        </label>
        <input
          type="text"
          value={values.masterBillNumber}
          onChange={(e) => handleChange('masterBillNumber', e.target.value)}
          onBlur={() => handleBlur('masterBillNumber')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            touched.masterBillNumber && errors.masterBillNumber
              ? 'border-red-500'
              : ''
          }`}
        />
        {touched.masterBillNumber && errors.masterBillNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.masterBillNumber}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          House Bill Number
        </label>
        <input
          type="text"
          value={values.houseBillNumber}
          onChange={(e) => handleChange('houseBillNumber', e.target.value)}
          onBlur={() => handleBlur('houseBillNumber')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            touched.houseBillNumber && errors.houseBillNumber
              ? 'border-red-500'
              : ''
          }`}
        />
        {touched.houseBillNumber && errors.houseBillNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.houseBillNumber}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
} 