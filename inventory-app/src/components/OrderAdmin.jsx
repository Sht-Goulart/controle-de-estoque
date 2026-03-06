import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { ClipboardList, CheckCircle, Clock, CreditCard } from 'lucide-react';

const OrderAdmin = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar status: ", error);
      alert("Erro ao atualizar status.");
    }
  };

  return (
    <div className="order-admin-container">
      <div className="card">
        <h3>Painel do Estoquista - Gerenciamento de Pedidos</h3>
        <p>Acompanhe e atualize o status das entregas e pagamentos.</p>

        {orders.length === 0 ? <p>Nenhum pedido encontrado.</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            {orders.map(order => (
              <div key={order.id} className="card" style={{ border: '1px solid #444', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>ID: #{order.id.substring(0, 8)}</strong>
                  <span className={`badge ${
                    order.status === 'Entregue' ? 'badge-success' :
                    order.status === 'Pagamento pendente' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.9rem', color: '#aaa' }}>
                    <strong>Criado em:</strong> {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#aaa' }}>
                    <strong>Data de Pagamento:</strong> {order.paymentDate || 'Não informada'}
                  </div>
                </div>

                <div style={{ backgroundColor: '#2a2a2a', padding: '10px', borderRadius: '4px', marginBottom: '1rem' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>Itens do Pedido:</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                  </ul>
                  <div style={{ textAlign: 'right', marginTop: '10px', fontWeight: 'bold', color: '#646cff' }}>
                    Total: R$ {order.total.toFixed(2)}
                  </div>
                </div>

                <div className="form-group">
                  <label>Mudar Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    style={{ marginTop: '5px' }}
                  >
                    <option value="Entrega pendente">Entrega pendente</option>
                    <option value="Entregue">Entregue</option>
                    <option value="Pagamento pendente">Pagamento pendente</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderAdmin;
