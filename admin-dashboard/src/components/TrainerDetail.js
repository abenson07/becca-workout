import React from 'react';
import './ClientDetail.css';
import Table from './Table';

const mockTrainer = {
  name: 'John Smith',
  email: 'john.smith@email.com',
  id: '1234567',
  dob: '1985-05-10',
  specialties: ['Strength', 'Mobility', 'Endurance'],
  clients: [
    {
      name: 'Client 1',
      workouts: [
        { name: 'Workout X', numExercises: 6, status: 'Active' },
        { name: 'Workout Y', numExercises: 4, status: 'Completed' },
      ],
    },
    {
      name: 'Client 2',
      workouts: [
        { name: 'Workout Z', numExercises: 5, status: 'Active' },
      ],
    },
  ],
  trainingNotes: 'Trainer notes go here. This can include their approach, philosophy, or anything relevant.',
  injuryNotes: 'Trainer injury notes or considerations go here.',
};

function TrainerDetail() {
  return (
    <div className="client-detail-page px-12 py-8">
      <div className="flex flex-row items-start justify-between mb-8 w-full">
        {/* Image */}
        <div className="border rounded w-48 h-48 flex items-center justify-center text-gray-400 text-center text-sm mr-8 min-w-48">
          Image of trainer
        </div>
        {/* Info and specialties */}
        <div className="flex-1">
          <div className="text-lg font-semibold mb-1">Trainer Name ({mockTrainer.name})</div>
          <div className="mb-1">{mockTrainer.email}</div>
          <div className="mb-2">ID {mockTrainer.id} &nbsp; date of birth {mockTrainer.dob}</div>
          <div className="flex flex-row items-center mb-4">
            <span className="mr-2">Specialties:</span>
            {mockTrainer.specialties.map((s, i) => (
              <button key={i} className="border rounded-full px-4 py-1 mx-1 text-sm hover:bg-gray-100 transition">{s}</button>
            ))}
            <button className="border rounded-full px-4 py-1 mx-2 text-sm hover:bg-gray-100 transition">+ Assign client</button>
          </div>
        </div>
        {/* Edit profile button */}
        <div className="ml-8">
          <button className="border rounded-full px-6 py-2 text-sm hover:bg-gray-100 transition">Edit profile</button>
        </div>
      </div>
      <div className="flex flex-row gap-16 w-full">
        <div className="flex-1">
          <div className="font-semibold mb-1">Trainer notes</div>
          <div>{mockTrainer.trainingNotes}</div>
        </div>
        <div className="flex-1">
          <div className="font-semibold mb-1">Injury Notes</div>
          <div>{mockTrainer.injuryNotes}</div>
        </div>
      </div>
      {/* Clients and their workouts */}
      <div className="mt-12">
        {mockTrainer.clients.map((c, i) => (
          <div key={i} className="mb-8">
            <div className="flex items-center mb-2">
              <b className="mr-4">{c.name}</b>
              <button className="border rounded-full px-3 py-1 text-xs ml-2 hover:bg-gray-100 transition">New workout</button>
            </div>
            <Table
              columns={[
                { key: 'name', label: 'Workout' },
                { key: 'numExercises', label: 'Number of exercises' },
                { key: 'status', label: 'Status' },
              ]}
              data={c.workouts}
              searchable={true}
              sortable={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainerDetail;
