# Piano di Miglioramento Gateway Wizard UX

## 1. Ottimizzazione Layout e Navigazione

### 1.1 Barra di Navigazione Sticky
- Implementare una barra di navigazione fissa in alto
- Mantenere sempre visibili i pulsanti Previous/Next
- Aggiungere transizioni fluide tra gli step
```jsx
// Esempio struttura
<div className="wizard-container">
  <div className="wizard-nav-sticky">
    <WizardProgress />
  </div>
  <div className="wizard-content">
    {renderStep()}
  </div>
  <div className="wizard-actions-sticky">
    <button>Previous</button>
    <button>Next</button>
  </div>
</div>
```

### 1.2 CSS Necessario
```css
.wizard-nav-sticky {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  border-bottom: 1px solid #eee;
  padding: 1rem;
}

.wizard-actions-sticky {
  position: sticky;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

## 2. Selezione Metri Migliorata

### 2.1 Layout a Due Colonne
- Implementare una vista side-by-side per metri disponibili e selezionati
- Aggiungere drag-and-drop tra le colonne
```jsx
<div className="meters-container">
  <div className="meters-available">
    <SearchableTable 
      data={availableMeters}
      onSelect={handleMeterAdd}
    />
  </div>
  <div className="meters-selected">
    <SelectedMetersTable 
      data={selectedMeters}
      onRemove={handleMeterRemove}
    />
  </div>
</div>
```

### 2.2 Ricerca Avanzata
- Implementare una ricerca con filtri multipli
- Aggiungere autocompletamento
- Evidenziare i risultati della ricerca
```jsx
<SearchInput
  placeholder="Search meters..."
  filters={['name', 'type', 'model']}
  onSearch={handleSearch}
  suggestions={meterSuggestions}
/>
```

## 3. Feedback Visivo e Animazioni

### 3.1 Transizioni
- Aggiungere animazioni per:
  - Selezione/rimozione metri
  - Cambio step del wizard
  - Apparizione/scomparsa elementi
```css
.meter-item {
  transition: all 0.3s ease;
}

.meter-item.selected {
  transform: translateX(100%);
  opacity: 0;
}
```

### 3.2 Feedback Interattivo
- Tooltip per azioni disponibili
- Highlight su hover
- Indicatori di stato chiari
```jsx
<Tooltip content="Add meter">
  <button className="action-button">
    <Icon name="plus" />
  </button>
</Tooltip>
```

## 4. Implementazione

### 4.1 Fasi di Sviluppo
1. Refactoring struttura layout
2. Implementazione navigazione sticky
3. Sviluppo nuovo componente selezione metri
4. Aggiunta animazioni e transizioni
5. Testing e ottimizzazione

### 4.2 Componenti da Modificare
- GatewayWizard/index.jsx
- SelectMeters.jsx
- WizardProgress.jsx
- GatewayWizard.css

### 4.3 Nuovi Componenti da Creare
- SearchableTable.jsx
- MeterList.jsx
- SearchInput.jsx
- Tooltip.jsx

## 5. Benefici Attesi

1. **Miglior Usabilità**
   - Navigazione più intuitiva
   - Meno scrolling necessario
   - Selezione metri più efficiente

2. **Esperienza Utente Migliorata**
   - Feedback visivo immediato
   - Interazioni più fluide
   - Layout più organizzato

3. **Efficienza Operativa**
   - Riduzione dei passaggi necessari
   - Maggior velocità di configurazione
   - Minor probabilità di errori

## 6. Note Tecniche

- Utilizzare React.memo() per ottimizzare performance
- Implementare lazy loading per tabelle grandi
- Aggiungere gestione errori robusta
- Mantenere accessibilità WCAG 2.1