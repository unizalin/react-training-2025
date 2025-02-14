import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link, useLocation } from "react-router";

import 'swiper/css';
import 'swiper/css/pagination';

import axios from 'axios';

// API URL
const apiUrl = import.meta.env.VITE_API_URL;
const apiPath = import.meta.env.VITE_API_APIPATH;

// 產品類型定義
interface Product {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  unit: string;
  origin_price: number;
  price: number;
  description: string;
  content: string;
  is_enabled: boolean;
  imagesUrl: string[];
  num: number;
  vistorNum: number;
  isExtraBed: boolean;
  extraBedNum: number;
}

function Room({modalType}:{modalType: string}) {
  const [products, setProducts] = useState<Product[]>([]);
  const isFetched = useRef(false);

  useEffect(() => {
    if (!isFetched.current) {
      getProductCategories('民宿');
      isFetched.current = true; 
    }
  }, [modalType]);

  const [hoveredItems, setHoveredItems] = useState<{ [key: string]: boolean }>({});

  const handleMouseEnter = (id: string) => {
    setHoveredItems((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoveredItems((prev) => ({ ...prev, [id]: false }));
  };

  const getProductCategories = async (type: string) => {
    try {
      const response = await axios.get(`${apiUrl}api/${apiPath}/products`, {
        params: { category: type },
      });

      // 檢查 API 結構，避免 `undefined` 錯誤
      const fetchedProducts = response.data?.products || [];

      // 過濾 `is_enabled = true` 的產品
      const filteredProducts = fetchedProducts.filter(
        (product: Product) => product.is_enabled
      );

      setProducts(filteredProducts);
    } catch (error) {
      console.error('API 錯誤:', error);
    }
  };

  return (
    <div className='roomCardSection'>
      <div className="card-container">
        <Swiper
          slidesPerView={1} // 手機顯示 1 張
          breakpoints={{
            768: { slidesPerView: 2 }, // 平板顯示 2 張
            1024: { slidesPerView: 3 }, // 桌面顯示 3 張
          }}
        >
          {products.length > 0 ? (
            products.map((product, index) => (
              <SwiperSlide key={product.id || `${product.title}`}>
              <div
                className={`card ${modalType}`}
                onMouseEnter={() => handleMouseEnter(product.id)}
                onMouseLeave={() => handleMouseLeave(product.id)}
              >
                {hoveredItems[product.id] && modalType === 'rooms' && (
                  <Link to={`/room/${product.id}`} className='hover-content p-4 '>
                    <div className="h-100 d-flex flex-column justify-content-between">
                      <div className="d-flex justify-content-between">
                        <div className="text-white h4">{product.title}</div>
                        <div className="btn btn-outline-info text-white">訂房</div>
                      </div>
                      <p className='text-white'>{product.description}</p>
                    </div>
                  </Link>
                )}
                <h2 className="location align-self-start">{product.title}</h2>
                <p className="distance">246 kilometers away</p>
                <div className="image-wrapper">
                  <img src={product.imageUrl} alt={product.title} />
                </div>
                { modalType != 'rooms' &&(<div className="d-flex align-self-start align-items-center explore">
                  <Link to={`/room/${product.id}`} className='nav-link' >
                    <span className="explore-btn m-3">↳</span> Explore
                  </Link>
                </div>)}
              </div>
            </SwiperSlide>
            ))
          ) : (
            <p>載入中...</p>
          )}
        </Swiper>
      </div>
    </div>
  );
}

export default Room;
