import { useEffect, useState } from "react";
import type { User } from "../../types/User";
import api from "../../helper/api";
import { toast } from "react-toastify";
import { HiUsers } from "react-icons/hi";
import {
  LoadingSpinner,
  PageHeader,
  EmptyState,
  Modal,
  Button,
} from "../../components/ui";

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Kullanıcı listesi alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      await api.patch(`/users/${id}/role`, { role: newRole });
      toast.success("Kullanıcı rolü güncellendi");
      setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    } catch (error) {
      toast.error("Rol değiştirilemedi.");
    }
  };

  const handleDelete = async () => {
    if (!userIdToDelete) return;
    try {
      await api.delete(`/users/${userIdToDelete}`);
      toast.success("Kullanıcı silindi");
      setUsers(users.filter((u) => u.id !== userIdToDelete));
      setShowDeleteModal(false);
      setUserIdToDelete(null);
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  if (loading) {
    return <LoadingSpinner message="Kullanıcılar yükleniyor..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Kullanıcı Yönetimi"
        subtitle="Kullanıcıları görüntüleyin ve yönetin"
        icon={HiUsers}
      />

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Kullanıcı Adı</th>
              <th className="px-6 py-3">Rol</th>
              <th className="px-6 py-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr
                key={user.id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-white">
                  {user.username}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="user">User</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => {
                      setUserIdToDelete(user.id);
                      setShowDeleteModal(true);
                    }}
                    className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 font-medium transition-colors"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Henüz kullanıcı bulunmuyor.
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Kullanıcıyı Sil
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri
              alınamaz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserIdToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
