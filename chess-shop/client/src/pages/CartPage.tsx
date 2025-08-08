import { useCart } from '../store/useCart';

export default function CartPage() {
  const { items, setQty, removeItem, clear } = useCart();
  const total = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
  return (
    <div style={{ padding: 24 }}>
      <h2>Shopping Cart</h2>
      {items.length === 0 ? <p>Your cart is empty.</p> : (
        <>
          <div style={{ display: 'grid', gap: 12 }}>
            {items.map((i) => (
              <div key={i.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', alignItems: 'center', gap: 8 }}>
                <div>
                  <strong>{i.name}</strong>
                  <div>${(i.priceCents / 100).toFixed(2)}</div>
                </div>
                <input type="number" min={1} value={i.quantity} onChange={(e) => setQty(i.id, Number(e.target.value))} />
                <div>${((i.priceCents * i.quantity) / 100).toFixed(2)}</div>
                <button onClick={() => removeItem(i.id)}>Remove</button>
              </div>
            ))}
          </div>
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Total</strong>
            <strong>${(total / 100).toFixed(2)}</strong>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button onClick={clear}>Clear</button>
            <button disabled>Checkout (demo)</button>
          </div>
        </>
      )}
    </div>
  );
}