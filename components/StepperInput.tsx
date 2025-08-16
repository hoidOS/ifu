import React from 'react';

interface StepperInputProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
  onWheel?: (e: React.WheelEvent<HTMLInputElement>) => void;
}

// Stepper input component with increment/decrement buttons
const StepperInput: React.FC<StepperInputProps> = ({
  value,
  onChange,
  step = 1,
  min = 0,
  max,
  placeholder,
  className = "",
  onWheel
}) => {
  const handleDecrement = () => {
    // Fix floating point precision issues by rounding to appropriate decimal places
    const decimals = step < 1 ? String(step).split('.')[1]?.length || 0 : 0;
    const newValue = Math.max(min, parseFloat(((value || 0) - step).toFixed(decimals)));
    onChange(newValue);
  };
  
  const handleIncrement = () => {
    // Fix floating point precision issues by rounding to appropriate decimal places
    const decimals = step < 1 ? String(step).split('.')[1]?.length || 0 : 0;
    const newValue = max ? Math.min(max, parseFloat(((value || 0) + step).toFixed(decimals))) : parseFloat(((value || 0) + step).toFixed(decimals));
    onChange(newValue);
  };

  return (
    <div className="relative flex items-center">
      {/* Minus Button */}
      <button
        onClick={handleDecrement}
        className="w-8 h-8 flex items-center justify-center border border-r-0 border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-l-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:bg-gray-100"
        type="button"
        tabIndex={-1}
      >
        <span className="text-gray-600 font-bold text-lg leading-none">−</span>
      </button>
      
      {/* Input Field */}
      <input
        type="number"
        value={isNaN(value) ? '' : value}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        onWheel={onWheel}
        placeholder={placeholder}
        className={`flex-1 px-3 py-2 border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent focus:z-10 text-center ${className}`}
        step={step}
        min={min}
        max={max}
      />
      
      {/* Plus Button */}
      <button
        onClick={handleIncrement}
        className="w-8 h-8 flex items-center justify-center border border-l-0 border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-r-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:bg-gray-100"
        type="button"
        tabIndex={-1}
      >
        <span className="text-gray-600 font-bold text-lg leading-none">+</span>
      </button>
    </div>
  );
};

export default StepperInput;