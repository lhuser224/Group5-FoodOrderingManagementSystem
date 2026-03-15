import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getUserOrders, cancelOrder, updateOrderStatus } from '../services/orderService';
import styles from './History.module.css';

function CancelModal({ isOpen, onClose, onConfirm, orderId }) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason) {
      alert('Vui lòng chọn lý do!');
      return;
    }
    onConfirm(orderId);
    setReason('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalSm}>
      <h3 className={styles.modalTitle}>Hủy đơn hàng?</h3>
      <p>Đơn hàng sẽ bị hủy và không thể khôi phục.</p>

      <div className={styles.textLeft} style={{ marginBottom: '20px' }}>
        <label>Lý do hủy:</label>
        <select
          id="cancel-reason"
          className="form-control"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">-- Chọn lý do --</option>
          <option value="Thay đổi ý định">Thay đổi ý định</option>
          <option value="Tìm thấy giá rẻ hơn">Tìm thấy giá rẻ hơn</option>
          <option value="Thời gian giao quá lâu">Thời gian giao quá lâu</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      <div className={styles.modalActions}>
        <button
          className="btn btn-secondary"
          onClick={onClose}
        >
          Không
        </button>
        <button
          className="btn btn-danger"
          onClick={handleConfirm}
        >
          Đồng ý hủy
        </button>
      </div>
    </div>
  );
}

export default function History() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }
    loadOrders();
  }, [navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await getUserOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async (orderId) => {
    try {
      await cancelOrder(orderId);
      alert('Đã hủy đơn hàng thành công');
      setShowCancelModal(false);
      setSelectedOrderId(null);
      loadOrders();
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Lỗi: Không thể hủy đơn hàng!');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FF9800',
      confirmed: '#2196F3',
      shipping: '#00BCD4',
      completed: '#4CAF50',
      cancelled: '#F44336',
      processing: '#FF9800'
    };
    return colors[status] || '#666';
  };

  if (!localStorage.getItem('token')) {
    return (
      <>
        <Navbar />
        <div className={`container ${styles.mainContentArea}`}>
          <div className={styles.historyEmptyState}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="Empty"
              width="120"
            />
            <h3>Chưa có đơn hàng nào</h3>
            <p>Hãy đặt món ăn ngon ngay bây giờ!</p>
            <button className="btn btn-primary mt-20" onClick={() => navigate('/')}>
              Đặt món ngay
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className={`container ${styles.mainContentArea} ${styles.historyLayout}`}>
        <h2 className={styles.pageTitle}>Lịch sử đơn hàng</h2>

        <div>
          {orders.map((order) => {
            const canCancel = order.status === 'pending';

            return (
              <div
                key={order.id}
                className={styles.orderCardModern}
              >
                <div className={styles.orderHeader}>
                  <div>
                    <span className={styles.shopNameSmall}>
                      <i className="fa-solid fa-store"></i> Food Order App
                    </span>
                    <span className={styles.orderId}>
                      Đơn #{order.id}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      className={styles.badge}
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status === 'pending' && 'Chờ xác nhận'}
                      {order.status === 'confirmed' && 'Đã xác nhận'}
                      {order.status === 'shipping' && 'Đang giao'}
                      {order.status === 'completed' && 'Đã giao'}
                      {order.status === 'cancelled' && 'Đã hủy'}
                    </span>
                    {canCancel && (
                      <span className={styles.countdownHint}>
                        <i className="fa-regular fa-clock"></i> Có thể hủy
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <div className={styles.orderItemRow}>
                    <div className={styles.itemImgSmall}>
                      <i className="fa-solid fa-utensils"></i>
                    </div>
                    <div className={styles.itemDetail}>
                      <div className={styles.itemName}>{orders.length} món ăn</div>
                      <div className={styles.itemPrice}>
                        Tổng giá: ${order.total_price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.totalMoney}>
                    Tổng tiền: <span style={{ color: '#FF6B6B', fontWeight: 'bold' }}>
                      ${order.total_price.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary btn-sm">
                      Chi tiết
                    </button>
                    {canCancel && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleOpenCancelModal(order.id)}
                      >
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCancelModal && (
        <div className={styles.successModal}>
          <CancelModal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            onConfirm={handleConfirmCancel}
            orderId={selectedOrderId}
          />
        </div>
      )}
    </>
  );
}
