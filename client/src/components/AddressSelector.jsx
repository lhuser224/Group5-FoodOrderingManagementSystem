import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddressSelector = ({ onAddressChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selected, setSelected] = useState({ province: '', district: '', ward: '', detail: '' });

  useEffect(() => {
    axios.get('https://provinces.open-api.vn/api/p/').then(res => setProvinces(res.data));
  }, []);

  const updateAddress = (newFields) => {
    const updated = { ...selected, ...newFields };
    setSelected(updated);
    onAddressChange(updated);
  };

  const handleProvince = async (e) => {
    const p = provinces.find(i => i.code == e.target.value);
    if (!p) return;
    updateAddress({ province: p.name, district: '', ward: '' });
    const res = await axios.get(`https://provinces.open-api.vn/api/p/${p.code}?depth=2`);
    setDistricts(res.data.districts);
  };

  const handleDistrict = async (e) => {
    const d = districts.find(i => i.code == e.target.value);
    if (!d) return;
    updateAddress({ district: d.name, ward: '' });
    const res = await axios.get(`https://provinces.open-api.vn/api/d/${d.code}?depth=2`);
    setWards(res.data.wards);
  };

  return (
    <div className="row g-2">
      <div className="col-4">
        <select className="form-select" onChange={handleProvince} required>
          <option value="">Tỉnh/Thành</option>
          {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
        </select>
      </div>
      <div className="col-4">
        <select className="form-select" onChange={handleDistrict} disabled={!districts.length} required>
          <option value="">Quận/Huyện</option>
          {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
        </select>
      </div>
      <div className="col-4">
        <select className="form-select" onChange={(e) => updateAddress({ ward: wards.find(w => w.code == e.target.value)?.name })} disabled={!wards.length} required>
          <option value="">Phường/Xã</option>
          {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
        </select>
      </div>
      <div className="col-12 mt-2">
        <input type="text" className="form-control" placeholder="Số nhà, tên đường..." onChange={(e) => updateAddress({ detail: e.target.value })} required />
      </div>
    </div>
  );
};

export default AddressSelector;