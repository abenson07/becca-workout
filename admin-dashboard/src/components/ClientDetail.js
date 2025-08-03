import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ClientDetail.css';
import { fetchClientById } from '../utils/supabaseClients';
import Table from './Table';
import TestModal from './modals/TestModal';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    fetchClient();
  }, [id]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Client not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Profile Image */}
          <div className="col-span-2">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {client.profile_picture_url ? (
                <img 
                  src={client.profile_picture_url} 
                  alt={`${client.first_name} ${client.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
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
                    {client.first_name} {client.last_name}
                  </h1>
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit profile
                  </button>
                </div>
              </div>

              {/* Bottom Row - Profile Info and Notes */}
              <div className="col-span-10">
                <div className="grid grid-cols-10 gap-6">
                  {/* Profile Info */}
                  <div className="col-span-3">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{client.email || 'No email provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ID</label>
                        <p className="mt-1 text-sm text-gray-900">{client.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {client.date_of_birth ? new Date(client.date_of_birth).toLocaleDateString() : 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Trainer</label>
                        <p className="mt-1 text-sm text-gray-900">{client.trainer_name || 'No trainer assigned'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Gap */}
                  <div className="col-span-1"></div>

                  {/* Training Notes */}
                  <div className="col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Training Goals</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {client.training_goals || 'No training goals available'}
                      </p>
                    </div>
                  </div>

                  {/* Gap */}
                  <div className="col-span-1"></div>

                  {/* Injury Notes */}
                  <div className="col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Injury Notes</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {client.injury_notes || 'No injury notes available'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workouts Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Workouts</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-500">No workouts available</p>
            </div>
          </div>

          {/* Relationships Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Trainer Relationships</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-500">No relationships available</p>
            </div>
          </div>
        </div>
      </div>

      <TestModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        entityType="client"
        initialData={client}
        isAdd={false}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default ClientDetail;
