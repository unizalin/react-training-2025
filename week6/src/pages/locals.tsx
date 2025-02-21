import Local from '../components/frontend/local'

function Locals() {
  return (
    <section className="vh-100 d-flex align-items-center experiences-section">
      <div className="container text-center">
        <h2>在地體驗</h2>
        <p>與在地人一起探索隱藏景點與文化</p>
          <Local modalType="rooms" />
      </div>
    </section>
  );
}

export default Locals;
