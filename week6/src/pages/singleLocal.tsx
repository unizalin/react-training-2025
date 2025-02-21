import { useEffect, useState } from 'react';
import { useParams } from "react-router"
import ReactLoading from 'react-loading';

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

function SingleLocal() {
  const params = useParams()
  useEffect(() => {
    if (params.id) {
      getProductId(params.id);
    }
  }, [params.id]);

  const [product, setProduct] = useState<Product | null>(null)

  const getProductId = async (id:string) => {
    try {
      const productIdRes = await axios.get(`${apiUrl}api/${apiPath}/product/${id}`)
      await setProduct(productIdRes.data.product)
    } catch (error) {
      console.log('productIdRes error :'+error)
    }
  }

  const [productIdLoding, setProductIdLoding] = useState<String>();
  const [quantity, setQuantity] = useState(1);

  // 加到購物車
  const addCart = async(id:string,qty:number) =>{
    setProductIdLoding(id)
    try {
      const data ={
        product_id: id,
        qty:qty
      }
      await axios.post(`${apiUrl}api/${apiPath}/cart`, {data})
    } catch (error) {
      console.log('addCart error :'+error)
    } finally {
      setProductIdLoding('')
    }
  }

  return (
    <section className="wrapper d-flex align-items-center flex-column justify-content-center bg-light container p-4">
      <div className="row">
        <div className="col-md-8">
          {product && (
            <>
              <img src={product.imageUrl} className="img-fluid rounded mb-3" alt="Main Image"/>
            </>
          )}
        </div>
        <div className="col-md-4">
          <div id="imageCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {product && product.imagesUrl && product.imagesUrl.map((img, index) => (
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
                <li className="list-group-item"><strong>原價:</strong> {product?.origin_price}</li>
                <li className="list-group-item"><strong>促銷:</strong> {product?.price}</li>
                <li className="list-group-item"><strong>單位:</strong> {product?.unit}</li>
            </ul>
            <div className="d-flex align-items-center justify-content-between mt-4">
              <div className='mr-3'>
                <button className="btn btn-outline-primary" onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>-</button>
                <span className='mx-4'>{quantity}</span>
                <button  className="btn btn-outline-primary"  onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button type="button" className="btn btn-outline-primary "
              onClick={() => product && addCart(product.id, quantity)}>
                {product && productIdLoding === product.id ?(<ReactLoading type="bubbles" color="#6c757d" height={20} width={20}/>):'加到購物車'}
              </button>
            </div>
          </div>
          <div className="col-md-6">
              <h5 className="fw-bold"></h5>
              <div className="text-secondary">
              <div dangerouslySetInnerHTML={{ __html: product?.content || '' }} />
              </div>
          </div>
      </div>
    </section>
  );
}

export default SingleLocal;
