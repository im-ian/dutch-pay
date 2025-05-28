import React, { useState } from "react";
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
import { Settings } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

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
  const [hideWon, setHideWon] = useState(false);

  const calculateShare = (amount: number, participantCount: number) => {
    if (participantCount === 0) return 0;
    return Math.round((amount / participantCount) * 10) / 10;
  };

  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString()}${hideWon ? '' : '원'}`;
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalShare = calculateShare(totalAmount, participants.length);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 bg-gray-100 hover:bg-gray-200"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onAddParticipant}>
              참가자 추가
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hide-won" 
                  checked={hideWon}
                  onCheckedChange={(checked) => setHideWon(checked as boolean)}
                />
                <Label htmlFor="hide-won">원 표시 제거</Label>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100">
              <TableHead className="w-[200px] font-semibold border-r">정산내역</TableHead>
              <TableHead className="w-[150px] font-semibold border-r text-right">금액</TableHead>
              {participants.map((participant, index) => (
                <TableHead 
                  key={participant.id} 
                  className={`font-semibold ${index !== participants.length - 1 ? 'border-r' : ''} text-right`}
                >
                  {participant.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={participants.length + 2} className="h-24 text-center text-muted-foreground">
                  아직 지출 내역이 없습니다
                </TableCell>
              </TableRow>
            ) : (
              <>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="border-r">{expense.description}</TableCell>
                    <TableCell className="border-r text-right">{formatAmount(expense.amount)}</TableCell>
                    {participants.map((participant, index) => (
                      <TableCell 
                        key={participant.id}
                        className={`${index !== participants.length - 1 ? 'border-r' : ''} text-right`}
                      >
                        {formatAmount(calculateShare(expense.amount, participants.length))}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell className="border-r">합계</TableCell>
                  <TableCell className="border-r text-right">{formatAmount(totalAmount)}</TableCell>
                  {participants.map((participant, index) => (
                    <TableCell 
                      key={participant.id}
                      className={`${index !== participants.length - 1 ? 'border-r' : ''} text-right`}
                    >
                      {formatAmount(totalShare)}
                    </TableCell>
                  ))}
                </TableRow>
              </>
            )}
            <TableRow>
              <TableCell colSpan={participants.length + 2}>
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
    </div>
  );
} 