import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ClientDetail.css';
import { fetchMovementById } from '../utils/supabaseMovements';
import Table from './Table';
import TestModal from './modals/TestModal';

const MovementDetail = () => {
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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!movement) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Movement not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Movement Image */}
          <div className="col-span-2">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {movement.profile_picture_url ? (
                <img 
                  src={movement.profile_picture_url} 
                  alt={movement.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="col-span-10">
            <div className="grid grid-cols-10 gap-6">
              {/* Top Row - Name and Edit Button */}
              <div className="col-span-10">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {movement.name}
                  </h1>
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit movement
                  </button>
                </div>
              </div>

              {/* Bottom Row - Movement Info and Details */}
              <div className="col-span-10">
                <div className="grid grid-cols-10 gap-6">
                  {/* Movement Info */}
                  <div className="col-span-3">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ID</label>
                        <p className="mt-1 text-sm text-gray-900">{movement.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <p className="mt-1 text-sm text-gray-900">{movement.type || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <p className="mt-1 text-sm text-gray-900">{movement.category || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Equipment</label>
                        <p className="mt-1 text-sm text-gray-900">{movement.equipment || 'No equipment required'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Gap */}
                  <div className="col-span-1"></div>

                  {/* Muscle Groups */}
                  <div className="col-span-2">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Primary Muscle</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {movement.primary_muscle || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Secondary Muscle</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {movement.secondary_muscle || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Gap */}
                  <div className="col-span-1"></div>

                  {/* Description */}
                  <div className="col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {movement.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Instructions</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700">
              {movement.instructions || 'No instructions available'}
            </p>
          </div>
        </div>

        {/* Usage Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workouts Using This Movement */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Workouts Using This Movement</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-500">No workouts found using this movement</p>
            </div>
          </div>

          {/* Related Movements */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Related Movements</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-500">No related movements found</p>
            </div>
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
};

export default MovementDetail;
