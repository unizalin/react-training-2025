import { useEffect, useState } from 'react';
import Room from '../components/frontend/room'
import axios from "axios";

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

function Rooms() {
  useEffect(() => {
    getProducts();
  }, []);

  const [products, setProducts] = useState<Product[]>([])

  const getProducts = async () => {
    try {
      const productsRes = await axios.get(`${apiUrl}api/${apiPath}/products`)
      console.log('productsRes',productsRes.data.products)
      await setProducts(productsRes.data.products)
    } catch (error) {
      console.log('productsRes error :'+error)
    }
  }

  return (
    <section className="vh-100 d-flex align-items-center flex-column justify-content-center bg-light">
        <div className="row text-center mb-5">
          <div className="col">
            <h2>房型介紹</h2>
            <p>選擇最適合你的優質住宿</p>
          </div>
        </div>

        <div className="row g-4">
          <Room modalType="rooms" />
        </div>
    </section>
  );
}

export default Rooms;
