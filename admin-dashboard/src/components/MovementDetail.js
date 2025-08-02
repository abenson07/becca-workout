import React, { useState } from 'react';
import './ClientDetail.css';

const mockMovement = {
  name: 'Movement name',
  type: 'Type',
  category: 'Category',
  equipment: 'Equipment',
  defaultUnit: 'Equipment',
  weighted: 'Yes',
  time: 'No',
  primaryMuscle: 'Muscle, muscle',
  secondaryMuscle: 'Muscle, muscle',
  description: 'Meet our dedicated trainer! Passionate about helping clients achieve their fitness goals, they focus on personalized training plans that cater to individual preferences and needs. With a keen eye for what makes a gym experience enjoyable, they ensure every session is effective and motivating.',
  instructions: 'Meet our dedicated trainer! Passionate about helping clients achieve their fitness goals, they focus on personalized training plans that cater to individual preferences and needs. With a keen eye for what makes a gym experience enjoyable, they ensure every session is effective and motivating.',
  workouts: Array.from({ length: 8 }).map((_, i) => ({
    exerciseId: (6519689 + i).toString(),
    workoutName: 'Workout',
    trainer: 'Trainer name',
    client: 'Client name',
    rep: 16,
    sets: 3,
  })),
};

function MovementDetail() {
  const [search, setSearch] = useState('');
  const m = mockMovement;
  const filtered = m.workouts.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );
  return (
    <div className="client-detail-page">
      <div className="client-detail-header">
        <div className="client-detail-image">
          <div className="client-image-placeholder">Image of movement</div>
        </div>
        <div className="client-detail-main">
          <div className="client-detail-title">
            <h2>{m.name}</h2>
            <div>Type &nbsp; {m.type} &nbsp;&nbsp; Category &nbsp; {m.category}</div>
            <div style={{ marginTop: 8 }}>
              <b>Equipment required</b>: {m.equipment} &nbsp;&nbsp;
              <b>Default Unit</b>: {m.defaultUnit}
            </div>
            <div style={{ marginTop: 8 }}>
              <b>Weighted</b>: {m.weighted} &nbsp;&nbsp;
              <b>Time?</b>: {m.time}
            </div>
            <div style={{ marginTop: 8 }}>
              <b>Primary muscle group</b>: {m.primaryMuscle} &nbsp;&nbsp;
              <b>Secondary muscle group</b>: {m.secondaryMuscle}
            </div>
          </div>
        </div>
        <div className="client-detail-main">
          <div style={{ marginBottom: 8 }}>
            <b>Description</b><br />
            {m.description}
          </div>
          <div>
            <b>Instructions</b><br />
            {m.instructions}
          </div>
        </div>
      </div>
      <div className="client-detail-workouts">
        <h3>Workouts</h3>
        <div className="clients-controls">
          <button className="clients-filter-btn">Filters</button>
          <input
            className="clients-search"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <table className="workouts-table">
          <thead>
            <tr>
              <th>Exercise ID</th>
              <th>Workout Name</th>
              <th>Trainer</th>
              <th>Client</th>
              <th>Rep</th>
              <th>Sets</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w, i) => (
              <tr key={i}>
                <td>{w.exerciseId}</td>
                <td>{w.workoutName}</td>
                <td>{w.trainer}</td>
                <td>{w.client}</td>
                <td>{w.rep}</td>
                <td>{w.sets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MovementDetail;
