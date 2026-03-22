import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getOrderHistory, cancelOrder } from '../services/orderService';
import styles from './History.module.css';

// Tách Component Modal để dễ quản lý
function CancelModal({ isOpen, onClose, onConfirm, orderId }) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason) {
      alert('Vui lòng chọn lý do!');
      return;
    }
    onConfirm(orderId, reason);
    setReason('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalSm}>
        <h3 className={styles.modalTitle}>Hủy đơn hàng?</h3>
        <p>Đơn hàng sẽ bị hủy và không thể khôi phục.</p>

        <div className={styles.textLeft} style={{ marginBottom: '20px' }}>
          <label>Lý do hủy:</label>
          <select
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
          <button className="btn btn-secondary" onClick={onClose}>Không</button>
          <button className="btn btn-danger" onClick={handleConfirm}>Đồng ý hủy</button>
        </div>
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
  const [cancellableUntil, setCancellableUntil] = useState({});

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrderHistory();
      const orderList = response.data || [];
      setOrders(orderList);

      const newCancellableUntil = {};
      orderList.forEach(order => {
        if (order.status === 'pending' || order.status === 'processing') {
          newCancellableUntil[order.id] = 60;
        }
      });
      setCancellableUntil(newCancellableUntil);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    } else {
      loadOrders();
    }
  }, [navigate, loadOrders]);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCancellableUntil(prev => {
        const updated = { ...prev };
        let hasChanged = false;
        Object.keys(updated).forEach(orderId => {
          if (updated[orderId] > 0) {
            updated[orderId] -= 1;
            hasChanged = true;
          } else {
            delete updated[orderId];
            hasChanged = true;
          }
        });
        return hasChanged ? updated : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleConfirmCancel = async (orderId, reason) => {
    try {
      await cancelOrder(orderId);
      alert('Đã hủy đơn hàng thành công');
      setShowCancelModal(false);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled', cancelReason: reason } : o));
      setCancellableUntil(prev => {
        const updated = { ...prev };
        delete updated[orderId];
        return updated;
      });
    } catch (error) {
      alert('Không thể hủy đơn hàng lúc này!');
    }
  };

  const getStatusColor = (status) => {
    const colors = { pending: '#FF9800', confirmed: '#2196F3', shipping: '#00BCD4', completed: '#4CAF50', cancelled: '#F44336', processing: '#FF9800' };
    return colors[status] || '#666';
  };

  return (
    <>
      <Navbar />
      <div className={`container ${styles.mainContentArea}`}>
        <h2 className={styles.pageTitle}>Lịch sử đơn hàng</h2>
        
        {loading ? (
          <div className="text-center mt-30">Đang tải...</div>
        ) : orders.length === 0 ? (
          <div className={styles.historyEmptyState}>
            <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty" width="100" />
            <h3>Chưa có đơn hàng nào</h3>
            <button className="btn btn-primary mt-20" onClick={() => navigate('/')}>Đặt món ngay</button>
          </div>
        ) : (
          <div className={styles.orderListContainer}>
            {orders.map((order) => {
              const remaining = cancellableUntil[order.id];
              const canCancel = remaining > 0;

              return (
                <div key={order.id} className={styles.orderCardModern}>
                  <div className={styles.orderHeader}>
                    <span className={styles.orderId}>ID: {order.id}</span>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span className={styles.badge} style={{ backgroundColor: getStatusColor(order.status) }}>
                        {order.status}
                      </span>
                      {canCancel && <span className={styles.countdownHint}><i className="fa-clock fa-regular"></i> {remaining}s</span>}
                    </div>
                  </div>

                  <div className={styles.orderItemsWrap}>
                    {order.items?.map((item, i) => (
                      <div key={i} className={styles.orderItemRow}>
                        <span>{item.name} x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.orderFooter}>
                    <div className={styles.totalMoney}>Tổng: <span>${order.total_price?.toFixed(2)}</span></div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary btn-sm">Mua lại</button>
                      {canCancel && (
                        <button className="btn btn-danger btn-sm" onClick={() => { setSelectedOrderId(order.id); setShowCancelModal(true); }}>
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        orderId={selectedOrderId}
      />
    </>
  );
}