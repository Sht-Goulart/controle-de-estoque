import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, runTransaction, doc, addDoc, query, orderBy } from 'firebase/firestore';
import { ShoppingCart, Plus, Trash2 } from 'lucide-react';

const Orders = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentDate, setPaymentDate] = useState('');

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
        console.error("Erro ao carregar produtos: ", error);
        if (error.code === 'not-found') {
            alert('Banco de dados Firestore não inicializado no Firebase.');
        }
    });

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubOrders = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
        console.error("Erro ao carregar pedidos: ", error);
    });

    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, []);

  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock <= 0) {
        alert('Produto sem estoque!');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      if (existingItem.quantity + 1 > product.stock) {
        alert('Quantidade excede o estoque disponível!');
        return;
      }
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    if (!paymentDate) {
      alert('Por favor, selecione uma data de pagamento.');
      return;
    }
    setLoading(true);

    try {
      await runTransaction(db, async (transaction) => {
        const productRefs = cart.map(item => doc(db, 'products', item.id));
        const productSnapshots = await Promise.all(productRefs.map(ref => transaction.get(ref)));

        // Check availability for all items first
        cart.forEach((item, index) => {
          const snapshot = productSnapshots[index];
          if (!snapshot.exists()) throw new Error(`Produto ${item.name} não existe!`);
          const currentStock = snapshot.data().stock;
          if (currentStock < item.quantity) {
            throw new Error(`Estoque insuficiente para ${item.name}!`);
          }
        });

        // Update stocks
        cart.forEach((item, index) => {
          const snapshot = productSnapshots[index];
          const newStock = snapshot.data().stock - item.quantity;
          transaction.update(productRefs[index], { stock: newStock });
        });

        // Create order document
        const orderData = {
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          total: calculateTotal(),
          createdAt: new Date(),
          paymentDate: paymentDate,
          status: 'Entrega pendente'
        };

        const ordersRef = collection(db, 'orders');
        transaction.set(doc(ordersRef), orderData);
      });

      setCart([]);
      setPaymentDate('');
      alert('Pedido realizado com sucesso!');
    } catch (error) {
      console.error("Erro ao realizar pedido: ", error);
      if (error.message.includes('database (default) does not exist')) {
        alert("Erro: O banco de dados Firestore não foi inicializado no seu projeto Firebase. Consulte o README para instruções de configuração.");
      } else {
        alert("Erro ao realizar pedido: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div className="create-order">
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3>Novo Pedido</h3>
          <div className="form-group">
            <label>Selecionar Produto</label>
            <select onChange={(e) => e.target.value && addToCart(e.target.value)} defaultValue="">
              <option value="" disabled>Escolha um produto...</option>
              {products.map(product => (
                <option key={product.id} value={product.id} disabled={product.stock <= 0}>
                  {product.name} - R$ {product.price.toFixed(2)} ({product.stock} em estoque)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Data de Pagamento</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          <div className="cart">
            <h4>Carrinho</h4>
            {cart.length === 0 ? <p>Carrinho vazio</p> : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qtd</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>R$ {(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button onClick={() => removeFromCart(item.id)} className="btn-danger" style={{ padding: '4px' }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan="2">Total</th>
                      <th colSpan="2">R$ {calculateTotal().toFixed(2)}</th>
                    </tr>
                  </tfoot>
                </table>
                <button
                  onClick={handlePlaceOrder}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '1rem' }}
                  disabled={loading}
                >
                  {loading ? 'Processando...' : 'Confirmar Pedido'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="order-history">
        <div className="card">
          <h3>Histórico de Pedidos (Visualização do Cliente)</h3>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {orders.length === 0 ? <p>Nenhum pedido realizado</p> : orders.map(order => (
              <div key={order.id} style={{ borderBottom: '1px solid #444', padding: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Pedido #{order.id.substring(0, 5)}</strong>
                  <span className={`badge ${
                    order.status === 'Entregue' ? 'badge-success' :
                    order.status === 'Pagamento pendente' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#888' }}>
                  Criado em: {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'Data desconhecida'}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#888' }}>
                  Pagamento: {order.paymentDate}
                </div>
                <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                  {order.items.map((item, idx) => (
                    <li key={idx}>{item.quantity}x {item.name}</li>
                  ))}
                </ul>
                <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  Total: R$ {order.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
