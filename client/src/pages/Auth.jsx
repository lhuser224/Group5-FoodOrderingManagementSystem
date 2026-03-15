import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, forgotPassword } from '../services/authService';
import styles from './Auth.module.css';

export default function Auth() {
  const [state, setState] = useState('login');
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    passwordConfirm: '',
    full_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async () => {
    if (!formData.phone || !formData.password) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (formData.phone.length > 15) {
      alert('Số điện thoại tối đa 15 ký tự!');
      return;
    }

    try {
      setLoading(true);
      const response = await login(formData.phone, formData.password);
      alert('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      alert('Lỗi đăng nhập: ' + (error.message || 'Vui lòng thử lại'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.full_name || !formData.phone || !formData.password || !formData.passwordConfirm) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (formData.phone.length > 15) {
      alert('Số điện thoại tối đa 15 ký tự!');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      alert('Mật khẩu không khớp!');
      return;
    }

    try {
      setLoading(true);
      await register(formData.full_name, formData.phone, formData.password);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      setState('login');
      setFormData({ phone: '', password: '', passwordConfirm: '', full_name: '' });
    } catch (error) {
      alert('Lỗi đăng ký: ' + (error.message || 'Vui lòng thử lại'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!formData.phone) {
      alert('Vui lòng nhập số điện thoại!');
      return;
    }
    if (formData.phone.length > 15) {
      alert('Số điện thoại tối đa 15 ký tự!');
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(formData.phone);
      alert('Mã xác nhận đã được gửi!');
      setState('login');
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Vui lòng thử lại'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authBg}>
        <div className={styles.authBgOverlay}>
          <h1>Food App</h1>
          <p>Đặt món thả ga - Freeship tận nhà</p>
        </div>
      </div>

      <div className={styles.authFormContainer}>
        <div className={styles.authBoxModern}>
          {state === 'login' && (
            <>
              <h2 className={styles.authTitle}>Đăng nhập</h2>
              <p className={styles.authSubtitle}>Chào mừng bạn quay lại!</p>

              <div className={styles.inputGroup}>
                <i className="fa-solid fa-phone"></i>
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <i className={`fa-solid fa-eye ${styles.showPass}`}></i>
              </div>

              <div className={styles.authActions}>
                <label>
                  <input type="checkbox" /> Ghi nhớ tôi
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setState('forgot');
                  }}
                  className={styles.linkHighlight}
                >
                  Quên mật khẩu?
                </a>
              </div>

              <button className={styles.btnAuth} disabled={loading} onClick={handleLogin}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>

              <div className={styles.authFooter}>
                Chưa có tài khoản?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setState('register');
                  }}
                  className={styles.linkHighlight}
                >
                  Đăng ký ngay
                </a>
              </div>
            </>
          )}

          {state === 'register' && (
            <>
              <h2 className={styles.authTitle}>Tạo tài khoản</h2>
              <p className={styles.authSubtitle}>Tham gia cộng đồng Food App ngay</p>

              <div className={styles.inputGroup}>
                <i className="fa-solid fa-user"></i>
                <input
                  type="text"
                  placeholder="Họ và tên"
                  id="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <i className="fa-solid fa-phone"></i>
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  id="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                />
              </div>

              <button className={styles.btnAuth} disabled={loading} onClick={handleRegister}>
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>

              <div className={styles.authFooter}>
                Đã có tài khoản?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setState('login');
                  }}
                  className={styles.linkHighlight}
                >
                  Đăng nhập
                </a>
              </div>
            </>
          )}

          {state === 'forgot' && (
            <>
              <h2 className={styles.authTitle}>Quên mật khẩu?</h2>
              <p className={styles.authSubtitle}>Nhập SĐT để nhận mã OTP</p>

              <div className={styles.inputGroup}>
                <i className="fa-solid fa-phone"></i>
                <input
                  type="text"
                  placeholder="Số điện thoại đã đăng ký"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <button className={styles.btnAuth} disabled={loading} onClick={handleForgot}>
                {loading ? 'Đang xử lý...' : 'Gửi mã xác nhận'}
              </button>

              <div className={styles.authFooter}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setState('login');
                  }}
                  className={styles.linkHighlight}
                >
                  <i className="fa-solid fa-arrow-left"></i> Quay lại đăng nhập
                </a>
              </div>
            </>
          )}

          <div className={styles.divider}>
            <span>Hoặc đăng nhập bằng</span>
          </div>
          <div className={styles.socialLogin}>
            <button className={`${styles.btnSocial} google`}>
              <i className="fa-brands fa-google"></i> Google
            </button>
            <button className={`${styles.btnSocial} facebook`}>
              <i className="fa-brands fa-facebook-f"></i> Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
