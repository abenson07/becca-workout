import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrainersData } from '../utils/supabaseTrainers';
import Table from './Table';

const columns = [
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'id', label: 'ID' },
  { key: 'profile_pic', label: 'Profile Picture' },
  { key: 'specialties', label: 'Specialties' },
  { key: 'clients', label: 'Clients' },
  { key: 'created_at', label: 'Created At' },
];

function Trainers() {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const data = await fetchTrainersData();
      setTrainers(data);
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
        <h2>Trainers</h2>
        <div className="text-center py-8">Loading trainers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="clients-page px-12 py-8">
        <h2>Trainers</h2>
        <div className="text-red-500 py-4">Error loading trainers: {error}</div>
        <button 
          onClick={fetchTrainers}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="clients-page px-12 py-8">
      <h2>Trainers ({trainers.length})</h2>
      <Table
        columns={columns}
        data={trainers}
        onRowClick={row => navigate(`/trainer/${row.id}`)}
        searchable={true}
        sortable={true}
      />
    </div>
  );
}

export default Trainers;
