import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DutchPayTable } from '../components/DutchPayTable'
import { AddParticipantDialog } from '../components/AddParticipantDialog'
import { AddExpenseDialog } from '../components/AddExpenseDialog'
import { v4 as uuidv4 } from 'uuid'

interface Participant {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  shares: { [participantId: string]: number };
}

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [hideWon, setHideWon] = useState(false);
  const [hideDecimal, setHideDecimal] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false);

  const handleAddParticipant = (name: string) => {
    const newParticipant: Participant = {
      id: uuidv4(),
      name,
    };
    setParticipants([...participants, newParticipant]);
  };

  const handleAddExpense = (description: string, amount: number) => {
    const newExpense: Expense = {
      id: uuidv4(),
      description,
      amount,
      shares: {},
    };
    setExpenses([...expenses, newExpense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const handleDeleteParticipant = (id: string) => {
    setParticipants(participants.filter(participant => participant.id !== id));
  };

  const handleUpdateParticipant = (id: string, newName: string) => {
    setParticipants(participants.map(participant => 
      participant.id === id ? { ...participant, name: newName } : participant
    ));
  };

  const handleImportData = (data: { participants: Participant[]; expenses: Expense[] }) => {
    setParticipants(data.participants);
    setExpenses(data.expenses);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">더치페이 계산기</h1>
      <DutchPayTable
        participants={participants}
        expenses={expenses}
        hideWon={hideWon}
        hideDecimal={hideDecimal}
        onHideWonChange={setHideWon}
        onHideDecimalChange={setHideDecimal}
        onAddParticipant={() => setIsAddDialogOpen(true)}
        onAddExpense={() => setIsAddExpenseDialogOpen(true)}
        onDeleteExpense={handleDeleteExpense}
        onDeleteParticipant={handleDeleteParticipant}
        onUpdateParticipant={handleUpdateParticipant}
        onImportData={handleImportData}
      />
      <AddParticipantDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddParticipant}
      />
      <AddExpenseDialog
        open={isAddExpenseDialogOpen}
        onOpenChange={setIsAddExpenseDialogOpen}
        onAdd={handleAddExpense}
      />
    </div>
  )
}
