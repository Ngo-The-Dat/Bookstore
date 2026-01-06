import React, { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId, userName) => {
        if (!confirm(`Bạn có chắc muốn xóa người dùng "${userName}"?`)) return;

        try {
            await adminService.deleteUser(userId);
            toast.success("Đã xóa người dùng");
            loadUsers();
        } catch (error) {
            toast.error("Lỗi khi xóa người dùng");
        }
    };

    const handleEdit = (user) => {
        setEditingUser({ ...user });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            await adminService.updateUser(editingUser._id, {
                ROLE: editingUser.ROLE,
                IS_ACTIVE: editingUser.IS_ACTIVE
            });
            toast.success("Đã cập nhật người dùng");
            setShowEditModal(false);
            loadUsers();
        } catch (error) {
            toast.error("Lỗi khi cập nhật người dùng");
        }
    };

    const filteredUsers = users.filter(user =>
        user.FULL_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.EMAIL?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.PHONE?.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email, SĐT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <span className="text-white/60 text-sm">{filteredUsers.length} người dùng</span>
            </div>

            {/* Table */}
            <div className="bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Họ tên</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">SĐT</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Vai trò</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-sm font-medium">
                                                {user.FULL_NAME?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <span className="text-white font-medium">{user.FULL_NAME}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white/80">{user.EMAIL}</td>
                                    <td className="px-6 py-4 text-white/80">{user.PHONE}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${user.ROLE === 'admin'
                                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                            : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                                            }`}>
                                            {user.ROLE === 'admin' ? 'Admin' : 'Khách hàng'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${user.IS_ACTIVE
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                            }`}>
                                            {user.IS_ACTIVE ? 'Hoạt động' : 'Đã khóa'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id, user.FULL_NAME)}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                title="Xóa"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && editingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Chỉnh sửa người dùng</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/60 mb-2">Họ tên</label>
                                <input
                                    type="text"
                                    value={editingUser.FULL_NAME}
                                    disabled
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/50 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-white/60 mb-2">Vai trò</label>
                                <select
                                    value={editingUser.ROLE}
                                    onChange={(e) => setEditingUser({ ...editingUser, ROLE: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                >
                                    <option value="customer">Khách hàng</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-white/60 mb-2">Trạng thái</label>
                                <select
                                    value={editingUser.IS_ACTIVE}
                                    onChange={(e) => setEditingUser({ ...editingUser, IS_ACTIVE: e.target.value === 'true' })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                >
                                    <option value="true">Hoạt động</option>
                                    <option value="false">Đã khóa</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
