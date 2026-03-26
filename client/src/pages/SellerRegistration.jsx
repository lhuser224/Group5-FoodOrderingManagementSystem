import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import AddressSelector from '../components/AddressSelector';

const SellerRegistration = () => {
  const [shopName, setShopName] = useState('');
  const [addressData, setAddressData] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

    const data = new FormData();
    data.append('shop_name', shopName);
    data.append('province', addressData.province);
    data.append('district', addressData.district);
    data.append('ward', addressData.ward);
    data.append('shop_address', addressData.detail);
    data.append('license_image', file);

    try {
      const response = await axiosClient.post('/shops', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        alert('Gửi yêu cầu thành công! Vui lòng chờ Admin phê duyệt hồ sơ.');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu');
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
              <h2 className="text-center mb-1 fw-bold text-primary">Đăng ký đối tác</h2>
              <p className="text-center text-muted mb-4">Cung cấp thông tin để mở cửa hàng trên FoodO</p>
              
              {error && (
                <div className="alert alert-danger shadow-sm" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Tên cửa hàng <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                    placeholder="VD: Quán Cơm Tấm ABC"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Địa chỉ kinh doanh <span className="text-danger">*</span></label>
                  <AddressSelector onAddressChange={(data) => setAddressData(data)} />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Giấy phép kinh doanh / Xác nhận VSATTP <span className="text-danger">*</span></label>
                  <div className={`card p-3 bg-light ${error && !file ? 'border-danger' : ''}`}>
                    <input
                      type="file"
                      className="form-control form-control-sm"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleFileChange}
                      required
                    />
                    <div className="form-text text-muted small mt-1">
                      Chấp nhận file: JPG, PNG, JPEG (Tối đa 5MB).
                    </div>
                    {preview && (
                      <div className="mt-3 text-center border rounded p-2 bg-white shadow-sm">
                        <p className="text-success small mb-1 fw-medium">Đã chọn file: {file.name}</p>
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="rounded" 
                          style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'contain' }} 
                        />
                      </div>
                    )}
                  </div>
                </div>

                <hr className="my-4 text-secondary opacity-25" />

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
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