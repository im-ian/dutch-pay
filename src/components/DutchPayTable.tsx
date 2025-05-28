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
import { Settings, UserPlus, Banknote, Trash2, MoreHorizontal, Pencil, Copy, Download, Upload } from "lucide-react";
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
import { toast } from "sonner";

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
  hideWon: boolean;
  onHideWonChange: (hide: boolean) => void;
  onAddParticipant: () => void;
  onAddExpense: () => void;
  onDeleteExpense: (id: string) => void;
  onDeleteParticipant: (id: string) => void;
  onUpdateParticipant: (id: string, newName: string) => void;
  onImportData: (data: { participants: Participant[]; expenses: Expense[]; hideWon: boolean }) => void;
}

export function DutchPayTable({ 
  participants, 
  expenses,
  hideWon,
  onHideWonChange,
  onAddParticipant,
  onAddExpense,
  onDeleteExpense,
  onDeleteParticipant,
  onUpdateParticipant,
  onImportData,
}: DutchPayTableProps) {
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [participantToEdit, setParticipantToEdit] = useState<Participant | null>(null);
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [exportData, setExportData] = useState("");
  const [importData, setImportData] = useState("");

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

  const handleUpdateParticipant = () => {
    if (participantToEdit && newParticipantName.trim()) {
      onUpdateParticipant(participantToEdit.id, newParticipantName.trim());
      setParticipantToEdit(null);
      setNewParticipantName("");
    }
  };

  const handleConfirmParticipantDelete = () => {
    if (participantToDelete) {
      onDeleteParticipant(participantToDelete.id);
      setParticipantToDelete(null);
    }
  };

  const handleExport = () => {
    const data = {
      participants,
      expenses,
    };
    const jsonString = JSON.stringify(data);
    const base64 = btoa(encodeURIComponent(jsonString));
    setExportData(base64);
    setShowExportDialog(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportData);
      toast.success("클립보드에 복사되었습니다");
    } catch (err) {
      toast.error("복사에 실패했습니다");
    }
  };

  const handleImport = () => {
    try {
      const jsonString = decodeURIComponent(atob(importData));
      const data = JSON.parse(jsonString);
      
      // Validate data structure
      if (!data.participants || !data.expenses) {
        throw new Error("Invalid data format");
      }

      onImportData(data);
      setShowImportDialog(false);
      setImportData("");
      toast.success("정산 내역을 불러왔습니다");
    } catch (err) {
      toast.error("올바르지 않은 데이터입니다");
    }
  };

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

      <AlertDialog open={participantToDelete !== null} onOpenChange={() => setParticipantToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>참가자 제거</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 참가자를 제거하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmParticipantDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              제거
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={participantToEdit !== null} onOpenChange={() => setParticipantToEdit(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>참가자 이름 변경</AlertDialogTitle>
            <AlertDialogDescription>
              <input
                type="text"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                className="w-full mt-2 px-3 py-2 border rounded-md"
                placeholder="새 이름을 입력하세요"
                autoFocus
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setParticipantToEdit(null);
              setNewParticipantName("");
            }}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateParticipant}>변경</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Dialog */}
      <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정산 내역 내보내기</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="mt-4 space-y-4">
                <div className="relative">
                  <textarea
                    readOnly
                    value={exportData}
                    className="w-full h-32 p-2 border rounded-md font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  위 텍스트를 복사하여 나중에 정산 내역을 불러올 수 있습니다.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>닫기</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Dialog */}
      <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정산 내역 불러오기</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="mt-4 space-y-4">
                <div className="relative">
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="내보낸 정산 내역 데이터를 붙여넣으세요"
                    className="w-full h-32 p-2 border rounded-md font-mono text-sm"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  내보낸 정산 내역 데이터를 붙여넣어 불러올 수 있습니다.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowImportDialog(false);
              setImportData("");
            }}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleImport}>불러오기</AlertDialogAction>
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
                        onCheckedChange={(checked) => onHideWonChange(checked as boolean)}
                      />
                      <Label htmlFor="hide-won">원 표시 제거</Label>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    정산 내역 내보내기
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowImportDialog(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    정산 내역 불러오기
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
                  <div className="flex items-center justify-end gap-2">
                    {participant.name}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setParticipantToEdit(participant);
                            setNewParticipantName(participant.name);
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          이름 변경
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setParticipantToDelete(participant)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          참가자 제거
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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