import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as bootstrap from "bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import ReactLoading from 'react-loading';
import axios from "axios";
import { currency } from "../../src/utils/filter.js";

interface Product{ 
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
}
// API 路徑設定
const apiUrl = import.meta.env.VITE_API_URL;
const apiPath = import.meta.env.VITE_API_APIPATH;

// 表單欄位
interface FormInput {
  [key:string]:string;
  name: string;
  email: string;
  tel: string;
  address: string;
  message: string;
}

const registerInputList = [
  {
    name: 'name',
    label: '姓名',
    type: 'text',
    placeholder: '輸入姓名',
    setting:{
      required: {value: true, message: '此欄位必填'}
    }
  },
  {
    name: 'email',
    label: '信箱',
    type: 'email',
    placeholder: '輸入信箱',
    setting:{
      required:{value: true, message: '此欄位必填'}
    }
  },
  {
    name: 'tel',
    label: '手機號碼',
    type: 'tel',
    placeholder: '輸入手機號碼',
    setting:{
      required:{value: true, message: '此欄位必填'},
      pattern: {
        value: /^09\d{8}$/,
        message: '請輸入開頭為09手機號碼'
      }
    },
  },
  {
    name: 'address',
    label: '地址',
    type: 'text',
    placeholder: '輸入地址',
    setting:{
      required:{value: true, message: '此欄位必填'}
    }
  },
  {
    name: 'message',
    label: '留言',
    type: 'message',
    placeholder: '有什麼需求或想說的嗎？',
    setting:{
      required:{value: false}
    }
  }
]

