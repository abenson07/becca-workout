import React from 'react';
import { useNavigate } from 'react-router-dom';
import Table from './Table';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'description', label: 'Description' },
  { key: 'id', label: 'ID' },
  { key: 'profilePic', label: 'profile picture url' },
  { key: 'createdAt', label: 'Created at' },
];

const mockMovements = Array.from({ length: 10 }).map((_, i) => ({
  name: 'Movement name',
  category: 'Category',
  description: 'Description here',
  id: (123456 + i).toString(),
  profilePic: 'profile picture url',
  createdAt: 'Date here',
}));

function Movements() {
  const navigate = useNavigate();
  return (
    <div className="clients-page px-12 py-8">
      <h2>Movements</h2>
      <Table
        columns={columns}
        data={mockMovements}
        onRowClick={row => navigate(`/movement/${row.id}`)}
        searchable={true}
        sortable={true}
      />
    </div>
  );
}

export default Movements;
