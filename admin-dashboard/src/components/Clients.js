import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Clients.css';

const mockClients = Array.from({ length: 10 }).map((_, i) => ({
  firstName: 'Name here',
  lastName: 'Name here',
  email: 'Email@email.com',
  id: (5616586 + i).toString(),
  profilePic: 'profile picture url',
  dob: 'date of birth',
  createdAt: 'Date here',
}));

const columns = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'id', label: 'ID' },
  { key: 'profilePic', label: 'profile picture url' },
  { key: 'dob', label: 'date of birth' },
  { key: 'createdAt', label: 'Created at' },
];

function Clients() {
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const navigate = useNavigate();

  // Filter
  const filtered = mockClients.filter(row =>
    columns.some(col =>
      row[col.key].toLowerCase().includes(search.toLowerCase())
    )
  );

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    if (a[sortCol] < b[sortCol]) return sortDir === 'asc' ? -1 : 1;
    if (a[sortCol] > b[sortCol]) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  function handleSort(col) {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  }

  return (
    <div className="clients-page">
      <h2>Clients</h2>
      <div className="clients-controls">
        <button className="clients-filter-btn">Filters</button>
        <input
          className="clients-search"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <table className="clients-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                {col.label}
                {sortCol === col.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((c, i) => (
            <tr
              key={i}
              className="clickable-row"
              onClick={() => navigate(`/client/${c.id}`)}
              style={{ cursor: 'pointer' }}
            >
              {columns.map(col => (
                <td key={col.key}>{c[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clients;
