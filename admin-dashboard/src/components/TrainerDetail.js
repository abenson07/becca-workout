import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ClientDetail.css';
import { fetchTrainerById } from '../utils/supabaseTrainers';
import Table from './Table';
import TestModal from './modals/TestModal';

function TrainerDetail() {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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

      <TestModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        entityType="trainer"
        initialData={trainer}
        isAdd={false}
      />
    </div>
  );
}

export default TrainerDetail;
