import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMovementsData } from '../utils/supabaseMovements';
import Table from './Table';

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
      <h2>Movements ({movements.length})</h2>
      <Table
        columns={columns}
        data={movements}
        onRowClick={row => navigate(`/movement/${row.id}`)}
        searchable={true}
        sortable={true}
      />
    </div>
  );
}

export default Movements;
