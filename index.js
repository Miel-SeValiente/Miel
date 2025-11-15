import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- Contenido de services/googleSheetService.js ---
const SHEET_ID = '1y35vZaHK_zv1-aylHYMk92FwHFpqk5aPzeEyO9BLk1Q';
const SHEET_NAME = 'Activo';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

const parseCSV = (csvText) => {
  const rows = csvText.split('\n').slice(1);
  return rows.map((row) => {
    const columns = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
    const cleanColumns = columns.map(col => col.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    
    if (cleanColumns.length >= 4) {
        return {
            id: cleanColumns[0],
            text: cleanColumns[1],
            reference: cleanColumns[2],
            comment: cleanColumns[3]
        };
    }
    if (cleanColumns.length === 3) {
      return {
        id: cleanColumns[0],
        text: cleanColumns[1],
        reference: cleanColumns[2],
        comment: ''
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


// --- Contenido de components/Icons.js ---
const TShirtIcon = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
    React.createElement('path', { d: "M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99 .84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" })
  )
);

const WhatsAppIcon = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", ...props },
        React.createElement('path', { d: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.269l-.444 1.625 1.664-.436zM15.245 14.193c-.146-.27-.291-.491-.457-.682-.166-.191-.363-.349-.626-.499-.263-.15-.572-.25-.926-.299-.354-.048-.74-.022-1.092.053-.352.075-.677.204-.958.384-.28.18-.521.42-.71.706-.19.287-.312.614-.364.979-.053.365-.053.73.001 1.093.054.363.16.704.316.996.156.292.368.558.629.798.26.24.56.444.889.606.328.162.68.287 1.05.372.37.086.756.129 1.154.129.472 0 .93-.057 1.365-.172.435-.115.819-.299 1.14-.551.32-.251.564-.568.72-.948.156-.38.231-.81.225-1.285-.006-.475-.113-.905-.318-1.285z" })
    )
);

// --- Contenido de components/LoadingSpinner.js ---
const LoadingSpinner = () => {
  return React.createElement('div', { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" });
};

// --- Contenido de components/VerseDisplay.js ---
const VerseDisplay = ({ verse, isLoading }) => {
  return React.createElement('div', { className: `bg-white p-6 rounded-2xl shadow-lg border border-zinc-200/80 w-full transition-opacity duration-300 ease-in-out ${isLoading ? 'opacity-50' : 'opacity-100'}` },
    React.createElement('blockquote', { className: "text-center" },
      React.createElement('p', { className: "text-xl md:text-2xl font-serif text-stone-800 leading-relaxed" }, `“${verse.text}”`)
    ),
    React.createElement('cite', { className: "block text-right mt-6 text-md font-semibold text-rose-800" }, `— ${verse.reference}`)
  );
};

// --- Contenido de components/PromoBanner.js ---
const PromoBanner = () => {
  const whatsappNumber = '584125384440';
  const message = encodeURIComponent('¡Quiero mas información por favor!');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return React.createElement('div', { className: "w-full p-4 bg-rose-100 rounded-2xl shadow-lg border border-rose-200/80 flex items-center gap-4" },
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
        className: "px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-full shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 flex items-center gap-2 self-start sm:self-center whitespace-nowrap"
      },
        React.createElement(WhatsAppIcon, { className: "h-5 w-5" }),
        "Contactar Vendedor"
      )
    )
  );
};

// --- Contenido de App.js ---
const App = () => {
  const [verses, setVerses] = useState([]);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(true);
  const [error, setError] = useState(null);
  const [showComment, setShowComment] = useState(false);

  useEffect(() => {
    const loadVerses = async () => {
      try {
        setError(null);
        setIsLoadingVerse(true);
        const fetchedVerses = await fetchVerses();
        setVerses(fetchedVerses);
        if (fetchedVerses.length > 0) {
          setCurrentVerse(fetchedVerses[Math.floor(Math.random() * fetchedVerses.length)]);
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

  const handleToggleComment = () => {
    setShowComment(prev => !prev);
  };

  return React.createElement('div', { className: "flex flex-col h-screen overflow-hidden bg-zinc-50 text-stone-800 selection:bg-rose-200 selection:text-rose-900" },
    React.createElement('header', { className: "relative w-full p-4 text-center bg-rose-50 sticky top-0 z-10 shadow-md" },
      React.createElement('h1', { className: "text-3xl font-bold font-serif text-rose-900" }, "Palabra de Dios"),
      React.createElement('p', { className: "mt-1 text-lg text-rose-800/80" }, "Miel para tu alma")
    ),
    React.createElement('main', { className: "flex-grow overflow-y-auto p-4 flex flex-col items-center gap-4 pb-40" },
      isLoadingVerse && !currentVerse ? React.createElement('div', { className: "flex justify-center items-center h-full" }, React.createElement(LoadingSpinner, null))
      : error ? React.createElement('div', { className: "text-center text-red-600 bg-red-100 p-4 rounded-lg" }, error)
      : currentVerse ? React.createElement(React.Fragment, null,
          React.createElement(VerseDisplay, { verse: currentVerse, isLoading: isLoadingVerse }),
          currentVerse.comment && React.createElement('div', {className: "flex flex-wrap justify-center items-center gap-4 mt-2 w-full"},
            React.createElement('button', {
              onClick: handleToggleComment,
              className: "px-6 py-2 font-semibold text-rose-800 bg-rose-100 border border-rose-200 rounded-full shadow-sm hover:bg-rose-200 transition-colors duration-300"
            }, showComment ? 'Ocultar Comentario' : 'Ver Comentario')
          ),
          showComment && currentVerse.comment && React.createElement('div', { className: "w-full p-6 mt-2 bg-white rounded-2xl shadow-lg border border-zinc-200/80 animate-fade-in" },
            React.createElement('p', { className: "text-stone-700 whitespace-pre-wrap leading-relaxed" }, currentVerse.comment)
          )
        )
      : React.createElement('div', { className: "text-center text-stone-500" }, "No se encontraron versículos.")
    ),
    React.createElement('div', { className: "fixed bottom-0 left-0 right-0 w-full p-4 z-20" },
      React.createElement('div', { className: "max-w-4xl mx-auto" },
        React.createElement(PromoBanner, null)
      )
    )
  );
};

// --- Lógica de renderizado final ---
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
