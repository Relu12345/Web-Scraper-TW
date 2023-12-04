import React, {useState} from 'react'
import {ExportFiles} from '../API/exportFiles'


interface ResponseMessageText {
    authors: Array<string>,
    title: string,
    url: string
}

interface Items {
  itemsValue: Array<number>
  items: ResponseMessageText[]
  type: string
  handleError: (value: string) => void
}

export const ExportItems: React.FC<Items> = ({itemsValue, items, type, handleError}) => {
  const handleExport = async () => {
    console.log(itemsValue)
    if (itemsValue.length === 0) 
      return handleError('Please select an item to export!')
    const valuesToExport: ResponseMessageText[] = items.filter((item) => itemsValue.includes(items.indexOf(item)))
    handleError('')
    const response = await ExportFiles(valuesToExport, type)

    if (!response)
      handleError('Server error')    
  } 
  


  return (  
    <div onClick={handleExport}>
      Export to {type} file
    </div>
  )
}
