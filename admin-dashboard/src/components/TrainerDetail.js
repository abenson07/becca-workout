import React from 'react';
import './ClientDetail.css';

const mockTrainer = {
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@email.com',
  id: '5616586',
  image: '',
  specialties: ['Strength', 'Cardio', 'Mobility', 'Nutrition', 'Rehab'],
  bio: 'Meet our dedicated trainer! Passionate about helping clients achieve their fitness goals, they focus on personalized training plans that cater to individual preferences and needs. With a keen eye for what makes a gym experience enjoyable, they ensure every session is effective and motivating.',
  certifications: [
    'Certified Personal Trainer (CPT)',
    'Nutrition Specialist (CNS)',
    'Group Fitness Instructor (GFI)',
    'Certified Strength and Conditioning Specialist (CSCS)',
    'CPR and First Aid Certified',
  ],
  clients: [
    {
      name: 'Client name',
      workouts: [
        { name: 'Workout name', numExercises: 32, status: 'Active' },
        { name: 'Workout name', numExercises: 32, status: 'Active' },
        { name: 'Workout name', numExercises: 32, status: 'Completed' },
      ],
    },
    {
      name: 'Client name',
      workouts: [
        { name: 'Workout name', numExercises: 32, status: 'Active' },
        { name: 'Workout name', numExercises: 32, status: 'Active' },
      ],
    },
  ],
};

function TrainerDetail() {
  const t = mockTrainer;
  return (
    <div className="client-detail-page">
      <div className="client-detail-header">
        <div className="client-detail-image">
          <div className="client-image-placeholder">Image of Trainer</div>
        </div>
        <div className="client-detail-main">
          <div className="client-detail-title">
            <h2>Trainer Name ({t.firstName} + {t.lastName})</h2>
            <div>{t.email} &nbsp;&nbsp; ID {t.id}</div>
            <div>Specialties: {t.specialties.join(', ')}</div>
            <div style={{ marginTop: 8 }}>
              <b>Bio</b><br />
              {t.bio}
            </div>
            <div style={{ marginTop: 8 }}>
              <b>Certifications</b><br />
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {t.certifications.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="client-detail-workouts">
        {t.clients.map((c, i) => (
          <div key={i} className="trainer-workouts-block">
            <div className="trainer-workouts-header">
              <b>{c.name}</b>
              <button className="edit-btn">New workout</button>
            </div>
            <table className="workouts-table">
              <thead>
                <tr>
                  <th>Workout</th>
                  <th>Number of exercises</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {c.workouts.map((w, j) => (
                  <tr key={j}>
                    <td>{w.name}</td>
                    <td>{w.numExercises}</td>
                    <td>{w.status}</td>
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

export default TrainerDetail;
