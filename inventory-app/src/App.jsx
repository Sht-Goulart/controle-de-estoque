import { useState } from 'react'
import Inventory from './components/Inventory'
import Orders from './components/Orders'
import { Package, ShoppingCart } from 'lucide-react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('inventory')

  return (
    <div className="container">
      <header>
        <h1>Gerenciador de Estoque</h1>
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
        </nav>
      </header>

      <main>
        {activeTab === 'inventory' ? <Inventory /> : <Orders />}
      </main>
    </div>
  )
}

export default App
