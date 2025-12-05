import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../slices/authSlice.js';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);
  const [form, setForm] = useState({ email: '', password: '', role: 'BUYER', name: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const action = await dispatch(registerUser(form));
    if (action.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <main className="mx-auto max-w-lg px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl bg-white p-8 shadow-card"
      >
        <h1 className="text-3xl font-semibold text-slate-900">Create account</h1>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="BUYER">Buyer</option>
          <option value="SELLER">Seller</option>
        </select>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-xl bg-indigo-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {status === 'loading' ? 'Creating...' : 'Create account'}
        </button>
        {error && <p className="text-sm font-medium text-rose-500">{error}</p>}
      </form>
    </main>
  );
};

export default Register;
