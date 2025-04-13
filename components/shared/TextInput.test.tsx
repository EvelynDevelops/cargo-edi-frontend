import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('renders input element correctly', () => {
    render(<TextInput data-testid="test-input" />);
    expect(screen.getByTestId('test-input')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    const label = 'Test Label';
    render(<TextInput label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('shows error message when provided', () => {
    const error = 'Test Error';
    render(<TextInput error={error} />);
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    const containerClassName = 'custom-container';
    render(<TextInput containerClassName={containerClassName} />);
    const container = screen.getByRole('textbox').parentElement;
    expect(container).toHaveClass(containerClassName);
  });

  it('applies custom className to label', () => {
    const labelClassName = 'custom-label';
    render(<TextInput label="Test" labelClassName={labelClassName} />);
    expect(screen.getByText('Test')).toHaveClass(labelClassName);
  });

  it('applies custom className to input', () => {
    const inputClassName = 'custom-input';
    render(<TextInput data-testid="test-input" inputClassName={inputClassName} />);
    expect(screen.getByTestId('test-input')).toHaveClass(inputClassName);
  });

  it('applies custom className to error message', () => {
    const errorClassName = 'custom-error';
    render(<TextInput error="Test Error" errorClassName={errorClassName} />);
    expect(screen.getByText('Test Error')).toHaveClass(errorClassName);
  });

  it('handles onChange event', () => {
    const handleChange = jest.fn();
    render(<TextInput data-testid="test-input" onChange={handleChange} />);
    
    const input = screen.getByTestId('test-input');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<TextInput data-testid="test-input" ref={ref} />);
    
    expect(ref.current).toBe(screen.getByTestId('test-input'));
  });

  it('passes through HTML input attributes', () => {
    render(
      <TextInput
        data-testid="test-input"
        placeholder="Test Placeholder"
        disabled
        maxLength={10}
      />
    );
    
    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('placeholder', 'Test Placeholder');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('renders with different input types', () => {
    render(<TextInput data-testid="test-input" type="password" />);
    expect(screen.getByTestId('test-input')).toHaveAttribute('type', 'password');
  });

  it('maintains default type as text when not specified', () => {
    render(<TextInput data-testid="test-input" />);
    expect(screen.getByTestId('test-input')).toHaveAttribute('type', 'text');
  });

  it('handles onBlur event', () => {
    const handleBlur = jest.fn();
    render(<TextInput data-testid="test-input" onBlur={handleBlur} />);
    
    const input = screen.getByTestId('test-input');
    fireEvent.blur(input);
    
    expect(handleBlur).toHaveBeenCalled();
  });

  it('handles onFocus event', () => {
    const handleFocus = jest.fn();
    render(<TextInput data-testid="test-input" onFocus={handleFocus} />);
    
    const input = screen.getByTestId('test-input');
    fireEvent.focus(input);
    
    expect(handleFocus).toHaveBeenCalled();
  });

  it('applies default styles to input', () => {
    render(<TextInput data-testid="test-input" />);
    const input = screen.getByTestId('test-input');
    expect(input).toHaveClass('flex', 'h-9', 'w-full', 'rounded-md', 'border', 'border-input');
  });

  it('applies error styles to error message', () => {
    render(<TextInput data-testid="test-input" error="Error message" />);
    const errorMessage = screen.getByText('Error message');
    expect(errorMessage).toHaveClass('text-sm', 'text-red-500');
  });

  it('applies label default styles', () => {
    render(<TextInput label="Test Label" />);
    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('text-sm', 'font-medium');
  });
}); 