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
import { Settings, UserPlus, Banknote, Trash2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

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
  onDeleteExpense: (id: string) => void;
}

export function DutchPayTable({ 
  participants, 
  expenses,
  onAddParticipant,
  onAddExpense,
  onDeleteExpense,
}: DutchPayTableProps) {
  const [hideWon, setHideWon] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setExpenseToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      onDeleteExpense(expenseToDelete);
      setExpenseToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setExpenseToDelete(null);
  };

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
      <AlertDialog open={expenseToDelete !== null} onOpenChange={handleCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정산 내역 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 정산 내역을 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-end space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 bg-gray-100 hover:bg-gray-200"
                onClick={onAddExpense}
              >
                <Banknote className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>정산 내용 추가</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 bg-gray-100 hover:bg-gray-200"
                onClick={onAddParticipant}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>참가자 추가</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>설정</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100">
              <TableHead className="w-[50px] font-semibold border-r"></TableHead>
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
                <TableCell colSpan={participants.length + 3} className="h-24 text-center text-muted-foreground">
                  지출 내역이나 정산 참가자를 추가해보세요.
                </TableCell>
              </TableRow>
            ) : (
              <>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="border-r">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteClick(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
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
                  <TableCell className="border-r"></TableCell>
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 