import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchClientsData, getClientsColumns } from '../utils/supabaseClients';
import Table from './Table';
import TestModal from './modals/TestModal';

const columns = [
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'id', label: 'ID' },
  { key: 'date_of_birth', label: 'Date of Birth' },
  { key: 'created_at', label: 'Created At' },
];

function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await fetchClientsData();
      setClients(data);
    } catch (err) {
      console.error('Supabase error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="clients-page px-12 py-8">
        <h2>Clients</h2>
        <div className="text-center py-8">Loading clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="clients-page px-12 py-8">
        <h2>Clients</h2>
        <div className="text-red-500 py-4">Error loading clients: {error}</div>
        <button 
          onClick={fetchClients}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="clients-page px-12 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2>Clients ({clients.length})</h2>
        <button 
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Client
        </button>
      </div>
      <Table
        columns={columns}
        data={clients}
        onRowClick={row => navigate(`/client/${row.id}`)}
        searchable={true}
        sortable={true}
      />
      <TestModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        entityType="client"
        initialData={{}}
        isAdd={true}
        onSuccess={() => {
          fetchClients(); // Refresh the clients list
        }}
      />
    </div>
  );
}

export default Clients;
