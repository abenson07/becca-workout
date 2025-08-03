import React from 'react';

const FieldRenderer = ({ 
  field, 
  value, 
  onChange, 
  error 
}) => {
  const { key, label, type, required, placeholder, options } = field;

  const handleChange = (e) => {
    const newValue = type === 'checkbox' ? e.target.checked : e.target.value;
    onChange(key, newValue);
  };

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={key}
            name={key}
            value={value || ''}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            id={key}
            name={key}
            value={value || ''}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            id={key}
            name={key}
            value={value || ''}
            onChange={handleChange}
            required={required}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );

      case 'select':
        return (
          <select
            id={key}
            name={key}
            value={value || ''}
            onChange={handleChange}
            required={required}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select {label}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={key}
            name={key}
            checked={value || false}
            onChange={handleChange}
            className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
              error ? 'border-red-500' : ''
            }`}
          />
        );

      case 'file':
        return (
          <input
            type="file"
            id={key}
            name={key}
            onChange={handleChange}
            accept="image/*"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );

      default: // text, number, etc.
        return (
          <input
            type={type || 'text'}
            id={key}
            name={key}
            value={value || ''}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <label 
        htmlFor={key} 
        className={`block text-sm font-medium text-gray-700 mb-1 ${
          type === 'checkbox' ? 'flex items-center' : ''
        }`}
      >
        {type === 'checkbox' && renderField()}
        <span className={type === 'checkbox' ? 'ml-2' : ''}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>
      {type !== 'checkbox' && renderField()}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FieldRenderer; 