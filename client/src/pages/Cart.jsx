import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CartSummary from '../components/CartSummary.jsx';
import { fetchCart, removeItemFromCart } from '../slices/cartSlice.js';

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.data);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (itemId) => dispatch(removeItemFromCart({ itemId }));

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <CartSummary cart={cart} onRemove={handleRemove} />
    </main>
  );
};

export default Cart;
