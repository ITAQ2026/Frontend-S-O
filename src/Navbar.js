import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav style={styles.nav}>
    <Link to="/" style={styles.logo}>🛡️ ERP Sistema</Link>
    <div style={styles.links}>
      <Link to="/proveedores" style={styles.link}>Proveedores</Link>
      <Link to="/compras" style={styles.link}>Compras</Link>
      <Link to="/pagos" style={styles.link}>Pagos</Link>
    </div>
  </nav>
);

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', padding: '15px 50px', background: '#1e293b', alignItems: 'center' },
  logo: { color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' },
  link: { color: '#cbd5e1', textDecoration: 'none', marginLeft: '20px', fontSize: '14px' }
};

export default Navbar;