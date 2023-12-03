import React from 'react'
import { jsPDF } from "jspdf"


interface ResponseMessageText {
    authors: Array<string>,
    title: string,
    url: string
}

interface Items {
  itemsValue: Array<number>
  items: ResponseMessageText[]
}

export const ExportItems: React.FC<Items> = ({itemsValue, items}) => {
  const valuesToExport: ResponseMessageText[] = items.filter((item) => itemsValue.includes(items.indexOf(item)))
  const handlePDFExport = async () => {
    

    console.log(valuesToExport)

    const doc = new jsPDF({orientation: 'landscape'})

    

    doc.save("a4.pdf")
  }

  return (  
    <>
      <button 
        onClick={handlePDFExport}
        className='bg-gray-600 text-white rounded-md p-2 ml-10 mb-4'
      >
        Export to PDF
      </button>

      <table
        id="results-table" 
        className=" w-11/12 border-collapse border border-gray-300 ml-10"
      >
        <thead>
          <tr>
            <th className="py-2 w-1/3 border border-gray-300 text-sm font-medium">Title</th>
            <th className="py-2 w-1/3 border border-gray-300 text-sm font-medium">Authors</th>
            <th className="py-2 w-1/3 border border-gray-300 text-sm font-medium">URL</th>
          </tr>
        </thead>
        <tbody>
          {valuesToExport?.map((value) => (
            <tr>
              <td className='py-2 px-4 border border-gray-300'>
                {value.title}
              </td>
              <td className='py-2 px-4 border border-gray-300'>
                {value.authors.map((author) => (
                  <>{author}</>
                ))}
              </td>
              <td className='py-2 px-4 border border-gray-300'>
                {value.url}
              </td>
            </tr>
          ))}
        </tbody>
      </table>    
    </>
  )
}
