const UserAddress = require('../models/UserAddress');

const userAddressService = {
  async create(userId, addressData) {
    if (!addressData.receiver_phone || !addressData.address_detail) {
      throw new Error('Receiver phone and address details are required');
    }
    return await UserAddress.create({
      ...addressData,
      user_id: userId
    });
  },

  async delete(userId, addressId) {
    const address = await UserAddress.findById(addressId);
    if (!address || address.user_id !== userId) {
      throw new Error('Address not found or unauthorized');
    }
    const result = await UserAddress.delete(addressId);    
    if (!result.success) {
      throw new Error(result.message); 
    }

    return result;
  },

  async setDefault(userId, addressId) {
    const address = await UserAddress.findById(addressId);
    if (!address || address.user_id !== userId) {
      throw new Error('Address not found');
    }
    return await UserAddress.updateDefault(userId, addressId);
  }
};

module.exports = userAddressService;