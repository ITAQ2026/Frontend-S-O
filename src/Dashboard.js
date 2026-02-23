import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingCart, CreditCard, FileSpreadsheet } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const modules = [
    { title: 'Proveedores', icon: <Users size={40} />, path: '/proveedores', color: '#3b82f6', desc: 'Gestionar base de datos de proveedores' },
    { title: 'Órdenes de Compra', icon: <ShoppingCart size={40} />, path: '/compras', color: '#10b981', desc: 'Generar pedidos y PDFs de compra' },
    { title: 'Órdenes de Pago', icon: <CreditCard size={40} />, path: '/pagos', color: '#f59e0b', desc: 'Registrar salidas de dinero y recibos' },
    { 
    title: 'Orden de Compra Proveedores', 
     icon: <FileSpreadsheet size={40} />, 
     path: '/orden-especial', 
    color: '#27ae60', 
    desc: 'Formato de compra para grandes proveedores' 
    }
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Bienvenido al Sistema de Gestión</h1>
        <p>Seleccione un módulo para comenzar a trabajar</p>
      </header>
      
      <div style={styles.grid}>
        {modules.map((m, i) => (
          <div key={i} style={styles.card} onClick={() => navigate(m.path)}>
            <div style={{ ...styles.iconWrapper, backgroundColor: m.color }}>
              {m.icon}
            </div>
            <h3 style={styles.cardTitle}>{m.title}</h3>
            <p style={styles.cardDesc}>{m.desc}</p>
            <button style={{ ...styles.btn, color: m.color }}>Ingresar →</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '40px auto', padding: '0 20px' },
  header: { textAlign: 'center', marginBottom: '50px', color: '#1e293b' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' },
  card: { 
    background: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex', flexDirection: 'column', alignItems: 'center'
  },
  iconWrapper: { padding: '20px', borderRadius: '15px', color: 'white', marginBottom: '20px' },
  cardTitle: { fontSize: '20px', marginBottom: '10px', color: '#334155' },
  cardDesc: { color: '#64748b', fontSize: '14px', marginBottom: '20px' },
  btn: { background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }
};

export default Dashboard;