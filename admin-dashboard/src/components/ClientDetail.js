import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ClientDetail.css';
import { fetchClientById } from '../utils/supabaseClients';
import Table from './Table';
import TestModal from './modals/TestModal';

function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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
                <button className="border rounded-full px-4 py-1 text-sm hover:bg-gray-100 transition">
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
      <TestModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        entityType="client"
        initialData={client}
        isAdd={false}
      />
    </div>
  );
}

export default ClientDetail;
