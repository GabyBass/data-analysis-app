import React, { useState, useMemo } from 'react'
import FileUploader from './components/FileUploader'
import ResultsPanel from './components/ResultsPanel'
import { ArrowUpDown } from 'lucide-react'

export default function App(){
  const [filesData, setFilesData] = useState([]) // [{name, data (array of objects)}]
  const [mandate, setMandate] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Data Analysis Studio</h1>
          <div className="text-sm text-slate-600">Modern React + shadcn-ui template</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold">1. Subir archivos</h2>
            <p className="text-sm text-slate-500">CSV, Excel (.xls/.xlsx), JSON. Puedes subir varios archivos.</p>
            <FileUploader onFilesParsed={setFilesData} />
          </div>

          <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold">2. Mandato de análisis</h2>
            <textarea
              value={mandate}
              onChange={(e)=>setMandate(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg resize-none"
              placeholder="Describe el análisis que quieres (ej: detectar outliers en monto, agrupar por proveedor, serie temporal de reclamos)..."
            />
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => {
                  // best-effort interpretation engine
                  const payload = { filesData, mandate }
                  // Simple heuristic engine (could be replaced with server or LLM)
                  try {
                    const result = window.simpleAnalyze(payload)
                    setAnalysisResult(result)
                  } catch(e){
                    setAnalysisResult({error: e.message})
                  }
                }}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white"
              >Analizar</button>

              <button onClick={()=>{ setFilesData([]); setAnalysisResult(null); setMandate('') }} className="px-4 py-2 rounded-lg border">Limpiar</button>
            </div>
          </div>
        </section>

        <section className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">3. Resultados</h2>
          <ResultsPanel result={analysisResult} filesData={filesData} />
        </section>

      </main>

      <footer className="max-w-6xl mx-auto mt-6 text-sm text-slate-500">Exportable app • Responsive • Modern</footer>
    </div>
  )
}