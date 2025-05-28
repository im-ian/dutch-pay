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

interface EditParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newName: string) => void;
  initialName: string;
}

export function EditParticipantDialog({
  open,
  onOpenChange,
  onConfirm,
  initialName,
}: EditParticipantDialogProps) {
  const [newName, setNewName] = useState(initialName);

  const handleConfirm = () => {
    if (newName.trim()) {
      onConfirm(newName.trim());
      setNewName("");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setNewName("");
  };

  return (
    <AlertDialog open={open} onOpenChange={handleCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>참가자 이름 변경</AlertDialogTitle>
          <AlertDialogDescription>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full mt-2 px-3 py-2 border rounded-md"
              placeholder="새 이름을 입력하세요"
              autoFocus
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>변경</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 