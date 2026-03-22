import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getFoods, addFood, toggleFoodStatus } from '../services/foodService';
import { getShopOrders, updateOrderStatus } from '../services/orderService';
import styles from './SellerDashboard.module.css';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [shopId] = useState(localStorage.getItem('shopId') || 1);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('foods');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image_url: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }
    loadData();
  }, [navigate, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'foods') {
        const foodData = await getFoods(shopId);
        setProducts(foodData.data || []);
      } else {
        const orderData = await getShopOrders(shopId);
        setOrders(orderData.data || []);
      }
    } catch (error) {
      console.error('Load error:', error);
      showAlert('Không thể kết nối đến Database!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFoodStatus = async (foodId) => {
    try {
      await toggleFoodStatus(shopId, foodId);
      showAlert('Cập nhật thành công!', 'success');
      loadData();
    } catch (error) {
      console.error('Error:', error);
      showAlert('Lỗi: Không thể cập nhật!', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showAlert('Cập nhật đơn hàng thành công!', 'success');
      loadData();
    } catch (error) {
      console.error('Error:', error);
      showAlert('Lỗi: Không thể cập nhật đơn hàng!', 'error');
    }
  };

  const showAlert = (msg, type) => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => {
      setAlertMsg('');
      setAlertType('');
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitFood = async () => {
    if (!formData.name || !formData.price) {
      showAlert('Vui lòng nhập đầy đủ tên và giá!', 'error');
      return;
    }

    try {
      await addFood(shopId, {
        name: formData.name,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        category_id: 1
      });
      showAlert('Thêm món thành công!', 'success');
      setShowForm(false);
      setFormData({ name: '', price: '', image_url: '' });
      loadData();
    } catch (error) {
      console.error('Error:', error);
      showAlert('Lỗi: Không thể thêm món ăn!', 'error');
    }
  };

  return (
    <div className={styles.dashboardWrapper}>
      <Navbar />
      
      <div className={styles.dashboardContainer}>
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Quản lý Cửa hàng #{shopId}</h3>
          <button 
            onClick={() => setShowForm(!showForm)}
            className={styles.sidebarButton}
          >
            <i className="fa-solid fa-plus"></i> Thêm món mới
          </button>
          <p className={styles.sidebarInfo}>Sản phẩm: <strong>{products.length}</strong></p>

          <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <button 
              onClick={() => setActiveTab('foods')}
              className={`${styles.tabButton} ${activeTab === 'foods' ? styles.active : ''}`}
            >
              <i className="fa-solid fa-utensils"></i> Danh sách món
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}
            >
              <i className="fa-solid fa-receipt"></i> Đơn hàng
            </button>
          </div>
        </aside>

        <main className={styles.mainContent}>
          {alertMsg && (
            <div className={`${styles.alert} ${alertType === 'error' ? styles.alertError : ''}`}>
              {alertMsg}
            </div>
          )}

          {activeTab === 'foods' && (
            <div>
              {showForm && (
                <div className={styles.formContainer}>
                  <h3>Thêm món ăn mới</h3>
                  <input
                    type="text"
                    id="name"
                    placeholder="Tên món ăn"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    id="price"
                    placeholder="Giá"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    id="image_url"
                    placeholder="URL hình ảnh"
                    value={formData.image_url}
                    onChange={handleInputChange}
                  />
                  <div className={styles.formActions}>
                    <button className={styles.btnCancel} onClick={() => setShowForm(false)}>
                      Đóng
                    </button>
                    <button className={styles.btnSave} onClick={handleSubmitFood}>
                      Lưu
                    </button>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <h3>Thực đơn từ Database</h3>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Đang tải dữ liệu...</div>
              ) : (
                <div className={styles.gridV2}>
                  {products.length > 0 ? (
                    products.map((food) => (
                      <div key={food.id} className={styles.cardV2}>
                        <div className={styles.cardThumb}>
                          {food.image_url ? (
                            <img src={food.image_url} alt={food.name} />
                          ) : (
                            <i className="fa-solid fa-utensils"></i>
                          )}
                        </div>
                        <div className={styles.cardDetails}>
                          <h4 className={styles.foodName}>{food.name}</h4>
                          <div className={styles.priceTag}>${food.price.toFixed(2)}</div>
                          <div className={styles.cardBottom}>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                checked={food.status === 'available'}
                                onChange={() => handleToggleFoodStatus(food.id)}
                              />
                              <span className={styles.slider}></span>
                            </label>
                            <span style={{ fontSize: '0.85rem', color: food.status === 'available' ? '#4caf50' : '#f44336' }}>
                              {food.status === 'available' ? 'Đang bán' : 'Tạm ẩn'}
                            </span>
                            <button style={{ padding: '5px 10px', fontSize: '0.85rem', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Chưa có món ăn nào.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3>Danh sách đơn hàng</h3>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Đang tải đơn hàng...</div>
              ) : (
                <div className={styles.ordersList}>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                          <div>
                            <h4>Đơn #{order.id}</h4>
                            <p style={{ color: '#999', fontSize: '0.9rem', margin: '5px 0 0 0' }}>{order.user_details?.full_name || 'N/A'}</p>
                          </div>
                          <span className={styles.orderStatus} style={{ 
                            background: order.status === 'pending' ? '#FF9800' : order.status === 'confirmed' ? '#2196F3' : order.status === 'shipping' ? '#00BCD4' : '#4CAF50'
                          }}>
                            {order.status === 'pending' && 'Chờ xác nhận'}
                            {order.status === 'confirmed' && 'Đã xác nhận'}
                            {order.status === 'shipping' && 'Đang giao'}
                            {order.status === 'completed' && 'Hoàn thành'}
                          </span>
                        </div>

                        <div className={styles.orderDetails}>
                          <p><strong>SĐT:</strong> {order.user_details?.phone || 'N/A'}</p>
                          <p><strong>Địa chỉ:</strong> {order.user_details?.address_detail || 'N/A'}</p>
                          <p><strong>Tổng tiền:</strong> <span style={{ color: '#ee4d2d', fontWeight: 'bold' }}>${order.total_price?.toFixed(2) || '0.00'}</span></p>
                        </div>

                        <div className={styles.orderActions}>
                          {order.status === 'pending' && (
                            <button
                              className={styles.btnAction}
                              onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                              style={{ background: '#2196F3' }}
                            >
                              Xác nhận
                            </button>
                          )}
                          {order.status === 'confirmed' && (
                            <button
                              className={styles.btnAction}
                              onClick={() => handleUpdateOrderStatus(order.id, 'shipping')}
                              style={{ background: '#00BCD4' }}
                            >
                              Đang giao
                            </button>
                          )}
                          {order.status === 'shipping' && (
                            <button
                              className={styles.btnAction}
                              onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                              style={{ background: '#4CAF50' }}
                            >
                              Hoàn thành
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Chưa có đơn hàng nào</p>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
