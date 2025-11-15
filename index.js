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
    React.createElement('path', { d: "M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99 .84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99 .84l.58-3.47a2 2 0 0 0-1.34-2.23z" })
  )
);

const WhatsAppIcon = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", ...props },
        React.createElement('path', { d: "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.49 3.48 1.38 4.94L2 22l5.25-1.42c1.4.83 3.04 1.32 4.79 1.32h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.84 12.2c-.22-.12-1.3-.64-1.5-.71-.2-.07-.35-.07-.49.07-.15.15-.57.71-.7.84-.12.12-.27.12-.49.07-.22-.05-1.02-.38-1.95-1.2-.72-.64-1.2-1.42-1.37-1.67-.17-.25-.02-.37.05-.5.06-.12.15-.27.22-.37.07-.1.1-.17.15-.27.05-.1.02-.2-.03-.27-.05-.07-.49-1.17-.67-1.62-.17-.42-.35-.37-.49-.37h-.42c-.15 0-.37.05-.57.25-.2.2-.75.74-.75 1.79s.77 2.07.87 2.22c.1.15 1.52 2.36 3.67 3.25.52.22 1.02.35 1.37.45.62.17 1.17.15 1.57-.02.45-.2.75-.84.85-1.04.1-.2.1-.37.07-.49z" })
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
      React.createElement('p', { className: "text-sm md:text-base text-stone-800 leading-relaxed" }, `“${verse.text}”`)
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

  return React.createElement('div', { className: "flex flex-col h-screen bg-zinc-50 text-stone-800 selection:bg-rose-200 selection:text-rose-900" },
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
            React.createElement('p', { className: "text-stone-700 whitespace-pre-wrap leading-relaxed text-xs" }, currentVerse.comment)
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
