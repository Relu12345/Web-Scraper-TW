import React, {useState} from 'react'

interface SearchedData {
    searchedData: ResponseMessageText[] 
}

interface ResponseMessageText {
    authors: Array<string>,
    title: string,
    url: string
  }

const Results: React.FC<SearchedData> = ({searchedData}) => {
    const [selectedItems, setSelectedItems] = useState<Array<number>>([])
    const handleSelectedItem = (id: number) => {
        if (selectedItems.includes(id))
            setSelectedItems(selectedItems.filter((item) => item !== id))
        else
            setSelectedItems([...selectedItems, id])
    }

    console.log({searchedData}) 
    return (
        <table className="min-w-full border-collapse border border-gray-300">
            <thead>
                <tr>
                    <th className="py-2 px-4 border border-gray-300">
                        <input 
                            type="checkbox"
                            onChange={() => {
                                setSelectedItems(searchedData.map((data: ResponseMessageText) => searchedData.indexOf(data)))
                            }} 
                        />
                    </th>
                </tr>
            </thead>
            <tbody>
                {searchedData.map((data: ResponseMessageText) => (
                    <tr key={searchedData.indexOf(data)}>
                        <td className="py-2 px-4 border border-gray-300">
                            <input 
                                type="checkbox"
                                checked={selectedItems.includes(searchedData.indexOf(data))}
                                onChange={() => handleSelectedItem(searchedData.indexOf(data))} 
                            />
                        </td>
                        <td className='py-2 px-4 border border-gray-300'>
                            {data.title}
                        </td>
                        <td className='py-2 px-4 border border-gray-300'>
                            {data.authors.map((author: string) => (
                                <>{author}</>
                            ))}
                        </td>
                        <td className='py-2 px-4 border border-gray-300'>
                            {data.url}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>    
    )
}

export default Results
