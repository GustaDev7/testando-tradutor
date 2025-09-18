"use client"

import { useState, useEffect } from 'react'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
]

function App() {
  const [sourceLang, setSourceLang] = useState('pt')
  const [targetLang, setTargetLang] = useState('en')
  const [sourceText, setSourceText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [translatedText, setTranslatedText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (sourceText) {
      const delay = setTimeout(() => {
        handleTranslate()
      }, 300);
      return () => clearTimeout(delay);
    }
  }, [sourceText, targetLang, sourceLang])

  const handleTranslate = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${sourceLang}|${targetLang}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json()
      setTranslatedText(data.responseData.translatedText)
    }
    catch (err) {
      setError(`Erro ao tentar traduzir: ${err.message}. Tente novamente.`)
    }
    finally {
      setIsLoading(false)
    }
  }

  const swapTranslate = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  return (
    <div className="min-h-screen flex flex-col bg-indigo-50">
      <header className="bg-indigo-600 shadow-2xl">
        <div className='max-w-6xl mx-auto px-6 py-6'>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h1 className='text-white text-4xl font-bold tracking-wide'>
              Tradutor Pro
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-start justify-center px-4 py-12">
        <div className='w-full max-w-6xl'>
          <div className='bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 transition-all duration-300 hover:shadow-3xl'>

            <div className='flex items-center justify-between p-6 bg-gradient-to-r from-gray-50/50 to-blue-50/50 border-b border-gray-200/50'>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <select
                  className='text-base font-medium text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer hover:text-blue-600 transition-colors'
                  value={sourceLang}
                  onChange={event => setSourceLang(event.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className='p-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95'
                onClick={swapTranslate}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <select
                  className='text-base font-medium text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer hover:text-purple-600 transition-colors'
                  value={targetLang}
                  onChange={event => setTargetLang(event.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 min-h-[300px]'>
              <div className='p-8 relative'>
                <div className="mb-3">
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Texto Original
                  </label>
                </div>
                <textarea
                  placeholder='Digite ou cole seu texto aqui para traduzir...'
                  className='w-full h-48 text-lg text-gray-800 bg-transparent resize-none outline-none placeholder-gray-400 leading-relaxed'
                  value={sourceText}
                  onChange={event => setSourceText(event.target.value)}
                />
                {sourceText && (
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {sourceText.length} caracteres
                  </div>
                )}
              </div>

              <div className='p-8 relative bg-gradient-to-br from-blue-50/30 to-purple-50/30 border-l border-gray-200/50'>
                <div className="mb-3">
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Tradução
                  </label>
                </div>

                {isLoading ? (
                  <div className='flex items-center justify-center h-48'>
                    <div className='flex flex-col items-center space-y-4'>
                      <div className='relative'>
                        <div className='animate-spin rounded-full h-10 w-10 border-2 border-blue-200'></div>
                        <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 absolute top-0'></div>
                      </div>
                      <p className="text-sm text-gray-500 font-medium">Traduzindo...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 overflow-y-auto">
                    <p className='text-lg text-gray-800 leading-relaxed whitespace-pre-wrap'>
                      {translatedText || (
                        <span className="text-gray-400 italic">
                          A tradução aparecerá aqui...
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {translatedText && !isLoading && (
                  <button
                    onClick={() => navigator.clipboard.writeText(translatedText)}
                    className="absolute bottom-3 right-3 p-2 rounded-lg bg-white/80 hover:bg-white text-gray-600 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                    title="Copiar tradução"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className='bg-gradient-to-r from-red-50 to-pink-50 border-t border-red-200/50 p-4'>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className='bg-slate-800 text-white/80 mt-16'>
        <div className='max-w-6xl mx-auto px-6 py-8'>
          <div className="text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Tradutor Pro - Projeto para portfólio. Feito com dedicação e muitas pesquisas por <a href="https://www.linkedin.com/in/gustavooliveira-dev/" className="underline hover:text-white" target="_blank" rel="noopener noreferrer">GustaDev</a>.  
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App