import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', price: '', stock: '', description: '' });
  const [editItem, setEditItem] = useState({ name: '', price: '', stock: '', description: '' });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    }, (error) => {
      console.error("Erro ao carregar produtos: ", error);
      if (error.code === 'permission-denied') {
        alert("Erro: Permissão negada ao ler produtos. Verifique as Regras de Segurança do Firestore.");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.stock) {
      alert("Por favor, preencha nome, preço e estoque inicial.");
      return;
    }

    try {
      await addDoc(collection(db, 'products'), {
        name: newItem.name,
        price: parseFloat(newItem.price),
        stock: parseInt(newItem.stock),
        description: newItem.description,
        createdAt: new Date()
      });
      setNewItem({ name: '', price: '', stock: '', description: '' });
      alert("Produto adicionado com sucesso!");
    } catch (error) {
      console.error("Error adding product: ", error);
      if (error.code === 'permission-denied') {
        alert("Erro: Você não tem permissão para adicionar produtos. Verifique as Regras de Segurança do Firestore no Console do Firebase.");
      } else if (error.message.includes('database (default) does not exist')) {
        alert("Erro: O banco de dados Firestore não foi inicializado. Consulte o README.");
      } else {
        alert("Erro ao adicionar produto: " + error.message);
      }
    }
  };

  const handleUpdateProduct = async (id) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        name: editItem.name,
        price: parseFloat(editItem.price),
        stock: parseInt(editItem.stock),
        description: editItem.description
      });
      setIsEditing(null);
      alert("Produto atualizado!");
    } catch (error) {
      console.error("Error updating product: ", error);
      alert("Erro ao atualizar produto: " + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (error) {
        console.error("Error deleting product: ", error);
        alert("Erro ao excluir produto: " + error.message);
      }
    }
  };

  const startEditing = (product) => {
    setIsEditing(product.id);
    setEditItem({ ...product });
  };

  return (
    <div className="inventory-container">
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Adicionar Novo Produto</h3>
        <form onSubmit={handleAddProduct}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="Nome do produto"
              />
            </div>
            <div className="form-group">
              <label>Preço</label>
              <input
                type="number"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                placeholder="0.00"
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Estoque Inicial</label>
              <input
                type="number"
                value={newItem.stock}
                onChange={(e) => setNewItem({...newItem, stock: e.target.value})}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <input
                type="text"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                placeholder="Breve descrição"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            <Plus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Adicionar Produto
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Lista de Produtos</h3>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Nenhum produto cadastrado.</td></tr>
            ) : products.map((product) => (
              <tr key={product.id}>
                {isEditing === product.id ? (
                  <>
                    <td><input type="text" value={editItem.name} onChange={(e) => setEditItem({...editItem, name: e.target.value})} /></td>
                    <td><input type="number" step="0.01" value={editItem.price} onChange={(e) => setEditItem({...editItem, price: e.target.value})} /></td>
                    <td><input type="number" value={editItem.stock} onChange={(e) => setEditItem({...editItem, stock: e.target.value})} /></td>
                    <td><input type="text" value={editItem.description} onChange={(e) => setEditItem({...editItem, description: e.target.value})} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => handleUpdateProduct(product.id)} style={{ padding: '5px', backgroundColor: '#2ecc71' }}><Check size={16} /></button>
                        <button onClick={() => setIsEditing(null)} style={{ padding: '5px', backgroundColor: '#95a5a6' }}><X size={16} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{product.name}</td>
                    <td>R$ {parseFloat(product.price).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${product.stock < 10 ? 'badge-warning' : 'badge-success'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>{product.description}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => startEditing(product)} style={{ padding: '5px' }}><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteProduct(product.id)} style={{ padding: '5px', backgroundColor: '#ff4646' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
