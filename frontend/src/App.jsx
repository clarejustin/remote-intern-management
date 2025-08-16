import React, { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import { apiFetch, API_BASE } from './api';

export default function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  if (!user) return <Login onLoggedIn={setUser} />;

  return (
    <div style={{ maxWidth: 1100, margin:'28px auto', fontFamily:'system-ui' }}>
      <header style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div>
          <h1 style={{marginBottom:4}}>Remote Intern Management</h1>
          <div style={{color:'#666', fontSize:13}}>API: {API_BASE}</div>
        </div>
        <div>
          <span style={{marginRight:12}}>Hello, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <p style={{ color:'#666' }}>Dashboard for Interns, Tasks, and Timesheets.</p>

      <Interns />
      <Tasks />
      <Timesheets />
    </div>
  );
}

const Card = ({ title, children }) => (
  <section style={{border:'1px solid #e5e5e5', borderRadius:12, padding:16, marginTop:20}}>
    <h2 style={{marginTop:0}}>{title}</h2>
    {children}
  </section>
);

// ===== Interns =====
function Interns(){
  const [list, setList] = useState([]);
  const [f, setF] = useState({ firstName:'', lastName:'', email:'', role:'Intern', status:'Active' });
  const [err, setErr] = useState('');

  async function load(){
    try { setList(await apiFetch('/api/interns')); }
    catch(e){ setErr(e.message); }
  }
  useEffect(()=>{ load(); },[]);

  async function add(e){
    e.preventDefault(); setErr('');
    try {
      await apiFetch('/api/interns', { method:'POST', body: JSON.stringify(f) });
      setF({ firstName:'', lastName:'', email:'', role:'Intern', status:'Active' });
      load();
    } catch(e){ setErr(e.message); }
  }

  async function remove(id){
    try { await apiFetch(`/api/interns/${id}`, { method:'DELETE' }); load(); }
    catch(e){ setErr(e.message); }
  }

  async function update(id, patch){
    try { await apiFetch(`/api/interns/${id}`, { method:'PUT', body: JSON.stringify(patch) }); load(); }
    catch(e){ setErr(e.message); }
  }

  return (
    <Card title="Interns">
      {err && <div style={{color:'crimson'}}>{err}</div>}

      <form onSubmit={add} style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:8, marginBottom:12}}>
        <input placeholder="First name" value={f.firstName} onChange={e=>setF({...f, firstName:e.target.value})} required />
        <input placeholder="Last name"  value={f.lastName}  onChange={e=>setF({...f, lastName:e.target.value})} required />
        <input type="email" placeholder="Email" value={f.email} onChange={e=>setF({...f, email:e.target.value})} required />
        <input placeholder="Role" value={f.role} onChange={e=>setF({...f, role:e.target.value})} />
        <select value={f.status} onChange={e=>setF({...f, status:e.target.value})}>
          <option>Active</option><option>Paused</option><option>Completed</option>
        </select>
        <button type="submit">Add Intern</button>
      </form>

      <table width="100%" cellPadding="6" style={{borderCollapse:'collapse'}}>
        <thead><tr><th align="left">Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {list.map(x => (
            <tr key={x._id}>
              <td>{x.firstName} {x.lastName}</td>
              <td>{x.email}</td>
              <td>{x.role}</td>
              <td>
                <select value={x.status} onChange={e=>update(x._id, {status:e.target.value})}>
                  <option>Active</option><option>Paused</option><option>Completed</option>
                </select>
              </td>
              <td><button onClick={()=>remove(x._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

// ===== Tasks =====
function Tasks(){
  const [list, setList] = useState([]);
  const [interns, setInterns] = useState([]);
  const [f, setF] = useState({ title:'', description:'', internId:'', status:'To Do', dueDate:'' });
  const [err, setErr] = useState('');

  async function load(){
    try {
      const [tasks, is] = await Promise.all([
        apiFetch('/api/tasks'),
        apiFetch('/api/interns')
      ]);
      setList(tasks); setInterns(is);
    } catch(e){ setErr(e.message); }
  }
  useEffect(()=>{ load(); },[]);

  async function add(e){
    e.preventDefault(); setErr('');
    try {
      await apiFetch('/api/tasks', { method:'POST', body: JSON.stringify(f) });
      setF({ title:'', description:'', internId:'', status:'To Do', dueDate:'' });
      load();
    } catch(e){ setErr(e.message); }
  }

  async function remove(id){
    try { await apiFetch(`/api/tasks/${id}`, { method:'DELETE' }); load(); }
    catch(e){ setErr(e.message); }
  }

  async function update(id, patch){
    try { await apiFetch(`/api/tasks/${id}`, { method:'PUT', body: JSON.stringify(patch) }); load(); }
    catch(e){ setErr(e.message); }
  }

  return (
    <Card title="Tasks">
      {err && <div style={{color:'crimson'}}>{err}</div>}

      <form onSubmit={add} style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:8, marginBottom:12}}>
        <input placeholder="Title" value={f.title} onChange={e=>setF({...f, title:e.target.value})} required />
        <input placeholder="Description" value={f.description} onChange={e=>setF({...f, description:e.target.value})} />
        <select value={f.internId} onChange={e=>setF({...f, internId:e.target.value})} required>
          <option value="">Assign to intern…</option>
          {interns.map(i => <option key={i._id} value={i._id}>{i.firstName} {i.lastName}</option>)}
        </select>
        <select value={f.status} onChange={e=>setF({...f, status:e.target.value})}>
          <option>To Do</option><option>In Progress</option><option>Done</option>
        </select>
        <input type="date" value={f.dueDate} onChange={e=>setF({...f, dueDate:e.target.value})} />
        <button type="submit">Add Task</button>
      </form>

      <table width="100%" cellPadding="6" style={{borderCollapse:'collapse'}}>
        <thead><tr><th align="left">Title</th><th>Assignee</th><th>Status</th><th>Due</th><th></th></tr></thead>
        <tbody>
          {list.map(x => (
            <tr key={x._id}>
              <td>{x.title}</td>
              <td>{(interns.find(i=>i._id===x.internId)||{}).firstName || '-'}</td>
              <td>{x.status}</td>
              <td>{x.dueDate ? new Date(x.dueDate).toLocaleDateString() : '-'}</td>
              <td><button onClick={()=>remove(x._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

// ===== Timesheets =====
function Timesheets(){
  const [rows, setRows] = useState([]);
  const [interns, setInterns] = useState([]);
  const [f, setF] = useState({ internId:'', date:'', hours:'', notes:'' });
  const [err, setErr] = useState('');

  async function load(){
    try {
      const [ts, is] = await Promise.all([
        apiFetch('/api/timesheets'),
        apiFetch('/api/interns')
      ]);
      setRows(ts); setInterns(is);
    } catch(e){ setErr(e.message); }
  }
  useEffect(()=>{ load(); },[]);

  async function add(e){
    e.preventDefault(); setErr('');
    try {
      await apiFetch('/api/timesheets', { method:'POST', body: JSON.stringify({ ...f, hours: Number(f.hours) }) });
      setF({ internId:'', date:'', hours:'', notes:'' });
      load();
    } catch(e){ setErr(e.message); }
  }

  async function remove(id){
    try { await apiFetch(`/api/timesheets/${id}`, { method:'DELETE' }); load(); }
    catch(e){ setErr(e.message); }
  }

  async function update(id, patch){
    try { await apiFetch(`/api/timesheets/${id}`, { method:'PUT', body: JSON.stringify(patch) }); load(); }
    catch(e){ setErr(e.message); }
  }

  return (
    <Card title="Timesheets">
      {err && <div style={{color:'crimson'}}>{err}</div>}

      <form onSubmit={add} style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:8, marginBottom:12}}>
        <select value={f.internId} onChange={e=>setF({...f, internId:e.target.value})} required>
          <option value="">Select intern…</option>
          {interns.map(i => <option key={i._id} value={i._id}>{i.firstName} {i.lastName}</option>)}
        </select>
        <input type="date" value={f.date} onChange={e=>setF({...f, date:e.target.value})} required />
        <input type="number" step="0.25" min="0" max="24" placeholder="Hours" value={f.hours} onChange={e=>setF({...f, hours:e.target.value})} required />
        <input placeholder="Notes" value={f.notes} onChange={e=>setF({...f, notes:e.target.value})} />
        <button type="submit">Save Timesheet</button>
      </form>

      <table width="100%" cellPadding="6" style={{borderCollapse:'collapse'}}>
        <thead><tr><th align="left">Intern</th><th>Date</th><th>Hours</th><th>Notes</th><th></th></tr></thead>
        <tbody>
          {rows.map(x => (
            <tr key={x._id}>
              <td>{(interns.find(i=>i._id===x.internId)||{}).firstName || '-'}</td>
              <td>{new Date(x.date).toLocaleDateString()}</td>
              <td>{x.hours}</td>
              <td>{x.notes || '-'}</td>
              <td><button onClick={()=>remove(x._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
