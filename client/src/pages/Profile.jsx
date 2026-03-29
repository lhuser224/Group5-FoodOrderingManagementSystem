import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/authService';

export default function Profile() {
  const { user, login } = useAuth();
  const [tab, setTab] = useState('info'); // 'info' hoặc 'pass'
  const [loading, setLoading] = useState(false);

  const [infoForm, setInfoForm] = useState({ full_name: user?.full_name || '', phone: user?.phone || '' });
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateProfile(infoForm);
      if (res.success) {
        alert('Cập nhật thành công!');
        const token = localStorage.getItem('token');
        login(res.data, token); // Cập nhật lại context
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi cập nhật');
    } finally { setLoading(false); }
  };

  const handleChangePass = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) return alert('Mật khẩu mới không khớp');
    try {
      setLoading(true);
      await changePassword(passForm.oldPassword, passForm.newPassword);
      alert('Đổi mật khẩu thành công!');
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Mật khẩu cũ sai');
    } finally { setLoading(false); }
  };

  return (
    <div className="container py-5 mt-4">
      <div className="row g-4">
        {/* Sidebar Mini */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm pt-3">
            <div className="list-group list-group-flush p-2">
              <button onClick={() => setTab('info')} className={`list-group-item list-group-item-action border-0 rounded-3 mb-2 ${tab === 'info' ? 'active bg-danger' : ''}`}>
                <i className="fa-solid fa-user-gear me-2"></i>Thông tin cá nhân
              </button>
              <button onClick={() => setTab('pass')} className={`list-group-item list-group-item-action border-0 rounded-3 ${tab === 'pass' ? 'active bg-danger' : ''}`}>
                <i className="fa-solid fa-key me-2"></i>Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="col-md-9">
          <div className="card border-0 shadow-sm p-4">
            {tab === 'info' ? (
              <form onSubmit={handleUpdateInfo}>
                <h5 className="fw-bold mb-4">Cấu hình hồ sơ</h5>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Họ và tên</label>
                  <input type="text" className="form-control" value={infoForm.full_name} onChange={e => setInfoForm({...infoForm, full_name: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Số điện thoại</label>
                  <input type="text" className="form-control bg-light" value={infoForm.phone} disabled />
                </div>
                <button className="btn btn-danger px-4" disabled={loading}>Lưu thay đổi</button>
              </form>
            ) : (
              <form onSubmit={handleChangePass}>
                <h5 className="fw-bold mb-4">Bảo mật tài khoản</h5>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Mật khẩu hiện tại</label>
                  <input type="password" Hb className="form-control" value={passForm.oldPassword} onChange={e => setPassForm({...passForm, oldPassword: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Mật khẩu mới</label>
                  <input type="password" Hb className="form-control" value={passForm.newPassword} onChange={e => setPassForm({...passForm, newPassword: e.target.value})} />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold">Xác nhận mật khẩu</label>
                  <input type="password" Hb className="form-control" value={passForm.confirmPassword} onChange={e => setPassForm({...passForm, confirmPassword: e.target.value})} />
                </div>
                <button className="btn btn-primary px-4" disabled={loading}>Cập nhật mật khẩu</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}