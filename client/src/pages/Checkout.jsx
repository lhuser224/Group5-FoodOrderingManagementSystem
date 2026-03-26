import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { createOrder } from '../services/orderService';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { state, dispatch } = useContext(AppContext);
  const { cart } = state;
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    note: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token && !!user);
  }, []);

  const total = cart.reduce((sum, item) => {
    return sum + (item.totalPrice || item.price * item.quantity);
  }, 0);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRemoveItem = (index) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index });
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để tiếp tục!');
      navigate('/auth');
      return;
    }

    if (!formData.name || !formData.address || !formData.phone) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    if (cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    try {
      setLoading(true);
      const orderItems = cart.map(item => ({
        food_id: item.id,
        quantity: item.quantity,
        selected_options: item.selected_options || {
          size: item.size || 'M',
          extras: item.extras || []
        }
      }));

      const orderPayload = {
        shop_id: 1,
        total_price: total + 2,
        items: orderItems,
        customer_info: formData
      };

      const response = await createOrder(orderPayload);

      const newOrderId = response.data?.id || '#ORD-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(newOrderId);
      setShowSuccess(true);
      dispatch({ type: 'CLEAR_CART' });
      
      setTimeout(() => {
        navigate('/history');
      }, 3000);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Lỗi: ' + (error.message || 'Không thể tạo đơn hàng!'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>      
      <div className={`container ${styles.checkoutLayout}`}>
        <div className={styles.checkoutForm}>
          <h2>Thông tin giao hàng</h2>
          <input
            type="text"
            className="form-control"
            placeholder="Họ tên"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Địa chỉ"
            id="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Số điện thoại"
            id="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <textarea 
            id="note"
            className="form-control" 
            placeholder="Ghi chú..."
            value={formData.note}
            onChange={handleInputChange}
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>

        <div className={styles.orderSummary}>
          <h3>Đơn hàng của bạn</h3>

          <div className={styles.cartItemsList}>
            {cart.length === 0 ? (
              <p style={{ color: '#777', fontStyle: 'italic' }}>Giỏ hàng đang trống</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #eee', padding: '10px 0' }}>
                  <div>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: '0.9rem', color: '#555' }}>${item.price?.toFixed(2)}</div>
                  </div>
                  <button className={styles.btnRemove} onClick={() => handleRemoveItem(index)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={{ borderTop: '2px solid #eee', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '15px' }}>
            <span>Tổng tiền:</span>
            <span style={{ color: '#ee4d2d' }}>${total.toFixed(2)}</span>
          </div>

          <button
            className="btn btn-success w-100 mt-20"
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            style={{ background: '#ee4d2d', border: 'none', padding: '12px', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Đang xử lý...' : 'Đặt hàng ngay'}
          </button>
          
          {cart.length === 0 && (
            <button 
              className="btn btn-secondary w-100 mt-20"
              onClick={() => navigate('/')}
              style={{ padding: '12px', borderRadius: '6px' }}
            >
              Quay lại chọn món
            </button>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className={styles.successModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '40px', textAlign: 'center', maxWidth: '400px' }}>
            <div style={{ fontSize: '3rem', color: '#4caf50', marginBottom: '20px' }}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2>Order Confirmed!</h2>
            <p>Your order has been placed successfully.</p>
            <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '20px' }}>Order ID: <strong>{orderId}</strong></p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
              style={{ background: '#ee4d2d', border: 'none', padding: '12px 30px', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Return to Menu
            </button>
          </div>
        </div>
      )}
    </>
  );
}