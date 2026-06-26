import {useState} from 'react';
import {products} from './data/products';
import ProductCard from './components/ProductCard';
import {getRecommendations} from './services/openrouter';

export default function App(){
  const[q,setQ]=useState('');
  const[rec,setRec]=useState([]);
  const[message,setMessage]=useState('');
  const[loading,setLoading]=useState(false);
  const[touched,setTouched]=useState(false);

  async function run(){
    if(!q.trim())return;
    setLoading(true);
    setTouched(true);
    try{
      const {message,recommendations}=await getRecommendations(q,products);
      setMessage(message);
      setRec(products.filter(p=>recommendations.includes(p.id)));
    }catch(e){console.error(e);alert('API Error: '+e.message);}
    setLoading(false);
  }

  return(
    <div className="app">
      <header className="hero">
        <h1 className="hero__title">🛍️ AI Product Recommendation</h1>
        <p className="hero__sub">Tell us what you need — we'll pick the best from our Indian catalogue.</p>
        <div className="search">
          <input
            className="search__input"
            value={q}
            onChange={e=>setQ(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&run()}
            placeholder="e.g. a phone under ₹30,000 with great camera"
          />
          <button className="search__btn" onClick={run} disabled={loading}>
            {loading?'Thinking…':'Recommend'}
          </button>
        </div>
      </header>

      <section className="section">
        <h2 className="section__title">✨ Recommendations</h2>
        {loading ? (
          <div className="note">
            <span className="note__spinner" />
            <span>Our AI is comparing prices and features to find your best matches…</span>
          </div>
        ) : touched ? (
          <>
            {message && <p className="answer">{message}</p>}
            {rec.length>0 && (
              <div className="grid">
                {rec.map(p=><ProductCard key={p.id} product={p} recommended />)}
              </div>
            )}
            {!message && rec.length===0 && (
              <p className="empty">No matches found — try rephrasing your need.</p>
            )}
          </>
        ) : (
          <p className="empty">No recommendations yet. Search above to get started!</p>
        )}
      </section>

      <section className="section">
        <h2 className="section__title">🗂️ All Products</h2>
        <div className="grid">
          {products.map(p=><ProductCard key={p.id} product={p}/>)}
        </div>
      </section>
    </div>
  );
}
