import React, { useState, useEffect } from 'react'
import { getStock, updateStockQuantity, getLowStockItems, saveStock } from '../services/stockService'
import './StockManagement.css'

function StockManagement({ menuItems }) {
  const [stock, setStock] = useState({})
  const [loading, setLoading] = useState(true)
  const [lowStockAlerts, setLowStockAlerts] = useState([])
  const [saveMessage, setSaveMessage] = useState({ show: false, text: '', type: '' })

  useEffect(() => {
    loadStock()
  }, [])

  const loadStock = () => {
    const currentStock = getStock()
    setStock(currentStock)
    const alerts = getLowStockItems()
    setLowStockAlerts(alerts)
    setLoading(false)
  }

  const showSaveMessage = (message, type = 'success') => {
    setSaveMessage({ show: true, text: message, type })
    setTimeout(() => {
      setSaveMessage({ show: false, text: '', type: '' })
    }, 3000)
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedStock = updateStockQuantity(itemId, parseInt(newQuantity) || 0)
    setStock(updatedStock)
    const alerts = getLowStockItems()
    setLowStockAlerts(alerts)
    showSaveMessage('✅ Stock mis à jour automatiquement !', 'success')
  }

  const handleThresholdChange = (itemId, newThreshold) => {
    const updatedStock = { ...stock }
    if (updatedStock[itemId]) {
      updatedStock[itemId].lowThreshold = parseInt(newThreshold) || 0
      saveStock(updatedStock)
      setStock(updatedStock)
      const alerts = getLowStockItems()
      setLowStockAlerts(alerts)
      showSaveMessage('✅ Seuil d\'alerte mis à jour automatiquement !', 'success')
    }
  }

  const handleManualSave = () => {
    saveStock(stock)
    showSaveMessage('✅ Tous les stocks ont été sauvegardés !', 'success')
  }

  if (loading) {
    return (
      <div className="stock-management">
        <div className="stock-loading">
          <p>Chargement des stocks...</p>
        </div>
      </div>
    )
  }

  // Créer un map pour accès rapide aux noms
  const menuMap = {}
  if (menuItems) {
    menuItems.forEach(item => {
      menuMap[item.id] = item.name
    })
  }

  return (
    <div className="stock-management">
      <div className="stock-header">
        <h2>📦 Gestion des Stocks</h2>
        <div className="stock-header-right">
          {lowStockAlerts.length > 0 && (
            <div className="stock-alert-banner">
              ⚠️ <strong>{lowStockAlerts.length}</strong> article(s) avec stock faible !
            </div>
          )}
          <button
            className="save-stock-button"
            onClick={handleManualSave}
            title="Sauvegarder manuellement (les changements sont déjà sauvegardés automatiquement)"
          >
            💾 Sauvegarder
          </button>
        </div>
      </div>

      {/* Message de confirmation */}
      {saveMessage.show && (
        <div className={`save-message ${saveMessage.type}`}>
          {saveMessage.text}
        </div>
      )}

      {lowStockAlerts.length > 0 && (
        <div className="low-stock-section">
          <h3>🚨 Alertes - Stock Faible</h3>
          <div className="low-stock-grid">
            {lowStockAlerts.map(item => (
              <div key={item.id} className="low-stock-card">
                <div className="low-stock-name">{item.name || menuMap[item.id] || `Article #${item.id}`}</div>
                <div className="low-stock-info">
                  <span className="low-stock-quantity">{item.quantity}</span>
                  <span className="low-stock-separator">/</span>
                  <span className="low-stock-threshold">{item.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stock-table-section">
        <h3>Articles en Stock</h3>
        <table className="stock-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Quantité Disponible</th>
              <th>Seuil d'Alerte</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(stock).map(itemId => {
              const item = stock[itemId]
              const isLow = item.quantity <= item.lowThreshold
              const itemName = item.name || menuMap[parseInt(itemId)] || `Article #${itemId}`

              return (
                <tr key={itemId} className={isLow ? 'low-stock-row' : ''}>
                  <td className="item-name">{itemName}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(itemId, e.target.value)}
                      className="quantity-input"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={item.lowThreshold}
                      onChange={(e) => handleThresholdChange(itemId, e.target.value)}
                      className="threshold-input"
                    />
                  </td>
                  <td>
                    <span className={`stock-status ${isLow ? 'low' : 'ok'}`}>
                      {isLow ? '⚠️ Faible' : '✅ OK'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="stock-action-btn"
                      onClick={() => handleQuantityChange(itemId, item.quantity + 10)}
                      title="Ajouter 10"
                    >
                      +10
                    </button>
                    <button
                      className="stock-action-btn"
                      onClick={() => handleQuantityChange(itemId, Math.max(0, item.quantity - 10))}
                      title="Retirer 10"
                    >
                      -10
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StockManagement

