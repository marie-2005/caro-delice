import React, { useState, useEffect } from 'react'
import { getAllOrders } from '../services/firebaseService'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import StockManagement from './StockManagement'
import './Dashboard.css'

function Dashboard({ menuItems }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('saturday') // 'saturday', 'week', 'month'
  const [showStock, setShowStock] = useState(false)

  useEffect(() => {
    const unsubscribe = getAllOrders((ordersList) => {
      setOrders(ordersList)
      setLoading(false)
    })

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe()
        } catch (error) {
          console.warn('Erreur nettoyage dashboard:', error)
        }
      }
    }
  }, [])

  // Filtrer les commandes selon la période
  const getFilteredOrders = () => {
    const now = new Date()
    let startDate
    let endDate = null

    switch (period) {
      case 'saturday':
        // Trouver le samedi le plus récent
        const dayOfWeek = now.getDay()
        const daysToSaturday = dayOfWeek === 6 ? 0 : (6 - dayOfWeek)
        startDate = new Date(now)
        startDate.setDate(now.getDate() - daysToSaturday)
        startDate.setHours(0, 0, 0, 0)
        // Jusqu'à la fin du samedi (23:59:59)
        endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)
        break
      case 'week':
        // Semaine actuelle (du samedi au samedi)
        const currentDayOfWeek = now.getDay()
        const daysToCurrentSaturday = currentDayOfWeek === 6 ? 0 : (6 - currentDayOfWeek)
        startDate = new Date(now)
        startDate.setDate(now.getDate() - daysToCurrentSaturday)
        startDate.setHours(0, 0, 0, 0)
        // Samedi précédent
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        startDate = new Date(0)
    }

    return orders.filter(order => {
      const orderDate = new Date(order.createdAt || order.date)
      const afterStart = orderDate >= startDate
      const beforeEnd = endDate ? orderDate <= endDate : true
      return afterStart && beforeEnd && order.status !== 'annulée'
    })
  }

  // Calculer le chiffre d'affaires
  const getRevenue = () => {
    const filtered = getFilteredOrders()
    return filtered.reduce((sum, order) => sum + (order.total || 0), 0)
  }

  // Commandes par statut
  const getOrdersByStatus = () => {
    const filtered = getFilteredOrders()
    const statusCount = {
      'en attente': 0,
      'en préparation': 0,
      'prête': 0,
      'livrée': 0,
      'annulée': 0
    }

    filtered.forEach(order => {
      if (statusCount.hasOwnProperty(order.status)) {
        statusCount[order.status]++
      }
    })

    return statusCount
  }

  // Articles les plus commandés
  const getPopularItems = () => {
    const filtered = getFilteredOrders()
    const itemCounts = {}

    filtered.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const itemId = item.id || item.name
          if (!itemCounts[itemId]) {
            itemCounts[itemId] = {
              name: item.name,
              quantity: 0,
              revenue: 0
            }
          }
          itemCounts[itemId].quantity += item.quantity || 1
          itemCounts[itemId].revenue += (item.price || 0) * (item.quantity || 1)
        })
      }
    })

    return Object.values(itemCounts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
  }

  // Graphique de ventes par heure
  const getSalesByHour = () => {
    const filtered = getFilteredOrders()
    const hourCounts = Array.from({ length: 24 }, (_, i) => ({ hour: i, orders: 0, revenue: 0 }))

    filtered.forEach(order => {
      const orderDate = new Date(order.createdAt || order.date)
      const hour = orderDate.getHours()
      hourCounts[hour].orders++
      hourCounts[hour].revenue += order.total || 0
    })

    return hourCounts.map(h => ({
      hour: `${h.hour}h`,
      commandes: h.orders,
      revenue: h.revenue
    }))
  }

  // Clients les plus fidèles
  const getTopCustomers = () => {
    const filtered = getFilteredOrders()
    const customerData = {}

    filtered.forEach(order => {
      const customerId = order.customerPhone || order.customerId || 'anonyme'
      if (!customerData[customerId]) {
        customerData[customerId] = {
          name: order.customerName || 'Client anonyme',
          phone: order.customerPhone || '',
          orders: 0,
          revenue: 0
        }
      }
      customerData[customerId].orders++
      customerData[customerId].revenue += order.total || 0
    })

    return Object.values(customerData)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)
  }

  // Ventes par jour de la semaine
  const getSalesByDay = () => {
    const filtered = getFilteredOrders()
    const dayCounts = {
      'Lun': 0,
      'Mar': 0,
      'Mer': 0,
      'Jeu': 0,
      'Ven': 0,
      'Sam': 0,
      'Dim': 0
    }

    filtered.forEach(order => {
      const orderDate = new Date(order.createdAt || order.date)
      const dayIndex = orderDate.getDay()
      const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
      const dayName = dayNames[dayIndex]
      if (dayCounts.hasOwnProperty(dayName)) {
        dayCounts[dayName] += order.total || 0
      }
    })

    return Object.keys(dayCounts).map(day => ({
      jour: day,
      revenue: dayCounts[day]
    }))
  }

  const filteredOrders = getFilteredOrders()
  const revenue = getRevenue()
  const statusCounts = getOrdersByStatus()
  const popularItems = getPopularItems()
  const salesByHour = getSalesByHour()
  const topCustomers = getTopCustomers()
  const salesByDay = getSalesByDay()

  const COLORS = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Tableau de Bord</h2>
        <div className="dashboard-actions">
          <button
            className="stock-toggle-btn"
            onClick={() => setShowStock(!showStock)}
          >
            {showStock ? '📊 Statistiques' : '📦 Gestion des Stocks'}
          </button>
          <div className="period-selector">
            <button
            className={period === 'saturday' ? 'active' : ''}
            onClick={() => setPeriod('saturday')}
          >
            Ce Samedi
          </button>
          <button
            className={period === 'week' ? 'active' : ''}
            onClick={() => setPeriod('week')}
          >
            Cette Semaine
          </button>
          <button
            className={period === 'month' ? 'active' : ''}
            onClick={() => setPeriod('month')}
          >
            Ce Mois
          </button>
        </div>
        </div>
      </div>

      {showStock ? (
        <StockManagement menuItems={menuItems || []} />
      ) : (
        <>

      {/* Métriques principales */}
      <div className="dashboard-metrics">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-label">Chiffre d'Affaires</div>
            <div className="metric-value">{revenue.toLocaleString()} FCFA</div>
            <div className="metric-subtitle">{filteredOrders.length} commande(s)</div>
          </div>
        </div>

        <div className="metric-card orders">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <div className="metric-label">Total Commandes</div>
            <div className="metric-value">{filteredOrders.length}</div>
            <div className="metric-subtitle">Période sélectionnée</div>
          </div>
        </div>

        <div className="metric-card pending">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <div className="metric-label">En Attente</div>
            <div className="metric-value">{statusCounts['en attente']}</div>
            <div className="metric-subtitle">À traiter</div>
          </div>
        </div>
      </div>

      {/* Commandes par statut */}
      <div className="dashboard-section">
        <h3>📋 Commandes par Statut</h3>
        <div className="status-grid">
          <div className="status-card attente">
            <div className="status-count">{statusCounts['en attente']}</div>
            <div className="status-label">En Attente</div>
          </div>
          <div className="status-card preparation">
            <div className="status-count">{statusCounts['en préparation']}</div>
            <div className="status-label">En Préparation</div>
          </div>
          <div className="status-card prete">
            <div className="status-count">{statusCounts['prête']}</div>
            <div className="status-label">Prête</div>
          </div>
          <div className="status-card livree">
            <div className="status-count">{statusCounts['livrée']}</div>
            <div className="status-label">Livrée</div>
          </div>
        </div>
      </div>

      {/* Articles populaires */}
      <div className="dashboard-section">
        <h3>🔥 Articles les Plus Commandés</h3>
        <div className="popular-items">
          {popularItems.length > 0 ? (
            <table className="popular-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Quantité</th>
                  <th>Chiffre d'Affaires</th>
                </tr>
              </thead>
              <tbody>
                {popularItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <span className="rank">#{index + 1}</span>
                      {item.name}
                    </td>
                    <td className="quantity">{item.quantity}</td>
                    <td className="revenue">{item.revenue.toLocaleString()} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-state">Aucune commande dans cette période</p>
          )}
        </div>
      </div>

      {/* Statistiques avancées */}
      <div className="dashboard-section">
        <h3>📈 Graphiques de Ventes</h3>
        <div className="charts-grid">
          <div className="chart-container">
            <h4>Ventes par Heure</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesByHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="commandes" fill="#ec4899" name="Commandes" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h4>Revenus par Jour</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="jour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenus (FCFA)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Clients fidèles */}
      <div className="dashboard-section">
        <h3>👥 Clients les Plus Fidèles</h3>
        <div className="top-customers">
          {topCustomers.length > 0 ? (
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Téléphone</th>
                  <th>Commandes</th>
                  <th>Total Dépensé</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr key={index}>
                    <td>
                      <span className="rank">#{index + 1}</span>
                      {customer.name}
                    </td>
                    <td>{customer.phone || 'N/A'}</td>
                    <td className="orders-count">{customer.orders}</td>
                    <td className="revenue">{customer.revenue.toLocaleString()} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-state">Aucun client dans cette période</p>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  )
}

export default Dashboard

