'use client';

import {
    Modal, 
    ModalContent,
    Button,
} from "@nextui-org/react";
import { TrashIcon } from '@heroicons/react/24/outline';

interface DeleteUserProps {
    dialog: boolean;
    setDialog: (show: boolean) => void;
    deleteUser: () => Promise<void>;
    loading: boolean;
}

export default function DeleteUser({ dialog, setDialog, deleteUser, loading }: DeleteUserProps) {
    if (!dialog) return null;

    return (
        <Modal 
            isOpen={dialog} 
            onOpenChange={() => setDialog(false)}
            size="sm"
        >
            <ModalContent>
                {(onClose) => (
                    <div className="p-4 md:p-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-3 rounded-full bg-danger/10">
                                <TrashIcon className="h-8 w-8 text-danger" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-default-500">
                                    Are you sure you want to delete this user? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Button
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={deleteUser}
                                    isLoading={loading}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </ModalContent>
        </Modal>
    );
} 