import React from 'react';
import './ClientDetail.css';
import Table from './Table';

const mockClient = {
  name: 'Jane Doe',
  email: 'jane.doe@email.com',
  id: '5616586',
  dob: '1990-01-01',
  trainers: ['Trainer 1', 'Trainer 2', 'Trainer 3', 'Trainer 4'],
  trainingNotes: 'Training notes go here. It can be things like what they want to achieve, preference for certain things, stuff their gym has or doesn’t have etc.',
  injuryNotes: 'Injury notes go here. It can be things like persistent injuries, things to consider, short term pain that is mentioned, etc.',
  workoutsByTrainer: [
    {
      trainerName: 'Trainer 1',
      workouts: [
        { name: 'Workout A', numExercises: 5 },
        { name: 'Workout B', numExercises: 3 },
      ],
    },
    {
      trainerName: 'Trainer 2',
      workouts: [
        { name: 'Workout C', numExercises: 4 },
      ],
    },
  ],
};

function ClientDetail() {
  return (
    <div className="client-detail-page px-12 py-8">
      <div className="flex flex-row items-start justify-between mb-8 w-full">
        {/* Image */}
        <div className="border rounded w-48 h-48 flex items-center justify-center text-gray-400 text-center text-sm mr-8 min-w-48">
          Image of client
        </div>
        {/* Info and trainers */}
        <div className="flex-1">
          <div className="text-lg font-semibold mb-1">Client Name ({mockClient.name})</div>
          <div className="mb-1">{mockClient.email}</div>
          <div className="mb-2">ID {mockClient.id} &nbsp; date of birth {mockClient.dob}</div>
          <div className="flex flex-row items-center mb-4">
            <span className="mr-2">Trainers:</span>
            {mockClient.trainers.map((t, i) => (
              <button key={i} className="border rounded-full px-4 py-1 mx-1 text-sm hover:bg-gray-100 transition">{t}</button>
            ))}
            <button className="border rounded-full px-4 py-1 mx-2 text-sm hover:bg-gray-100 transition">+ Assign trainer</button>
          </div>
        </div>
        {/* Edit profile button */}
        <div className="ml-8">
          <button className="border rounded-full px-6 py-2 text-sm hover:bg-gray-100 transition">Edit profile</button>
        </div>
      </div>
      <div className="flex flex-row gap-16 w-full">
        <div className="flex-1">
          <div className="font-semibold mb-1">Training notes</div>
          <div>{mockClient.trainingNotes}</div>
        </div>
        <div className="flex-1">
          <div className="font-semibold mb-1">Injury Notes</div>
          <div>{mockClient.injuryNotes}</div>
        </div>
      </div>
      {/* Workouts by trainer */}
      <div className="mt-12">
        {mockClient.workoutsByTrainer.map((t, i) => (
          <div key={i} className="mb-8">
            <div className="flex items-center mb-2">
              <b className="mr-4">{t.trainerName}</b>
              <button className="border rounded-full px-3 py-1 text-xs ml-2 hover:bg-gray-100 transition">Unassign trainer</button>
            </div>
            <Table
              columns={[
                { key: 'name', label: 'Workout' },
                { key: 'numExercises', label: 'Number of exercises' },
              ]}
              data={t.workouts}
              searchable={true}
              sortable={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientDetail;
