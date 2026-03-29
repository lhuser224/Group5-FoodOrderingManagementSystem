import { useState } from 'react';
import adminService from '../services/adminService';

export default function CategoryManager({ categories, refreshData }) {
  const [newCat, setNewCat] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleAdd = async (e) => {
    if (e) e.preventDefault();
    if (!newCat.trim()) return;
    try {
      await adminService.createCategory(newCat);
      setNewCat('');
      refreshData();
    } catch (err) { 
      alert("Lỗi thêm: " + (err.response?.data?.message || err.message)); 
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await adminService.toggleCategory(id, currentStatus);
      refreshData();
    } catch (err) { 
      alert("Lỗi trạng thái: " + (err.response?.data?.message || err.message)); 
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      await adminService.updateCategory(id, editName);
      setEditingId(null);
      refreshData();
    } catch (err) { 
      alert("Lỗi cập nhật: " + (err.response?.data?.message || err.message)); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await adminService.deleteCategory(id);
      refreshData();
    } catch (err) { 
      alert("Lỗi xóa: " + (err.response?.data?.message || err.message)); 
    }
  };

  return (
    <div className="card border-0 shadow-sm p-4">
      <h4 className="fw-bold mb-4 text-dark">Quản lý Danh mục</h4>
      
      <form className="input-group mb-4 w-50" onSubmit={handleAdd}>
        <input 
          id="add-category-input"
          name="new_category"
          type="text" 
          className="form-control" 
          placeholder="Nhập tên danh mục mới..." 
          value={newCat} 
          onChange={(e) => setNewCat(e.target.value)} 
        />
        <button className="btn btn-primary px-4" type="submit">Thêm</button>
      </form>

      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Trạng thái</th>
            <th className="text-center">Hiển thị</th>
            <th className="text-end">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>
                {editingId === cat.id ? (
                  <div className="input-group input-group-sm">
                    <input 
                      id={`edit-input-${cat.id}`}
                      name={`edit_name_${cat.id}`}
                      type="text" 
                      className="form-control" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)} 
                    />
                    <button className="btn btn-success" onClick={() => handleUpdate(cat.id)}>Lưu</button>
                    <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Hủy</button>
                  </div>
                ) : (
                  <span className="fw-bold">{cat.name}</span>
                )}
              </td>
              <td>
                <span className={`badge ${cat.is_active ? 'bg-success' : 'bg-secondary'}`}>
                  {cat.is_active ? 'Đang hiện' : 'Đang ẩn'}
                </span>
              </td>
              <td className="text-center">
                <div className="form-check form-switch d-inline-block">
                  <input 
                    id={`switch-${cat.id}`}
                    name={`is_active_${cat.id}`}
                    className="form-check-input" 
                    type="checkbox" 
                    style={{ cursor: 'pointer' }}
                    checked={cat.is_active || false} 
                    onChange={() => handleToggle(cat.id, cat.is_active)} 
                  />
                </div>
              </td>
              <td className="text-end">
                <button 
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => {
                    setEditingId(cat.id);
                    setEditName(cat.name);
                  }}
                >
                  Sửa
                </button>
                <button 
                  className="btn btn-sm btn-outline-danger" 
                  onClick={() => handleDelete(cat.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}