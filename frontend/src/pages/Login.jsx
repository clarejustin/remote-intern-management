import React, { useState } from 'react';
import { apiFetch } from '../api';

export default function Login({ onLoggedIn }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [err, setErr] = useState('');

  async function submit(e){
    e.preventDefault(); setErr('');
    try {
      const path = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name || 'User', email: form.email, password: form.password };

      const data = await apiFetch(path, { method:'POST', body: JSON.stringify(payload) });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLoggedIn?.(data.user);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div style={{maxWidth:420, margin:'80px auto', padding:24, border:'1px solid #ddd', borderRadius:12, fontFamily:'system-ui'}}>
      <h2 style={{marginTop:0}}>{mode === 'login' ? 'Sign in' : 'Create an account'}</h2>
      <form onSubmit={submit} style={{display:'grid', gap:10}}>
        {mode === 'register' && (
          <input
            placeholder="Name"
            value={form.name}
            onChange={e=>setForm({...form, name:e.target.value})}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={e=>setForm({...form, email:e.target.value})}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={e=>setForm({...form, password:e.target.value})}
        />
        {err && <div style={{color:'crimson'}}>{err}</div>}
        <button type="submit">{mode === 'login' ? 'Login' : 'Register & Login'}</button>
      </form>
      <div style={{marginTop:10, fontSize:13}}>
        {mode === 'login'
          ? <>No account? <button onClick={()=>setMode('register')}>Register</button></>
          : <>Have an account? <button onClick={()=>setMode('login')}>Login</button></>}
      </div>
    </div>
  );
}

