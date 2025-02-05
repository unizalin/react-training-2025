import { useEffect, useRef, useState } from 'react'
import * as bootstrap from "bootstrap";
import ProductModal from "../component/productModal"
import axios from "axios";

function Home() {
  useEffect(() => {
      async function initialize() {
        await getProducts();
      }
      initialize();
  
      productModalRef.current = new bootstrap.Modal("#productModal", {
        keyboard: false,
      });
    }, [])
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
    const [products, setProducts] = useState<Product[]>([])
    
    const productModalRef = useRef<bootstrap.Modal | null>(null);
    const [modalType, setModalType] = useState<"new" | "edit" | "delete" | "">("");
    const [templateData, setTemplateData] = useState<{
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
    }>({
      id: "",
      imageUrl: "",
      title: "",
      category: "",
      unit: "",
      origin_price: 0,
      price: 0,
      description: "",
      content: "",
      is_enabled: false,
      imagesUrl: [""],
      num: 0,
      vistorNum: 0,
      isExtraBed: false,
      extraBedNum: 0,
    });
  
    const apiUrl = import.meta.env.VITE_API_URL;
    const apiPath = import.meta.env.VITE_API_APIPATH;

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
      } catch (error) {
        console.error("刪除失敗", error);
      }
    }
  
    const updateProduct = async (id: string) => {
      const url =
        modalType === "edit"
          ? `${apiUrl}/api/${apiPath}/admin/product/${id}`
          : `${apiUrl}/api/${apiPath}/admin/product`;
  
      const productData = {
        data: {
          ...templateData,
          origin_price: Number(templateData.origin_price),
          price: Number(templateData.price),
          is_enabled: templateData.is_enabled ? 1 : 0,
          imagesUrl: templateData.imagesUrl || [],
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
      } catch (error) {
        console.error(
          modalType === "edit" ? "更新失敗" : "新增失敗",
          error
        );
      }
    }
  
    const handleAddImage = () => {
      setTemplateData((prevData) => ({
        ...prevData,
        imagesUrl: [...(prevData.imagesUrl || []), ""],
      }));
    };
  
    const handleRemoveImage = () => {
      setTemplateData((prevData) => {
        const newImages = [...(prevData.imagesUrl || [])];
        newImages.pop();
        return { ...prevData, imagesUrl: newImages };
      });
    }
  
    const handleImageChange = (index: number, value: string) => {
      setTemplateData((prevData) => {
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
  
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = `${apiUrl}api/${apiPath}/admin/upload`;
      const file = e.target.files?.[0];
      if(!file)return;
  
      try {
        const formData = new FormData();
        formData.append("file-to-upload", file);
  
        const res = await axios.post(url, formData);
        const uploadedImageUrl = res.data.imageUrl;
        setTemplateData((prevTemplateData) => ({
          ...prevTemplateData,
          imageUrl: uploadedImageUrl,
        }));
      } catch (error) {
        console.log('handleFileChange error :'+error)
      }
    }
  
    
  
    const closeModal = () => {
      productModalRef.current.hide();
  
      if (productModalRef.current) {
        setTemplateData({
              id: "",
              imageUrl: "",
              title: "",
              category: "",
              unit: "",
              origin_price: 0,
              price: 0,
              description: "",
              content: "",
              is_enabled: false,
              imagesUrl: [],
              num: 0,
              vistorNum: 0,
              isExtraBed: false,
              extraBedNum: 0,
            });
      }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value, type, checked } = e.target as HTMLInputElement;
      setTemplateData((prevData) => ({
        ...prevData,
        [id]: type === "checkbox" ? checked : type==="number"?Number(value):value,
      }));
    };
  const openModal = (product: Partial<Product>, type: "new" | "edit" | "delete") => {
    setTemplateData({
      id: product.id || "",
      imageUrl: product.imageUrl || "",
      title: product.title || "",
      category: product.category || "",
      unit: product.unit || "",
      origin_price: Number(product.origin_price) || 0,
      price: Number(product.price) || 0,
      description: product.description || "",
      content: product.content || "",
      is_enabled: Boolean(product.is_enabled) || false,
      imagesUrl: product.imagesUrl || [],
      num: Number(product.num) || 0,
      vistorNum: Number(product.vistorNum) || 0,
      isExtraBed: Boolean(product.isExtraBed) || false,
      extraBedNum: Number(product.extraBedNum) || 0,
    });
    if (productModalRef.current) {
      productModalRef.current.show();
    }
    setModalType(type);
  }
  return <>
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
            <p className='text-left'>每棟人數：{item.vistorNum}</p>
            <p className='text-left'>使否可加床：{item.isExtraBed?'是':'否'}</p>
            <p className='text-left'>每棟可加床：{item.extraBedNum ? item.extraBedNum : 0}/人</p>
            <p className='text-left'>是否啟用：{item.is_enabled ? '是' : '否'}</p>
            <button type="button" className='btn btn-danger ' onClick={() => openModal(item, "delete")}>刪除</button>
            <button type="button" className='btn btn-primary mx-2' onClick={() => openModal(item, "edit")}>編輯</button>
          </div>

        </div>
      ))}
    </div>

     {/**modal*/}
          <ProductModal
            modalType={modalType}
            templateData={templateData}
            onCloseModal={closeModal}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onImageChange={handleImageChange}
            onAddImage={handleAddImage}
            onRemoveImage={handleRemoveImage}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
          />
  </>;
}
export default Home;