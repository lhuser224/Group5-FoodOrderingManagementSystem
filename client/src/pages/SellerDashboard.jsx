import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFoodsByShop, toggleFoodStatus, deleteFood, addFood, updateFood } from '../services/foodService';
import axiosClient from '../api/axiosClient';

export default function ShopDashboard() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [currentFood, setCurrentFood] = useState(null); 
  const [formData, setFormData] = useState({ name: '', price: '', image_url: '', category_id: 1, description: '' });

  // 1. Lấy thông tin Shop trước để có shopId chuẩn
  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const res = await axiosClient.get('/FoodO/shops/me/info'); // Khớp với route /me/info của ông
        if (res.success) {
          setShop(res.data);
          loadFoods(res.data.id);
        }
      } catch (err) { console.error("Lỗi lấy thông tin shop:", err); }
    };
    fetchShopInfo();
  }, []);

  const loadFoods = async (sId) => {
    try {
      const res = await getFoodsByShop(sId);
      if (res.success) setFoods(res.data);
    } catch (err) { console.error("Lỗi lấy danh sách món:", err); }
  };

  const handleToggle = async (id) => {
    try {
      await toggleFoodStatus(id);
      loadFoods(shop.id);
    } catch (err) { alert("Không thể cập nhật trạng thái"); }
  };

  const handleDelete = async (foodId) => {
    if (window.confirm("Xóa món này nhé?")) {
      try {
        await deleteFood(shop.id, foodId);
        setFoods(foods.filter(f => f.id !== foodId));
      } catch (err) { alert("Lỗi khi xóa món"); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (currentFood) {
        await updateFood(shop.id, currentFood.id, formData);
      } else {
        await addFood(shop.id, formData);
      }
      setShowModal(false);
      loadFoods(shop.id);
      setFormData({ name: '', price: '', image_url: '', category_id: 1, description: '' });
    } catch (err) { alert("Lỗi khi lưu món ăn"); } 
    finally { setLoading(false); }
  };

  return (
    <div className="container py-5 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Quản lý thực đơn</h4>
          <p className="text-muted small">Cửa hàng: <span className="text-danger fw-bold">{shop?.shop_name || 'Loading...'}</span></p>
        </div>
        <button className="btn btn-danger shadow-sm px-4" onClick={() => { setCurrentFood(null); setFormData({name:'', price:'', image_url:'', category_id:1, description:''}); setShowModal(true); }}>
          <i className="fa-solid fa-plus me-2"></i>Thêm món
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Món ăn</th>
                <th className="text-center">Giá</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-end pe-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {foods.map(food => (
                <tr key={food.id}>
                  <td className="ps-3">
                    <div className="d-flex align-items-center">
                      <img src={food.image_url || 'https://via.placeholder.com/50'} alt="" 
                        className="rounded me-3 border" style={{ width: '45px', height: '45px', objectFit: 'cover' }} />
                      <div className="fw-bold">{food.name}</div>
                    </div>
                  </td>
                  <td className="text-center fw-bold text-danger">${parseFloat(food.price).toFixed(2)}</td>
                  <td className="text-center">
                    <div className="form-check form-switch d-inline-block">
                      <input className="form-check-input" type="checkbox" checked={food.is_active} onChange={() => handleToggle(food.id)} />
                    </div>
                  </td>
                  <td className="text-end pe-3">
                    <button onClick={() => { setCurrentFood(food); setFormData(food); setShowModal(true); }} className="btn btn-sm btn-outline-primary me-2">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button onClick={() => handleDelete(food.id)} className="btn btn-sm btn-outline-danger">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal chuẩn class Bootstrap 5 */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">{currentFood ? 'Sửa món ăn' : 'Thêm món mới'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Tên món</label>
                      <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="row">
                      <div className="col-6 mb-3">
                        <label className="form-label small fw-bold">Giá ($)</label>
                        <input type="number" step="0.01" className="form-control" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                      </div>
                      <div className="col-6 mb-3">
                        <label className="form-label small fw-bold">Danh mục</label>
                        <select className="form-select" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                          <option value="1">Đồ ăn</option>
                          <option value="2">Đồ uống</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Link ảnh</label>
                      <input type="text" className="form-control" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Đóng</button>
                    <button type="submit" className="btn btn-danger px-4" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu món'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}