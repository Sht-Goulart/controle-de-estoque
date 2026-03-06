import { useState } from 'react'
import Inventory from './components/Inventory'
import Orders from './components/Orders'
import OrderAdmin from './components/OrderAdmin'
import { Package, ShoppingCart, LayoutDashboard, Database } from 'lucide-react'
import { db } from './firebase'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('inventory')

  return (
    <div className="container">
      <header>
        <div>
            <h1>Gerenciador de Estoque</h1>
            <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Database size={14} />
                Projeto: {db.app.options.projectId}
            </div>
        </div>
        <nav>
          <button
            className={activeTab === 'inventory' ? 'active' : ''}
            onClick={() => setActiveTab('inventory')}
          >
            <Package size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Estoque
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Pedidos
          </button>
          <button
            className={activeTab === 'admin' ? 'active' : ''}
            onClick={() => setActiveTab('admin')}
          >
            <LayoutDashboard size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Painel do Estoquista
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'orders' && <Orders />}
        {activeTab === 'admin' && <OrderAdmin />}
      </main>
    </div>
  )
}

export default App
