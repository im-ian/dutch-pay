import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (description: string, amount: number) => void;
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  onAdd,
}: AddExpenseDialogProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }

    onAdd(description, numericAmount);
    handleClose();
  };

  const handleClose = () => {
    setDescription("");
    setAmount("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정산 내용 추가</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">내용</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                  placeholder="정산 내용을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">금액</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                  placeholder="금액을 입력하세요"
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>추가</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 