function Register() {
  useEffect(() => {
    getProductCategories('伴手禮');
    getCart();
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
  }, [])

  const [products, setProducts] = useState<Product[]>([])
  const productModalRef = useRef<bootstrap.Modal | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [productIdLoding, setProductIdLoding] = useState<String>();
  const [productType  , setProductType] = useState<string>();
  const [cart, setCart] = useState<any>({});
  const getProductCategories = async (type:string) => {
    try {
      const productCategoryRes = await axios.get(`${apiUrl}api/${apiPath}/admin/products`, {
        params: { category: type }
      })
    
      await setProducts(productCategoryRes.data.products)
    } catch (error) {
      console.log('productsRes error :'+error)
    }
  };
  const navigate = useNavigate();
  // 取得單一產品資料
  const openModal = async(id:string) =>{
    setProductIdLoding(id)
    setProductType('moreProduct')
    try {
      const productRes = await axios.get(`${apiUrl}api/${apiPath}/product/${id}`)
      setProduct(productRes.data.product)
      console.log('productRes',productRes.data.product)
      productModalRef.current.show()
      setProductType('')
    } catch (error) {
      console.log('openModal error :'+error)
    }
  }
  // 關閉Modal
  const closeModal = () =>{
    console.log('closeModal')
    setProductIdLoding('')
    productModalRef.current.hide()
  }
  // 加到購物車
  const addCart = async(id:string,qty:number) =>{
    setProductIdLoding(id)
    setProductType('addToCart')
    try {
      const data ={
        product_id: id,
        qty:qty
      }
      await axios.post(`${apiUrl}api/${apiPath}/cart`, {data})
    } catch (error) {
      console.log('addCart error :'+error)
    } finally {
      await getCart()
      setProductIdLoding('')
      setProductType('')
    }
  }
  //取得購物車清單
  const getCart = async() =>{
    try {
      const cartRes = await axios.get(`${apiUrl}api/${apiPath}/cart`)
      setCart(cartRes.data.data)
    } catch (error) {
      console.log('getCart error :'+error)
    }
  }
  //更新購物車  
  const updateCart = async(id:string,qty:number) =>{
    try {
      const data ={
        product_id: id,
        qty:qty
      }
      console.log('updateCart',data)
      const updateCartRes = await axios.put(`${apiUrl}api/${apiPath}/cart/${id}`,{data})
      console.log('updateCartRes',updateCartRes)
    } catch (error) {
      console.log('updateCart error:'+error)
    } finally {
      await getCart() 
    }
  }
  //刪除單一訂單
  const deleteCart = async(id:string) =>{
    setProductIdLoding(id)
    try {
      const deleteRes = await axios.delete(`${apiUrl}api/${apiPath}/cart/${id}`)
      console.log("deleteCart",deleteRes) 
    } catch (error) {
      console.log('deleteCart error:'+error)
    }finally{
      await getCart()
      setProductIdLoding('')
    }
  }
  //刪除全部訂單
  const deleteAllCart = async() =>{
    setProductIdLoding('all')
    try {
      await axios.delete(`${apiUrl}api/${apiPath}/carts`)
    } catch (error) {
      console.log('deleteAllCart error:'+error)
    }finally{
      await getCart()
      setProductIdLoding('')
    }
  }

  const {
    formState: { errors },
    register,
    handleSubmit
  } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = async(userData) =>{
    try {
      console.log('onSubmit userData:',userData)
      if(userData){
        const {name,email,tel,address,message} = userData
        const data={
          user: {name,email,tel,address},
          message: message
        }
        const orderRes = await axios.post(`${apiUrl}api/${apiPath}/order`, { data })
        console.log('orderRes',orderRes)
      }
    } catch (error) {
      console.log('onSubmit error:'+error)
    }finally{
      await getCart()
      navigate('/orderList')
    }
  }
  return <>
    <div className="mt-4">
      {/* 產品Modal */}
      <div className="modal fade" id="productModal" ref={productModalRef} role="dialog" aria-labelledby="productModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{product?.title}</h5>
            </div>
            <div className="modal-body">
              {product ? (
                <>
                  <p>{product.description}</p>
                  <div dangerouslySetInnerHTML={{ __html: product.content }}></div>
                  <img src={product.imageUrl} alt={product.title} style={{ width: "100%" }} />
                </>
              ) : (
                <p>載入中...</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={()=>closeModal()}>
                Close</button>
            </div>
          </div>
        </div>
      </div>
      {/* 產品Modal */}
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th><del>原價</del></th>
            <th>價格</th>
          </tr>
        </thead>
        <tbody>
          { products.map((item,index)=>(
            <tr key={index}>
              <td style={{ width: '200px' }}>
                <div style={{ height: '100px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${item.imageUrl})` }}></div>
              </td>
              <td>
                <div className="h5">{item.title}</div>
              </td>
              <td><div className="h6">${item.price}</div></td>
              <td><div className="h6">$<del> {item.origin_price}</del></div></td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button type="button" className="btn btn-outline-secondary"
                  disabled={productIdLoding === item.id}
                  onClick={() => openModal(item.id)}>
                    {productIdLoding === item.id && productType =='moreProduct'?( 
                      <ReactLoading type="bubbles" color="#6c757d" height={20} width={20}/>
                    ) : (
                    "查看更多"
                    )
                  }
                  </button>
                  <button type="button" className="btn btn-outline-danger"
                  onClick={() =>addCart(item.id,1)}>
                    {productIdLoding == item.id && productType == 'addToCart'?(<ReactLoading type="bubbles" color="#6c757d" height={20} width={20}/>):'加到購物車'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-end">
        <button className="btn btn-outline-danger" onClick={() => deleteAllCart()} type="button">
          {productIdLoding == 'all' ? ( <ReactLoading type="bubbles" color="#6c757d" height={20} width={20}/>):'清空購物車'}</button>
      </div>
      <table className="table align-middle">
        <thead>
          <tr>
            <th>品名</th>
            <th style={{ width: '250px' }}>數量/單位</th>
            <th>單價</th>
            <th></th>
          </tr>
        </thead>
        <tbody> 
          {cart?.carts && cart?.carts.map((item:any)=> (
            <tr key={item.id}>
              <td>{item.product.title}</td>
              <td >
                <div className="input-group input-group-sm">
                <input type="number" className="form-control" min="1" value={item.qty} onChange={(e)=>updateCart(item.id,Number(e.target.value))}/>/{item.product.unit}
                  </div>
              </td>
              <td>${item.final_total}</td>
              <td><button type="button" className="btn btn-outline-danger" onClick={()=>deleteCart(item.id)} >
                {productIdLoding === item.id ?(
                  <ReactLoading type="bubbles" color="#6c757d" height={20} width={20}/>
                ):'刪除此筆訂單'}
              </button></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="text-end">總計</td>
            <td className="text-end">{currency(cart?.total)}</td>
          </tr>
          <tr>
            <td colSpan={3} className="text-end text-success">折扣價</td>
            <td className="text-end text-success">{currency(cart?.final_total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <form onSubmit={handleSubmit(onSubmit)}>
      {registerInputList.map(({name, label, type, placeholder, setting}) => (
        <div className="form-group" key={name}>
          <label htmlFor={name}>{label}</label>
          <input type={type} className="form-control" id={name} aria-describedby={`${name}Help`} placeholder={placeholder} autoComplete='off' {...register(name, setting)}/>
          {errors[name] && <div className='text-danger'>{errors[name]?.message}</div>}
        </div>
      ))}
      <button type="submit" className="btn btn-primary mt-2">送出訂單</button>
    </form>
  </>;
}
export default Register;