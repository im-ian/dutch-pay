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
import { Settings, UserPlus, Banknote, Trash2, MoreHorizontal, Pencil, Download, Upload, Check, X } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { DeleteExpenseDialog } from "./dialogs/DeleteExpenseDialog";
import { DeleteParticipantDialog } from "./dialogs/DeleteParticipantDialog";
import { EditParticipantDialog } from "./dialogs/EditParticipantDialog";
import { ExportDialog } from "./dialogs/ExportDialog";
import { ImportDialog } from "./dialogs/ImportDialog";
import { Input } from "./ui/input";

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
  title: string;
  onTitleChange: (title: string) => void;
  participants: Participant[];
  expenses: Expense[];
  hideWon: boolean;
  hideDecimal: boolean;
  onHideWonChange: (hide: boolean) => void;
  onHideDecimalChange: (hide: boolean) => void;
  onAddParticipant: () => void;
  onAddExpense: () => void;
  onDeleteExpense: (id: string) => void;
  onDeleteParticipant: (id: string) => void;
  onUpdateParticipant: (id: string, newName: string) => void;
  onImportData: (data: { title: string; participants: Participant[]; expenses: Expense[] }) => void;
  isSharedLink: boolean;
  onExpensesChange: (expenses: Expense[]) => void;
}

export function DutchPayTable({ 
  title,
  onTitleChange,
  participants, 
  expenses,
  hideWon,
  hideDecimal,
  onHideWonChange,
  onHideDecimalChange,
  onAddParticipant,
  onAddExpense,
  onDeleteExpense,
  onDeleteParticipant,
  onUpdateParticipant,
  onImportData,
  isSharedLink,
  onExpensesChange,
}: DutchPayTableProps) {
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [participantToEdit, setParticipantToEdit] = useState<Participant | null>(null);
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [exportData, setExportData] = useState("");
  const [editingShare, setEditingShare] = useState<{ expenseId: string; participantId: string } | null>(null);
  const [shareAmount, setShareAmount] = useState("");

  const handleDeleteClick = (id: string) => {
    setExpenseToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      onDeleteExpense(expenseToDelete);
      setExpenseToDelete(null);
    }
  };

  const calculateShare = (amount: number, participantCount: number) => {
    if (participantCount === 0) return 0;
    const share = amount / participantCount;
    return hideDecimal ? Math.round(share) : Math.round(share * 10) / 10;
  };

  const formatAmount = (amount: number) => {
    const formattedAmount = hideDecimal ? Math.round(amount) : amount;
    return `${formattedAmount.toLocaleString()}${hideWon ? '' : '원'}`;
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalShare = calculateShare(totalAmount, participants.length);

  const handleExport = () => {
    const data = {
      title,
      participants,
      expenses,
    };
    const jsonString = JSON.stringify(data);
    const base64 = btoa(encodeURIComponent(jsonString));
    setExportData(base64);
    setShowExportDialog(true);
  };

  const handleShareEdit = (expenseId: string, participantId: string, currentAmount: number) => {
    setEditingShare({ expenseId, participantId });
    setShareAmount(currentAmount.toString());
  };

  const handleShareSave = () => {
    if (!editingShare) return;

    const numericAmount = parseFloat(shareAmount);
    if (isNaN(numericAmount) || numericAmount < 0) return;

    const expense = expenses.find(e => e.id === editingShare.expenseId);
    if (!expense) return;

    const newShares = { ...expense.shares };
    newShares[editingShare.participantId] = numericAmount;

    const updatedExpenses = expenses.map(e => 
      e.id === editingShare.expenseId 
        ? { ...e, shares: newShares }
        : e
    );

    onExpensesChange(updatedExpenses);
    setEditingShare(null);
    setShareAmount("");
  };

  return (
    <div className="space-y-4">
      <DeleteExpenseDialog
        open={expenseToDelete !== null}
        onOpenChange={(open) => !open && setExpenseToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <DeleteParticipantDialog
        open={participantToDelete !== null}
        onOpenChange={(open) => !open && setParticipantToDelete(null)}
        onConfirm={() => {
          if (participantToDelete) {
            onDeleteParticipant(participantToDelete.id);
            setParticipantToDelete(null);
          }
        }}
      />

      <EditParticipantDialog
        open={participantToEdit !== null}
        onOpenChange={(open) => !open && setParticipantToEdit(null)}
        onConfirm={(newName) => {
          if (participantToEdit) {
            onUpdateParticipant(participantToEdit.id, newName);
            setParticipantToEdit(null);
          }
        }}
        initialName={participantToEdit?.name ?? ""}
      />

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        exportData={exportData}
      />

      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={onImportData}
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-xl font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-gray-500 focus:outline-none px-1 py-0.5"
            placeholder="정산 제목을 입력하세요"
            readOnly={isSharedLink}
          />
        </div>
        <div className="flex space-x-2">
          {!isSharedLink && (
            <>
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
            </>
          )}

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
                          id="hide-decimal" 
                          checked={hideDecimal}
                          onCheckedChange={(checked) => onHideDecimalChange(checked as boolean)}
                        />
                        <Label htmlFor="hide-decimal">소숫점 제거</Label>
                      </div>
                    </DropdownMenuItem>
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
                    {!isSharedLink && (
                      <>
                        <DropdownMenuItem onClick={handleExport}>
                          <Download className="h-4 w-4 mr-2" />
                          정산 내역 내보내기
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowImportDialog(true)}>
                          <Upload className="h-4 w-4 mr-2" />
                          정산 내역 불러오기
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>설정</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100">
              {!isSharedLink && <TableHead className="w-[50px] font-semibold border-r"></TableHead>}
              <TableHead className="w-[200px] font-semibold border-r">정산내역</TableHead>
              <TableHead className="w-[150px] font-semibold border-r text-right">금액</TableHead>
              {participants.map((participant, index) => (
                <TableHead 
                  key={participant.id} 
                  className={`font-semibold ${index !== participants.length - 1 ? 'border-r' : ''} text-right`}
                >
                  <div className="flex items-center justify-end gap-2">
                    {participant.name}
                    {!isSharedLink && (
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
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={participants.length + (isSharedLink ? 2 : 3)} className="h-24 text-center text-muted-foreground">
                  지출 내역이나 정산 참가자를 추가해보세요.
                </TableCell>
              </TableRow>
            ) : (
              <>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    {!isSharedLink && (
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
                    )}
                    <TableCell className="border-r">{expense.description}</TableCell>
                    <TableCell className="border-r text-right">{formatAmount(expense.amount)}</TableCell>
                    {participants.map((participant, index) => (
                      <TableCell 
                        key={participant.id}
                        className={`${index !== participants.length - 1 ? 'border-r' : ''} text-right`}
                      >
                        {editingShare?.expenseId === expense.id && editingShare?.participantId === participant.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <Input
                              type="number"
                              value={shareAmount}
                              onChange={(e) => setShareAmount(e.target.value)}
                              className="w-24"
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={handleShareSave}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingShare(null);
                                setShareAmount("");
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <span className={expense.shares[participant.id] !== undefined ? "text-blue-600" : ""}>
                              {formatAmount(expense.shares[participant.id] ?? calculateShare(expense.amount, participants.length))}
                            </span>
                            {!isSharedLink && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-gray-700"
                                onClick={() => handleShareEdit(expense.id, participant.id, expense.shares[participant.id] ?? calculateShare(expense.amount, participants.length))}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  {!isSharedLink && <TableCell className="border-r"></TableCell>}
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