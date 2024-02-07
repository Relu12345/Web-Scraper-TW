import React, { useState} from 'react'
import { IoMdClose } from "react-icons/io"
import { deleteFromHistory } from '../API/deleteFromHistory'

interface historyObj {
    date: Date,
    query: string
}

interface Props {
    text: string,
    isOpen: boolean
    onClose: () => void
    item: historyObj | null
    username: string | undefined
    handleFetch: (value: boolean) => void
    handleConfirmationDialog: (value: boolean) => void
}

export const DeleteDialog: React.FC<Props> = ({text, isOpen, onClose, item, username, handleFetch, handleConfirmationDialog}) => {
    const [isDeleted, setIsDeleted] = useState(false)
    

    const handleDelete = async (item: historyObj | null, username: string | undefined) => {
        if (item && username) {
            const response = await deleteFromHistory(item, username)

            if (response) {
                console.log("item deleted!")
                console.log(await response.text())
                handleFetch(true)
                handleConfirmationDialog(true)
                onClose()
                
            }
            
            else
                onClose()
        }
        console.log(isDeleted)
    }


    return (
        <div 
            className={`
                fixed flex inset-0 justify-center items-center transition-colors 
                ${isOpen? "visible bg-black/30" : "invisible "}
            `}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
                    flex justify-center text-center w-2/3 lg:w-1/3 bg-white rounded-xl shadow-md 
                    ${isOpen ? "scale-100 opacity-100" : "scale-125 opacity-0"} 
                    p-6 transition-all dark:bg-slate-800 dark:text-white`}
            >
                <button
                        onClick={onClose} 
                        className={`
                            absolute top-2 right-1 px-2 py-1 rounded-md text-xl lg:text-3xl  
                            text-gray-700 hover:text-gray-900 hover:bg-gray-100 
                            hover:rounded-full dark:text-white hover:dark:bg-gray-600 
                        `}
                    >
                        <IoMdClose />
                </button>

                <div className='block mt-8 '>
                    <h1 className='text-lg lg:text-xl font-semibold m-2'>
                        {text}
                    </h1>
                    
                    <div className='flex justify-end pt-8 font-semibold'>
                        <button 
                            onClick={onClose}
                            className= {`
                                bg-blue-500 mx-3 text-white p-2 rounded-md
                                dark:bg-blue-600 dark:text-white`
                            }
                        >
                            Cancel
                        </button>

                        <div>
                            <button 
                                onClick={() => {handleDelete(item, username);}}
                                className='bg-red-500  text-white p-2 rounded-md dark:bg-red-600'
                            >
                                Delete
                            </button>
                            
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}
