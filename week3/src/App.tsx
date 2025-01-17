import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as bootstrap from "bootstrap";
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
  const [modalType, setModalType] = useState<"new" | "edit" | "delete" | "">("");

  const productModalRef = useRef<bootstrap.Modal | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const apiPath = import.meta.env.VITE_API_APIPATH;


  useEffect(() => {
    if (modalRef.current) {
      console.log('modalRef',modalRef)
      productModalRef.current = new bootstrap.Modal("#productModal", {
        keyboard: false,
      });
    }
  }, []);
  
  useEffect(() => {
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

  const handleModalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target;
    console.log(e)
    setTempProduct((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

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

  const deleteProduct = async (id: string) => {
    try {
      console.log('deleteProduct',id)
      await axios.delete(
        `${apiUrl}api/${apiPath}/admin/product/${id}`
      );
      console.log("刪除成功");
      productModalRef.current.hide();
      getProducts();
    } catch (err: any) {
      console.error("刪除失敗", err.response.data.message);
    }
  }

  const updateProduct = async (id: string) => {
    const url =
      modalType === "edit"
        ? `${apiUrl}/api/${apiPath}/admin/product/${id}`
        : `${apiUrl}/api/${apiPath}/admin/product`;

    const productData = {
      data: {
        ...tempProduct,
        origin_price: Number(tempProduct.origin_price),
        price: Number(tempProduct.price),
        is_enabled: tempProduct.is_enabled ? 1 : 0,
        imagesUrl: tempProduct.imagesUrl || [],
      },
    };

    try {
      if (modalType === "edit") {
        await axios.put(url, productData);
        console.log("更新成功");
      } else {
        await axios.post(url, productData);
        console.log("新增成功");
      }
      productModalRef.current?.hide();
      getProducts();
    } catch (err: any) {
      console.error(
        modalType === "edit" ? "更新失敗" : "新增失敗",
        err.response.data.message
      );
    }
  }


  const handleAddImage = () => {
    setTempProduct((prevData) => ({
      ...prevData,
      imagesUrl: [...(prevData.imagesUrl || []), ""],
    }));
  };

  const handleRemoveImage = () => {
    setTempProduct((prevData) => {
      const newImages = [...(prevData.imagesUrl || [])];
      newImages.pop();
      return { ...prevData, imagesUrl: newImages };
    });
  }

  const handleImageChange = (index: number, value: string) => {
    setTempProduct((prevData) => {
      const newImages = [...(prevData.imagesUrl || [])];
      newImages[index] = value;

      if (
        value !== "" &&
        index === newImages.length - 1 &&
        newImages.length < 5
      ) {
        newImages.push("");
      }

      if (newImages.length > 1 && newImages[newImages.length - 1] === "") {
        newImages.pop();
      }

      return { ...prevData, imagesUrl: newImages };
    });
  };

  const openModal = (product: Partial<Product>, type: "new" | "edit" | "delete") => {
    console.log('openModal',product,type)
    console.log('productModalRef',productModalRef)
    setModalType(type);
    if (productModalRef.current) {
      productModalRef.current.show();
      setTempProduct(product||{})
    }
  }

  const closeModal = () => {
    if (productModalRef.current) {
      productModalRef.current.hide();
      setTempProduct({});
    }
  };

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
      <div className='d-flex'>
        {/**Sidebar*/}
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px' }}>
          <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <span className="fs-4">JINGHOUSE</span>
          </a>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <a href="#" className="nav-link active" aria-current="page">
                民宿資訊
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-white">
                客人資訊
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-white">
                備品資訊
              </a>
            </li>
          </ul>
        </div>
        {/**content*/}
        <div className='container p-4'>
          <button type="button" className="btn btn-primary"onClick={() => openModal({}, "new")}>建立新的民宿資訊</button>
          <div className='d-flex flex-wrap'>
            {products.map((item, index)=>(
              <div className="card mx-2 my-2" key={index} id={item.id} style={{ width: '18rem' }}>
                <img className="card-img-top" src={item.imageUrl} alt={item.title} />
                <div className="card-body">
                  <h5 className="card-title">品項：{item.title}</h5>
                  <p className='card-text'>分類：{item.category}</p>
                  <p className='text-left'>原價：{item.origin_price}</p>
                  <p className='text-left'>售價：{item.price}</p>
                  <button type="button" className='btn btn-danger ' onClick={() => openModal(item, "delete")}>刪除</button>
                  <button type="button" className='btn btn-primary mx-2' onClick={() => openModal(item, "edit")}>編輯</button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>}
      {/**modal*/}
      <div  className="modal fade" id="productModal" ref={modalRef} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          { tempProduct?(
          <div className="modal-content">
            <div  className={`modal-header ${modalType === "delete" ? "bg-danger" : "bg-primary"} text-white`}>
              <div> {modalType === "delete"? "刪除民宿資訊": modalType === "edit"? "編輯民宿資訊": "新增民宿資訊"}</div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {modalType === "delete" ? (<p>確定要刪除{tempProduct.title}嗎？</p>) : null}
              {modalType === "edit" || modalType === "new" ? (
              <div>
                <div>
                  <img
                    src={detailImg ? detailImg : tempProduct.imageUrl}
                    alt={tempProduct.title}
                    style={{ width: "220px" }}
                  />
                </div>
                <div className="container">
                    <div className="form-group row mb-3">
                      <label htmlFor="imageUrl" className="col-sm-2 col-form-label">輸入圖片網址</label>
                      <div className="col-sm-10">
                        <input id="imageUrl" type="text" className="form-control"  placeholder="請輸入標題" value={tempProduct.imageUrl}
                        onChange={handleModalInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row mb-3">
                      <label htmlFor="title" className="col-sm-2 col-form-label">標題</label>
                      <div className="col-sm-10">
                        <input id="title" type="text" className="form-control"  placeholder="請輸入標題" value={tempProduct.title}
                        onChange={handleModalInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row mb-3">
                      <label htmlFor="origin_price" className="col-sm-2 col-form-label">原價</label>
                      <div className="col-sm-10">
                        <input id="origin_price" type="text" className="form-control"  placeholder="請輸入原價
                        " value={tempProduct.origin_price}
                        onChange={handleModalInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row mb-3">
                      <label htmlFor="price" className="col-sm-2 col-form-label">售價</label>
                      <div className="col-sm-10">
                        <input id="price" type="text" className="form-control"  placeholder="請輸入售價" value={tempProduct.price}
                        onChange={handleModalInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row mb-3">
                      <label htmlFor="content" className="col-sm-2 col-form-label">描述</label>
                      <div className="col">
                        <textarea id="content" className="form-control" rows={6} placeholder="請輸入文案" value={tempProduct.content}
                        onChange={handleModalInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row mb-3">
                      <label htmlFor="description" className="col-sm-2 col-form-label">說明</label>
                      <div className="col">
                        <textarea id="description" className="form-control"  rows={6} placeholder="請輸入標題" value={tempProduct.description}
                        onChange={handleModalInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row mb-3">
                      <label className="col-sm-2 col-form-label">附圖</label>
                      <div className="col-sm-10">
                        {tempProduct.imagesUrl?.map((image, index) => (
                          <div key={index} className="mb-3">
                            {image && (
                              <img
                                src={image}
                                alt={`${index + 1}`}
                                className="img-preview mb-2"
                                style={{ width: "220px" }}
                              />
                            )}
                            <input
                              type="text"
                              value={image}
                              onChange={(e) => handleImageChange(index, e.target.value)}
                              placeholder={`圖片網址 ${index + 1}`}
                              className="form-control"
                            />
                          </div>
                        ))}
                        <div className="d-flex justify-content-between">
                          <button
                             className={`btn  btn-sm w-100 btn-primary text-white`}
                            onClick={handleAddImage}
                            disabled={(tempProduct.imagesUrl?.length ?? 0) >= 5}
                          >
                            新增圖片
                          </button>
                          {(tempProduct.imagesUrl?.length ?? 0) > 0 && (
                            <button
                              className="btn btn-danger btn-sm w-100 ms-2"
                              onClick={handleRemoveImage}
                            >
                              取消圖片
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                </div>
              </div>
              ) : null}
            </div>
            <div className="modal-footer">
              {modalType === "delete" && tempProduct.id ? ( <button type="button" onClick={() => deleteProduct(tempProduct.id!)}  className="btn btn-danger">確認刪除</button>) : null}
              {modalType === "edit" && tempProduct.id ? ( <button type="button" onClick={() => updateProduct(tempProduct.id!)}  className="btn btn-danger">確認更新</button>) : null}
              <button type="button" onClick={closeModal}  className="btn btn-primary">關閉</button>
            </div>
          </div>
          ):null}
        </div>
      </div>
    </>
  )
}

export default App
