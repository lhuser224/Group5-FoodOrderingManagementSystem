import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerShop } from '../services/shopService'; 
import AddressSelector from '../components/AddressSelector';

const SellerRegistration = () => {
  const [shopName, setShopName] = useState('');
  const [addressData, setAddressData] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cleanup function: Giải phóng bộ nhớ từ đường dẫn tạm (Object URL) 
  // khi ảnh preview thay đổi hoặc khi component bị gỡ bỏ (unmount).
  // Giúp tránh hiện tượng rò rỉ bộ nhớ (Memory Leak).
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Vui lòng chỉ chọn file hình ảnh (jpg, png,...)');
        e.target.value = null;
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Dung lượng ảnh quá lớn (Vui lòng chọn ảnh < 5MB)');
        e.target.value = null;
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!addressData.province || !addressData.district || !addressData.ward) {
      setError("Vui lòng chọn đầy đủ Tỉnh/Huyện/Xã");
      setLoading(false);
      return;
    }

    if (!file) {
      setError("Vui lòng upload ảnh Giấy phép kinh doanh");
      setLoading(false);
      return;
    }

    // Khởi tạo FormData để gửi cả file và text
    const data = new FormData();
    data.append('shop_name', shopName);
    data.append('province', addressData.province);
    data.append('district', addressData.district);
    data.append('ward', addressData.ward);
    data.append('shop_address', addressData.detail || '');
    data.append('license_image', file);

    try {
      const res = await registerShop(data);

      if (res.success) {
        alert('Gửi yêu cầu thành công! Vui lòng chờ Admin phê duyệt hồ sơ.');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Đăng ký đối tác</h2>
                <p className="text-muted">Cung cấp thông tin để mở cửa hàng trên FoodO</p>
              </div>
              
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="fa-solid fa-circle-exclamation me-2"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold small">Tên cửa hàng <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control form-control-lg border-2"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                    placeholder="VD: Quán Cơm Tấm ABC"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Địa chỉ kinh doanh <span className="text-danger">*</span></label>
                  <AddressSelector onAddressChange={(data) => setAddressData(data)} />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Giấy phép kinh doanh / VSATTP <span className="text-danger">*</span></label>
                  <div className={`card p-3 bg-light border-dashed ${error && !file ? 'border-danger' : ''}`}>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                    <div className="form-text small mt-2">Định dạng hỗ trợ: JPG, PNG (Max 5MB)</div>
                    
                    {preview && (
                      <div className="mt-3 text-center bg-white p-2 rounded border shadow-sm">
                        <img 
                          src={preview} 
                          alt="Giấy phép kinh doanh preview" 
                          className="img-fluid rounded" 
                          style={{ maxHeight: '200px' }} 
                        />
                      </div>
                    )}
                  </div>
                </div>

                <hr className="my-4 opacity-25" />

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Đang xử lý...
                    </>
                  ) : "Gửi hồ sơ đăng ký"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegistration;