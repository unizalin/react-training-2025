import 'bootstrap/dist/css/bootstrap.min.css';
import Room from '../components/frontend/room';
function Home() {
  return(
    <>
      <section 
          id="section1" 
          className="vh-100 d-flex align-items-center hero-section"
        >
          <div className="container text-center">
            <h1 className="display-4 mb-4">Where is Your Next Stay?</h1>
            <p className="lead">體驗在地民宿與多元文化，打造不一樣的旅程</p>
            <div className="mt-4 d-flex justify-content-center">
              <input
                type="text"
                placeholder="目的地？"
                className="form-control w-auto me-2"
              />
              <button className="btn btn-dark">搜尋</button>
            </div>
          </div>
      </section>
      {/* 第二區塊 (房型介紹) */}
      <section 
        className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light"
      >
          <div className="hero-banner">
            <div className="hero-bg-text">EXPLORE NEXT</div>
            <div className="hero-overlay">
              <h1>探索不一樣的旅程</h1>
              <p>感受世界的多元風貌，開啟你的冒險之路。</p>
            </div>
          </div>
          <Room/>
      </section>
      {/* 第三區塊 (在地體驗) */}
      <section 
        id="section3" 
        className="vh-100 d-flex align-items-center experiences-section"
      >
        <div className="container text-center">
          <h2>在地體驗</h2>
          <p>與在地人一起探索隱藏景點與文化</p>
          <button className="btn btn-primary mt-4">查看更多體驗</button>
        </div>
      </section>
      {/* 第四區塊 (聯絡我們) */}
      <section 
        id="section4" 
        className="vh-100 d-flex align-items-center bg-light"
      >
        <div className="container text-center">
          <h2>聯絡我們</h2>
          <p>想預訂或成為房東？歡迎洽詢</p>
          <p>電話：09xx-xxx-xxx / Email：info@example.com</p>
        </div>
      </section>
    </>
  )
}

export default Home;