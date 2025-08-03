import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ClientDetail.css';
import { fetchMovementById } from '../utils/supabaseMovements';
import Table from './Table';
import TestModal from './modals/TestModal';

function MovementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movement, setMovement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMovement = async () => {
    try {
      setLoading(true);
      const result = await fetchMovementById(id);
      if (result.success) {
        setMovement(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch movement details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovement();
  }, [id]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = (updatedMovement) => {
    if (updatedMovement === null) {
      // Record was deleted, navigate back to list
      navigate('/movements');
    } else {
      // Record was updated, refresh the data
      setMovement(updatedMovement);
    }
  };

  if (loading) {
    return (
      <div className="client-detail-page px-12 py-8">
        <div className="text-center py-8">Loading movement details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-detail-page px-12 py-8">
        <div className="text-red-500 py-4">Error loading movement: {error}</div>
        <button 
          onClick={fetchMovement}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!movement) {
    return (
      <div className="client-detail-page px-12 py-8">
        <div className="text-center py-8">Movement not found</div>
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
            {movement.profile_picture_url ? (
              <img src={movement.profile_picture_url} alt="Movement" className="w-full h-full object-cover rounded-lg" />
            ) : (
              'Image of movement'
            )}
          </div>
        </div>

        {/* Content Area - 10 columns */}
        <div className="col-span-10">
          {/* Top Row - Name and Edit Button */}
          <div className="flex justify-between items-start mb-6">
            <div className="text-2xl font-semibold">
              {movement.name}
            </div>
            <button
              onClick={handleEditClick}
              className="border rounded-lg px-6 py-2 text-sm hover:bg-gray-100 transition"
            >
              Edit movement
            </button>
          </div>
          
          {/* Bottom Row - Movement Info and Details */}
          <div className="grid grid-cols-10 gap-4">
            {/* Movement Info - 3 columns */}
            <div className="col-span-3">
              <div className="text-gray-600 mb-4">
                <span className="font-medium">Type:</span> {movement.type || 'Not specified'}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Category</div>
                  <div className="text-sm">{movement.category || 'Not specified'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Equipment</div>
                  <div className="text-sm">{movement.equipment || 'None'}</div>
                </div>
              </div>
              
              <div className="w-full">
                <div className="text-sm font-medium text-gray-500 mb-2">Muscle Groups</div>
                <div className="text-sm mb-2">
                  <span className="font-medium">Primary:</span> {movement.primary_muscle || 'Not specified'}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Secondary:</span> {movement.secondary_muscle || 'None'}
                </div>
              </div>
            </div>
            
            {/* 1 column gap */}
            <div className="col-span-1"></div>

            {/* Description - 2 columns */}
            <div className="col-span-2">
              <div className="font-semibold mb-2">Description</div>
              <div className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                {movement.description || 'No description available'}
              </div>
            </div>

            {/* 1 column gap */}
            <div className="col-span-1"></div>

            {/* Instructions - 2 columns */}
            <div className="col-span-2">
              <div className="font-semibold mb-2">Instructions</div>
              <div className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                {movement.instructions || 'No instructions available'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workouts table - placeholder for now */}
      <div className="mt-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Workouts</h3>
            <button className="border rounded-full px-4 py-1 text-sm hover:bg-gray-100 transition">
              + Add to workout
            </button>
          </div>
          <div className="text-gray-500 text-center py-8">
            Workout data will be displayed here when connected to the workouts table
          </div>
        </div>
      </div>

      <TestModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        entityType="movement"
        initialData={movement}
        isAdd={false}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default MovementDetail;
