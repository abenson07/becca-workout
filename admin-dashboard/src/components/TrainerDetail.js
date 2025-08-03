import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ClientDetail.css';
import { fetchTrainerById, fetchClientsByTrainerId } from '../utils/supabaseTrainers';
import { fetchClientById } from '../utils/supabaseClients';
import { fetchWorkoutsByTrainerId, groupWorkoutsByClient } from '../utils/supabaseWorkouts';
import Table from './Table';
import TestModal from './modals/TestModal';

function TrainerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);
  const [clientNames, setClientNames] = useState({});
  const [associatedClients, setAssociatedClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);

  const fetchTrainer = async () => {
    try {
      setLoading(true);
      const result = await fetchTrainerById(id);
      if (result.success) {
        setTrainer(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch trainer details');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkouts = async () => {
    try {
      setWorkoutsLoading(true);
      const result = await fetchWorkoutsByTrainerId(id);
      if (result.success) {
        setWorkouts(result.data);
        // Fetch client names for all unique client IDs
        await fetchClientNames(result.data);
      } else {
        console.error('Error fetching workouts:', result.error);
      }
    } catch (err) {
      console.error('Failed to fetch workouts:', err);
    } finally {
      setWorkoutsLoading(false);
    }
  };

  const fetchClientNames = async (workoutsData) => {
    try {
      const uniqueClientIds = [...new Set(workoutsData.map(workout => workout.client_id))];
      const clientNamesMap = {};
      
      for (const clientId of uniqueClientIds) {
        const result = await fetchClientById(clientId);
        if (result.success) {
          clientNamesMap[clientId] = `${result.data.first_name} ${result.data.last_name}`;
        } else {
          clientNamesMap[clientId] = `Client ${clientId}`;
        }
      }
      
      setClientNames(clientNamesMap);
    } catch (err) {
      console.error('Failed to fetch client names:', err);
    }
  };

  useEffect(() => {
    fetchTrainer();
  }, [id]);

  const fetchAssociatedClients = async () => {
    try {
      setClientsLoading(true);
      const result = await fetchClientsByTrainerId(id);
      if (result.success) {
        setAssociatedClients(result.data);
      } else {
        console.error('Error fetching associated clients:', result.error);
      }
    } catch (err) {
      console.error('Failed to fetch associated clients:', err);
    } finally {
      setClientsLoading(false);
    }
  };

  useEffect(() => {
    if (trainer) {
      fetchWorkouts();
      fetchAssociatedClients();
    }
  }, [trainer]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = (updatedTrainer) => {
    if (updatedTrainer === null) {
      // Record was deleted, navigate back to list
      navigate('/trainers');
    } else {
      // Record was updated, refresh the data
      setTrainer(updatedTrainer);
    }
  };

  if (loading) {
    return (
      <div className="client-detail-page px-12 py-8">
        <div className="text-center py-8">Loading trainer details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-detail-page px-12 py-8">
        <div className="text-red-500 py-4">Error loading trainer: {error}</div>
        <button 
          onClick={fetchTrainer}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="client-detail-page px-12 py-8">
        <div className="text-center py-8">Trainer not found</div>
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
            {trainer.profile_picture_url ? (
              <img src={trainer.profile_picture_url} alt="Trainer" className="w-full h-full object-cover rounded-lg" />
            ) : (
              'Image of trainer'
            )}
          </div>
        </div>

        {/* Content Area - 10 columns */}
        <div className="col-span-10">
          {/* Top Row - Name and Edit Button */}
          <div className="flex justify-between items-start mb-6">
            <div className="text-2xl font-semibold">
              {trainer.first_name} {trainer.last_name}
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
              <div className="text-gray-600 mb-4">{trainer.email}</div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">ID</div>
                  <div className="text-sm">{trainer.id}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Date of birth</div>
                  <div className="text-sm">{trainer.date_of_birth || 'Not provided'}</div>
                </div>
              </div>
              
              <div className="w-full">
                <div className="text-sm font-medium text-gray-500 mb-2">Specialties</div>
                {trainer.specialties ? (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {trainer.specialties.split(',').map((specialty, i) => (
                      <button key={i} className="border rounded-full px-3 py-1 text-xs hover:bg-gray-100 transition">
                        {specialty.trim()}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">No specialties listed</span>
                )}
                <button className="border rounded-full px-4 py-1 text-sm hover:bg-gray-100 transition">
                  + Assign client
                </button>
              </div>
            </div>
            
            {/* 1 column gap */}
            <div className="col-span-1"></div>

            {/* Training Notes - 2 columns */}
            <div className="col-span-2">
              <div className="font-semibold mb-2">Bio</div>
              <div className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                {trainer.bio || 'No bio available'}
              </div>
            </div>

            {/* 1 column gap */}
            <div className="col-span-1"></div>

            {/* Injury Notes - 2 columns */}
            <div className="col-span-2">
              <div className="font-semibold mb-2">Certifications</div>
              <div className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                {trainer.certifications || 'No certifications available'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workouts by assigned clients */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold mb-4">Assigned Clients</h3>
        {clientsLoading ? (
          <div className="text-center py-4">Loading assigned clients...</div>
        ) : associatedClients.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No clients assigned to this trainer</div>
        ) : (
          associatedClients.map((client) => {
            const clientWorkouts = workouts.filter(workout => workout.client_id === client.id);
            return (
              <div key={client.id} className="mb-8">
                <div className="flex items-center mb-2">
                  <Link 
                    to={`/client/${client.id}`}
                    className="mr-4 font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {client.first_name} {client.last_name}
                  </Link>
                  <button className="border rounded-full px-3 py-1 text-xs ml-2 hover:bg-gray-100 transition">New workout</button>
                </div>
                {clientWorkouts.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No workouts found for this client
                    <button className="block mx-auto mt-2 border rounded-full px-4 py-1 text-sm hover:bg-gray-100 transition">
                      + Add workout
                    </button>
                  </div>
                ) : (
                  <Table
                    columns={[
                      { key: 'name', label: 'Workout' },
                    ]}
                    data={clientWorkouts.map(workout => ({
                      name: workout.workout_name || 'Unnamed Workout'
                    }))}
                    searchable={true}
                    sortable={true}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Workouts by unassigned clients */}
      {(() => {
        // Filter out workouts from assigned clients
        const assignedClientIds = associatedClients.map(client => client.id);
        const unassignedWorkouts = workouts.filter(workout => !assignedClientIds.includes(workout.client_id));
        
        if (unassignedWorkouts.length === 0) {
          return null; // Don't render anything if no unassigned workouts
        }

        return (
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">Other Workouts</h3>
            {workoutsLoading ? (
              <div className="text-center py-4">Loading workouts...</div>
            ) : (
              Object.entries(groupWorkoutsByClient(unassignedWorkouts)).map(([clientId, clientWorkouts]) => (
                <div key={clientId} className="mb-8">
                  <div className="flex items-center mb-2">
                    <Link 
                      to={`/client/${clientId}`}
                      className="mr-4 font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {clientNames[clientId] || `Client ${clientId}`} <span className="text-gray-500 text-sm">(not assigned)</span>
                    </Link>
                    <button className="border rounded-full px-3 py-1 text-xs ml-2 hover:bg-gray-100 transition">New workout</button>
                  </div>
                  <Table
                    columns={[
                      { key: 'name', label: 'Workout' },
                    ]}
                    data={clientWorkouts.map(workout => ({
                      name: workout.workout_name || 'Unnamed Workout'
                    }))}
                    searchable={true}
                    sortable={true}
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
        entityType="trainer"
        initialData={trainer}
        isAdd={false}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default TrainerDetail;
