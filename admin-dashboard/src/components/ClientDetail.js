import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ClientDetail.css';
import { fetchClientById } from '../utils/supabaseClients';
import Table from './Table';

function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const data = await fetchClientById(id);
      setClient(data);
    } catch (err) {
      console.error('Error fetching client:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
      <div className="flex flex-row items-start justify-between mb-8 w-full">
        {/* Image */}
        <div className="border rounded w-48 h-48 flex items-center justify-center text-gray-400 text-center text-sm mr-8 min-w-48">
          {client.profile_picture_url ? (
            <img src={client.profile_picture_url} alt="Client" className="w-full h-full object-cover rounded" />
          ) : (
            'Image of client'
          )}
        </div>
        {/* Info and trainers */}
        <div className="flex-1">
          <div className="text-lg font-semibold mb-1">
            {client.first_name} {client.last_name}
          </div>
          <div className="mb-1">{client.email}</div>
          <div className="mb-2">
            ID {client.id} &nbsp; 
            {client.date_of_birth && `date of birth ${client.date_of_birth}`}
          </div>
          <div className="flex flex-row items-center mb-4">
            <span className="mr-2">Trainers:</span>
            {/* Placeholder for trainers - you can expand this later */}
            <button className="border rounded-full px-4 py-1 mx-2 text-sm hover:bg-gray-100 transition">+ Assign trainer</button>
          </div>
        </div>
        {/* Edit profile button */}
        <div className="ml-8">
          <button className="border rounded-full px-6 py-2 text-sm hover:bg-gray-100 transition">Edit profile</button>
        </div>
      </div>
      <div className="flex flex-row gap-16 w-full">
        <div className="flex-1">
          <div className="font-semibold mb-1">Training notes</div>
          <div>{client.training_goals || 'No training notes available'}</div>
        </div>
        <div className="flex-1">
          <div className="font-semibold mb-1">Injury Notes</div>
          <div>{client.injury_notes || 'No injury notes available'}</div>
        </div>
      </div>
      {/* Workouts by trainer - placeholder for now */}
      <div className="mt-12">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <b className="mr-4">Trainer 1</b>
            <button className="border rounded-full px-3 py-1 text-xs ml-2 hover:bg-gray-100 transition">Unassign trainer</button>
          </div>
          <Table
            columns={[
              { key: 'name', label: 'Workout' },
              { key: 'numExercises', label: 'Number of exercises' },
            ]}
            data={[
              { name: 'Workout A', numExercises: 5 },
              { name: 'Workout B', numExercises: 3 },
            ]}
            searchable={true}
            sortable={true}
          />
        </div>
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <b className="mr-4">Trainer 2</b>
            <button className="border rounded-full px-3 py-1 text-xs ml-2 hover:bg-gray-100 transition">Unassign trainer</button>
          </div>
          <Table
            columns={[
              { key: 'name', label: 'Workout' },
              { key: 'numExercises', label: 'Number of exercises' },
            ]}
            data={[
              { name: 'Workout C', numExercises: 4 },
            ]}
            searchable={true}
            sortable={true}
          />
        </div>
      </div>
    </div>
  );
}

export default ClientDetail;
