import { useEffect, useState } from 'react';
import { useParams } from "react-router"

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
  const params = useParams()
  useEffect(() => {
    if (params.id) {
      getProductId(params.id);
    }
  }, []);

  const [product, setProduct] = useState<Product | null>(null)

  const getProductId = async (id:string) => {
    try {
      const productIdRes = await axios.get(`${apiUrl}api/${apiPath}/product/${id}`)
      console.log('productIdRes',productIdRes)
      await setProduct(productIdRes.data.product)
    } catch (error) {
      console.log('productIdRes error :'+error)
    }
  }

  return (
    <section className="wrapper d-flex align-items-center flex-column justify-content-center bg-light container">
      <div className="row">
        <div className="col-md-6">
          {product && (
            <>
              <img src={product.imageUrl} className="img-fluid rounded mb-3" alt="Main Image"/>
            </>
          )}
        </div>
        <div className="col-md-6">
          <div id="imageCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {product && product.imagesUrl.map((img, index) => (
                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                    <img src={img} className="d-block w-100" alt="..." />
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="row mt-5">
          <div className="col-md-6">
              <h2 className="fw-bold">{product?.title}</h2>
              <p className="text-secondary">{product?.description}</p>
              <ul className="list-group list-group-flush">
                  <li className="list-group-item"><strong>棟數:</strong>{product?.num}</li>
                  <li className="list-group-item"><strong>可容納人數:</strong>{product?.vistorNum}</li>
                  <li className="list-group-item"><strong>國定假日:</strong> {product?.origin_price}</li>
                  <li className="list-group-item"><strong>平日假日:</strong> {product?.price}</li>
              </ul>
          </div>
          <div className="col-md-6">
              <h5 className="fw-bold"></h5>
              <p className="text-secondary">
              <div dangerouslySetInnerHTML={{ __html: product?.content || '' }} />
              </p>
          </div>
      </div>
    </section>
  );
}

export default Rooms;
