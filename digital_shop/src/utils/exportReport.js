import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header]
      const stringValue = typeof value === 'string' ? value : String(value)
      return stringValue.includes(',') ? `"${stringValue}"` : stringValue
    }).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToJSON = (data, filename) => {
  if (!data) {
    console.error('No data to export')
    return
  }

  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.json`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToPDF = (data, filename, title = 'Report') => {
  if (!data) {
    console.error('No data to export')
    return
  }

  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(20)
  doc.setTextColor(99, 102, 241)
  doc.text(title, 14, 22)
  
  // Add timestamp
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30)
  
  // Add line
  doc.setDrawColor(229, 231, 235)
  doc.line(14, 35, 196, 35)

  // Prepare data for table
  let tableData = []
  let headers = []

  if (Array.isArray(data) && data.length > 0) {
    headers = Object.keys(data[0])
    tableData = data.map(row => headers.map(header => {
      const value = row[header]
      return typeof value === 'string' ? value : String(value)
    }))
  } else if (typeof data === 'object') {
    headers = ['Key', 'Value']
    tableData = Object.entries(data).map(([key, value]) => [
      key,
      typeof value === 'string' ? value : JSON.stringify(value)
    ])
  }

  // Add table
  if (tableData.length > 0) {
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 45,
      theme: 'grid',
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [71, 85, 105]
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      margin: { top: 45, right: 14, bottom: 14, left: 14 }
    })
  } else {
    doc.setFontSize(12)
    doc.setTextColor(107, 114, 128)
    doc.text('No data available for this report', 14, 50)
  }

  // Save the PDF
  doc.save(`${filename}.pdf`)
}
