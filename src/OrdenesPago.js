import React, { useState, useEffect } from 'react';
import api from './api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrdenesPago = () => {
  const [proveedores, setProveedores] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [pago, setPago] = useState({
    proveedorNombre: '',
    productoServicio: '', // Nuevo campo
    cantidad: 1,
    precioUnitario: '',
    caja: '',
    metodoPago: 'Transferencia',
    referencia: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resProv, resPagos] = await Promise.all([
        api.get('/proveedores'),
        api.get('/ordenes-pago')
      ]);
      setProveedores(resProv.data);
      setHistorial(resPagos.data);
    } catch (err) { console.error(err); }
  };

  const generarPDF = (p) => {
    const doc = new jsPDF();
    const idFormateado = String(p.id).padStart(4, '0');
    const totalCalculado = p.cantidad * p.precioUnitario;
    
    // --- ENCABEZADO AZUL ---
    doc.setFillColor(41, 128, 185); 
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("ORDEN DE PAGO", 14, 25);
    doc.setFontSize(10);
    doc.text("ADMINISTRACIÓN Y GESTIÓN DE PROYECTOS", 196, 25, { align: "right" });
    
    // Datos principales
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Comprobante Nro: ${idFormateado}`, 14, 50);
    doc.text(`Fecha: ${new Date(p.fecha).toLocaleDateString()}`, 14, 56);
    doc.text(`Caja: ${p.caja || "General"}`, 14, 62);
    
    // --- TABLA DETALLADA ---
    autoTable(doc, {
      startY: 70,
      head: [["Producto / Servicio", "Proveedor", "Cant.", "P. Unit", "Total"]],
      body: [
        [
          p.productoServicio || "S/D",
          p.proveedorNombre, 
          p.cantidad, 
          `$${Number(p.precioUnitario).toLocaleString()}`, 
          `$${Number(totalCalculado).toLocaleString()}`
        ]
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });

    // --- DETALLES DE PAGO ---
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Método de Pago", "Referencia"]],
      body: [
        [p.metodoPago, p.referencia || "-"]
      ],
      theme: 'striped'
    });

    // --- SECCIÓN DE FIRMA Y DATOS AL PIE ---
    const finalY = doc.lastAutoTable.finalY + 45;
    doc.line(14, finalY, 80, finalY); // Línea
    doc.setFontSize(10);
    doc.text("FIRMA", 14, finalY + 5);
    doc.text("ACLARACIÓN:", 14, finalY + 13);
    doc.text("DNI:", 14, finalY + 21);

    doc.save(`Pago_${idFormateado}_${p.proveedorNombre}.pdf`);
  };

  const enviar = async (e) => {
    e.preventDefault();
    try {
      const montoTotal = Number(pago.cantidad) * Number(pago.precioUnitario);
      await api.post('/ordenes-pago', { ...pago, monto: montoTotal });
      
      alert("✅ Orden de Pago registrada");
      setPago({ 
        proveedorNombre: '', productoServicio: '', cantidad: 1, 
        precioUnitario: '', caja: '', metodoPago: 'Transferencia', referencia: '' 
      });
      cargarDatos();
    } catch (err) { alert("Error al registrar"); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>💸 Nueva Orden de Pago</h2>
        <form onSubmit={enviar}>
          
          <div style={styles.gridRow}>
            <div style={{gridColumn: 'span 2'}}>
               <label style={styles.label}>Producto / Servicio</label>
               <input 
                 style={styles.input} 
                 placeholder="Ej: Servicio de Limpieza / Compra de Insumos" 
                 value={pago.productoServicio} 
                 onChange={e => setPago({...pago, productoServicio: e.target.value})} 
                 required 
               />
            </div>
          </div>

          <div style={styles.gridRow}>
            <div>
              <label style={styles.label}>Proveedor</label>
              <select style={styles.input} required value={pago.proveedorNombre} onChange={e => setPago({...pago, proveedorNombre: e.target.value})}>
                <option value="">Seleccionar...</option>
                {proveedores.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Caja</label>
              <input style={styles.input} placeholder="Caja de origen" value={pago.caja} onChange={e => setPago({...pago, caja: e.target.value})} />
            </div>
          </div>

          <div style={styles.gridRow}>
            <div>
              <label style={styles.label}>Cantidad</label>
              <input style={styles.input} type="number" value={pago.cantidad} onChange={e => setPago({...pago, cantidad: e.target.value})} />
            </div>
            <div>
              <label style={styles.label}>Precio Unitario</label>
              <input style={styles.input} type="number" placeholder="$ 0.00" value={pago.precioUnitario} onChange={e => setPago({...pago, precioUnitario: e.target.value})} required />
            </div>
          </div>

          <div style={styles.gridRow}>
            <div>
              <label style={styles.label}>Método</label>
              <select style={styles.input} value={pago.metodoPago} onChange={e => setPago({...pago, metodoPago: e.target.value})}>
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Cheque">Cheque</option>
                <option value="Cuenta Corriente">Cuenta Corriente</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Referencia</label>
              <input style={styles.input} placeholder="Nro de comprobante" value={pago.referencia} onChange={e => setPago({...pago, referencia: e.target.value})} />
            </div>
          </div>

          <div style={styles.totalBox}>
            Total a Liquidar: <strong>${(pago.cantidad * (pago.precioUnitario || 0)).toLocaleString()}</strong>
          </div>
          
          <button type="submit" style={styles.btnSubmit}>REGISTRAR Y GENERAR COMPROBANTE</button>
        </form>
      </div>

      {/* Tabla de Historial con IDs 0000 */}
      <div style={styles.card}>
        <h3 style={styles.header}>📋 Últimos Pagos</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nro</th>
              <th style={styles.th}>Producto/Servicio</th>
              <th style={styles.th}>Monto</th>
              <th style={styles.th}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {historial.map(p => (
              <tr key={p.id}>
                <td style={styles.td}>#{String(p.id).padStart(4, '0')}</td>
                <td style={styles.td}>{p.productoServicio}</td>
                <td style={styles.td}>${Number(p.monto).toLocaleString()}</td>
                <td style={styles.td}>
                  <button onClick={() => generarPDF(p)} style={styles.btnPdf}>PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Arial' },
  card: { background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', maxWidth: '850px', margin: '0 auto 20px' },
  header: { borderBottom: '2px solid #edf2f7', paddingBottom: '10px', color: '#2c3e50', marginBottom: '20px' },
  gridRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' },
  label: { display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#7f8c8d', marginBottom: '5px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' },
  totalBox: { background: '#f0fff4', padding: '15px', borderRadius: '10px', textAlign: 'right', fontSize: '18px', color: '#2f855a', marginBottom: '15px', border: '1px solid #c6f6d5' },
  btnSubmit: { width: '100%', padding: '14px', background: '#2980b9', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  btnPdf: { background: '#edf2f7', color: '#2980b9', border: '1px solid #2980b9', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #edf2f7', color: '#7f8c8d', fontSize: '12px' },
  td: { padding: '12px', borderBottom: '1px solid #edf2f7', fontSize: '14px' }
};

export default OrdenesPago;