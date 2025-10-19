import React from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export default function FileUploader({onFilesParsed}){
  const handleFiles = async (files) => {
    const parsed = []
    for(const file of files){
      const name = file.name
      const ext = name.split('.').pop().toLowerCase()
      if(ext === 'csv' || ext === 'txt'){
        const text = await file.text()
        const { data, errors, meta } = Papa.parse(text, { header: true, dynamicTyping: true, skipEmptyLines: true })
        parsed.push({name, data})
      } else if(ext === 'json'){
        const text = await file.text()
        const data = JSON.parse(text)
        const arr = Array.isArray(data) ? data : [data]
        parsed.push({name, data: arr })
      } else if(ext === 'xls' || ext === 'xlsx'){
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(worksheet, { defval: null })
        parsed.push({name, data})
      } else {
        // skip
      }
    }
    onFilesParsed(parsed)
  }

  return (
    <div className="mt-3">
      <input
        type="file"
        multiple
        onChange={(e)=>handleFiles(Array.from(e.target.files))}
        className=""
      />
      <div className="text-xs text-slate-500 mt-2">Suelta varios archivos o haz click para seleccionar.</div>
    </div>
  )
}