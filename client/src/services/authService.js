import axiosClient from '../api/axiosClient';
//regular expression to validate phone number (10-15 digits)
const validatePhone = (phone) => {
  const re = /^[0-9]{10,15}$/;
  return re.test(phone);
};

export const login = async (phone, password) => {
  if (!phone || !password) {
    throw new Error('Số điện thoại và mật khẩu không được để trống');
  }
  if (!validatePhone(phone.trim())) {
    throw new Error('Số điện thoại không hợp lệ (phải từ 10-15 chữ số)');
  }

  const payload = {
    phone: phone.trim(),
    password
  };

  const response = await axiosClient.post('/FoodO/auth/login', payload);
  return response;
};

export const register = async (fullName, phone, password, passwordConfirm) => {
  if (!fullName || !phone || !password || !passwordConfirm) {
    throw new Error('Vui lòng điền đầy đủ tất cả các trường');
  }
  if (fullName.trim().length < 2) {
    throw new Error('Họ và tên quá ngắn');
  }
  if (!validatePhone(phone.trim())) {
    throw new Error('Số điện thoại không hợp lệ');
  }
  if (password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  }
  if (password !== passwordConfirm) {
    throw new Error('Mật khẩu xác nhận không khớp');
  }

  const payload = {
    full_name: fullName.trim(),
    phone: phone.trim(),
    password,
    role: 'customer'
  };

  const response = await axiosClient.post('/FoodO/auth/register', payload);
  return response;
};

export const updateProfile = async (userData) => {
  return await axiosClient.put('/FoodO/auth/profile', userData);
};

export const changePassword = async (oldPassword, newPassword) => {
  const payload = { oldPassword, newPassword };
  return await axiosClient.put('/FoodO/auth/change-password', payload);
};

export const getProfile = async () => {
  return await axiosClient.get('/FoodO/auth/me'); 
};

export default { login, register };