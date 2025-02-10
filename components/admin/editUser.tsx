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

interface EditUserProps {
    dialog: boolean;
    setDialog: (show: boolean) => void;
    user: any;  // Current user data
    onUpdate: () => Promise<void>;
}

interface FormValues {
    name: string;
    email: string;
    password?: string;
    oto_1: number;
    oto_2: number;
    oto_3: number;
    oto_4: number;
    oto_5: number;
    oto_6: number;
    oto_7: number;
    oto_8: number;
}

export default function EditUser({ dialog, setDialog, user, onUpdate }: EditUserProps) {
    const formik = useFormik<FormValues>({
        initialValues: {
            name: user?.name || '',
            email: user?.email || '',
            password: '',
            oto_1: Number(user?.oto_1 || 0),
            oto_2: Number(user?.oto_2 || 0),
            oto_3: Number(user?.oto_3 || 0),
            oto_4: Number(user?.oto_4 || 0),
            oto_5: Number(user?.oto_5 || 0),
            oto_6: Number(user?.oto_6 || 0),
            oto_7: Number(user?.oto_7 || 0),
            oto_8: Number(user?.oto_8 || 0),
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters"),
        }),
        onSubmit: async (values) => {
            try {
                const userDataStr = localStorage.getItem('userData');
                if (!userDataStr) return;

                const userData = JSON.parse(userDataStr);
                const token = userData.token;

                // Transform the data for the backend
                const requestBody = {
                    name: values.name,
                    email: values.email,
                    ...(values.password ? { password: values.password } : {}),
                    oto1: Number(values.oto_1),  // Remove underscore for API
                    oto2: Number(values.oto_2),
                    oto3: Number(values.oto_3),
                    oto4: Number(values.oto_4),
                    oto5: Number(values.oto_5),
                    oto6: Number(values.oto_6),
                    oto7: Number(values.oto_7),
                    oto8: Number(values.oto_8)
                };

                console.log('Current user data:', user);
                console.log('Form values:', values);
                console.log('Request body:', requestBody);

                const response = await fetch(`https://api.humanaiapp.com/api/update-user/${user.id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();
                console.log('API Response:', data);

                if (data.status === "success") {
                    toast.success('User updated successfully!');
                    setDialog(false);
                    await onUpdate();
                } else {
                    toast.error(data.message || 'Failed to update user');
                }
            } catch (error) {
                console.error('Error updating user:', error);
                toast.error('An error occurred while updating the user');
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
                        <h3 className="text-lg font-semibold mb-4">Edit User</h3>
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
                                label="Password (Optional)"
                                name="password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                errorMessage={formik.touched.password && formik.errors.password}
                            />

                            <div className="space-y-3">
                                <p className="text-sm font-medium">OTO Access</p>
                                <div className="grid grid-cols-4 gap-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                        <Checkbox
                                            key={num}
                                            isSelected={formik.values[`oto_${num}` as keyof FormValues] === 1}
                                            onValueChange={(checked) => {
                                                const newValue = checked ? 1 : 0;
                                                console.log(`Changing oto_${num} from`, formik.values[`oto_${num}` as keyof FormValues], 'to', newValue);
                                                formik.setFieldValue(`oto_${num}`, newValue);
                                            }}
                                            classNames={{
                                                base: "w-full",
                                                label: "text-sm font-medium",
                                                wrapper: "p-2"
                                            }}
                                        >
                                            OTO {num}
                                        </Checkbox>
                                    ))}
                                </div>
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
                                    Update User
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </ModalContent>
        </Modal>
    );
} 