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
const SunIcon = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a2.25 2.25 0 00-2.25 2.25 2.25 2.25 0 002.25 2.25 2.25 2.25 0 002.25-2.25A2.25 2.25 0 0012 12z" })
  )
);
const MoonIcon = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" })
  )
);


// --- components/LoadingSpinner.js ---
const InitialLoadingSpinner = () => {
  return React.createElement('div', { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" });
};

// --- components/VerseDisplay.js ---
const VerseDisplay = ({ verse, isLoading, children }) => {
  return React.createElement('div', { className: `bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-zinc-200/80 dark:border-slate-700 w-full transition-opacity duration-300 ease-in-out ${isLoading ? 'opacity-50' : 'opacity-100'}` },
    React.createElement('blockquote', { className: "text-center" },
      React.createElement('p', { className: "text-base md:text-lg text-stone-800 dark:text-stone-200 leading-relaxed" }, `“${verse.text}”`)
    ),
    React.createElement('div', { className: "mt-6 flex justify-between items-center" },
      React.createElement('div', null, children),
      React.createElement('cite', { className: "text-md font-semibold text-rose-800 dark:text-rose-400" }, `— ${verse.reference}`)
    )
  );
};

// --- components/PromoBanner.js ---
const PromoBanner = () => {
    const whatsappNumber = '584125384440';
    const message = encodeURIComponent('¡Hola! Me gustaría más información sobre las franelas, por favor.');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    return React.createElement('div', {
        className: "w-full h-20 rounded-2xl shadow-lg overflow-hidden relative bg-rose-100 dark:bg-slate-700"
    },
        // Left side colored shape & text
        React.createElement('div', {
            className: "absolute top-0 left-0 w-[65%] h-full bg-gradient-to-r from-rose-500 to-rose-600 dark:from-rose-600 dark:to-rose-700 p-2 sm:p-3 flex flex-col justify-center",
            style: { clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' }
        },
            React.createElement('p', { className: "text-white/90 text-[11px] sm:text-xs uppercase tracking-wider" }, "Franelas con la"),
            React.createElement('h3', {
                className: "text-white text-sm sm:text-base font-bold uppercase tracking-wide border border-white py-0.5 px-1.5 inline-block my-0.5"
            }, "Palabra de Dios"),
            React.createElement('a', {
                href: whatsappUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "mt-1 text-xs font-bold text-white flex items-center gap-1 hover:underline decoration-white/70"
            },
                "Contáctanos",
                 React.createElement('svg', {
                     xmlns: "http://www.w3.org/2000/svg",
                     viewBox: "0 0 20 20",
                     fill: "currentColor",
                     className: "w-3 h-3"
                 },
                    React.createElement('path', {
                        fillRule: "evenodd",
                        d: "M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z",
                        clipRule: "evenodd"
                    })
                )
            )
        ),
        // Right side icon
        React.createElement('div', {
            className: "absolute top-0 right-0 w-2/5 h-full flex items-center justify-center p-2"
        },
            React.createElement(TShirtIcon, {
                className: "h-10 w-10 text-rose-500 dark:text-rose-300"
            })
        )
    );
};


// --- components/Modal.js ---
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return React.createElement('div', {
    className: "fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  },
    React.createElement('div', {
      className: "bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-fade-in"
    },
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
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

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

      return React.createElement(VerseDisplay, { verse: currentVerse, isLoading: isLoadingVerse },
        hasReflection && React.createElement('button', {
          onClick: () => setIsModalOpen(true),
          className: "flex items-center justify-center gap-2.5 px-5 py-2.5 font-semibold text-white bg-gradient-to-r from-rose-400 to-rose-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 dark:focus:ring-offset-slate-800"
        },
          React.createElement(SparkleIcon, { key: 'icon', className: "h-5 w-5" }),
          React.createElement('span', { key: 'text' }, 'Ver Reflexión')
        )
      );
    }
    return React.createElement('div', { className: "text-center text-stone-500 dark:text-stone-400 mt-10" }, "No se encontraron versículos.");
  };

  return React.createElement('div', { className: "flex flex-col h-full bg-zinc-50 dark:bg-slate-900 text-stone-800 dark:text-stone-200 selection:bg-rose-200 selection:text-rose-900" },
    React.createElement('header', { className: "relative w-full p-4 text-center bg-rose-50/80 dark:bg-slate-800/80 sticky top-0 z-10 shadow-md backdrop-blur-lg border-b border-rose-200/60 dark:border-slate-700/60" },
      React.createElement('h1', { className: "text-3xl font-bold font-serif text-rose-900 dark:text-rose-300" }, "Palabra de Dios"),
      React.createElement('p', { className: "mt-1 text-lg text-rose-800/80 dark:text-rose-400/80" }, "Miel para tu alma")
    ),
    React.createElement('main', { className: "flex-grow p-4 flex flex-col items-center justify-start gap-4 pb-32" },
      React.createElement('div', { className: "w-full max-w-2xl mx-auto" }, renderMainContent()),
      React.createElement('div', { className: "mt-auto text-center text-xs text-stone-500 dark:text-stone-400 pb-2" },
          React.createElement('p', null, "© Se Valiente Dios te Ama"),
          React.createElement('p', null, "2025 | Todo los derechos reservados")
      )
    ),
     React.createElement('button', {
        onClick: toggleTheme,
        'aria-label': 'Cambiar tema',
        className: "fixed bottom-48 right-4 z-30 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 bg-indigo-900 dark:bg-amber-200 text-amber-300 dark:text-slate-800 border border-indigo-700 dark:border-amber-300/80 hover:bg-indigo-800 dark:hover:bg-amber-300 focus:ring-rose-500 dark:focus:ring-amber-400"
      },
      theme === 'light' 
        ? React.createElement(MoonIcon, { className: "h-6 w-6" }) 
        : React.createElement(SunIcon, { className: "h-6 w-6" })
    ),
    React.createElement('footer', { className: "fixed bottom-0 left-0 right-0 w-full p-4 z-20" },
      React.createElement('div', { className: "max-w-4xl mx-auto" },
        React.createElement(PromoBanner, null)
      )
    ),
    React.createElement(Modal, {
      isOpen: isModalOpen,
      onClose: () => setIsModalOpen(false)
    },
      React.createElement('h2', { className: "text-2xl font-bold font-serif text-rose-900 dark:text-rose-300 mb-4" }, "Reflexión"),
      currentVerse?.reflexion1 && React.createElement('p', { className: "text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed text-sm mb-4" }, currentVerse.reflexion1),
      currentVerse?.reflexion2 && React.createElement('p', { className: "text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed text-sm" }, currentVerse.reflexion2),
      React.createElement('div', { className: "mt-8 flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-slate-700" },
        React.createElement('p', { className: "text-stone-800 dark:text-stone-100 font-semibold" }, "Dios te Bendiga"),
        React.createElement('button', {
          onClick: () => setIsModalOpen(false),
          className: "px-6 py-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        }, "Amén")
      )
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
