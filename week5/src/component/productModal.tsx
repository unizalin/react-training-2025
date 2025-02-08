import { useRef, useEffect } from "react";
import * as bootstrap from "bootstrap";
import PropTypes from "prop-types";

type TemplateData = {
  id: string;
  category: string;
  content: string;
  description: string;
  imageUrl: string;
  imagesUrl: string[];
  is_enabled: boolean;
  origin_price: number | string;
  price: number | string;
  title: string;
  unit: string;
  num: number;
  vistorNum: number;
  isExtraBed: boolean;
  extraBedNum: number;
};

function ProductModal({
  modalType,
  templateData,
  onFileChange,
  onCloseModal,
  onInputChange,
  onImageChange,
  onAddImage,
  onRemoveImage,
  onUpdateProduct,
  onDeleteProduct,
}: {
  modalType: string;
  templateData: TemplateData;
  onCloseModal: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onImageChange: (index: number, value: string) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  onUpdateProduct: (id: string) => void;
  onDeleteProduct: () => void;
}) {
  const productModalRef = useRef<bootstrap.Modal | null>(null);
  useEffect(() => {
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
  }, [modalType]);
  
  return (
    <div  className="modal fade" id="productModal" ref={productModalRef} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          { templateData?(
          <div className="modal-content">
            <div  className={`modal-header ${modalType === "delete" ? "bg-danger" : "bg-primary"} text-white`}>
              <div> {modalType === "delete"? `刪除${templateData.category}資訊`: modalType === "edit"? `編輯${templateData.category}資訊`: `新增${templateData.category}資訊`}</div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onCloseModal}></button>
            </div>
            <div className="modal-body">
              {modalType === "delete" ? (<p>確定要刪除{templateData.title}嗎？</p>) : null}
              {modalType === "edit" || modalType === "new" ? (
              <div>
                <div>
                  <img
                    src={templateData.imageUrl}
                    alt={templateData.title}
                    style={{ width: "220px" }}
                  />
                </div>
                <div className="container">
                    <div className="form-group row mb-3">
                      <label htmlFor="imageUrl" className="col-sm-3 col-form-label">圖片上傳or輸入圖片網址</label>
                      <div className="col-sm-9">
                      <div className="mb-3">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="form-control"
                        id="fileInput"
                        onChange={onFileChange}
                      />
                    </div>
                        <input id="imageUrl" type="text" className="form-control"  placeholder="主圖網址" value={templateData.imageUrl??""}
                        onChange={onInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row mb-3">
                      <label htmlFor="title" className="col-sm-2 col-form-label">標題</label>
                      <div className="col-sm-10">
                        <input id="title" type="text" className="form-control"  placeholder="請輸入標題" value={templateData.title??""}
                        onChange={onInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row mb-3">
                      <label htmlFor="category" className="col-sm-2 col-form-label">分類</label>
                      <div className="col-sm-10">
                        <input id="category" type="text" className="form-control"  placeholder="請輸入分類" value={templateData.category??""}
                        onChange={onInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row mb-3">
                      <label htmlFor="origin_price" className="col-sm-2 col-form-label">原價</label>
                      <div className="col-sm-10">
                        <input id="origin_price" type="text" className="form-control"  placeholder="請輸入原價
                        " value={templateData.origin_price??""}
                        onChange={onInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row mb-3">
                      <label htmlFor="price" className="col-sm-2 col-form-label">售價</label>
                      <div className="col-sm-10">
                        <input id="price" type="text" className="form-control"  placeholder="請輸入售價" value={templateData.price??""}
                        onChange={onInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row mb-3">
                      <label htmlFor="num" className="col-sm-2 col-form-label">數量
                      </label>
                      <div className="col-sm-10">
                        <input id="num" type="number" className="form-control"  placeholder="數量" value={templateData.num??0}
                        onChange={onInputChange}/>
                      </div>
                    </div>
                    { templateData.category === "民宿" ? (<>
                      <div className="form-group row mb-3">
                        <label htmlFor="vistorNum" className="col-sm-3 col-form-label">每棟人數
                        </label>
                        <div className="col-sm-9">
                          <input id="vistorNum" type="number" className="form-control"  placeholder="請輸入每棟人數" value={templateData.vistorNum??0}
                          onChange={onInputChange}/>
                        </div>
                      </div>
                      <div className="form-group row mb-3">
                        <label htmlFor="isExtraBed" className="col-sm-3 form-check-label">是否可加床
                        </label>
                        <div className="col">
                          <input id="isExtraBed" type="checkbox" className="form-check-input" checked={templateData.isExtraBed}
                          onChange={onInputChange}/>
                        </div>
                      </div>
                      {
                        templateData.isExtraBed?
                        <div className="form-group row mb-3">
                          <label htmlFor="extraBedNum" className="col-sm-4 col-form-label">每棟可加床人數
                          </label>
                          <div className="col">
                          <input id="extraBedNum" type="number" className="form-control"  placeholder="請輸入加床人數" value={templateData.extraBedNum??0}
                            onChange={onInputChange}/>
                          </div>
                      </div>:
                      null}    
                    </>):null}           
                    <div className="form-group row mb-3">
                      <label htmlFor="content" className="col-sm-2 col-form-label">描述</label>
                      <div className="col">
                        <textarea id="content" className="form-control" rows={6} placeholder="請輸入文案" value={templateData.content}
                        onChange={onInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row mb-3">
                      <label htmlFor="description" className="col-sm-2 col-form-label">說明</label>
                      <div className="col">
                        <textarea id="description" className="form-control"  rows={6} placeholder="請輸入標題" value={templateData.description}
                        onChange={onInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row mb-3">
                      <label className="col-sm-2 col-form-label">附圖</label>
                      <div className="col-sm-10">
                        {templateData.imagesUrl?.map((image, index) => (
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
                              value={image??""}
                              onChange={(e) => onImageChange(index, e.target.value)}
                              placeholder={`圖片網址 ${index + 1}`}
                              className="form-control"
                            />
                          </div>
                        ))}
                        <div className="d-flex justify-content-between">
                          <button
                            className={`btn  btn-sm w-100 btn-primary text-white`}
                            onClick={onAddImage}
                            disabled={(templateData.imagesUrl?.length ?? 0) >= 5}
                          >
                            新增圖片
                          </button>
                          {(templateData.imagesUrl?.length ?? 0) > 0 && (
                            <button
                              className="btn btn-danger btn-sm w-100 ms-2"
                              onClick={() => onRemoveImage(templateData.imagesUrl.length - 1)}
                            >
                              取消圖片 
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="form-group row mb-3">
                      <label htmlFor="is_enabled" className="col-sm-3 form-check-label">是否啟用
                      </label>
                      <div className="col">
                        <input id="is_enabled" type="checkbox" className="form-check-input" checked={templateData.is_enabled}
                        onChange={onInputChange}/>
                        </div>
                    </div>
                </div>
              </div>
              ) : null}
            </div>
            <div className="modal-footer">
              {modalType === "delete" && templateData.id ? ( <button type="button" onClick={onDeleteProduct}  className="btn btn-danger">確認刪除</button>) : null}
              {modalType === "edit" && templateData.id ? ( <button type="button" onClick={() => onUpdateProduct(templateData.id)}  className="btn btn-danger">確認更新</button>) : null}
              <button type="button" onClick={onCloseModal}  className="btn btn-primary">關閉</button>
            </div>
          </div>
          ):null}
        </div>
      </div>
  )
}

ProductModal.propTypes = {
  modalType: PropTypes.string.isRequired,
  templateData: PropTypes.shape({
    id: PropTypes.string,
    category: PropTypes.string,
    content: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    imagesUrl: PropTypes.arrayOf(PropTypes.string),
    is_enabled: PropTypes.bool,
    origin_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string,
    unit: PropTypes.string,
    num: PropTypes.number,
    vistorNum:PropTypes.number,
    isExtraBed: PropTypes.bool,
    extraBedNum: PropTypes.number,
  }).isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
  onImageChange: PropTypes.func.isRequired,
  onAddImage: PropTypes.func.isRequired,
  onRemoveImage: PropTypes.func.isRequired,
  onUpdateProduct: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
}

export default ProductModal;
