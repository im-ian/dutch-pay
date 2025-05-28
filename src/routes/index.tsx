import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DutchPayTable } from '../components/DutchPayTable'
import { v4 as uuidv4 } from 'uuid'

interface Participant {
  id: string;
  name: string;
}

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);

  const handleAddParticipant = () => {
    const newParticipant: Participant = {
      id: uuidv4(),
      name: `Person ${participants.length + 1}`,
    };
    setParticipants([...participants, newParticipant]);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dutch Pay Calculator</h1>
      <DutchPayTable
        participants={participants}
        onAddParticipant={handleAddParticipant}
      />
    </div>
  )
}
