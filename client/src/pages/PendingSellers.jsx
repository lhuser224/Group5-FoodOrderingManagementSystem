import adminService from '../services/adminService';

const SERVER_URL = 'http://localhost:3000';

export default function PendingSellers({ sellers, refreshData }) {
  
  const handleApprove = async (id) => {
    try {
      await adminService.approveShop(id); 
      alert("Đã duyệt quán thành công!");
      refreshData();
    } catch (err) {
      alert("Duyệt lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="card border-0 shadow-sm p-4">
      <h4 className="fw-bold mb-4 text-dark">Yêu cầu mở quán đang chờ</h4>
      <table className="table table-striped align-middle">
        <thead className="table-light">
          <tr>
            <th>Ảnh hồ sơ</th>
            <th>Thông tin quán</th>
            <th>Địa chỉ</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map(s => (
            <tr key={s.id}>
              <td style={{ width: '150px' }}>
                {s.image_url ? (
                  <img 
                    src={`${SERVER_URL}${s.image_url}`} 
                    alt="License" 
                    className="rounded border shadow-sm img-thumbnail"
                    style={{ width: '120px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => window.open(`${SERVER_URL}${s.image_url}`, '_blank')}
                  />
                ) : <span className="text-muted">Không ảnh</span>}
              </td>
              <td>
                <div className="fw-bold text-primary fs-5">{s.shop_name}</div>
                <div className="small text-muted">Mã Shop: {s.id}</div>
              </td>
              <td>
                <div className="fw-bold text-dark">{s.shop_address}</div>
                <div className="small text-muted">{s.ward}, {s.district}, {s.province}</div>
              </td>
              <td className="text-center">
                <button 
                  className="btn btn-success px-4 fw-bold" 
                  onClick={() => handleApprove(s.id)}
                >
                  Phê duyệt
                </button>
              </td>
            </tr>
          ))}
          {sellers.length === 0 && (
            <tr><td colSpan="4" className="text-center py-5 text-muted">Hiện tại không có quán nào chờ duyệt.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}