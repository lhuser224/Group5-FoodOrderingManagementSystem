import { useState, useEffect } from 'react';
import adminService from '../services/adminService'; 
import CategoryManager from './CategoryManager';
import PendingSellers from './PendingSellers';

export default function AdminDashboard() {
  const [tab, setTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await (tab === 'categories' 
        ? adminService.getCategories() 
        : adminService.getPendingShops());
      const result = res.data || res; 
      
      if (tab === 'categories') setCategories(result);
      else setSellers(result);
    } catch (err) {
      console.error("Lỗi fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        {/* Sidebar cố định bên trái */}
        <div className="col-md-2 bg-dark min-vh-100 shadow position-fixed">
          <div className="p-4 text-warning text-center border-bottom border-secondary fw-bold fs-4">
            FOOD O ADMIN
          </div>
          <div className="list-group list-group-flush mt-2">
            <button 
              className={`list-group-item list-group-item-action bg-dark text-white border-0 py-3 ${tab === 'categories' ? 'active bg-primary' : ''}`} 
              onClick={() => setTab('categories')}
            >
              <i className="bi bi-tag me-2"></i> Danh mục
            </button>
            <button 
              className={`list-group-item list-group-item-action bg-dark text-white border-0 py-3 ${tab === 'sellers' ? 'active bg-primary' : ''}`} 
              onClick={() => setTab('sellers')}
            >
              <i className="bi bi-shop me-2"></i> Duyệt người bán
            </button>
          </div>
        </div>

        {/* Nội dung chính bên phải */}
        <div className="col-md-10 offset-md-2 bg-light p-5 min-vh-100">
          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2 text-muted">Đang tải...</p>
            </div>
          ) : (
            tab === 'categories' ? 
            <CategoryManager categories={categories} refreshData={fetchData} /> : 
            <PendingSellers sellers={sellers} refreshData={fetchData} />
          )}
        </div>
      </div>
    </div>
  );
}