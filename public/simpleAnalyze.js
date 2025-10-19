// A very small client-only analysis engine. Replace with server/LLM for stronger behavior.
window.simpleAnalyze = function({filesData, mandate}){
  const summary = { files: filesData.map(f=>({name: f.name, rows: f.data.length})), mandate }
  const charts = []
  // heuristics: if any dataset has numeric columns, produce a time-series or histogram
  for(const f of filesData){
    const sample = f.data[0] || {}
    const numericCols = Object.keys(sample).filter(k => typeof sample[k] === 'number')
    const dateCols = Object.keys(sample).filter(k => /date|fecha|time|timestamp/i.test(k))
    if(dateCols.length>0 && numericCols.length>0){
      const x = dateCols[0]
      const y = numericCols[0]
      const data = f.data.map(r=>({[x]: r[x], [y]: r[y]})).filter(r=>r[x]!=null && r[y]!=null)
      charts.push({type: 'line', x, y, data})
    } else if(numericCols.length>0){
      const x = Object.keys(sample).find(k=> typeof sample[k] === 'string') || Object.keys(sample)[0]
      const y = numericCols[0]
      const grouped = {}
      for(const r of f.data){
        const key = r[x] ?? 'N/A'
        grouped[key] = (grouped[key]||0) + (Number(r[y])||0)
      }
      const data = Object.entries(grouped).slice(0,30).map(([k,v])=>({[x]:k, [y]:v}))
      charts.push({type: 'bar', x, y, data})
    }
  }
  return { summary, charts }
}