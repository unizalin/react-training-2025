const { useState } = React;
const productList = [
{
  category: "甜甜圈",
  content: "尺寸：14x14cm",
  description: "濃郁的草莓風味，中心填入滑順不膩口的卡士達內餡，帶來滿滿幸福感！",
  id: "-L9tH8jxVb2Ka_DYPwng",
  is_enabled: 1,
  origin_price: 150,
  price: 99,
  title: "草莓莓果夾心圈",
  unit: "元",
  num: 10,
  imageUrl: "https://images.unsplash.com/photo-1583182332473-b31ba08929c8",
  imagesUrl: [
  "https://images.unsplash.com/photo-1626094309830-abbb0c99da4a",
  "https://images.unsplash.com/photo-1559656914-a30970c1affd"] },


{
  category: "蛋糕",
  content: "尺寸：6寸",
  description: "蜜蜂蜜蛋糕，夾層夾上酸酸甜甜的檸檬餡，清爽可口的滋味讓人口水直流！",
  id: "-McJ-VvcwfN1_Ye_NtVA",
  is_enabled: 1,
  origin_price: 1000,
  price: 900,
  title: "蜂蜜檸檬蛋糕",
  unit: "個",
  num: 1,
  imageUrl: "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80",
  imagesUrl: [
  "https://images.unsplash.com/photo-1618888007540-2bdead974bbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=987&q=80"] },


{
  category: "蛋糕",
  content: "尺寸：6寸",
  description: "法式煎薄餅加上濃郁可可醬，呈現經典的美味及口感。",
  id: "-McJ-VyqaFlLzUMmpPpm",
  is_enabled: 1,
  origin_price: 700,
  price: 600,
  title: "暗黑千層",
  unit: "個",
  num: 15,
  imageUrl: "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDZ8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
  imagesUrl: [
  "https://images.unsplash.com/flagged/photo-1557234985-425e10c9d7f1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA5fHxjYWtlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
  "https://images.unsplash.com/photo-1540337706094-da10342c93d8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDR8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"] }];



function App() {
  const [product, setProduct] = useState(productList);
  // 初始化，尚未有資料帶入null
  const [tempProduct, setTempProduct] = useState(null);
  const [detailImg, setDetailImg] = useState(null);

  return /*#__PURE__*/(
    React.createElement("div", null,
    product.map((item) => /*#__PURE__*/
    React.createElement("div", { className: "card cl-flex cl-alignItems-center cl-justifyContent-around", key: item.id }, /*#__PURE__*/
    React.createElement("div", { className: "left" }, /*#__PURE__*/
    React.createElement("div", { className: "bigImg" }, /*#__PURE__*/
    React.createElement("img", { src: item.imageUrl, alt: item.title }))), /*#__PURE__*/


    React.createElement("div", { className: "center cl-mx-4 cl-text-left" }, /*#__PURE__*/
    React.createElement("div", { className: "cl-fontSize-16" }, "\u54C1\u540D\uFF1A", item.title), /*#__PURE__*/
    React.createElement("div", { className: "cl-fontSize-16 cl-line-through" }, "\u539F\u50F9\uFF1A", item.origin_price), /*#__PURE__*/
    React.createElement("div", { className: "cl-fontSize-16" }, "\u552E\u50F9\uFF1A", item.price), /*#__PURE__*/
    React.createElement("div", { className: "cl-fontSize-16" }, "\u555F\u7528\uFF1A", item.is_enabled ? "啟用" : "未啟用")), /*#__PURE__*/

    React.createElement("div", { className: "right" }, /*#__PURE__*/

    React.createElement("button", { onClick: () => {setTempProduct(item);setDetailImg(null);} }, "\u67E5\u770B\u7D30\u7BC0")))), /*#__PURE__*/






    React.createElement("div", { className: "cl-my-8" }, /*#__PURE__*/
    React.createElement("div", { className: "cl-text-center" },
    tempProduct ? "您現在查看的商品是" : "請選擇一樣查看更詳細內容"),


    tempProduct ? /*#__PURE__*/
    React.createElement("div", { className: "card cl-flex" }, /*#__PURE__*/

    React.createElement("div", { className: "left cl-mx-8" }, /*#__PURE__*/
    React.createElement("img", {
      src: detailImg ? detailImg : tempProduct.imageUrl,
      alt: tempProduct.title,
      style: { width: "220px" } })), /*#__PURE__*/


    React.createElement("div", { className: "cl-flex cl-flex-column cl-justifyContent-around" }, /*#__PURE__*/
    React.createElement("div", { className: "top" }, /*#__PURE__*/
    React.createElement("div", null, "\u5546\u54C1\u540D\u7A31\uFF1A", tempProduct.title), /*#__PURE__*/
    React.createElement("div", null, "\u5546\u54C1\u63CF\u8FF0\uFF1A", tempProduct.category), /*#__PURE__*/
    React.createElement("div", null, "\u5546\u54C1\u5927\u5C0F\uFF1A", tempProduct.content), /*#__PURE__*/
    React.createElement("div", null, "\u5EAB\u5B58\u6578\u91CF\uFF1A", tempProduct.num), /*#__PURE__*/
    React.createElement("div", null, "\u5546\u54C1\u4ECB\u7D39\uFF1A", tempProduct.description)), /*#__PURE__*/

    React.createElement("div", null, "\u66F4\u591A\u5716\u7247\uFF1A", /*#__PURE__*/

    React.createElement("div", { className: "cl-flex" },
    tempProduct.imagesUrl.map((url, index) => /*#__PURE__*/
    React.createElement("img", {
      className: "smallImg cl-mx-4",
      key: index,
      src: url,
      alt: `更多圖片-${index}`,
      onClick: () => setDetailImg(url) })))))) :






    null)));



}



ReactDOM.createRoot(document.querySelector('#app')).
render( /*#__PURE__*/React.createElement(App, null));