import React from 'react';
import './ClientDetail.css';

const mockClient = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@email.com',
  id: '5616586',
  dob: '1990-01-01',
  image: '',
  trainers: [
    { id: 1, name: 'Trainer 1' },
    { id: 2, name: 'Trainer 2' },
    { id: 3, name: 'Trainer 3' },
    { id: 4, name: 'Trainer 4' },
  ],
  trainingNotes: 'Training notes go here. It can be things like what they want to achieve, preference for certain things, stuff their gym has or doesn’t have etc.',
  injuryNotes: 'Injury notes go here. It can be things like persistent injuries, things to consider, short term pain that is mentioned, etc.',
  workoutsByTrainer: [
    {
      trainerName: 'Trainer 1',
      workouts: [
        { name: 'Workout name', numExercises: 32 },
        { name: 'Workout name', numExercises: 32 },
        { name: 'Workout name', numExercises: 32 },
      ],
    },
    {
      trainerName: 'Trainer 2',
      workouts: [
        { name: 'Workout name', numExercises: 32 },
        { name: 'Workout name', numExercises: 32 },
      ],
    },
  ],
};

function ClientDetail() {
  const c = mockClient;
  return (
    <div className="client-detail-page">
      <div className="client-detail-header">
        <div className="client-detail-image">
          <div className="client-image-placeholder">Image of client</div>
        </div>
        <div className="client-detail-main">
          <div className="client-detail-title">
            <h2>Client Name ({c.firstName} + {c.lastName})</h2>
            <div>{c.email}</div>
            <div>ID {c.id} &nbsp;&nbsp; date of birth {c.dob}</div>
            <div className="client-trainers">
              Trainers:&nbsp;
              {c.trainers.map(t => (
                <span className="trainer-avatar" key={t.id}>{t.name}</span>
              ))}
              <button className="assign-btn">+ Assign trainer</button>
            </div>
          </div>
          <div className="client-detail-notes">
            <div>
              <b>Training notes</b><br />
              {c.trainingNotes}
            </div>
            <div>
              <b>Injury Notes</b><br />
              {c.injuryNotes}
            </div>
          </div>
        </div>
        <div className="client-detail-edit">
          <button className="edit-btn">Edit profile</button>
        </div>
      </div>
      <div className="client-detail-workouts">
        {c.workoutsByTrainer.map((t, i) => (
          <div key={i} className="trainer-workouts-block">
            <div className="trainer-workouts-header">
              <b>{t.trainerName}</b>
              <button className="unassign-btn">Unassign trainer</button>
            </div>
            <table className="workouts-table">
              <thead>
                <tr>
                  <th>Workout</th>
                  <th>Number of exercises</th>
                </tr>
              </thead>
              <tbody>
                {t.workouts.map((w, j) => (
                  <tr key={j}>
                    <td>{w.name}</td>
                    <td>{w.numExercises}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientDetail;
