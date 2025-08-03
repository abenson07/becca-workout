import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMovementsData } from '../utils/supabaseMovements';
import Table from './Table';
import TestModal from './modals/TestModal';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'description', label: 'Description' },
  { key: 'id', label: 'ID' },
  { key: 'profile_pic', label: 'Profile Picture' },
  { key: 'created_at', label: 'Created At' },
];

function Movements() {
  const navigate = useNavigate();
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const data = await fetchMovementsData();
      setMovements(data);
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
        <h2>Movements</h2>
        <div className="text-center py-8">Loading movements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="clients-page px-12 py-8">
        <h2>Movements</h2>
        <div className="text-red-500 py-4">Error loading movements: {error}</div>
        <button 
          onClick={fetchMovements}
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
        <h2>Movements ({movements.length})</h2>
        <button 
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Movement
        </button>
      </div>
      <Table
        columns={columns}
        data={movements}
        onRowClick={row => navigate(`/movement/${row.id}`)}
        searchable={true}
        sortable={true}
      />
      <TestModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        entityType="movement"
        initialData={{}}
        isAdd={true}
        onSuccess={() => {
          fetchMovements(); // Refresh the movements list
        }}
      />
    </div>
  );
}

export default Movements;
