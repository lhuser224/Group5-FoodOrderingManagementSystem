import { useState, useEffect } from 'react';
import OptionManager from './OptionManager';
import categoryService from '../services/categoryService'; 

export default function FoodModal({ show, onClose, formData, setFormData, onSave, loading }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (show) {
      const fetchCategories = async () => {
        try {
          const res = await categoryService.getAllCategories();
          if (res && res.success) {
            setCategories(res.data);
          }
        } catch (error) {
          console.error("Không thể tải danh mục món ăn:", error);
        }
      };
      fetchCategories();
    }
  }, [show]);

  if (!show) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        image_url: URL.createObjectURL(file)
      });
    }
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title fw-bold">Thông tin món ăn</h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            
            <form onSubmit={onSave}>
              <div className="modal-body p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                <div className="row">
                  <div className="col-md-7">
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Tên món ăn</label>
                      <input type="text" className="form-control" required 
                        value={formData.name || ''} 
                        onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="row">
                      <div className="col-6 mb-3">
                        <label className="form-label small fw-bold">Giá ($)</label>
                        <input type="number" step="0.01" className="form-control" required 
                          value={formData.price || ''} 
                          onChange={e => setFormData({...formData, price: e.target.value})} />
                      </div>
                      <div className="col-6 mb-3">
                        <label className="form-label small fw-bold">Danh mục</label>
                        <select 
                          className="form-select" 
                          required
                          value={formData.category_id || ''} 
                          onChange={e => setFormData({...formData, category_id: e.target.value})}
                        >
                          <option value="">Chọn danh mục</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Hình ảnh món ăn</label>
                      <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
                    </div>
                  </div>

                  <div className="col-md-5 border-start d-flex flex-column align-items-center justify-content-center bg-light rounded">
                    <p className="small fw-bold text-muted mb-2">Xem trước hình ảnh</p>
                    <div className="border bg-white rounded" style={{ width: '100%', height: '150px', overflow: 'hidden' }}>
                      <img 
                        src={formData.image_url || 'https://via.placeholder.com/150?text=No+Image'} 
                        alt="Preview" 
                        className="w-100 h-100" style={{ objectFit: 'cover' }}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Error+Link'}
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <OptionManager 
                  options={formData.options || []} 
                  setOptions={(newOptions) => setFormData({...formData, options: newOptions})} 
                />
              </div>

              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-secondary px-4" onClick={onClose}>Hủy</button>
                <button type="submit" className="btn btn-danger px-4" disabled={loading}>
                  {loading ? 'Đang lưu...' : 'Xác nhận món'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}