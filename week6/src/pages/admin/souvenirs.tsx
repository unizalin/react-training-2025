import { useEffect, useRef, useState } from 'react'
import * as bootstrap from "bootstrap";
import ProductModal from "../../components/productModal"
import axios from "axios";

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

function Souvenirs() {
  useEffect(() => {
    getProductCategories('伴手禮');
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
  }, [])
  
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
  
  const getProductCategories = async (type:string) => {
    try {
      const productCategoryRes = await axios.get(`${apiUrl}api/${apiPath}/admin/products`, {
        params: { category: type }
      })
      await setProducts(productCategoryRes.data.products)
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
      await getProductCategories('伴手禮');
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
      await getProductCategories('伴手禮');
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
  <div className='container p-4'>
    <button type="button" className="btn btn-primary"onClick={() => openModal({}, "new")}>建立新的伴手禮資訊</button>
    <div className='d-flex flex-wrap'>
      {products.map((item, index)=>(
        <div className="card mx-2 my-2" key={index} id={item.id} style={{ width: '18rem' }}>
          <img className="card-img-top" src={item.imageUrl} alt={item.title} />
          <div className="card-body">
            <p className='card-text'>品項：{item.title}</p>
            <p className='card-text'>分類：{item.category}</p>
            <p className='text-left'>原價：{item.origin_price}</p>
            <p className='text-left'>售價：{item.price}</p>
            <p className='text-left'>單位{item.unit}</p>
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
  </div>
  </>;
}
export default Souvenirs;