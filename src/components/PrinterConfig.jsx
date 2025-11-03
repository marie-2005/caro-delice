import React, { useState, useEffect } from 'react'
import { getPrinterConfig, savePrinterConfig } from '../services/printService'
import './PrinterConfig.css'

function PrinterConfig({ onClose }) {
  const [config, setConfig] = useState({
    autoPrint: true,
    autoPrintCaisse: true,
    autoPrintCuisine: true,
    autoPrintLivraison: true,
    printerNames: {
      caisse: 'Imprimante Caisse',
      cuisine: 'Imprimante Cuisine',
      livraison: 'Imprimante Livraison'
    }
  })

  useEffect(() => {
    const savedConfig = getPrinterConfig()
    if (savedConfig) {
      setConfig(savedConfig)
    }
  }, [])

  const handleChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handlePrinterNameChange = (type, value) => {
    setConfig(prev => ({
      ...prev,
      printerNames: {
        ...prev.printerNames,
        [type]: value
      }
    }))
  }

  const handleSave = () => {
    if (savePrinterConfig(config)) {
      alert('Configuration sauvegardée avec succès !')
      if (onClose) onClose()
    } else {
      alert('Erreur lors de la sauvegarde')
    }
  }

  return (
    <div className="printer-config-overlay" onClick={onClose}>
      <div className="printer-config-modal" onClick={(e) => e.stopPropagation()}>
        <div className="printer-config-header">
          <h2>🖨️ Configuration des Imprimantes</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="printer-config-content">
          <div className="config-section">
            <h3>Impression Automatique</h3>
            <div className="config-item">
              <label>
                <input
                  type="checkbox"
                  checked={config.autoPrint}
                  onChange={(e) => handleChange('autoPrint', e.target.checked)}
                />
                <span>Activer l'impression automatique</span>
              </label>
              <small>Quand activé, les tickets s'impriment automatiquement</small>
            </div>
          </div>

          <div className="config-section">
            <h3>Types de Tickets</h3>
            
            <div className="config-item">
              <label>
                <input
                  type="checkbox"
                  checked={config.autoPrintCaisse}
                  onChange={(e) => handleChange('autoPrintCaisse', e.target.checked)}
                  disabled={!config.autoPrint}
                />
                <span>Ticket Caisse</span>
              </label>
              <small>Impression automatique à la création de commande</small>
              {config.autoPrint && (
                <input
                  type="text"
                  className="printer-name-input"
                  value={config.printerNames.caisse}
                  onChange={(e) => handlePrinterNameChange('caisse', e.target.value)}
                  placeholder="Nom de l'imprimante"
                />
              )}
            </div>

            <div className="config-item">
              <label>
                <input
                  type="checkbox"
                  checked={config.autoPrintCuisine}
                  onChange={(e) => handleChange('autoPrintCuisine', e.target.checked)}
                  disabled={!config.autoPrint}
                />
                <span>Ticket Cuisine</span>
              </label>
              <small>Impression automatique pour la préparation</small>
              {config.autoPrint && (
                <input
                  type="text"
                  className="printer-name-input"
                  value={config.printerNames.cuisine}
                  onChange={(e) => handlePrinterNameChange('cuisine', e.target.value)}
                  placeholder="Nom de l'imprimante"
                />
              )}
            </div>

            <div className="config-item">
              <label>
                <input
                  type="checkbox"
                  checked={config.autoPrintLivraison}
                  onChange={(e) => handleChange('autoPrintLivraison', e.target.checked)}
                  disabled={!config.autoPrint}
                />
                <span>Ticket Livraison</span>
              </label>
              <small>Impression automatique quand statut = "Prête"</small>
              {config.autoPrint && (
                <input
                  type="text"
                  className="printer-name-input"
                  value={config.printerNames.livraison}
                  onChange={(e) => handlePrinterNameChange('livraison', e.target.value)}
                  placeholder="Nom de l'imprimante"
                />
              )}
            </div>
          </div>

          <div className="config-info">
            <h4>ℹ️ Informations</h4>
            <ul>
              <li>Les tickets sont formatés pour imprimantes thermiques 80mm</li>
              <li>L'impression utilise la fenêtre d'impression du navigateur</li>
              <li>Assurez-vous que votre imprimante est configurée comme imprimante par défaut</li>
              <li>Pour les imprimantes USB/Bluetooth, sélectionnez l'imprimante dans le dialogue d'impression</li>
            </ul>
          </div>
        </div>

        <div className="printer-config-footer">
          <button className="save-button" onClick={handleSave}>
            💾 Sauvegarder
          </button>
          <button className="cancel-button" onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrinterConfig

