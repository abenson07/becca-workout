import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ClientDetail.css';
import { fetchClientById, fetchTrainersByClientId } from '../utils/supabaseClients';
import { fetchTrainerById } from '../utils/supabaseTrainers';
import { fetchWorkoutsByClientId, groupWorkoutsByTrainer } from '../utils/supabaseWorkouts';
import { supabase } from '../supabaseClient';
import Table from './Table';
import TestModal from './modals/TestModal';

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrainerAssignmentModalOpen, setIsTrainerAssignmentModalOpen] = useState(false);
  const [isWorkoutCreationModalOpen, setIsWorkoutCreationModalOpen] = useState(false);
  const [isWorkoutEditModalOpen, setIsWorkoutEditModalOpen] = useState(false);
  const [selectedTrainerForWorkout, setSelectedTrainerForWorkout] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);
  const [trainerNames, setTrainerNames] = useState({});
  const [associatedTrainers, setAssociatedTrainers] = useState([]);
  const [trainersLoading, setTrainersLoading] = useState(false);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const result = await fetchClientById(id);
      if (result.success) {
        setClient(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch client details');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkouts = async () => {
    try {
      setWorkoutsLoading(true);
      const result = await fetchWorkoutsByClientId(id);
      if (result.success) {
        setWorkouts(result.data);
        // Fetch trainer names for all unique trainer IDs
        await fetchTrainerNames(result.data);
      } else {
        console.error('Error fetching workouts:', result.error);
      }
    } catch (err) {
      console.error('Failed to fetch workouts:', err);
    } finally {
      setWorkoutsLoading(false);
    }
  };

  const fetchTrainerNames = async (workoutsData) => {
    try {
      const uniqueTrainerIds = [...new Set(workoutsData.map(workout => workout.trainer_id))];
      const trainerNamesMap = {};
      
      for (const trainerId of uniqueTrainerIds) {
        const result = await fetchTrainerById(trainerId);
        if (result.success) {
          trainerNamesMap[trainerId] = `${result.data.first_name} ${result.data.last_name}`;
        } else {
          trainerNamesMap[trainerId] = `Trainer ${trainerId}`;
        }
      }
      
      setTrainerNames(trainerNamesMap);
    } catch (err) {
      console.error('Failed to fetch trainer names:', err);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchAssociatedTrainers = async () => {
    try {
      setTrainersLoading(true);
      const result = await fetchTrainersByClientId(id);
      if (result.success) {
        setAssociatedTrainers(result.data);
      } else {
        console.error('Error fetching associated trainers:', result.error);
      }
    } catch (err) {
      console.error('Failed to fetch associated trainers:', err);
    } finally {
      setTrainersLoading(false);
    }
  };

  useEffect(() => {
    if (client) {
      fetchWorkouts();
      fetchAssociatedTrainers();
    }
  }, [client]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTrainerAssignmentClick = () => {
    setIsTrainerAssignmentModalOpen(true);
  };

  const handleTrainerAssignmentClose = () => {
    setIsTrainerAssignmentModalOpen(false);
  };

  const handleTrainerAssigned = (trainer) => {
    // Refresh the associated trainers list
    fetchAssociatedTrainers();
  };

  const handleTrainerRemoved = (trainerId) => {
    // Refresh the associated trainers list
    fetchAssociatedTrainers();
  };

  const handleUnassignTrainer = async (trainerId) => {
    try {
      const { error } = await supabase
        .from('trainer_client')
        .delete()
        .eq('trainer_id', trainerId)
        .eq('client_id', id);

      if (error) {
        throw error;
      }

      // Refresh the associated trainers list
      fetchAssociatedTrainers();
    } catch (err) {
      console.error('Error unassigning trainer:', err);
      // You might want to show an error message to the user here
    }
  };

  const handleWorkoutCreationClick = (trainer) => {
    setSelectedTrainerForWorkout(trainer);
    setIsWorkoutCreationModalOpen(true);
  };

  const handleWorkoutCreationClose = () => {
    setIsWorkoutCreationModalOpen(false);
    setSelectedTrainerForWorkout(null);
  };

  const handleWorkoutCreated = (workout) => {
    // Refresh the workouts list
    fetchWorkouts();
  };

  const handleWorkoutRowClick = (workout) => {
    setSelectedWorkout(workout);
    setIsWorkoutEditModalOpen(true);
  };

  const handleWorkoutEditClose = () => {
    setIsWorkoutEditModalOpen(false);
    setSelectedWorkout(null);
  };

  const handleWorkoutUpdated = (workout) => {
    // Refresh the workouts list
    fetchWorkouts();
  };

  const handleWorkoutDeleted = (workoutId) => {
    // Refresh the workouts list
    fetchWorkouts();
  };

  const handleSuccess = (updatedClient) => {
    if (updatedClient === null) {
      // Record was deleted, navigate back to list
      navigate('/clients');
    } else {
      // Record was updated, refresh the data
      setClient(updatedClient);
    }
  };

  if (loading) {
    return (
      <div className="client-detail-page px-12 py-8">
        <div className="text-center py-8">Loading client details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-detail-page px-12 py-8">
        <div className="text-red-500 py-4">Error loading client: {error}</div>
        <button 
          onClick={fetchClient}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="client-detail-page px-12 py-8">
        <div className="text-center py-8">Client not found</div>
      </div>
    );
  }

  return (
    <div className="client-detail-page px-12 py-8">
      {/* Header Section - 12 columns */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Profile Image - 2 columns, 1:1 ratio */}
        <div className="col-span-2">
          <div className="aspect-square border rounded-lg flex items-center justify-center text-gray-400 text-center text-sm">
            {client.profile_picture_url ? (
              <img src={client.profile_picture_url} alt="Client" className="w-full h-full object-cover rounded-lg" />
            ) : (
              'Image of client'
            )}
          </div>
        </div>

        {/* Content Area - 10 columns */}
        <div className="col-span-10">
          {/* Top Row - Name and Edit Button */}
          <div className="flex justify-between items-start mb-6">
            <div className="text-2xl font-semibold">
              {client.first_name} {client.last_name}
            </div>
            <button
              onClick={handleEditClick}
              className="border rounded-lg px-6 py-2 text-sm hover:bg-gray-100 transition"
            >
              Edit profile
            </button>
          </div>

          {/* Bottom Row - Profile Info and Notes */}
          <div className="grid grid-cols-10 gap-4">
            {/* Profile Info - 3 columns */}
            <div className="col-span-3">
              <div className="text-gray-600 mb-4">{client.email}</div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">ID</div>
                  <div className="text-sm">{client.id}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Date of birth</div>
                  <div className="text-sm">{client.date_of_birth || 'Not provided'}</div>
                </div>
              </div>
              
              <div className="w-full">
                <div className="text-sm font-medium text-gray-500 mb-2">Trainers</div>
                {trainersLoading ? (
                  <div className="text-sm text-gray-500">Loading trainers...</div>
                ) : associatedTrainers.length === 0 ? (
                  <div className="text-sm text-gray-500 mb-2">No trainers assigned</div>
                ) : (
                  <div className="mb-2">
                    {associatedTrainers.map((trainer) => (
                      <Link
                        key={trainer.id}
                        to={`/trainer/${trainer.id}`}
                        className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors mb-1"
                      >
                        {trainer.first_name} {trainer.last_name}
                      </Link>
                    ))}
                  </div>
                )}
                <button 
                  onClick={handleTrainerAssignmentClick}
                  className="border rounded-full px-4 py-1 text-sm hover:bg-gray-100 transition"
                >
                  + Assign trainer
                </button>
              </div>
            </div>
            
            {/* 1 column gap */}
            <div className="col-span-1"></div>

            {/* Training Notes - 2 columns */}
            <div className="col-span-2">
              <div className="font-semibold mb-2">Training notes</div>
              <div className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                {client.training_goals || 'No training notes available'}
              </div>
            </div>

            {/* 1 column gap */}
            <div className="col-span-1"></div>

            {/* Injury Notes - 2 columns */}
            <div className="col-span-2">
              <div className="font-semibold mb-2">Injury Notes</div>
              <div className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                {client.injury_notes || 'No injury notes available'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workouts by assigned trainers */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold mb-4">Assigned Trainers</h3>
        {trainersLoading ? (
          <div className="text-center py-4">Loading assigned trainers...</div>
        ) : associatedTrainers.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No trainers assigned to this client</div>
        ) : (
          associatedTrainers.map((trainer) => {
            const trainerWorkouts = workouts.filter(workout => workout.trainer_id === trainer.id);
            return (
              <div key={trainer.id} className="mb-8">
                <div className="flex items-center mb-2">
                  <Link 
                    to={`/trainer/${trainer.id}`}
                    className="mr-4 font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {trainer.first_name} {trainer.last_name}
                  </Link>
                  <button 
                    onClick={() => handleUnassignTrainer(trainer.id)}
                    className="border rounded-full px-3 py-1 text-xs ml-2 hover:bg-gray-100 transition"
                  >
                    Unassign trainer
                  </button>
                </div>
                {trainerWorkouts.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No workouts found for this trainer
                    <button 
                      onClick={() => handleWorkoutCreationClick(trainer)}
                      className="block mx-auto mt-2 border rounded-full px-4 py-1 text-sm hover:bg-gray-100 transition"
                    >
                      + Add workout
                    </button>
                  </div>
                ) : (
                  <Table
                    columns={[
                      { key: 'name', label: 'Workout' },
                    ]}
                    data={trainerWorkouts.map(workout => ({
                      ...workout,
                      name: workout.workout_name || 'Unnamed Workout'
                    }))}
                    searchable={true}
                    sortable={true}
                    onRowClick={handleWorkoutRowClick}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Workouts by unassigned trainers */}
      {(() => {
        // Filter out workouts from assigned trainers
        const assignedTrainerIds = associatedTrainers.map(trainer => trainer.id);
        const unassignedWorkouts = workouts.filter(workout => !assignedTrainerIds.includes(workout.trainer_id));
        
        if (unassignedWorkouts.length === 0) {
          return null; // Don't render anything if no unassigned workouts
        }

        return (
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">Other Workouts</h3>
            {workoutsLoading ? (
              <div className="text-center py-4">Loading workouts...</div>
            ) : (
              Object.entries(groupWorkoutsByTrainer(unassignedWorkouts)).map(([trainerId, trainerWorkouts]) => (
                <div key={trainerId} className="mb-8">
                  <div className="flex items-center mb-2">
                    <Link 
                      to={`/trainer/${trainerId}`}
                      className="mr-4 font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {trainerNames[trainerId] || `Trainer ${trainerId}`} <span className="text-gray-500 text-sm">(not assigned)</span>
                    </Link>
                    <button 
                      onClick={() => handleUnassignTrainer(trainerId)}
                      className="border rounded-full px-3 py-1 text-xs ml-2 hover:bg-gray-100 transition"
                    >
                      Unassign trainer
                    </button>
                  </div>
                  <Table
                    columns={[
                      { key: 'name', label: 'Workout' },
                    ]}
                    data={trainerWorkouts.map(workout => ({
                      ...workout,
                      name: workout.workout_name || 'Unnamed Workout'
                    }))}
                    searchable={true}
                    sortable={true}
                    onRowClick={handleWorkoutRowClick}
                  />
                </div>
              ))
            )}
          </div>
        );
      })()}

      <TestModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        entityType="client"
        initialData={client}
        isAdd={false}
        onSuccess={handleSuccess}
      />

      <TestModal 
        isOpen={isTrainerAssignmentModalOpen} 
        onClose={handleTrainerAssignmentClose} 
        entityType="trainer-assignment"
        initialData={{ clientId: id, associatedTrainers }}
        isAdd={true}
        onSuccess={handleTrainerAssigned}
        onDelete={handleTrainerRemoved}
      />

      <TestModal 
        isOpen={isWorkoutCreationModalOpen} 
        onClose={handleWorkoutCreationClose} 
        entityType="workout"
        initialData={{ 
          client_id: id, 
          trainer_id: selectedTrainerForWorkout?.id 
        }}
        isAdd={true}
        onSuccess={handleWorkoutCreated}
      />

      <TestModal 
        isOpen={isWorkoutEditModalOpen} 
        onClose={handleWorkoutEditClose} 
        entityType="workout"
        initialData={selectedWorkout}
        isAdd={false}
        onSuccess={handleWorkoutUpdated}
        onDelete={handleWorkoutDeleted}
      />
    </div>
  );
}

export default ClientDetail;
