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
      showAlert('Không thể kết nối đến server!', 'error');
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
    <div className={styles.sellerDashboardWrapper}>
      <Navbar />
      
      <div className={styles.dashboardContainer}>
        {alertMsg && (
          <div className={`${styles.alert} ${styles[alertType]}`}>
            {alertMsg}
          </div>
        )}

        <div className={styles.dashboardHeader}>
          <h1>Quản lý cửa hàng</h1>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'foods' ? styles.active : ''}`}
              onClick={() => setActiveTab('foods')}
            >
              <i className="fa-solid fa-utensils"></i> Danh sách món
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <i className="fa-solid fa-receipt"></i> Đơn hàng
            </button>
          </div>
        </div>

        {activeTab === 'foods' && (
          <div className={styles.foodsSection}>
            <button
              className={styles.addFoodBtn}
              onClick={() => setShowForm(!showForm)}
            >
              <i className="fa-solid fa-plus"></i> Thêm món ăn
            </button>

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
                  placeholder="Giá (VND)"
                  step="1000"
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
                  <button className={styles.btnSave} onClick={handleSubmitFood}>
                    Lưu
                  </button>
                  <button className={styles.btnCancel} onClick={() => setShowForm(false)}>
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className={styles.loading}>Đang tải...</div>
            ) : (
              <div className={styles.foodsList}>
                {products.map((food) => (
                  <div key={food.id} className={styles.foodCard}>
                    <div className={styles.foodImage}>
                      {food.image_url ? (
                        <img src={food.image_url} alt={food.name} />
                      ) : (
                        <i className="fa-solid fa-image"></i>
                      )}
                    </div>
                    <div className={styles.foodInfo}>
                      <h3>{food.name}</h3>
                      <p className={styles.price}>${food.price.toFixed(2)}</p>
                      <div className={styles.foodActions}>
                        <label className={styles.switchToggle}>
                          <input
                            type="checkbox"
                            checked={food.status === 'available'}
                            onChange={() => handleToggleFoodStatus(food.id)}
                          />
                          <span className={styles.slider}></span>
                          {food.status === 'available' ? 'Kinh doanh' : 'Tạm dừng'}
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className={styles.ordersSection}>
            {loading ? (
              <div className={styles.loading}>Đang tải...</div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <h3>Đơn #{order.id}</h3>
                      <span className={styles.orderStatus}>{order.status}</span>
                    </div>
                    <div className={styles.orderDetails}>
                      <p><strong>Khách:</strong> {order.user_details?.full_name || 'N/A'}</p>
                      <p><strong>SĐT:</strong> {order.user_details?.phone || 'N/A'}</p>
                      <p><strong>Địa chỉ:</strong> {order.user_details?.address_detail || 'N/A'}</p>
                      <p><strong>Tổng tiền:</strong> ${order.total_price.toFixed(2)}</p>
                    </div>
                    <div className={styles.orderActions}>
                      {order.status === 'pending' && (
                        <button
                          className={styles.btnAction}
                          onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                        >
                          Xác nhận
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          className={styles.btnAction}
                          onClick={() => handleUpdateOrderStatus(order.id, 'shipping')}
                        >
                          Đang giao
                        </button>
                      )}
                      {order.status === 'shipping' && (
                        <button
                          className={styles.btnAction}
                          onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                        >
                          Hoàn thành
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
