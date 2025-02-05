'use client';

import { useCallback, useEffect, useState } from "react";
import { PlusIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import AddUser from "./addUser";
import DeleteUser from "./deleteUser";
import EditUser from "./editUser";
import { format } from "date-fns";
import lodash from 'lodash';

// Types
interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
}

interface Plan {
    id: number;
    name: string;
    oto2: number;
}

interface AgencyUser {
    user: User;
    plan: Plan;
    created_at: string;
}

interface PlanItem {
    id: number;
    name: string;
}

export default function Agency() {
    const [loading, setLoading] = useState(false);
    const [deleteDialog, setDel] = useState(false);
    const [delID, setDeleteID] = useState('');
    const [editDetails, setEditDetails] = useState<AgencyUser | null>(null);
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [planList, setPlanList] = useState<PlanItem[]>([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [agencyUsers, setAgencyUsers] = useState<AgencyUser[]>([]);

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = agencyUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(agencyUsers.length / itemsPerPage);

    // Updated fetch function with error handling
    const fetchAgencyUsers = useCallback(async () => {
        try {
            const response = await fetch('/api/agency/users');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            const data = await response.json();
            if (data.success) {
                setAgencyUsers(data.users);
            }
        } catch (error) {
            console.error('Failed to fetch agency users:', error);
            setAgencyUsers([]); // Set empty array on error
        }
    }, []);

    // Updated useEffect with better error handling
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [plansResponse, usersResponse] = await Promise.all([
                    fetch('/api/plans'),
                    fetch('/api/agency/users')
                ]);

                // Check if responses are ok and are JSON
                if (!plansResponse.ok || !usersResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const plansData = await plansResponse.json();
                const usersData = await usersResponse.json();

                if (plansData.success) {
                    setPlanList(plansData.plans);
                }
                if (usersData.success) {
                    setAgencyUsers(usersData.users);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setPlanList([]);
                setAgencyUsers([]);
            }
        };

        fetchData();
    }, []);

    // Updated deleteUser function with error handling
    const deleteUser = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/agency/users/${delID}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.success) {
                await fetchAgencyUsers();
                setDel(false);
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
        } finally {
            setLoading(false);
        }
    }, [delID, fetchAgencyUsers]);

    // Updated toggleStatus function with error handling
    const toggleStatus = useCallback(async (user: User) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/agency/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    is_active: !user.is_active,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.success) {
                await fetchAgencyUsers();
            }
        } catch (error) {
            console.error('Failed to toggle status:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchAgencyUsers]);

    const addAgencyUser = async (values: any, resetForm: () => void) => {
        setLoading(true);
        try {
            const response = await fetch('/api/agency/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();

            if (data.success) {
                await fetchAgencyUsers();
                setAddDialog(false);
                resetForm();
            }
        } catch (error) {
            console.error('Failed to add user:', error);
        } finally {
            setLoading(false);
        }
    };

    const editUser = async (values: any, resetForm: () => void) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/agency/users/${values.userid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();

            if (data.success) {
                await fetchAgencyUsers();
                setEditDialog(false);
                resetForm();
            }
        } catch (error) {
            console.error('Failed to edit user:', error);
        } finally {
            setLoading(false);
        }
    };

    const planStringMapper = (plan: {
        oto1?: number;
        oto2?: number;
        oto3?: number;
        oto4?: number;
        oto5?: number;
        oto6?: number;
        oto7?: number;
        oto8?: number;
        user?: object;
    }) => {
        if (!plan || Object.keys(plan).length === 0) return '';

        let content: string = '';
        let index: number = 0;

        for (const item in plan) {
            if (item?.includes('oto') && plan[item as keyof typeof plan]) {
                const planItem = lodash.find(planList, (p) => p.id === index);
                content += `${planItem?.name || ''} `;
            }
            index += 1;
        }

        return content.trim().replaceAll(' ', ', ');
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto font-sans p-8">
            <div className="flex justify-between items-center mb-8 mt-4">
                <h1 className="text-3xl font-bold text-gray-900">Agency</h1>
                <button
                    onClick={() => setAddDialog(true)}
                    className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add New User
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Full Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Plans
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date Added
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Active
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((user: any, index: number) => (
                                    <tr key={user.user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.user.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {`${user.user.first_name} ${user.user.last_name}`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {planStringMapper(user.plan)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {format(new Date(user.created_at), 'Pp')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={user.user.is_active}
                                                    onChange={(e) => {
                                                        toggleStatus(user.user)
                                                    }}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditDialog(true)
                                                        setEditDetails(user)
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDel(true)
                                                        setDeleteID(user.user.id)
                                                    }}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(indexOfLastItem, agencyUsers.length)}
                                </span>{' '}
                                of <span className="font-medium">{agencyUsers.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddUser dialog={addDialog} setDialog={setAddDialog} loading={loading} addUser={addAgencyUser} />
            <DeleteUser dialog={deleteDialog} setDialog={setDel} deleteUser={deleteUser} loading={loading} />
            {editDialog && editDetails && (
                <EditUser
                    details={editDetails}
                    editUser={editUser}
                    dialog={editDialog}
                    setDialog={setEditDialog}
                    loading={loading}
                />
            )}
        </div>
    )
}