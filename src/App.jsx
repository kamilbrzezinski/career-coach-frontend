import { useState, useRef } from 'react'
import './App.css'

const API_URL = 'http://localhost:8000'

function App() {
  // Stan aplikacji
  const [cvText, setCvText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Sprawdź format pliku
    const fileExtension = file.name.toLowerCase().split('.').pop()
    if (!['pdf', 'txt'].includes(fileExtension)) {
      setError('Nieobsługiwany format pliku. Dozwolone: PDF, TXT')
      return
    }

    // Sprawdź rozmiar pliku (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Plik jest za duży. Maksymalny rozmiar: 10MB')
      return
    }

    setLoading(true)
    setError(null)
    setUploadedFile(file.name)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_URL}/upload-cv`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Błąd podczas przetwarzania pliku')
      }

      const data = await response.json()
      setCvText(data.text)
      setError(null)
    } catch (err) {
      setError(err.message)
      setUploadedFile(null)
    } finally {
      setLoading(false)
    }
  }

  const analyzeCv = async () => {
    if (!cvText.trim()) {
      setError('Proszę najpierw załadować CV')
      return
    }

    if (!jobDescription.trim()) {
      setError('Proszę podać opis oferty pracy')
      return
    }

    if (!apiKey.trim()) {
      setError('Proszę podać klucz API OpenAI')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('cv_text', cvText)
      formData.append('job_description', jobDescription)
      formData.append('api_key', apiKey)

      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Błąd podczas analizy')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎯 Career Coach
          </h1>
          <p className="text-gray-600 text-lg">
            Analizuj swoje CV względem ofert pracy z AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lewa kolumna - Upload i formularz */}
          <div className="space-y-6">
            {/* Upload CV */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                📄 Załaduj swoje CV
              </h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                  >
                    {loading ? 'Przetwarzanie...' : 'Wybierz plik CV'}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Obsługiwane formaty: PDF, TXT (max 10MB)
                  </p>
                </div>

                {uploadedFile && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 text-sm">
                      ✅ Załadowano: <span className="font-semibold">{uploadedFile}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Klucz API */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                🔑 Klucz API OpenAI
              </h2>
              
              <div className="space-y-3">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Wprowadź swój klucz API OpenAI..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
                <p className="text-sm text-gray-500">
                  Potrzebujesz klucz API OpenAI do analizy CV. Możesz go uzyskać na{' '}
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 underline"
                  >
                    platform.openai.com
                  </a>
                </p>
              </div>
            </div>

            {/* Opis oferty pracy */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                💼 Opis oferty pracy
              </h2>
              
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Wklej tutaj opis oferty pracy..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              />
            </div>

            {/* Przycisk analizy */}
            <button
              onClick={analyzeCv}
              disabled={loading || !cvText.trim() || !jobDescription.trim() || !apiKey.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analizuję CV...
                </div>
              ) : (
                '🚀 Analizuj CV'
              )}
            </button>

            {/* Błąd */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold mb-1">❌ Błąd:</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Prawa kolumna - Wyniki analizy */}
          <div className="space-y-6">
            {analysis ? (
              <div className="space-y-6">
                {/* Procent dopasowania */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    📊 Dopasowanie CV
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                      {analysis.match_percentage}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${analysis.match_percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {analysis.match_percentage >= 80 ? 'Doskonałe dopasowanie!' : 
                       analysis.match_percentage >= 60 ? 'Dobre dopasowanie' : 
                       analysis.match_percentage >= 40 ? 'Średnie dopasowanie' : 
                       'Wymaga poprawy'}
                    </p>
                  </div>
                </div>

                {/* Mocne strony */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
                    ✅ Mocne strony
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Słabe strony */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center">
                    ⚠️ Słabe strony
                  </h3>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sugestie poprawek */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                    💡 Sugestie poprawek CV
                  </h3>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sugestie nauki */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                    🎓 Sugestie nauki
                  </h3>
                  <ul className="space-y-2">
                    {analysis.learning_suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Wyniki analizy pojawią się tutaj
                </h3>
                <p className="text-gray-500 text-sm">
                  Załaduj CV, wprowadź klucz API i opisz ofertę pracy, a następnie kliknij "Analizuj CV"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
