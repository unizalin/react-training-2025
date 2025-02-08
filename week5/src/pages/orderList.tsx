import { useEffect, useRef, useState } from 'react'
import * as bootstrap from "bootstrap";
import { currency, date } from "../../src/utils/filter.js";
import ReactLoading from 'react-loading';
import axios from "axios";

// API 路徑設定
const apiUrl = import.meta.env.VITE_API_URL;
const apiPath = import.meta.env.VITE_API_APIPATH;

interface Order {
  create_at: number;
  id: string;
  is_paid: boolean;
  num: number;
  products: object;
  total: number; 
  user: {
    name: string;
  };
  message: string;
}
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
interface OrderProduct {
  final_total: number;
  id: string;
  product: Product;
  product_id: string;
  qty: number;
  total: number;
}

function OrderList() {
  useEffect(() => {
    getOrderList();
    orderModalRef.current = new bootstrap.Modal("#orderModal", {
      keyboard: false,
    });
  }, [])

  const [orderList, setOrderList] = useState<Order[]>([])
  const orderModalRef = useRef<bootstrap.Modal | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([])
  const [orderIdLoading , setOrderIdLoading] = useState<string>('')
  const [orderType , setOrderType] = useState<string>('')
  // 開啟Modal
  const openModal = async(id: string) => {
    await getOrder(id)
    orderModalRef.current.show();
  }
  // 取得訂單列表
  const getOrderList = async()  =>{
    try {
      const ordersRes = await axios.get(`${apiUrl}api/${apiPath}/orders`)
      setOrderList(ordersRes.data.orders)
    } catch (error) {
      console.log('orderList error :'+error)
    }
  }
  // 取得單筆訂單
  const getOrder = async(id: string) => {
    setOrderIdLoading(id)
    setOrderType('open')
    try {
      const orderRes = await axios.get(`${apiUrl}api/${apiPath}/order/${id}`)
      setOrder(orderRes.data.order);
      setOrderProducts(Object.values(orderRes.data.order.products))
    } catch (error) {
      console.log('getOrder error :'+error) 
    }
  }
  //結帳單筆
  const payOrder = async(id: string) => {
    setOrderIdLoading(id)
    setOrderType('pay')
    try {
      const payRes = await axios.post(`${apiUrl}api/${apiPath}/pay/${id}`)
      console.log('payRes',payRes)
    } catch (error) {
      console.log('payOrder error :'+error)
    }finally{
      setOrderIdLoading('')
      getOrderList()
    }
  }
  const closeModal = () => {
    setOrderIdLoading('')
    setOrderType('')
    orderModalRef.current.hide();
  }
  return(<>
    <div className="mt-4">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>購買日期</th>
            <th>購買姓名</th>
            <th>購買金額</th>
            <th>詳細資訊</th>
            <th>結帳</th>
          </tr>
        </thead>
        <tbody>
            { orderList.map((order) => (
            <tr key={order.id}>
              <td>
                <div className="h5">{date(order.create_at)}</div>
              </td>
              <td>{order.user.name}</td>
              <td>${currency(order.total)}</td>
              <td><button type="button" className='btn btn-outline-primary' onClick={()=> openModal(order.id)}>
                {orderIdLoading == order.id && orderType =='open'? <ReactLoading type={'spin'} color={'#000'} height={20} width={20} /> : '查看此筆購物資訊'}
                </button></td>
              <td>
                {order.is_paid ? '已付款' :
                <button type="button" className='btn btn-outline-success'onClick={()=>payOrder(order.id)}>
                {orderIdLoading == order.id && orderType =='pay' ? <ReactLoading type={'spin'} color={'#000'} height={20} width={20} /> : '結帳'}</button>
                }
                
              </td>
            </tr>
            ))}
        </tbody>
      </table>
      {/* 產品Modal */}
        <div className="modal fade" id="orderModal" ref={orderModalRef} role="dialog" aria-labelledby="orderLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{order?.user.name} 購物清單</h5>
            </div>
            <div className="modal-body">
              <p>購買日期：{ date(order?.create_at)}</p>
              <div>
                購買項目：
                <ol>
                  {orderProducts.map((item,index) => (
                    <li key={index}>{item.product.title} {item.qty}{item.product.unit}/ ${item.total}</li>
                  ))} 
                </ol>
              </div>
              <p>備註：{order?.message}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={()=>closeModal()}>
                Close</button>
            </div>
          </div>
        </div>
      </div>
      {/* 產品Modal */}
    </div>
  </>)
}
export default OrderList;