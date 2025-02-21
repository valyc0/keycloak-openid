# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


prompt:

Crea un nuovo progetto React basato su Vite che riproduca esattamente il layout e lo stile del template fornito (composto da un file index.html e il relativo CSS), includendo anche tutti gli effetti JavaScript presenti, come la gestione della chiusura del menu e le transizioni.

Requisiti:

1. **Componenti React:**
   - **Header:** Componente per la parte superiore della pagina.
   - **Sidebar:** Componente per la barra laterale (a sinistra o come da template) che includa la funzionalità per l'apertura/chiusura del menu.
   - **Main:** Componente per il contenuto principale.

2. **Layout e Stili:**
   - Il layout finale (struttura, posizionamento, spaziatura) deve essere identico al template originale.
   - Tutti gli stili, inclusi font, colori, margini e padding, devono essere mantenuti esattamente come nel file CSS del template.
   - Se il template utilizza tecniche come Flexbox o CSS Grid, replicare esattamente la stessa struttura nel progetto React.

3. **Effetti JavaScript:**
   - Riproduci tutti gli effetti JavaScript esistenti relativi alla chiusura del menu, transizioni ed eventuali animazioni.
   - Assicurati che le funzioni di interazione (ad esempio, l'apertura e chiusura del menu a tendina o laterale) siano gestite correttamente nei componenti React, mantenendo lo stesso comportamento del template originale.
   - Se il template contiene codice JavaScript personalizzato, integralo o riscrivilo in modo idiomatico in React (utilizzando ad esempio gli hook come `useState` e `useEffect`).

4. **Struttura del Progetto:**
   - Organizza il codice in file separati per ogni componente (es. `Header.jsx`, `Sidebar.jsx`, `Main.jsx`) e un file `App.jsx` che li componga insieme.
   - Utilizza il file `index.html` generato da Vite, modificandolo se necessario per includere il root element per la React App, ma mantenendo i riferimenti al CSS originale.
   - Importa il file CSS globale all'interno del progetto (ad esempio in `main.jsx` o in `App.jsx`) per applicare esattamente gli stessi stili del template.

5. **Configurazione e Output:**
   - Il progetto deve essere configurato con Vite in modo standard per React.
   - Il risultato renderizzato deve essere identico alla visualizzazione del template originale, senza alcuna differenza visiva o comportamentale.
   - Fornisci il codice completo, la struttura delle cartelle e le eventuali configurazioni necessarie per avviare il progetto con Vite.

la directory template si trova:/workspace/db-ready/www  ed il progetto si deve chiamare myprj