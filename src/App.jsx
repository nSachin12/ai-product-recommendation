import {useState} from 'react';
import {products} from './data/products';
import ProductCard from './components/ProductCard';
import {getRecommendations} from './services/openrouter';

// Shown (one picked at random) when the AI finds no matching product.
const NOT_FOUND_MESSAGES=[
  'Sorry, we don\'t have that exact product in our store right now. Try a different category or budget!',
  'Hmm, that specific item isn\'t in our list yet. Maybe explore the products below?',
  'No luck — we couldn\'t find a match for that. Try broadening your search a little.',
  'That product isn\'t available in our catalogue at the moment. Check back soon!',
  'Oops! Nothing in our store fits that request. Try another brand, price, or type.',
  'We searched everywhere but couldn\'t find that one. How about adjusting your preferences?',
];

function randomNotFound(){
  return NOT_FOUND_MESSAGES[Math.floor(Math.random()*NOT_FOUND_MESSAGES.length)];
}

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
      const matched=products.filter(p=>recommendations.includes(p.id));
      setRec(matched);
      setMessage(matched.length>0 ? message : randomNotFound());
    }catch(e){console.error(e);alert('API Error: '+e.message);}
    setLoading(false);
  }

  return(
    <div className="app">
      <header className="hero">
        <h1 className="hero__title">🛍️ AI Product Recommendation</h1>
        <p className="hero__sub">Tell us what you need — we'll pick the best from our catalogue.</p>
        <div className="search">
          <input
            className="search__input"
            value={q}
            onChange={e=>setQ(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&run()}
            placeholder="e.g. a phone under $400 with a great camera"
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
