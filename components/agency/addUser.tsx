'use client';

import { useFormik, FormikErrors } from "formik";
import * as Yup from "yup";
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useState } from 'react';

interface FormValues {
    username: string;  // This will be sent as 'name' to the API
    email: string;
    password: string;
    firstname: string; // For UI only
    lastname: string;  // For UI only
    oto2: string;     // For UI only
}

interface AddUserProps {
    dialog: boolean;
    setDialog: (show: boolean) => void;
    loading: boolean;
    addUser: (values: FormValues, resetForm: () => void) => void;
}

export default function AddUser({ dialog, setDialog, loading, addUser }: AddUserProps) {
    const initialValues: FormValues = {
        username: "",
        email: "",
        firstname: "",
        lastname: "",
        password: '',
        oto2: '0'
    };

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is Required"),
        email: Yup.string()
            .email("Email is Incorrect")
            .required("Email is Required"),
        firstname: Yup.string().required("Firstname is Required"),
        lastname: Yup.string().required("Lastname is Required"),
        password: Yup.string().required("Password is Required").min(6, 'Password is too short'),
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (isSubmitting) return;
            setIsSubmitting(true);

            try {
                const userDataStr = localStorage.getItem('userData');
                if (!userDataStr) {
                    toast.error('User data not found');
                    return;
                }

                const userData = JSON.parse(userDataStr);
                const token = userData.token;

                if (!token) {
                    toast.error('Authentication token not found');
                    return;
                }

                const apiData = {
                    name: values.username,
                    email: values.email,
                    password: values.password
                };

                console.log('Submitting user data:', apiData); // Debug log

                const response = await fetch('https://api.humanaiapp.com/api/add-agency', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(apiData),
                });

                const data = await response.json();
                console.log('API Response:', data); // Debug log

                if (data.status === "success") {
                    // First show the success message
                    toast.success('User added successfully!');
                    
                    // Then reset form and close modal
                    resetForm();
                    setDialog(false);
                    
                    // Finally refresh the list
                    await addUser(values, resetForm);
                    
                    // Show another toast for list refresh
                    toast.success('User list updated!');
                } else {
                    toast.error(data.message || 'Failed to add user');
                }
            } catch (error) {
                toast.error('An error occurred while adding the user');
            } finally {
                setIsSubmitting(false);
            }
        }
    });

    if (!dialog) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
                    <button
                        onClick={() => setDialog(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="px-6 py-4">
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div>
                            <input
                                className={`w-full px-3 py-2 border rounded-md ${
                                    formik.touched.username && formik.errors.username 
                                    ? 'border-red-500' 
                                    : 'border-gray-300'
                                }`}
                                placeholder="Username"
                                {...formik.getFieldProps('username')}
                            />
                            {formik.touched.username && formik.errors.username && (
                                <p className="mt-1 text-sm text-red-500">{formik.errors.username}</p>
                            )}
                        </div>

                        <div>
                            <input
                                className={`w-full px-3 py-2 border rounded-md ${
                                    formik.touched.email && formik.errors.email 
                                    ? 'border-red-500' 
                                    : 'border-gray-300'
                                }`}
                                placeholder="Email"
                                type="email"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <input
                                className={`w-full px-3 py-2 border rounded-md ${
                                    formik.touched.firstname && formik.errors.firstname 
                                    ? 'border-red-500' 
                                    : 'border-gray-300'
                                }`}
                                placeholder="First Name"
                                {...formik.getFieldProps('firstname')}
                            />
                            {formik.touched.firstname && formik.errors.firstname && (
                                <p className="mt-1 text-sm text-red-500">{formik.errors.firstname}</p>
                            )}
                        </div>

                        <div>
                            <input
                                className={`w-full px-3 py-2 border rounded-md ${
                                    formik.touched.lastname && formik.errors.lastname 
                                    ? 'border-red-500' 
                                    : 'border-gray-300'
                                }`}
                                placeholder="Last Name"
                                {...formik.getFieldProps('lastname')}
                            />
                            {formik.touched.lastname && formik.errors.lastname && (
                                <p className="mt-1 text-sm text-red-500">{formik.errors.lastname}</p>
                            )}
                        </div>

                        <div>
                            <input
                                className={`w-full px-3 py-2 border rounded-md ${
                                    formik.touched.password && formik.errors.password 
                                    ? 'border-red-500' 
                                    : 'border-gray-300'
                                }`}
                                placeholder="Password"
                                type="password"
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <p className="font-semibold text-sm">Select Plans</p>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked
                                        disabled
                                        className="form-checkbox text-gray-400"
                                    />
                                    <span>FE</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formik.values.oto2 === '1'}
                                        onChange={(e) => {
                                            formik.setFieldValue('oto2', e.target.checked ? '1' : '0')
                                        }}
                                        className="form-checkbox text-blue-600"
                                    />
                                    <span>Unlimited</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className={`w-full py-2 px-4 rounded-lg text-white font-medium
                                ${isSubmitting || loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-500 to-gray-900 hover:from-indigo-600 hover:to-gray-800'
                                }
                                transform transition-all duration-200 hover:scale-[1.02]
                                shadow-md hover:shadow-lg
                            `}
                        >
                            {isSubmitting ? 'Adding...' : 'Add User'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}