import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
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
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter(t => t !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      extras: selectedToppings,
      quantity: quantity,
      totalPrice: totalPrice,
      selected_options: {
        size: selectedSize,
        extras: selectedToppings
      }
    });
    onClose();
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalImageBox}>
          <i
            className="fa-solid fa-utensils fa-4x"
            style={{ color: '#ccc' }}
          ></i>
          <button
            onClick={onClose}
            className={styles.modalCloseBtn}
          >
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          <h2>{product.name}</h2>
          <p>
            Mô tả: Món ăn được chế biến từ nguyên liệu tươi ngon nhất trong ngày.
          </p>

          <div className={styles.optionsScroll}>
            <div className={styles.optGroup}>
              <div className={styles.optGroupHeader}>
                <strong>Chọn Size</strong>
                <span className={styles.optGroupRequired}>Bắt buộc</span>
              </div>
              <label className={styles.optItem}>
                <span>
                  <input
                    type="radio"
                    name="size"
                    value="M"
                    checked={selectedSize === 'M'}
                    onChange={() => setSelectedSize('M')}
                  />{' '}
                  Size M
                </span>
                <span>+ $0.00</span>
              </label>
              <label className={styles.optItem}>
                <span>
                  <input
                    type="radio"
                    name="size"
                    value="L"
                    checked={selectedSize === 'L'}
                    onChange={() => setSelectedSize('L')}
                  />{' '}
                  Size L
                </span>
                <span>+ $2.00</span>
              </label>
            </div>

            <div className={styles.optGroup}>
              <div className={styles.optGroupHeader}>
                <strong>Topping</strong>
              </div>
              <label className={styles.optItem}>
                <span>
                  <input
                    type="checkbox"
                    checked={selectedToppings.includes('Egg')}
                    onChange={() => handleToppingChange('Egg')}
                  />{' '}
                  Egg
                </span>
                <span>+ $1.00</span>
              </label>
              <label className={styles.optItem}>
                <span>
                  <input
                    type="checkbox"
                    checked={selectedToppings.includes('Cheese')}
                    onChange={() => handleToppingChange('Cheese')}
                  />{' '}
                  Cheese
                </span>
                <span>+ $1.50</span>
              </label>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <div className={styles.quantityEditor}>
              <button
                className={styles.quantityBtn}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className={styles.quantityDisplay}>{quantity}</span>
              <button
                className={styles.quantityBtn}
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className={styles.addToCartBtn}
            >
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
  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const data = await getFoods(1);
      setFoods(data.data || []);
    } catch (error) {
      console.error('Error loading foods:', error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadFoods();
      return;
    }
    try {
      setLoading(true);
      const data = await searchFoods(searchTerm);
      setFoods(data.data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const handleQuickAdd = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      totalPrice: product.price,
      selected_options: {}
    });
    alert(`🛒 Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleAddToCartFromModal = (productWithOptions) => {
    addToCart(productWithOptions);
    alert(`Đã thêm món vào giỏ hàng!`);
  };

  return (
    <>
      <Navbar />

      <div className={styles.heroWrapper}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Đặt Đồ Ăn, Giao Hàng Nhanh Chỉ Từ 20 phút</h1>
          <p className={styles.heroSubtitle}>Có 10,000+ Địa điểm ở TP. HCM từ 00:00 - 23:59</p>

          <div className={styles.searchBoxLarge}>
            <input
              type="text"
              placeholder="Tìm địa điểm, món ăn, địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className={styles.btnSearch} onClick={handleSearch}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
                <span>+ $2.00</span>
              </label>
            </div>

            {/* Toppings */}
            <div className={styles.optGroup}>
              <div className={styles.optGroupHeader}>
                <strong>Topping thêm</strong>
              </div>
              <label className={styles.optItem}>
                <span>
                  <input
                    type="checkbox"
                    checked={selectedToppings.includes('Egg')}
                    onChange={() => handleToppingChange('Egg')}
                  />{' '}
                  Thêm trứng
                </span>
                <span>+ $1.00</span>
              </label>
              <label className={styles.optItem}>
                <span>
                  <input
                    type="checkbox"
                    checked={selectedToppings.includes('Cheese')}
                    onChange={() => handleToppingChange('Cheese')}
                  />{' '}
                  Thêm phô mai
                </span>
                <span>+ $1.50</span>
              </label>
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />

          <div className={styles.modalFooter}>
            <div className={styles.quantityControl}>
              <button
                className={styles.quantityBtn}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className={styles.quantityDisplay}>{quantity}</span>
              <button
                className={styles.quantityBtn}
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className={styles.addToCartBtn}
            >
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
  const { state, dispatch } = useContext(AppContext);
  const { products } = state;

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const handleQuickAdd = (product) => {
    addToCart(product);
    alert(`🛒 Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleAddToCartFromModal = (productWithOptions) => {
    addToCart(productWithOptions);
    alert(`Đã thêm món vào giỏ hàng!`);
  };

  return (
    <>
      <Navbar />

      <div className={styles.heroWrapper}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Đặt Đồ Ăn, Giao Hàng Nhanh Chỉ Từ 20 phút</h1>
          <p className={styles.heroSubtitle}>Có 10,000+ Địa điểm ở TP. HCM từ 00:00 - 23:59</p>

          <div className={styles.searchBoxLarge}>
            <input type="text" placeholder="Tìm địa điểm, món ăn, địa chỉ..." />
            <button className={styles.btnSearch}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          <div className={styles.quickTags}>
            <span className={`${styles.tag} ${styles.active}`}>Tất cả</span>
            <span className={styles.tag}>Đồ ăn</span>
            <span className={styles.tag}>Đồ uống</span>
            <span className={styles.tag}>Tráng miệng</span>
          </div>
        </div>
      </div>

      <div className={styles.mainContentArea}>
        <main className={styles.productSection}>
          <div className={styles.sectionHead}>
            <h3>Các món ăn</h3>
          </div>

          {loading ? (
            <div className={styles.loading}>Đang tải...</div>
          ) : foods.length === 0 ? (
            <div className={styles.empty}>Không tìm thấy món ăn nào</div>
          ) : (
            <div className={styles.gridV2}>
              {foods.map((product) => (
                <div
                  key={product.id}
                  className={styles.cardV2}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className={styles.cardThumb}>
                    <div className={styles.badgeTime}>15 min</div>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} />
                    ) : (
                      <div className={styles.imgPlaceholder}>
                        <i className="fa-solid fa-utensils"></i>
                      </div>
                    )}
                    <div className={styles.overlayHover}>Xem chi tiết</div>
                  </div>
                  <div className={styles.cardDetails}>
                    <h4 className={styles.foodName} title={product.name}>
                      {product.name}
                    </h4>
                    <div className={styles.cardMeta}>
                      <div className={styles.rating}>
                        <i className="fa-solid fa-star"></i> 4.8
                      </div>
                      <div>(999+)</div>
                    </div>
                    <div className={styles.cardBottom}>
                      <div className={styles.priceTag}>${product.price.toFixed(2)}</div>
                      <button
                        className={styles.btnPlus}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(product);
                        }}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCartFromModal}
        />
      )}
    </>
  );
}