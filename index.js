// --- Dependencies (loaded via importmap in index.html) ---
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- services/googleSheetService.js ---
const SHEET_ID = '1y35vZaHK_zv1-aylHYMk92FwHFpqk5aPzeEyO9BLk1Q';
const SHEET_NAME = 'Activo';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
const parseCSV = (csvText) => {
  const rows = csvText.trim().split(/\r?\n/).slice(1);
  return rows.map((row) => {
    const columns = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
    const cleanColumns = columns.map(col => col.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    if (cleanColumns.length >= 5) {
      return {
        id: cleanColumns[0],
        text: cleanColumns[1],
        reference: cleanColumns[2],
        reflexion1: cleanColumns[3],
        reflexion2: cleanColumns[4],
      };
    }
     if (cleanColumns.length >= 3) {
      return {
        id: cleanColumns[0],
        text: cleanColumns[1],
        reference: cleanColumns[2],
        reflexion1: '',
        reflexion2: '',
      };
    }
    return null;
  }).filter((verse) => verse !== null && verse.id !== '' && verse.text !== '' && verse.reference !== '');
};
const fetchVerses = async () => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Failed to fetch or parse verses:', error);
    throw new Error('Could not retrieve verses from Google Sheet.');
  }
};

// --- components/Icons.js ---
const TShirtIcon = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
    React.createElement('path', { d: "M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99 .84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99 .84l.58-3.47a2 2 0 0 0-1.34-2.23z" })
  )
);
const WhatsAppIcon = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 16 16", fill: "currentColor", ...props },
    React.createElement('path', { d: "M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79 .965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.575 6.575 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" })
  )
);
const SparkleIcon = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
    React.createElement('path', { d: "M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" })
  )
);
const CloseIcon = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" })
  )
);

