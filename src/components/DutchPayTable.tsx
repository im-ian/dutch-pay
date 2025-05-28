import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Plus } from "lucide-react";

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

interface DutchPayTableProps {
  participants: Participant[];
  expenses: Expense[];
  onAddParticipant: () => void;
  onAddExpense: () => void;
}

export function DutchPayTable({ 
  participants, 
  expenses,
  onAddParticipant,
  onAddExpense,
}: DutchPayTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">정산내역</TableHead>
            <TableHead className="w-[150px]">금액</TableHead>
            {participants.map((participant) => (
              <TableHead key={participant.id}>{participant.name}</TableHead>
            ))}
            <TableHead className="w-[50px]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onAddParticipant}>
                    참가자 추가
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={participants.length + 3} className="h-24 text-center text-muted-foreground">
                아직 지출 내역이 없습니다
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.amount.toLocaleString()}원</TableCell>
                {participants.map((participant) => (
                  <TableCell key={participant.id}>
                    {expense.shares[participant.id]?.toLocaleString() ?? "-"}원
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            ))
          )}
          <TableRow>
            <TableCell colSpan={participants.length + 3}>
              <Button 
                variant="default" 
                className="w-full bg-black hover:bg-black/90"
                onClick={onAddExpense}
              >
                정산 내용 추가
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
} 