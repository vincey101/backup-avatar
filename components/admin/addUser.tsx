'use client';

import {
    Modal,
    ModalContent,
    Button,
    Input,
    Checkbox,
} from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'sonner';

interface AddUserProps {
    dialog: boolean;
    setDialog: (show: boolean) => void;
    loading: boolean;
    addUser: () => Promise<void>;
}

export default function AddUser({ dialog, setDialog, loading, addUser }: AddUserProps) {
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            fe: 1,
            oto_1: 0,
            oto_2: 0,
            oto_3: 0,
            oto_4: 0,
            oto_5: 0,
            oto_6: 0,
            oto_7: 0,
            oto_8: 0,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
        }),
        onSubmit: async (values) => {
            try {
                const userDataStr = localStorage.getItem('userData');
                if (!userDataStr) return;

                const userData = JSON.parse(userDataStr);
                const token = userData.token;

                const submitValues = {
                    ...values,
                    fe: 1
                };

                const response = await fetch('https://api.humanaiapp.com/api/create-users', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submitValues),
                });

                const data = await response.json();

                if (data.status === "success") {
                    toast.success('User added successfully!');
                    setDialog(false);
                    formik.resetForm();
                    await addUser();
                } else {
                    toast.error(data.message || 'Failed to add user');
                }
            } catch (error) {
                console.error('Error adding user:', error);
                toast.error('An error occurred while adding the user');
            }
        },
    });

    return (
        <Modal
            isOpen={dialog}
            onOpenChange={() => setDialog(false)}
            size="md"
        >
            <ModalContent>
                {(onClose) => (
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Add New User</h3>
                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <Input
                                label="Name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                errorMessage={formik.touched.name && formik.errors.name}
                            />
                            <Input
                                label="Email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                errorMessage={formik.touched.email && formik.errors.email}
                            />
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                errorMessage={formik.touched.password && formik.errors.password}
                            />

                            <div>
                                <Checkbox
                                    isSelected={true}
                                    isDisabled={true}
                                    defaultSelected
                                >
                                    FE
                                </Checkbox>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <Button
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-indigo-500 to-gray-900
                                        hover:from-indigo-600 hover:to-gray-800
                                        text-white shadow-md hover:shadow-lg
                                        transform transition-all duration-200 hover:scale-[1.02]"
                                    isLoading={formik.isSubmitting}
                                >
                                    Add User
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </ModalContent>
        </Modal>
    );
} 