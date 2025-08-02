import React, { useState } from 'react';
import './Clients.css';

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
  id: '123456',
  profilePic: 'profile picture url',
  createdAt: 'Date here',
}));

function Movements() {
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  const filtered = mockMovements.filter(row =>
    columns.some(col =>
      row[col.key].toLowerCase().includes(search.toLowerCase())
    )
  );

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
      <h2>Movements</h2>
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
            <tr key={i}>
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

export default Movements;
