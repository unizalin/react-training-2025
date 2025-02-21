import { useEffect, useState } from 'react'
import { currency } from "../utils/filter.js";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from 'react-router';

import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const apiPath = import.meta.env.VITE_API_APIPATH;

interface CartItem {
    id: string;
    final_total: number,
    product: object,
    product_id: string;
    qty: number;
    total: number;
}

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

const Checkout = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showModal, setShowModal] = useState(false);
   
    const navigate = useNavigate();
    useEffect(() => {
        getCart()
    }, []);
    const {
        formState: { errors },
        register,
        handleSubmit
    } = useForm<FormInput>();
    
    const [quantity, setQuantity] = useState(1);

    //取得購物車清單
    const getCart = async() =>{
        try {
            const cartRes = await axios.get(`${apiUrl}api/${apiPath}/cart`)
            setCart(cartRes.data.data.carts)
            } catch (error) {
            console.log('getCart error :'+error)
        }
    }
    //更新購物車  
    const updateCart = async(id:string,qty:number) =>{
        try {
            setQuantity(qty)
            const data ={
                product_id: id,
                qty:qty
            }
            await axios.put(`${apiUrl}api/${apiPath}/cart/${id}`,{data})
        } catch (error) {
        console.log('updateCart error:'+error)
        } finally {
        await getCart() 
        }
    }

    const onSubmit: SubmitHandler<FormInput> = async(userData) =>{
        try {
            if(userData){
            const {name,email,tel,address,message} = userData
            const data={
                user: {name,email,tel,address},
                message: message
            }
            await axios.post(`${apiUrl}api/${apiPath}/order`, { data })
            }
        } catch (error) {
            console.log('onSubmit error:'+error)
        }finally{
            await getCart()
            navigate('/orderList')
        }
    }

    return (
        <div className="p-4 mt-4 pt-4">
            <div className="container pt-4">
            <div className='h1'>結帳</div>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>商品名稱</th>
                        <th>數量</th>
                        <th>單價</th>
                        <th>總計</th>
                    </tr>
                </thead>
                <tbody>
                {cart && cart.map((item) => (
                    <tr key={item.id}>
                        <td>{item.product.title}</td>
                        <td> 
                        <button className="btn btn-outline-primary"onClick={() =>updateCart(item.id,item.qty -1) }disabled={item.qty <= 1}>-</button>
                        <span className='mx-4'>{item.qty}</span>
                        <button  className="btn btn-outline-primary"  onClick={() =>updateCart(item.id,item.qty + 1) }>+</button> 
                        </td>                            
                        <td>${currency(item.product.price)}</td>
                        <td>${currency(item.final_total)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>提交訂單</button>
            
            {showModal && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">填寫訂單資訊</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form action="" onSubmit={handleSubmit(onSubmit)}>
                                <div className="modal-body">
                                {registerInputList.map(({name, label, type, placeholder, setting}) => (
                                    <div className="form-group" key={name}>
                                    <label htmlFor={name}>{label}</label>
                                    <input type={type} className="form-control" id={name} aria-describedby={`${name}Help`} placeholder={placeholder} autoComplete='off' {...register(name, setting)}/>
                                    {errors[name] && <div className='text-danger'>{errors[name]?.message}</div>}
                                    </div>
                                ))}
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>取消</button>
                                    <button className="btn btn-primary" type="submit">確認付款</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            </div>

        </div>
    );
};

export default Checkout;
