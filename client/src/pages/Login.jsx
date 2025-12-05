import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../slices/authSlice.js';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const action = await dispatch(loginUser(form));
    if (action.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl bg-white p-8 shadow-card"
      >
        <h1 className="text-3xl font-semibold text-slate-900">Login</h1>
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-xl bg-emerald-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {status === 'loading' ? 'Signing in...' : 'Sign in'}
        </button>
        {error && <p className="text-sm font-medium text-rose-500">{error}</p>}
      </form>
    </main>
  );
};

export default Login;
