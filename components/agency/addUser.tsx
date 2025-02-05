'use client';

import { useFormik, FormikErrors } from "formik";
import * as Yup from "yup";
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FormValues {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    oto2: string;
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

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { resetForm }) => addUser(values, resetForm)
    });

    if (!dialog) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="flex justify-end p-2">
                    <button
                        onClick={() => setDialog(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="px-6 pb-6">
                    <h2 className="text-xl font-semibold mb-6">Add New User</h2>
                    
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
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                                loading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {loading ? 'Adding...' : 'Add User'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}