import React, { useState, useEffect } from 'react';
import FieldRenderer from './FieldRenderer';
import { getEntityConfig } from './entityConfigs';

const ModalForm = ({ 
  entityType, 
  initialData = {}, 
  onSubmit, 
  onCancel,
  isAdd = false 
}) => {
  const config = getEntityConfig(entityType, isAdd);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data with initial values
  useEffect(() => {
    const initialFormData = {};
    config.fields.forEach(field => {
      initialFormData[field.key] = initialData[field.key] || '';
    });
    setFormData(initialFormData);
  }, [initialData, config.fields]);

  const handleFieldChange = (fieldKey, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldKey]) {
      setErrors(prev => ({
        ...prev,
        [fieldKey]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    config.fields.forEach(field => {
      const value = formData[field.key];
      
      // Required field validation
      if (field.required && (!value || value.trim() === '')) {
        newErrors[field.key] = `${field.label} is required`;
      }
      
      // Email validation
      if (field.type === 'email' && value && !isValidEmail(value)) {
        newErrors[field.key] = 'Please enter a valid email address';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      // Handle submission errors here if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {config.fields.map(field => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={formData[field.key]}
          onChange={handleFieldChange}
          error={errors[field.key]}
        />
      ))}
      
      {/* Hidden submit button for form validation */}
      <button type="submit" style={{ display: 'none' }}>
        Submit
      </button>
    </form>
  );
};

export default ModalForm; 