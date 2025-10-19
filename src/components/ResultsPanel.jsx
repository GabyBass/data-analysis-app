import React from 'react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts'

function Table({data}){
  if(!data || data.length===0) return <div className="p-4 text-slate-500">Sin datos para mostrar.</div>
  const cols = Object.keys(data[0])
  return (
    <div className="overflow-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {cols.map(c=> <th key={c} className="p-2 text-left font-medium border-b">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.slice(0,200).map((r,i)=> (
            <tr key={i} className={i%2? 'bg-slate-50': ''}>
              {cols.map(c=> <td key={c} className="p-2 align-top">{String(r[c])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ResultsPanel({result, filesData}){
  if(!result) return <div className="p-4 text-slate-500">Aún no has realizado un análisis.</div>
  if(result.error) return <div className="p-4 text-red-600">Error: {result.error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold">Tablas</h3>
        {filesData.map(f=> (
          <div key={f.name} className="mt-3">
            <h4 className="text-sm font-medium">{f.name}</h4>
            <Table data={f.data} />
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold">Gráficos sugeridos</h3>
        {result.charts && result.charts.length>0 ? result.charts.map((c,idx)=> (
          <div key={idx} style={{width: '100%', height: 260}} className="mt-3">
            {c.type === 'line' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={c.data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey={c.x} /><YAxis /><Tooltip /><Line type="monotone" dataKey={c.y} stroke="#8884d8" /></LineChart>
              </ResponsiveContainer>
            )}
            {c.type === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={c.data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey={c.x} /><YAxis /><Tooltip /><Bar dataKey={c.y} /></BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )) : <div className="p-3 text-slate-500">No se generaron gráficos.</div>}
      </div>

      <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold">Resumen</h3>
        <pre className="whitespace-pre-wrap text-sm mt-2">{JSON.stringify(result.summary, null, 2)}</pre>
      </div>
    </div>
  )
}