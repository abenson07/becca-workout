import React, { useState } from 'react';
import AddEditModal from './AddEditModal';
import ModalForm from './ModalForm';
import ConfirmationModal from './ConfirmationModal';
import { createClient, updateClient, deleteClient } from '../../utils/supabaseClients';
import { createTrainer, updateTrainer, deleteTrainer } from '../../utils/supabaseTrainers';
import { createMovement, updateMovement, deleteMovement } from '../../utils/supabaseMovements';

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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const entityId = initialData.id;
      if (!entityId) {
        throw new Error('No entity ID provided for deletion');
      }
      
      let result;
      switch (entityType) {
        case 'client':
          result = await deleteClient(entityId);
          break;
        case 'trainer':
          result = await deleteTrainer(entityId);
          break;
        case 'movement':
          result = await deleteMovement(entityId);
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
      
      if (result.success) {
        console.log(`Deleted ${entityType}:`, entityId);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(null); // Pass null to indicate deletion
        }
        
        // Close both modals
        setShowDeleteConfirmation(false);
        onClose();
      } else {
        setError(result.error || 'An error occurred during deletion');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'An unexpected error occurred during deletion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  const getDeleteMessage = () => {
    const entityName = entityType.charAt(0).toUpperCase() + entityType.slice(1);
    const displayName = initialData.first_name && initialData.last_name 
      ? `${initialData.first_name} ${initialData.last_name}`
      : initialData.name || entityName;
    
    return `Are you sure you want to delete ${displayName}? This action cannot be undone.`;
  };

  return (
    <>
      <AddEditModal
        isOpen={isOpen && !showDeleteConfirmation}
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
        showDeleteButton={!isAdd} // Only show delete button for edit mode
        onDelete={handleDelete}
        deleteText={`Delete ${entityType}`}
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

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${entityType}`}
        message={getDeleteMessage()}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </>
  );
};

export default TestModal; 