import React, { useState, useEffect } from 'react';
import AddEditModal from './AddEditModal';
import ModalForm from './ModalForm';
import ConfirmationModal from './ConfirmationModal';
import { createClient, updateClient, deleteClient } from '../../utils/supabaseClients';
import { createTrainer, updateTrainer, deleteTrainer } from '../../utils/supabaseTrainers';
import { createMovement, updateMovement, deleteMovement } from '../../utils/supabaseMovements';
import { createWorkout, updateWorkout, deleteWorkout } from '../../utils/supabaseWorkouts';
import { supabase } from '../../supabaseClient';

const TestModal = ({ 
  isOpen, 
  onClose, 
  entityType = 'client', 
  initialData = {},
  isAdd = false,
  onSuccess = null,
  onDelete = null
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [trainersLoading, setTrainersLoading] = useState(false);
  const [assignedTrainers, setAssignedTrainers] = useState([]);
  const [availableClients, setAvailableClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [assignedClients, setAssignedClients] = useState([]);

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
          case 'workout':
            result = await createWorkout(formData);
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
          case 'workout':
            result = await updateWorkout(entityId, formData);
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
          case 'workout':
            result = await deleteWorkout(entityId);
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

  // Fetch available trainers for assignment
  const fetchAvailableTrainers = async (search = '') => {
    if (entityType !== 'trainer-assignment') return;
    
    try {
      setTrainersLoading(true);
      
      // Get all trainers
      let query = supabase
        .from('trainers')
        .select('id, first_name, last_name')
        .order('first_name', { ascending: true });

      // Add search filter if search term exists
      if (search.trim()) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Filter out already assigned trainers
      const assignedTrainerIds = assignedTrainers.map(trainer => trainer.id);
      const filteredTrainers = data.filter(trainer => !assignedTrainerIds.includes(trainer.id));

      // Limit to top 5
      setAvailableTrainers(filteredTrainers.slice(0, 5));
    } catch (err) {
      console.error('Error fetching available trainers:', err);
    } finally {
      setTrainersLoading(false);
    }
  };

  // Initialize assigned trainers when modal opens
  useEffect(() => {
    if (isOpen && entityType === 'trainer-assignment') {
      setAssignedTrainers(initialData.associatedTrainers || []);
    }
  }, [isOpen, entityType]);

  // Initialize assigned clients when modal opens
  useEffect(() => {
    if (isOpen && entityType === 'client-assignment') {
      setAssignedClients(initialData.associatedClients || []);
    }
  }, [isOpen, entityType]);

  // Handle search input changes for trainer assignment
  useEffect(() => {
    if (isOpen && entityType === 'trainer-assignment') {
      fetchAvailableTrainers(searchTerm);
    }
  }, [searchTerm, isOpen, assignedTrainers]);

  // Handle search input changes for client assignment
  useEffect(() => {
    if (isOpen && entityType === 'client-assignment') {
      fetchAvailableClients(searchTerm);
    }
  }, [searchTerm, isOpen, assignedClients]);

  // Handle assigning a trainer
  const handleAssignTrainer = async (trainer) => {
    try {
      const { error } = await supabase
        .from('trainer_client')
        .insert({
          trainer_id: trainer.id,
          client_id: initialData.clientId
        });

      if (error) {
        throw error;
      }

      // Update local state immediately
      const updatedAssignedTrainers = [...assignedTrainers, trainer];
      setAssignedTrainers(updatedAssignedTrainers);
      
      // Call the callback to refresh the parent component
      if (onSuccess) {
        onSuccess(trainer);
      }
      
      // Refresh the available trainers list
      fetchAvailableTrainers(searchTerm);
      
      // Clear any errors
      setError(null);
    } catch (err) {
      console.error('Error assigning trainer:', err);
      setError(err.message);
    }
  };

  // Handle removing a trainer
  const handleRemoveTrainer = async (trainerId) => {
    try {
      const { error } = await supabase
        .from('trainer_client')
        .delete()
        .eq('trainer_id', trainerId)
        .eq('client_id', initialData.clientId);

      if (error) {
        throw error;
      }

      // Update local state immediately
      const updatedAssignedTrainers = assignedTrainers.filter(trainer => trainer.id !== trainerId);
      setAssignedTrainers(updatedAssignedTrainers);
      
      // Call the callback to refresh the parent component
      if (onDelete) {
        onDelete(trainerId);
      }
      
      // Refresh the available trainers list
      fetchAvailableTrainers(searchTerm);
      
      // Clear any errors
      setError(null);
    } catch (err) {
      console.error('Error removing trainer:', err);
      setError(err.message);
    }
  };

  // Fetch available clients for assignment
  const fetchAvailableClients = async (search = '') => {
    if (entityType !== 'client-assignment') return;
    
    try {
      setClientsLoading(true);
      
      // Get all clients
      let query = supabase
        .from('clients')
        .select('id, first_name, last_name')
        .order('first_name', { ascending: true });

      // Add search filter if search term exists
      if (search.trim()) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Filter out already assigned clients
      const assignedClientIds = assignedClients.map(client => client.id);
      const filteredClients = data.filter(client => !assignedClientIds.includes(client.id));

      // Limit to top 5
      setAvailableClients(filteredClients.slice(0, 5));
    } catch (err) {
      console.error('Error fetching available clients:', err);
    } finally {
      setClientsLoading(false);
    }
  };

  // Handle assigning a client
  const handleAssignClient = async (client) => {
    try {
      const { error } = await supabase
        .from('trainer_client')
        .insert({
          trainer_id: initialData.trainerId,
          client_id: client.id
        });

      if (error) {
        throw error;
      }

      // Update local state immediately
      const updatedAssignedClients = [...assignedClients, client];
      setAssignedClients(updatedAssignedClients);
      
      // Call the callback to refresh the parent component
      if (onSuccess) {
        onSuccess(client);
      }
      
      // Refresh the available clients list
      fetchAvailableClients(searchTerm);
      
      // Clear any errors
      setError(null);
    } catch (err) {
      console.error('Error assigning client:', err);
      setError(err.message);
    }
  };

  // Handle removing a client
  const handleRemoveClient = async (clientId) => {
    try {
      const { error } = await supabase
        .from('trainer_client')
        .delete()
        .eq('trainer_id', initialData.trainerId)
        .eq('client_id', clientId);

      if (error) {
        throw error;
      }

      // Update local state immediately
      const updatedAssignedClients = assignedClients.filter(client => client.id !== clientId);
      setAssignedClients(updatedAssignedClients);
      
      // Call the callback to refresh the parent component
      if (onDelete) {
        onDelete(clientId);
      }
      
      // Refresh the available clients list
      fetchAvailableClients(searchTerm);
      
      // Clear any errors
      setError(null);
    } catch (err) {
      console.error('Error removing client:', err);
      setError(err.message);
    }
  };

  const getDeleteMessage = () => {
    const entityName = entityType.charAt(0).toUpperCase() + entityType.slice(1);
    const displayName = initialData.first_name && initialData.last_name 
      ? `${initialData.first_name} ${initialData.last_name}`
      : initialData.name || entityName;
    
    return `Are you sure you want to delete ${displayName}? This action cannot be undone.`;
  };

  // Render trainer assignment modal
  if (entityType === 'trainer-assignment') {
    if (!isOpen) return null;
    
    return (
      <div
        className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trainer-assignment-modal-title"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 id="trainer-assignment-modal-title" className="text-xl font-semibold text-gray-900">
              Trainers
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Assigned Trainers Section */}
            <div className="mb-6">
              {assignedTrainers.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No trainers assigned</div>
              ) : (
                <div className="space-y-2">
                  {assignedTrainers.map((trainer) => (
                    <div key={trainer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{trainer.first_name} {trainer.last_name}</span>
                      <button
                        onClick={() => handleRemoveTrainer(trainer.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label={`Remove ${trainer.first_name} ${trainer.last_name}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Trainer Section */}
            <div>
              <h3 className="font-semibold mb-3">Add trainer</h3>
              <input
                type="text"
                placeholder="search trainers...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {trainersLoading ? (
                <div className="text-center py-4 text-gray-500">Loading trainers...</div>
              ) : availableTrainers.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  {searchTerm ? 'No trainers found' : 'No available trainers'}
                </div>
              ) : (
                <div className="space-y-2">
                  {availableTrainers.map((trainer) => (
                    <div key={trainer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{trainer.first_name} {trainer.last_name}</span>
                      <button
                        onClick={() => handleAssignTrainer(trainer)}
                        className="text-green-500 hover:text-green-700 transition-colors"
                        aria-label={`Add ${trainer.first_name} ${trainer.last_name}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render client assignment modal
  if (entityType === 'client-assignment') {
    if (!isOpen) return null;
    
    return (
      <div
        className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-assignment-modal-title"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 id="client-assignment-modal-title" className="text-xl font-semibold text-gray-900">
              Clients
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Assigned Clients Section */}
            <div className="mb-6">
              {assignedClients.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No clients assigned</div>
              ) : (
                <div className="space-y-2">
                  {assignedClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{client.first_name} {client.last_name}</span>
                      <button
                        onClick={() => handleRemoveClient(client.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label={`Remove ${client.first_name} ${client.last_name}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Client Section */}
            <div>
              <h3 className="font-semibold mb-3">Add client</h3>
              <input
                type="text"
                placeholder="search clients...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {clientsLoading ? (
                <div className="text-center py-4 text-gray-500">Loading clients...</div>
              ) : availableClients.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  {searchTerm ? 'No clients found' : 'No available clients'}
                </div>
              ) : (
                <div className="space-y-2">
                  {availableClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{client.first_name} {client.last_name}</span>
                      <button
                        onClick={() => handleAssignClient(client)}
                        className="text-green-500 hover:text-green-700 transition-colors"
                        aria-label={`Add ${client.first_name} ${client.last_name}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render workout modal (creation or editing)
  if (entityType === 'workout') {
    if (!isOpen) return null;
    
    return (
      <>
        <div
          className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="workout-modal-title"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="workout-modal-title" className="text-xl font-semibold text-gray-900">
                {isAdd ? 'Create New Workout' : 'Edit Workout'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const workoutData = {
                  workout_name: formData.get('workout_name'),
                  ...(isAdd && {
                    trainer_id: initialData.trainer_id,
                    client_id: initialData.client_id
                  })
                };
                handleSubmit(workoutData);
              }}>
                <div className="mb-4">
                  <label htmlFor="workout_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    id="workout_name"
                    name="workout_name"
                    required
                    defaultValue={!isAdd ? initialData.workout_name : ''}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter workout name..."
                  />
                </div>

                <div className="flex justify-between">
                  {!isAdd && onDelete && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  )}
                  <div className="flex space-x-3 ml-auto">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (isAdd ? "Creating..." : "Saving...") : (isAdd ? "Create Workout" : "Save Changes")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <ConfirmationModal
          isOpen={showDeleteConfirmation}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Workout"
          message="Are you sure you want to delete this workout? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={isLoading}
        />
      </>
    );
  }

  // Render regular modal for other entity types
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