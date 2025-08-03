import React, { useState } from 'react';
import AddEditModal from './AddEditModal';
import ModalForm from './ModalForm';
import { createClient, updateClient } from '../../utils/supabaseClients';
import { createTrainer, updateTrainer } from '../../utils/supabaseTrainers';
import { createMovement, updateMovement } from '../../utils/supabaseMovements';

const TestModal = ({ 
  isOpen, 
  onClose, 
  entityType = 'client', 
  initialData = {},
  isAdd = false,
  onSuccess = null
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (isAdd) {
        // Create new record
        switch (entityType) {
          case 'client':
            result = await createClient(formData);
            break;
          case 'trainer':
            result = await createTrainer(formData);
            break;
          case 'movement':
            result = await createMovement(formData);
            break;
          default:
            throw new Error(`Unknown entity type: ${entityType}`);
        }
      } else {
        // Update existing record
        const entityId = initialData.id;
        if (!entityId) {
          throw new Error('No entity ID provided for update');
        }
        
        switch (entityType) {
          case 'client':
            result = await updateClient(entityId, formData);
            break;
          case 'trainer':
            result = await updateTrainer(entityId, formData);
            break;
          case 'movement':
            result = await updateMovement(entityId, formData);
            break;
          default:
            throw new Error(`Unknown entity type: ${entityType}`);
        }
      }
      
      if (result.success) {
        console.log(`${isAdd ? 'Created' : 'Updated'} ${entityType}:`, result.data);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(result.data);
        }
        
        // Close modal
        onClose();
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
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
      saveText={isLoading ? "Saving..." : (isAdd ? "Create" : "Save")}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
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