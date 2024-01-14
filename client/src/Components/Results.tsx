import React, {useState, useEffect, ReactNode} from 'react'
import { ExportItems } from './ExportItems'
import {BiSolidRightArrow, BiSolidLeftArrow} from 'react-icons/bi'
import { MdOutlineStar } from "react-icons/md"
import { CiStar } from "react-icons/ci"
import Select from 'react-select'
import { getUserInfoFromToken } from '../API/verifyToken'
import {getFavoritesItems, addItemToFavorites, removeItemFromFavorites} from '../API/manageFavorites'

interface SearchedData {
    searchedData: ResponseMessageText[]
    onDisplay: (value: number) => void
}

interface ResponseMessageText {
    authors: Array<string>,
    title: string,
    url: string
    source: string
}

//No. of results displayed per page
const displayItems = [
    {value: 5, label: "5"},
    {value: 10, label: "10"},
    {value: 25, label: "25"}
]

const Results: React.FC<SearchedData> = ({searchedData, onDisplay}) => {
    const user = getUserInfoFromToken()?.sub?.username
    const [selectedItems, setSelectedItems] = useState<Array<number>>([])
    const [favoritesItems, setFavoritesItems] = useState<ResponseMessageText[]>([])
    /*Table pagination */
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [itemsPerPage, setItemsPerPage] = useState<number>(5)
    const indexOfLastItem: number = currentPage * itemsPerPage
    const indexOfFirstItem: number = indexOfLastItem - itemsPerPage
    const currentResults = searchedData.slice(indexOfFirstItem, indexOfLastItem)
    const maxVisiblePages = 10
    const totalPages = Math.ceil((searchedData? searchedData.length: 1) / itemsPerPage)
    const pageButtons: ReactNode[] = []

    const [error, setError] = useState<string>('')

        useEffect(() => {
        const checkForFavoriteItems = async () => {
            /*const favoritesList: ResponseMessageText[] = await getFavoritesItems()

            for (let elem of searchedData) {
                if (favoritesList.includes(elem))
                    favoritesItems.push(elem)
            }
            */
            if (searchedData.length > 0) {
                //handleFavourites()
            }
        }
        checkForFavoriteItems()
        setSelectedItems([])
    }, [searchedData,  itemsPerPage])

    const handleFavourites = async () => {
        if (!user)
            return

        const result = await getFavoritesItems(user)

        if (result) {
            console.log(await result)
        }
    }
    

    const handlePageRendering = () => {
        if (totalPages < maxVisiblePages) {
            for (let i = 1; i < totalPages; i++)
                pageButtons.push(renderPageButton(i))
        }
        else {
            let lastPage = currentPage < 5 ? 5 : currentPage
            for (let i = 1; i <= lastPage; i++) {
                pageButtons.push(renderPageButton(i))
            }

            if (currentPage > 4 && currentPage < totalPages - 1) {
                pageButtons.push(renderPageButton(currentPage + 1))
                pageButtons.push(
                    <span
                        key={"ellipsis"}
                        className='mx-2 text-center dark:text-white'
                    >   
                        ...
                    </span>
                )
            } 
            
            else if (currentPage < totalPages - 1) {
                pageButtons.push(
                    <span
                        key={"ellipsis"}
                        className='mx-2 text-center dark:text-white'
                    >   
                        ...
                    </span>
                )
            }
            if (currentPage < totalPages)
                pageButtons.push(renderPageButton(totalPages))
        }

        

        

        return <div>{pageButtons}</div>
    }



    const handleSelectedItem = (id: number) => {
        if (selectedItems.includes(id))
            setSelectedItems(selectedItems.filter((item) => item !== id))
        else
            setSelectedItems([...selectedItems, id])
    }

    const handleFavoritesItem = async (id: number) => {
        if (!user)
            return
        const currentItem = searchedData[id]
        if (favoritesItems.includes(currentItem)) {
            await removeItemFromFavorites(currentItem, user)
            setFavoritesItems(favoritesItems.filter((item) => item !== currentItem))
        }
        else {
            await addItemToFavorites(currentItem, user)
            setFavoritesItems([...favoritesItems, currentItem])
        }
    }

    const nextPage = () => {
        if (indexOfLastItem < (searchedData? searchedData.length : 1)) {
            setCurrentPage(currentPage + 1)
            
        }
    }

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            
        }
    }

    const goToPage = (pageNumber:number) => {
        setCurrentPage(pageNumber)
        
    }

    const handleErrorAtExport = (value: string) => {
        setError(value)
    }

    const customStyles = {
        control: (provided: any, state: any) => ({
          ...provided,
          paddingTop: 0,
          paddingBottom: 0, 
        }),
    }

    const renderPageButton = (page: number): ReactNode => {
        return (
            <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-1 rounded-lg ${currentPage === page ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} mr-2 focus:outline-none ` }
        >
            {page}
        </button>
        )
    }

    return (
        <>
            {searchedData.length === 0 ? null
                : (
            <div className="w-11/12 mx-auto mt-4 p-6 bg-white rounded-lg shadow-md dark:bg-slate-700 slow-change">
                <div className="overflow-x-auto">
                    <>
                        <div className="flex mb-8 justify-between">
                            <div>
                                <button className='bg-gray-600 text-white font-medium p-2 my-4 lg:my-0 mx-2 rounded-md dark:bg-gray-800 hover:dark:bg-slate-900 slow-change'>
                                    <ExportItems itemsValue={selectedItems} items={searchedData} type={'pdf'} handleError={handleErrorAtExport}/>
                                </button>

                                <button className='bg-gray-600 text-white font-medium p-2 my-4 lg:my-0 mx-2 rounded-md dark:bg-gray-800 hover:dark:bg-slate-900 slow-change'>
                                    <ExportItems itemsValue={selectedItems} items={searchedData} type={'csv'} handleError={handleErrorAtExport}/>
                                </button>

                                {
                                    error.length > 0 && 
                                    <span className='my-2 mx-2 block text-red-600 font-medium'>{error}</span>
                                }
                            </div>
                            <label className="flex gap-2 ">
                                <span className="mt-2 dark:text-white">
                                    Show
                                </span>
                                <Select
                                    options={displayItems}
                                    placeholder={itemsPerPage}
                                    styles={customStyles}
                                    onChange={(e:any) => {setItemsPerPage(e.value); setCurrentPage(1)}}
                                />
                                <span className="mt-2 ml-1 dark:text-white">
                                    results
                                </span>
                            </label>
                        </div>
                    </>

                    <table
                        id="results-table" 
                        className="w-full overflow-y-auto"
                    >
                        <thead className='bg-gray-800 text-white'>
                            <tr>
                                <th className="p-2">
                                    <div className='flex gap-2 justify-center'>
                                        Select all 
                                        <input 
                                            type="checkbox"
                                            className="w-4 h-4 my-4"
                                            checked={searchedData.length === selectedItems.length? true: false}
                                            onChange={() => {
                                                setSelectedItems(selectedItems.length !== searchedData.length ? 
                                                    searchedData.map((data: ResponseMessageText) => searchedData.indexOf(data)) :
                                                    []       
                                                )
                                            }} 
                                        />
                                    </div>
                                </th>

                                <th className='p-2'>
                                    <div className='flex gap-2 justify-center'>
                                        <h1>Title</h1>
                                    </div>
                                </th>
                                
                                <th className='p-2'>
                                    <div className='flex gap-2 justify-center'>
                                        <h1>Authors</h1>
                                    </div>
                                </th>

                                <th className='p-2'>
                                    <div className='flex gap-2 jusitfy-center'>
                                        <h1>Source</h1>
                                    </div>
                                </th>

                                <th className='p-2'>
                                    <div className='flex gap-2 justify-center'>
                                        <h1>Add to Favorites</h1>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentResults.map((data: ResponseMessageText) => (
                                <tr key={currentResults.indexOf(data)}>
                                    <td className='p-2 font-semibold'>
                                        <input 
                                            type="checkbox"
                                            className='mx-9 w-4 h-4'
                                            checked={selectedItems.includes(searchedData.indexOf(data))}
                                            onChange={() => handleSelectedItem(searchedData.indexOf(data))} 
                                        />
                                    </td>
                                    <td className='p-4  hover:text-blue-600 font-medium dark:text-blue-300'>
                                        <a href={data.url} target='_blank' rel="noreferrer">{data.title}</a>
                                    </td>
                                    <td className='p-2 dark:text-white text-center'>
                                        {data.authors.map((author: string) => (
                                            <div key={author + data.url}>{author} <br /></div>
                                        ))}
                                    </td>

                                    <td className='p-2 dark:text-white text-center'>
                                        {data.source}
                                    </td>

                                    <td className='p-2 '>
                                        {favoritesItems.includes(data)?
                                            <MdOutlineStar 
                                            onClick={() => handleFavoritesItem(searchedData.indexOf(data))}
                                            className='mx-auto  text-2xl mt-1 text-yellow-600 cursor-pointer'
                                        />
                                            :
                                            <CiStar 
                                            onClick={() => handleFavoritesItem(searchedData.indexOf(data))}
                                            className='mx-auto  text-2xl mt-1 text-dark dark:text-white cursor-pointer'
                                        />
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>    
                </div>

                {/* Pagination */}
                <div className='pagination flex justify-end mt-5 mr-2'>
                    {
                        currentPage !== 1 &&
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className='hover:text-gray-500 cursor-pointer'
                        >
                            <BiSolidLeftArrow size={20} />
                        </button>
                    }
                    
                    <div>
                    {handlePageRendering()}
                    </div>
                    
                    <button
                        onClick={nextPage}
                        disabled={indexOfLastItem >= (searchedData? searchedData.length: 1)}
                    >   
                        <BiSolidRightArrow
                            size={20}
                            className="hover:text-gray-500 cursor-pointer"
                        />
                    </button>
                </div>
            </div>
                )
            }
        </>
    )
}

export default Results