// --- components/LoadingSpinner.js ---
const InitialLoadingSpinner = () => {
  return React.createElement('div', { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" });
};

// --- components/VerseDisplay.js ---
const VerseDisplay = ({ verse, isLoading }) => {
  return React.createElement('div', { className: `bg-white p-6 rounded-2xl shadow-lg border border-zinc-200/80 w-full transition-opacity duration-300 ease-in-out ${isLoading ? 'opacity-50' : 'opacity-100'}` },
    React.createElement('blockquote', { className: "text-center" },
      React.createElement('p', { className: "text-base md:text-lg text-stone-800 leading-relaxed" }, `“${verse.text}”`)
    ),
    React.createElement('cite', { className: "block text-right mt-6 text-md font-semibold text-rose-800" }, `— ${verse.reference}`)
  );
};

// --- components/PromoBanner.js ---
const PromoBanner = () => {
  const whatsappNumber = '584125384440';
  const message = encodeURIComponent('¡Hola! Me gustaría más información sobre las franelas, por favor.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return React.createElement('div', { className: "w-full p-4 bg-gradient-to-br from-rose-50 to-amber-100 rounded-2xl shadow-lg border border-rose-200/60 flex items-center gap-4" },
    React.createElement('div', { className: "flex-shrink-0" },
      React.createElement(TShirtIcon, { className: "h-12 w-12 text-rose-500" })
    ),
    React.createElement('div', { className: "flex-grow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2" },
      React.createElement('div', null,
        React.createElement('h3', { className: "font-bold font-serif text-rose-900 text-lg" }, "¡Viste tu Fe!"),
        React.createElement('p', { className: "text-sm text-rose-800/90" }, "Franelas con la palabra de Dios.")
      ),
      React.createElement('a', {
          href: whatsappUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-md hover:shadow-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 flex items-center gap-2 self-end sm:self-auto whitespace-nowrap"
        },
        React.createElement(WhatsAppIcon, { className: "h-5 w-5" }),
        "Contáctanos"
      )
    )
  );
};

// --- components/Modal.js ---
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return React.createElement('div', {
    onClick: onClose,
    className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  },
    React.createElement('div', {
      onClick: e => e.stopPropagation(),
      className: "bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-fade-in"
    },
      React.createElement('button', {
        onClick: onClose,
        className: "absolute top-4 right-4 text-stone-500 hover:text-stone-800 transition-colors"
      },
        React.createElement(CloseIcon, { className: "h-6 w-6" })
      ),
      children
    )
  );
};


// --- App.js ---
const App = () => {
  const [verses, setVerses] = useState([]);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadVerses = async () => {
      try {
        setError(null);
        setIsLoadingVerse(true);
        const fetchedVerses = await fetchVerses();
        setVerses(fetchedVerses);
        if (fetchedVerses.length > 0) {
          const randomIndex = Math.floor(Math.random() * fetchedVerses.length);
          setCurrentVerse(fetchedVerses[randomIndex]);
        }
      } catch (err) {
        setError('No se pudieron cargar los versículos. Por favor, inténtelo de nuevo más tarde.');
        console.error(err);
      } finally {
        setIsLoadingVerse(false);
      }
    };
    loadVerses();
  }, []);

  const renderMainContent = () => {
    if (isLoadingVerse && !currentVerse) {
      return React.createElement('div', { className: "flex justify-center items-center h-64" }, React.createElement(InitialLoadingSpinner));
    }
    if (error) {
      return React.createElement('div', { className: "text-center text-red-600 bg-red-100 p-4 rounded-lg" }, error);
    }
    if (currentVerse) {
      const hasReflection = currentVerse.reflexion1 || currentVerse.reflexion2;

      return React.createElement(React.Fragment, null,
        React.createElement(VerseDisplay, { verse: currentVerse, isLoading: isLoadingVerse }),
        hasReflection && React.createElement('div', { className: "flex flex-wrap justify-end items-center gap-3 mt-4 w-full" },
          React.createElement('button', {
            onClick: () => setIsModalOpen(true),
            className: "flex items-center justify-center gap-2.5 px-5 py-2.5 font-semibold text-white bg-gradient-to-r from-rose-400 to-rose-600 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          }, 
            React.createElement(SparkleIcon, { key: 'icon', className: "h-5 w-5" }),
            React.createElement('span', { key: 'text' }, 'Ver Reflexión')
          )
        )
      );
    }
    return React.createElement('div', { className: "text-center text-stone-500 mt-10" }, "No se encontraron versículos.");
  };

  return React.createElement('div', { className: "flex flex-col min-h-screen bg-zinc-50 text-stone-800 selection:bg-rose-200 selection:text-rose-900" },
    React.createElement('header', { className: "relative w-full p-4 text-center bg-rose-50 sticky top-0 z-10 shadow-md" },
      React.createElement('h1', { className: "text-3xl font-bold font-serif text-rose-900" }, "Palabra de Dios"),
      React.createElement('p', { className: "mt-1 text-lg text-rose-800/80" }, "Miel para tu alma")
    ),
    React.createElement('main', { className: "flex-grow overflow-y-auto p-4 flex flex-col items-center gap-4 pb-40" },
      React.createElement('div', { className: "w-full max-w-2xl mx-auto" }, renderMainContent())
    ),
    React.createElement('div', { className: "fixed bottom-0 left-0 right-0 w-full p-4 z-20 bg-gradient-to-t from-zinc-50/80 to-zinc-50/0 backdrop-blur-lg" },
      React.createElement('div', { className: "max-w-4xl mx-auto" },
        React.createElement(PromoBanner, null)
      )
    ),
    React.createElement(Modal, {
      isOpen: isModalOpen,
      onClose: () => setIsModalOpen(false)
    },
      React.createElement('h2', { className: "text-2xl font-bold font-serif text-rose-900 mb-4" }, "Reflexión"),
      currentVerse?.reflexion1 && React.createElement('p', { className: "text-stone-700 whitespace-pre-wrap leading-relaxed text-sm mb-4" }, currentVerse.reflexion1),
      currentVerse?.reflexion2 && React.createElement('p', { className: "text-stone-700 whitespace-pre-wrap leading-relaxed text-sm" }, currentVerse.reflexion2),
      React.createElement('p', { className: "text-stone-800 font-semibold text-center mt-6" }, "Dios te Bendiga")
    )
  );
};

// --- Entry Point ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(App, null)
  )
);
