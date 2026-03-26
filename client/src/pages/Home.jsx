import { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { getFoods, searchFoods } from '../services/foodService';
import styles from './Home.module.css';

function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const basePriceWithSize = selectedSize === 'L' ? product.price + 2 : product.price;
  const toppingPrice = selectedToppings.reduce((sum, topping) => {
    if (topping === 'Egg') return sum + 1;
    if (topping === 'Cheese') return sum + 1.5;
    return sum;
  }, 0);
  const totalPrice = (basePriceWithSize + toppingPrice) * quantity;

  const handleToppingChange = (topping) => {
    setSelectedToppings(prev => 
      prev.includes(topping) ? prev.filter(t => t !== topping) : [...prev, topping]
    );
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      size: selectedSize,
      extras: selectedToppings,
      quantity,
      totalPrice,
      selected_options: { size: selectedSize, extras: selectedToppings }
    });
    setQuantity(1);
    setSelectedToppings([]);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalImageBox}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className={styles.modalImg} />
          ) : (
            <i className="fa-solid fa-utensils fa-4x" style={{ color: '#ccc' }}></i>
          )}
          <button onClick={onClose} className={styles.modalCloseBtn}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <h2>{product.name}</h2>
          <p className={styles.modalDesc}>Món ăn được chế biến từ nguyên liệu tươi ngon nhất.</p>
          
          <div className={styles.optionsScroll}>
            <div className={styles.optGroup}>
              <div className={styles.optGroupHeader}>
                <strong>Chọn Size</strong>
                <span className={styles.optGroupRequired}>Bắt buộc</span>
              </div>
              {['M', 'L'].map(size => (
                <label key={size} className={styles.optItem}>
                  <span>
                    <input 
                      type="radio" 
                      name="size" 
                      checked={selectedSize === size} 
                      onChange={() => setSelectedSize(size)} 
                    /> Size {size}
                  </span>
                  <span className={styles.optPrice}>+ ${size === 'L' ? '2.00' : '0.00'}</span>
                </label>
              ))}
            </div>

            <div className={styles.optGroup}>
              <div className={styles.optGroupHeader}>
                <strong>Topping thêm</strong>
                <span style={{ fontSize: '0.7rem', color: '#999' }}>Tùy chọn</span>
              </div>
              <label className={styles.optItem}>
                <span>
                  <input type="checkbox" checked={selectedToppings.includes('Egg')} onChange={() => handleToppingChange('Egg')} /> Thêm trứng
                </span>
                <span className={styles.optPrice}>+ $1.00</span>
              </label>
              <label className={styles.optItem}>
                <span>
                  <input type="checkbox" checked={selectedToppings.includes('Cheese')} onChange={() => handleToppingChange('Cheese')} /> Thêm phô mai
                </span>
                <span className={styles.optPrice}>+ $1.50</span>
              </label>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <div className={styles.quantityControl}>
              <button className={styles.quantityBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span className={styles.quantityDisplay}>{quantity}</span>
              <button className={styles.quantityBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button onClick={handleAddToCart} className={styles.addToCartBtn}>
              Thêm vào giỏ - ${totalPrice.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 100 });
  
  const { state, dispatch } = useContext(AppContext);
  const loadFoods = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getFoods();
      const data = res?.data || res || [];
      setFoods(data.length > 0 ? data : (state.products || []));
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
      setFoods(state.products || []);
    } finally {
      setLoading(false);
    }
  }, [state.products]);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return loadFoods();
    try {
      setLoading(true);
      const res = await searchFoods(searchTerm);
      setFoods(res?.data || res || []);
    } catch {
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (payload) => {
    dispatch({ type: 'ADD_TO_CART', payload });
  };

  const quickAddToCart = (product) => {
    addToCart({ 
      ...product, 
      quantity: 1, 
      totalPrice: product.price, 
      selected_options: { size: 'M', extras: [] } 
    });
  };

  return (
    <div className={styles.homeLayout}>
      <div className={styles.heroWrapper}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Đặt Đồ Ăn, Giao Nhanh 20 Phút</h1>
          <div className={styles.searchBoxLarge}>
            <input
              type="text"
              placeholder="Tìm địa điểm, món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className={styles.btnSearch} onClick={handleSearch}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <div className={styles.quickTags}>
            {['All', 'Đồ ăn', 'Đồ uống', 'Đồ chay'].map((tag, idx) => (
              <span key={idx} className={`${styles.tag} ${idx === 0 ? styles.active : ''}`}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.mainContentArea}>
        
        {/* BỘ LỌC ĐÃ ĐƯỢC UPGRADE LÊN BẢN MỚI */}
        <aside className={styles.sidebarWireframe}>
          <div className={styles.filterTitle}>
            <span>Filter</span>
            <i className="fa-solid fa-filter"></i>
          </div>

          {/* Nhóm 1: Categories */}
          <div className={styles.filterSection}>
            <h4>CATEGORIES</h4>
            <label className={styles.checkboxRow}>
              <div className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked /> Food
              </div>
            </label>
            <label className={styles.checkboxRow}>
              <div className={styles.checkboxLabel}>
                <input type="checkbox" /> Beverage
              </div>
            </label>
            <label className={styles.checkboxRow}>
              <div className={styles.checkboxLabel}>
                <input type="checkbox" /> Dessert
              </div>
            </label>
          </div>

          {/* Nhóm 2: Price Range */}
          <div className={styles.filterSection}>
            <h4>PRICE RANGE ($)</h4>
            <div className={styles.priceInputs}>
              <input type="number" className={styles.priceBox} placeholder="Min" />
              <span className={styles.dash}>-</span>
              <input type="number" className={styles.priceBox} placeholder="Max" />
            </div>
            <input type="range" className={styles.rangeSlider} min="0" max="100" defaultValue="30" />
          </div>

          {/* Nhóm 3: Distance */}
          <div className={styles.filterSection}>
            <h4>DISTANCE</h4>
            <label className={styles.checkboxRow}>
              <div className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked /> Under 1 km
              </div>
            </label>
            <label className={styles.checkboxRow}>
              <div className={styles.checkboxLabel}>
                <input type="checkbox" /> 1 - 3 km
              </div>
            </label>
            <label className={styles.checkboxRow}>
              <div className={styles.checkboxLabel}>
                <input type="checkbox" /> Over 3 km
              </div>
            </label>
          </div>

          {/* Nhóm 4: Sort (Giống bản vẽ tay) */}
          <div className={styles.filterSection}>
            <h4>SORT BY</h4>
            <div className={styles.sortBox}>
              <select>
                <option>Nearest</option>
                <option>Price: Low to High</option>
                <option>Rating: High to Low</option>
              </select>
            </div>
          </div>

          {/* Các nút hành động */}
          <div className={styles.filterActions}>
            <button className={styles.applyFilterBtn}>APPLY FILTER</button>
            <button className={styles.clearFilterBtn}>Clear all</button>
          </div>
        </aside>

        <main className={styles.productSection}>
          <div className={styles.sectionHead}>
            <h3>Ưu đãi hôm nay</h3>
          </div>

          {loading ? (
            <div className={styles.statusMsg}>Đang tải món ăn...</div>
          ) : foods.length > 0 ? (
            <div className={styles.gridV2}>
              {foods.map((product) => (
                <div 
                  key={product.id} 
                  className={styles.cardV2} 
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className={styles.cardThumb}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      <div className={styles.imgPlaceholder}><i className="fa-solid fa-utensils"></i></div>
                    )}
                    {product.status === 'available' && <div className={styles.badgeDeal}>-15k</div>}
                    
                    {/* Hiệu ứng hover cho card (tùy chọn hiện chữ) */}
                    <div className={styles.overlayHover}>
                      <span>Xem chi tiết</span>
                    </div>
                  </div>
                  <div className={styles.cardDetails}>
                    <h4 className={styles.foodName}>{product.name}</h4>
                    <p className={styles.foodAddress}>{product.address || 'Hồ Chí Minh'}</p>
                    <div className={styles.cardBottom}>
                      <div className={styles.priceTag}>${product.price?.toFixed(2)}</div>
                      <button 
                        className={styles.btnPlus} 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          quickAddToCart(product);
                        }}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.statusMsg}>Không tìm thấy món ăn nào.</div>
          )}
        </main>
      </div>
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}