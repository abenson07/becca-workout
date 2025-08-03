import React from 'react';
import { useNavigate } from 'react-router-dom';
import Table from './Table';

const columns = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'id', label: 'ID' },
  { key: 'profilePic', label: 'profile picture url' },
  { key: 'specialties', label: 'Specialties' },
  { key: 'clients', label: 'Clients' },
  { key: 'createdAt', label: 'Created at' },
];

const mockTrainers = Array.from({ length: 10 }).map((_, i) => ({
  firstName: 'Name here',
  lastName: 'Name here',
  email: 'Email@email.com',
  id: (5616586 + i).toString(),
  profilePic: 'profile picture url',
  specialties: 'List of specialties',
  clients: 'Number of clients',
  createdAt: 'Date here',
}));

function Trainers() {
  const navigate = useNavigate();
  return (
    <div className="clients-page px-12 py-8">
      <h2>Trainers</h2>
      <Table
        columns={columns}
        data={mockTrainers}
        onRowClick={row => navigate(`/trainer/${row.id}`)}
        searchable={true}
        sortable={true}
      />
    </div>
  );
}

export default Trainers;
