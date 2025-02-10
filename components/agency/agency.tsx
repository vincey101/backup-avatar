'use client';

import { useCallback, useEffect, useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { format } from "date-fns";
import AddUser from "./addUser";
import DeleteUser from "./deleteUser";
import EditUser from "./editUser";
import { Input } from "@nextui-org/react";
import debounce from 'lodash/debounce';
import { toast } from "sonner";

interface AgencyUser {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: null | string;
    fcm_token: null | string;
    user_pic: null | string;
    reseller_id: number;
    fe: number;
    oto_1: number;
    oto_2: number;
    oto_3: number;
    oto_4: number;
    oto_5: number;
    oto_6: number;
    oto_7: number;
    oto_8: number;
    created_at: string;
    updated_at: string;
    is_email_verified: number;
}

export default function Agency() {
    const [users, setUsers] = useState<AgencyUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<AgencyUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
    const [editingUser, setEditingUser] = useState<AgencyUser | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Debounced search function
    const debouncedSearch = debounce((query: string) => {
        if (!query.trim()) {
            setFilteredUsers(users);
            return;
        }

        const lowercaseQuery = query.toLowerCase();
        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(lowercaseQuery)
        );
        setFilteredUsers(filtered);
    }, 300);

    // Update filtered users when users or search query changes
    useEffect(() => {
        debouncedSearch(searchQuery);
        return () => {
            debouncedSearch.cancel();
        };
    }, [users, searchQuery]);

    // Initialize filtered users when users are loaded
    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    const fetchUsers = useCallback(async () => {
        try {
            const userDataStr = localStorage.getItem('userData');
            if (!userDataStr) {
                throw new Error('User data not found');
            }

            const userData = JSON.parse(userDataStr);
            const token = userData.token;

            if (!token) {
                throw new Error('Token not found');
            }

            const response = await fetch('https://api.humanaiapp.com/api/agency', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === "success" && Array.isArray(data.users)) {
                setUsers(data.users);
            } else {
                setUsers([]);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleEdit = (user: AgencyUser) => {
        setEditingUser(user);
        setShowEditModal(true);
    };

    // Reset editing user when modal closes
    const handleEditModalClose = () => {
        setShowEditModal(false);
        setEditingUser(null); // Clear the editing user
    };

    const handleDelete = async () => {
        if (!deleteUserId) return;
        try {
            const userDataStr = localStorage.getItem('userData');
            if (!userDataStr) {
                return;
            }

            const userData = JSON.parse(userDataStr);
            const token = userData.token;

            const response = await fetch(`https://api.humanaiapp.com/api/delete-agency/${deleteUserId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.status === "success") {
                setShowDeleteModal(false);
                // Refresh the users list
                await fetchUsers();
            } else {
                console.error('Failed to delete user:', data.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Reset delete user when modal closes
    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
        setDeleteUserId(null);
    };

    const handleAddUser = useCallback(async () => {
        try {
            setIsLoading(true);
            await fetchUsers(); // Refresh the users list
        } catch (error) {
            toast.error('Error refreshing users list');
        } finally {
            setIsLoading(false);
        }
    }, [fetchUsers]);

    if (isLoading) {
        return (
            <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
    return (
            <div className="p-8">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Agency Users</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm
                        bg-gradient-to-r from-indigo-500 to-gray-900
                        hover:from-indigo-600 hover:to-gray-800
                        transform transition-all duration-200 hover:scale-[1.02]
                        shadow-md hover:shadow-lg"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add New User
                </button>
            </div>

            {/* Search Input */}
            <div className="mb-4">
                <Input
                    type="text"
                    placeholder="Search by username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                    className="max-w-xs"
                />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        {searchQuery ? 'No users found matching your search' : 'No users found'}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.role}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {format(new Date(user.created_at), 'PPp')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                >
                                                    <PencilIcon className="w-4 h-4 text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeleteUserId(user.id);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                >
                                                    <TrashIcon className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            <AddUser 
                dialog={showAddModal}
                setDialog={setShowAddModal}
                loading={isLoading}
                addUser={handleAddUser}
            />

            {/* Delete Confirmation Modal */}
            <DeleteUser
                dialog={showDeleteModal}
                setDialog={handleDeleteModalClose} // Use new handler
                deleteUser={handleDelete}
                loading={isLoading}
            />

            {/* Edit User Modal */}
            {editingUser && (
                <EditUser
                    dialog={showEditModal}
                    setDialog={handleEditModalClose} // Use new handler
                    user={editingUser}
                    onUpdate={fetchUsers}
                />
            )}
        </div>
    );
}