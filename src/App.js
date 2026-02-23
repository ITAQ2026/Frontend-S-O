import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar'; // Quitamos el /components/
import Dashboard from './Dashboard'; // Quitamos el /components/
import Proveedores from './Proveedores'; // Quitamos el /pages/
import OrdenesCompra from './OrdenesCompra'; // Quitamos el /pages/
import OrdenesPago from './OrdenesPago'; // Quitamos el /pages/
import OrdenEspecial from './OrdenEspecial';

function App() {
  return (
    <Router>
      <div style={styles.app}>
        <Navbar />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/compras" element={<OrdenesCompra />} />
            <Route path="/pagos" element={<OrdenesPago />} />
            <Route path="/orden-especial" element={<OrdenEspecial />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const styles = {
  app: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  main: { padding: '20px' }
};

export default App;