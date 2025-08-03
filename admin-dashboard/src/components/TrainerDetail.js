import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ClientDetail.css';
import { fetchTrainerById } from '../utils/supabaseTrainers';
import Table from './Table';

function TrainerDetail() {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrainer();
  }, [id]);

  const fetchTrainer = async () => {
    try {
      setLoading(true);
      const data = await fetchTrainerById(id);
      setTrainer(data);
    } catch (err) {
      console.error('Error fetching trainer:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
      <div className="flex flex-row items-start justify-between mb-8 w-full">
        {/* Image */}
        <div className="border rounded w-48 h-48 flex items-center justify-center text-gray-400 text-center text-sm mr-8 min-w-48">
          {trainer.profile_picture_url ? (
            <img src={trainer.profile_picture_url} alt="Trainer" className="w-full h-full object-cover rounded" />
          ) : (
            'Image of trainer'
          )}
        </div>
        {/* Info and specialties */}
        <div className="flex-1">
          <div className="text-lg font-semibold mb-1">
            {trainer.first_name} {trainer.last_name}
          </div>
          <div className="mb-1">{trainer.email}</div>
          <div className="mb-2">
            ID {trainer.id} &nbsp; 
            {trainer.date_of_birth && `date of birth ${trainer.date_of_birth}`}
          </div>
          <div className="flex flex-row items-center mb-4">
            <span className="mr-2">Specialties:</span>
            {trainer.specialties ? (
              trainer.specialties.split(',').map((specialty, i) => (
                <button key={i} className="border rounded-full px-4 py-1 mx-1 text-sm hover:bg-gray-100 transition">
                  {specialty.trim()}
                </button>
              ))
            ) : (
              <span className="text-gray-500">No specialties listed</span>
            )}
            <button className="border rounded-full px-4 py-1 mx-2 text-sm hover:bg-gray-100 transition">+ Assign client</button>
          </div>
        </div>
        {/* Edit profile button */}
        <div className="ml-8">
          <button className="border rounded-full px-6 py-2 text-sm hover:bg-gray-100 transition">Edit profile</button>
        </div>
      </div>
      <div className="flex flex-row gap-16 w-full">
        <div className="flex-1">
          <div className="font-semibold mb-1">Trainer notes</div>
          <div>{trainer.training_notes || 'No trainer notes available'}</div>
        </div>
        <div className="flex-1">
          <div className="font-semibold mb-1">Injury Notes</div>
          <div>{trainer.injury_notes || 'No injury notes available'}</div>
        </div>
      </div>
      {/* Clients and their workouts - placeholder for now */}
      <div className="mt-12">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <b className="mr-4">Client 1</b>
            <button className="border rounded-full px-3 py-1 text-xs ml-2 hover:bg-gray-100 transition">New workout</button>
          </div>
          <Table
            columns={[
              { key: 'name', label: 'Workout' },
              { key: 'numExercises', label: 'Number of exercises' },
              { key: 'status', label: 'Status' },
            ]}
            data={[
              { name: 'Workout X', numExercises: 6, status: 'Active' },
              { name: 'Workout Y', numExercises: 4, status: 'Completed' },
            ]}
            searchable={true}
            sortable={true}
          />
        </div>
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <b className="mr-4">Client 2</b>
            <button className="border rounded-full px-3 py-1 text-xs ml-2 hover:bg-gray-100 transition">New workout</button>
          </div>
          <Table
            columns={[
              { key: 'name', label: 'Workout' },
              { key: 'numExercises', label: 'Number of exercises' },
              { key: 'status', label: 'Status' },
            ]}
            data={[
              { name: 'Workout Z', numExercises: 5, status: 'Active' },
            ]}
            searchable={true}
            sortable={true}
          />
        </div>
      </div>
    </div>
  );
}

export default TrainerDetail;
