import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Modal } from 'bootstrap';
import axios from "axios";

function App() {
  interface User {
    username: string;
    password: string;
  }
  const [user, setUser] = useState<User>({
    username: '',
    password: ''
  })
  const [isLogin, setIsLogin] = useState<boolean>(false)
  interface Product {
    category: string,
    content: string,
    description: string,
    id: string,
    imageUrl: string,
    imagesUrl: string[],
    is_enabled: number,
    origin_price: number,
    price: number,
    title: string
    unit: string,
    num: number;
  }
  const [products, setProducts] = useState<Product[]>([])
  const [tempProduct, setTempProduct] = useState<Partial<Product>>({})
  const [detailImg, setDetailImg] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const customModal = useRef<Modal|null >(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const apiPath = import.meta.env.VITE_API_APIPATH;

  useEffect(() => {
    if(modalRef.current){
      customModal.current = new Modal(modalRef.current)
    }
    async function initialize() {
      await checkLogin();
      await getProducts();
    }
    initialize();
  }, [])

  const handleLogin = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {name,value} = e.target
    setUser({
      ...user,
      [name]: value
    })
  }

  async function login() {
    try {
      const signInRes = await axios.post(`${apiUrl}admin/signin`,user)
      const { token, expired } = signInRes.data
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = `${token}`;
      if(signInRes.status == 200){
        setIsLogin(true)
        await getProducts()
      }
    } catch (error) {
      console.log('login error :'+error)
    }
  }

  async function checkLogin () {
    try {
      const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
      axios.defaults.headers.common.Authorization = token;

      const checkRes = await axios.post(`${apiUrl}api/user/check`)
      if(checkRes.status == 200){
        setIsLogin(true)
      }else{
        setIsLogin(false)
      }
      console.log('checkRes',checkRes)
    } catch (error) {
      console.log('checkLogin error :'+error)
    }
  }

  const getProducts = async () => {
    try {
      const productsRes = await axios.get(`${apiUrl}api/${apiPath}/products/all`)
      await setProducts(productsRes.data.products)
    } catch (error) {
      console.log('productsRes error :'+error)
    }
  }
  const openModal = (item: Product)=>{
    if (customModal.current) {
      customModal.current.show();
      setTempProduct(item)
    }
  }

  const closeModal = ()=>{
    if (customModal.current) {
      customModal.current.hide();
    }
  }

  return (
    <>
      {!isLogin?
      <div className='h-100vh d-flex justify-content-center align-items-center'>
        <div className="card">
          <div className="mb-3">
            <label htmlFor="usernameInput" className="form-label">username</label>
            <input type="username" name="username" className="form-control" id="usernameInput" placeholder="name@example.com" value={user.username} onChange={handleLogin}/>
          </div>
          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label">password</label>
            <input type="password" name="password" className="form-control" id="passwordInput" value={user.password} onChange={handleLogin}/>
          </div>
          <button className='btn btn-primary' onClick={login}>Login</button>
        </div>
      </div>
      :
      <div>
        <div className='d-flex flex-wrap'>
          {products.map((item, index)=>(
            <div className="card mx-2 my-2" key={index} id={item.id} style={{ width: '18rem' }}>
              <img className="card-img-top" src={item.imageUrl} alt={item.title} />
              <div className="card-body">
                <h5 className="card-title">品項：{item.title}</h5>
                <p className='card-text'>分類：{item.category}</p>
                <p className='text-left'>原價：{item.origin_price}</p>
                <p className='text-left'>售價：{item.price}</p>
                <button type="button" className='btn btn-primary' onClick={() => openModal(item)}>查看更多</button>
              </div>

            </div>
          ))}
        </div>
        <div  className="modal fade" ref={modalRef} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            { tempProduct?(
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">{tempProduct.title}</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <img
                  src={detailImg ? detailImg : tempProduct.imageUrl}
                  alt={tempProduct.title}
                  style={{ width: "220px" }}
                />
                <div className="top">
                  <div>商品名稱：{tempProduct.title}</div>
                  <div>商品描述：{tempProduct.category}</div>
                  <div>商品大小：{tempProduct.content}</div>
                  <div>庫存數量：{tempProduct.num}</div>
                  <div>商品介紹：{tempProduct.description}</div>
                </div>
                <div>
                  更多圖片：
                  <div className="flex">
                    {tempProduct.imagesUrl && tempProduct.imagesUrl.map((url, index) => (
                      <img
                        className="img-thumbnail"
                        style={{ width: "120px" }}
                        key={index}
                        src={url}
                        alt={`更多圖片-${index}`}
                        onClick={() => setDetailImg(url)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeModal}  className="btn btn-primary">關閉</button>
              </div>
            </div>
            ):null}
          </div>
        </div>
      </div>}
    </>
  )
}

export default App
