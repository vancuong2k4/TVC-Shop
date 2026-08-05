import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FiUnlock, FiLock, FiShield, FiUser } from 'react-icons/fi';
import dayjs from 'dayjs';

const AdminUsers = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleRole = async (user) => {
        if (user.id === currentUser.id && user.role === 'admin') {
            alert('Bạn không thể tự giáng cấp chính mình!');
            return;
        }

        const newRole = user.role === 'admin' ? 'customer' : 'admin';
        if (!window.confirm(`Bạn có chắc muốn cấp quyền ${newRole.toUpperCase()} cho user ${user.full_name}?`)) return;

        try {
            await api.put(`/admin/users/${user.id}/role`, { role: newRole });
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleToggleStatus = async (user) => {
        if (user.id === currentUser.id) {
            alert('Bạn không thể tự khóa tài khoản của chính mình!');
            return;
        }
        if (user.role === 'admin') {
            alert('Bạn không thể khóa tài khoản của Admin khác!');
            return;
        }

        const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
        const actionText = newStatus === 'blocked' ? 'KHÓA' : 'MỞ KHÓA';
        
        if (!window.confirm(`Bạn có chắc muốn ${actionText} tài khoản của ${user.full_name}?`)) return;

        try {
            await api.put(`/admin/users/${user.id}/status`, { status: newStatus });
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold font-playfair">Quản Lý Khách Hàng</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số đơn hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className={user.status === 'blocked' ? 'bg-red-50/50' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold uppercase">
                                            {user.full_name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.status === 'blocked' ? 'Bị khóa' : 'Hoạt động'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.orders_count} đơn
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {dayjs(user.created_at).format('DD/MM/YYYY')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => handleToggleRole(user)}
                                        disabled={user.id === currentUser?.id}
                                        className={`mr-3 ${user.id === currentUser?.id ? 'text-gray-300' : 'text-indigo-600 hover:text-indigo-900'}`}
                                        title="Đổi vai trò"
                                    >
                                        {user.role === 'admin' ? <FiUser size={18} /> : <FiShield size={18} />}
                                    </button>
                                    <button 
                                        onClick={() => handleToggleStatus(user)}
                                        disabled={user.id === currentUser?.id || user.role === 'admin'}
                                        className={`${(user.id === currentUser?.id || user.role === 'admin') ? 'text-gray-300' : 'text-red-600 hover:text-red-900'}`}
                                        title={user.status === 'blocked' ? 'Mở khóa' : 'Khóa tài khoản'}
                                    >
                                        {user.status === 'blocked' ? <FiUnlock size={18} /> : <FiLock size={18} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
