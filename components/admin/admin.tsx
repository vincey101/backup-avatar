'use client';

import { useCallback, useEffect, useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { format } from "date-fns";
import AddUser from "./addUser";
import DeleteUser from "./deleteUser";
import EditUser from "./editUser";
import { Input } from "@nextui-org/react";
import debounce from 'lodash/debounce';

interface AdminUser {
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

export default function Admin() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

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

            const response = await fetch('https://api.humanaiapp.com/api/users', {
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
                console.error('Invalid data format:', data);
                setUsers([]);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setError(error instanceof Error ? error.message : 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounced search function
    const debouncedSearch = debounce((query: string) => {
        if (!query.trim()) {
            setFilteredUsers(users);
            return;
        }

        const lowercaseQuery = query.toLowerCase();
        const filtered = users.filter(user => 
            user.email.toLowerCase().includes(lowercaseQuery)
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

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Initialize filtered users when users are loaded
    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    const handleEdit = (user: AdminUser) => {
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
            if (!userDataStr) return;

            const userData = JSON.parse(userDataStr);
            const token = userData.token;

            const response = await fetch(`https://api.humanaiapp.com/api/delete-user/${deleteUserId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.status === "success") {
                await fetchUsers();
            } else {
                console.error('Failed to delete user:', data.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setShowDeleteModal(false);
            setDeleteUserId(null); // Clear the delete ID
        }
    };

    // Reset delete user when modal closes
    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
        setDeleteUserId(null);
    };

    // Calculate pagination values
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Handle page changes
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Pagination component
    const Pagination = () => {
        // Logic to show limited page numbers with ellipsis
        const getPageNumbers = () => {
            const pageNumbers = [];
            if (totalPages <= 7) {
                // If 7 or fewer pages, show all
                for (let i = 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                // Always show first page
                pageNumbers.push(1);
                
                if (currentPage > 3) {
                    pageNumbers.push('...');
                }
                
                // Show pages around current page
                for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
                    pageNumbers.push(i);
                }
                
                if (currentPage < totalPages - 2) {
                    pageNumbers.push('...');
                }
                
                // Always show last page
                pageNumbers.push(totalPages);
            }
            return pageNumbers;
        };

        return (
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-t border-gray-200">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                        ${currentPage === 1 
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                            : 'text-gray-700 bg-white hover:bg-gray-50 border'}`}
                >
                    Previous
                </button>

                <div className="flex gap-1">
                    {getPageNumbers().map((pageNum, index) => (
                        pageNum === '...' ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-2 text-gray-500"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(Number(pageNum))}
                                className={`px-3 py-2 text-sm font-medium rounded-md
                                    ${currentPage === pageNum
                                        ? 'bg-indigo-500 text-white'
                                        : 'text-gray-700 bg-white hover:bg-gray-50 border'}`}
                            >
                                {pageNum}
                            </button>
                        )
                    ))}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                        ${currentPage === totalPages 
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                            : 'text-gray-700 bg-white hover:bg-gray-50 border'}`}
                >
                    Next
                </button>
            </div>
        );
    };

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
            {/* Header with Add User Button */}
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Admin Users</h2>
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
                    placeholder="Search by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                    className="max-w-xs"
                />
            </div>

            {/* Adjusted table container */}
            <div className="bg-white rounded-lg shadow">
                <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200 table-fixed">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                                        Username
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                                        Created At
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                                            {searchQuery ? 'No users found matching your search' : 'No users found'}
                                        </td>
                                    </tr>
                                ) : (
                                    currentUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 overflow-hidden text-ellipsis">
                                                {user.name}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 overflow-hidden text-ellipsis">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.role}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {format(new Date(user.created_at), 'PPp')}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex items-center space-x-2">
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
            </div>

            {/* Add Pagination component after the table */}
            {filteredUsers.length > 0 && <Pagination />}

            {/* Modals */}
            <AddUser 
                dialog={showAddModal}
                setDialog={setShowAddModal}
                loading={isLoading}
                addUser={fetchUsers}
            />

            <DeleteUser
                dialog={showDeleteModal}
                setDialog={handleDeleteModalClose} // Use new handler
                deleteUser={handleDelete}
                loading={isLoading}
            />

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