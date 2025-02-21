import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from "react-router";

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

function Local({modalType}:{modalType: string}) {
  const [products, setProducts] = useState<Product[]>([]);
  const isFetched = useRef(false);

  useEffect(() => {
    if (!isFetched.current) {
      getProductCategories('伴手禮');
      isFetched.current = true; 
    }
  }, [modalType]);

  const getProductCategories = async (type: string) => {
    try {
      const response = await axios.get(`${apiUrl}api/${apiPath}/products`, {
        params: { category: type },
      });

      const fetchedProducts = response.data?.products || [];
      const filteredProducts = fetchedProducts.filter(
        (product: Product) => product.is_enabled
      );

      setProducts(filteredProducts);
    } catch (error) {
      console.error('API 錯誤:', error);
    }
  };

  return (
    <div className='foodCardSection'>
      {modalType== 'img'? 
      <div className="row">
        {products.map((product) => (
          <div className='col-6' key={product.id}>
            <img className='w-100 m-2'key={product.id} src={product.imageUrl} alt={product.title} />
          </div>
      ))}</div>:
      <div className="card-container">
        <Swiper
          slidesPerView={1} // 手機顯示 1 張
          breakpoints={{
            768: { slidesPerView: 2 }, // 平板顯示 2 張
            1024: { slidesPerView: 3 }, // 桌面顯示 3 張
          }}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <SwiperSlide key={product.id || `${product.title}`}>
              <div
                className={`card ${modalType} mx-4`}
              >
                { modalType === 'rooms' && (
                  <Link to={`/singleLocal/${product.id}`} className='hover-content p-4 mx-2 '>
                    <div className="h-100 d-flex flex-column justify-content-between">
                      <div className="d-flex justify-content-between">
                        <div className="text-black h4">{product.title}</div>
                      </div>
                      <p className='text-muted'>{product.description}</p>
                    </div>
                  </Link>
                )}
                <div className="image-wrapper">
                  <img src={product.imageUrl} alt={product.title} />
                </div>
                <div className="my-4 mr-4">
                  <Link to={`/singleLocal/${product.id}`} className='btn btn-outline-success' >
                    購買
                  </Link>
                </div>
              </div>
            </SwiperSlide>
            ))
          ) : (
            <p>載入中...</p>
          )}
        </Swiper>
      </div>
      }
    </div>
  );
}

export default Local;
