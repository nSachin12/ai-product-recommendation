const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function ProductCard({ product, recommended }) {
  return (
    <div className={`card${recommended ? ' card--rec' : ''}`}>
      <div className="card__art" style={{ background: `linear-gradient(135deg, ${product.color}, ${product.color}99)` }}>
        <span className="card__emoji">{product.emoji}</span>
        {recommended && <span className="card__pick">★ AI Pick</span>}
      </div>
      <div className="card__body">
        <span className="card__cat">{product.category}</span>
        <h3 className="card__name">{product.name}</h3>
        <p className="card__brand">{product.brand}</p>
        <div className="card__foot">
          <span className="card__price">{usd.format(product.price)}</span>
          <span className="card__rating">⭐ {product.rating}</span>
        </div>
      </div>
    </div>
  );
}
