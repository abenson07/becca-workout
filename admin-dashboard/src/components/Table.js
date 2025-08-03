import React, { useState } from 'react';

export default function Table({ columns, data, onRowClick, searchable = true, sortable = true }) {
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  // Filter
  const filtered = data.filter(row =>
    !search
      ? true
      : columns.some(col =>
          String(row[col.key] ?? '').toLowerCase().includes(search.toLowerCase())
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
    if (!sortable) return;
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  }

  return (
    <div className="w-full">
      {searchable && (
        <div className="flex justify-end mb-2">
          <input
            className="border rounded px-3 py-2 w-64 text-sm"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-2 text-left font-semibold cursor-pointer select-none whitespace-nowrap ${sortable ? 'hover:bg-gray-100' : ''}`}
                >
                  {col.label}
                  {sortCol === col.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-gray-100 transition cursor-pointer"
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-2 border-t whitespace-nowrap">{row[col.key]}</td>
                ))}
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">No results found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 