import React from 'react';
import Table from './Table';

const columns = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'id', label: 'ID' },
  { key: 'createdAt', label: 'Created at' },
];

const mockAdmins = Array.from({ length: 10 }).map((_, i) => ({
  firstName: 'Name here',
  lastName: 'Name here',
  email: 'Email@email.com',
  id: (5616586 + i).toString(),
  createdAt: 'Date here',
}));

function Admin() {
  return (
    <div className="clients-page px-12 py-8">
      <h2>Admins</h2>
      <Table
        columns={columns}
        data={mockAdmins}
        searchable={true}
        sortable={true}
      />
    </div>
  );
}

export default Admin;
