import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DutchPayTable } from '../components/DutchPayTable'
import { AddParticipantDialog } from '../components/AddParticipantDialog'
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddParticipant = (name: string) => {
    const newParticipant: Participant = {
      id: uuidv4(),
      name,
    };
    setParticipants([...participants, newParticipant]);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">더치페이 계산기</h1>
      <DutchPayTable
        participants={participants}
        onAddParticipant={() => setIsAddDialogOpen(true)}
      />
      <AddParticipantDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddParticipant}
      />
    </div>
  )
}
