import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CargoFormItem from './CargoFormItem';
import { CargoFormData } from '@/types/cargo';

describe('CargoFormItem', () => {
  const mockData: CargoFormData = {
    cargoType: 'FCL',
    packageCount: 10,
    containerNumber: 'CONT123',
    masterBillNumber: 'MAST123',
    houseBillNumber: 'HOUSE123'
  };

  const mockOnChange = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnValidate = jest.fn();

  const defaultProps = {
    index: 0,
    data: mockData,
    onChange: mockOnChange,
    onDelete: mockOnDelete,
    onValidate: mockOnValidate,
    errors: {}
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<CargoFormItem {...defaultProps} />);
    
    // 检查标题
    expect(screen.getByText('Cargo Item #1')).toBeInTheDocument();
    
    // 检查所有输入字段
    expect(screen.getByTestId('cargoType-0')).toBeInTheDocument();
    expect(screen.getByTestId('packageCount-0')).toBeInTheDocument();
    expect(screen.getByTestId('containerNumber-0')).toBeInTheDocument();
    expect(screen.getByTestId('masterBillNumber-0')).toBeInTheDocument();
    expect(screen.getByTestId('houseBillNumber-0')).toBeInTheDocument();
  });

  it('displays initial values correctly', () => {
    render(<CargoFormItem {...defaultProps} />);
    
    expect(screen.getByTestId('containerNumber-0')).toHaveValue('CONT123');
    expect(screen.getByTestId('masterBillNumber-0')).toHaveValue('MAST123');
    expect(screen.getByTestId('houseBillNumber-0')).toHaveValue('HOUSE123');
  });

  it('handles field changes correctly', () => {
    render(<CargoFormItem {...defaultProps} />);
    
    const containerInput = screen.getByTestId('containerNumber-0');
    fireEvent.change(containerInput, { target: { value: 'NEW123' } });
    
    expect(mockOnChange).toHaveBeenCalledWith(0, {
      ...mockData,
      containerNumber: 'NEW123'
    });
  });

  it('displays error messages when provided', () => {
    const propsWithErrors = {
      ...defaultProps,
      errors: {
        cargoType: 'Cargo type is required',
        packageCount: 'Package count must be positive'
      }
    };
    
    render(<CargoFormItem {...propsWithErrors} />);
    
    expect(screen.getByText('Cargo type is required')).toBeInTheDocument();
    expect(screen.getByText('Package count must be positive')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<CargoFormItem {...defaultProps} />);
    
    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('handles field blur events correctly', () => {
    render(<CargoFormItem {...defaultProps} />);
    
    const containerInput = screen.getByTestId('containerNumber-0');
    fireEvent.blur(containerInput);
    
    // 验证 onValidate 是否被调用
    expect(mockOnValidate).toHaveBeenCalled();
  });

  it('renders without delete button when onDelete is not provided', () => {
    const propsWithoutDelete = {
      ...defaultProps,
      onDelete: undefined
    };
    
    render(<CargoFormItem {...propsWithoutDelete} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles empty initial data correctly', () => {
    const emptyData: CargoFormData = {
      cargoType: undefined,
      packageCount: undefined,
      containerNumber: '',
      masterBillNumber: '',
      houseBillNumber: ''
    };
    
    render(
      <CargoFormItem
        {...defaultProps}
        data={emptyData}
      />
    );
    
    expect(screen.getByTestId('containerNumber-0')).toHaveValue('');
    expect(screen.getByTestId('masterBillNumber-0')).toHaveValue('');
    expect(screen.getByTestId('houseBillNumber-0')).toHaveValue('');
  });
}); 