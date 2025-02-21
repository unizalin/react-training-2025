import 'bootstrap/dist/css/bootstrap.min.css';
import Room from '../components/frontend/room';
import Local from '../components/frontend/local'
import { Link } from "react-router";
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
          <div className="row">
            <div className="col-6">
              <div className="hero-text">
              <h1>在地手作 | 精選伴手禮</h1>
              <h2>匠心手作，最暖心的伴手禮</h2>
              <hr />
              <p className='mt-4'>我們相信，每一份伴手禮不只是美食，更是一份心意的傳遞。<br />
              從挑選優質食材，到每一道用心製作的工序，都是為了讓這份禮物承載滿滿的溫暖。</p>
              <p className="text-muted mt-4">
                  我們的伴手禮堅持在地手作，嚴選優質食材與細膩工藝，讓每一份禮物都承載滿滿心意。
                  無論是旅行、節慶送禮，還是與親朋好友共享，都能帶來美好回憶。
              </p>
              <Link to="local" className="btn btn-outline-dark custom-btn">探索我們的伴手禮</Link>
              </div>
            </div>
            <div className="col-6">
              <Local modalType='img'/>
            </div>
        </div>
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