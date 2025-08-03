import React, { useState } from 'react';
import AddEditModal from './AddEditModal';
import ModalForm from './ModalForm';

const TestModal = ({ 
  isOpen, 
  onClose, 
  entityType = 'client', 
  initialData = {},
  isAdd = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted with data:', formData);
    console.log('Entity type:', entityType);
    console.log('Is add mode:', isAdd);
    
    // For now, just close the modal
    onClose();
    setIsLoading(false);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <AddEditModal
      isOpen={isOpen}
      onClose={onClose}
      title={isAdd ? `Add New ${entityType}` : `Edit ${entityType}`}
      onSave={() => {
        // Trigger form submission
        const form = document.querySelector('form');
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }}
      onCancel={handleCancel}
      isLoading={isLoading}
      saveText={isLoading ? "Saving..." : "Save"}
    >
      <ModalForm
        entityType={entityType}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isAdd={isAdd}
      />
    </AddEditModal>
  );
};

export default TestModal; 