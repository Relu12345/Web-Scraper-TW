import React from 'react'
import { IoMdClose } from "react-icons/io"
import {YearSlider} from '../utils/YearSlider'

interface Props {
    open: boolean,
    onClose: () => void,
    setAge: (from: number, to: number) => void
}

const currentYear = new Date().getFullYear()

export const Filters: React.FC<Props> = ({open, onClose, setAge}) => {

    return (
        <div
            className={`
                fixed flex inset-0 justify-center items-center transition-colors 
                ${open? "visible bg-black/30" : "invisible "}
            `}
        >
            <div
                onClick={(e) => e.stopPropagation()} 
                className={`
                    w-2/5  bg-white rounded-xl shawod-md 
                    ${open? "scale-100 opacity-100" : "scale-125 opacity-0"} 
                    p-6 transition-all dark:bg-slate-800 dark:text-white`
                }>
                
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

                <div className="flex items-center justify-center">
                    <div className="w-full p-8 text-white">
                        <h1 className="text-2xl font-bold mb-4 text-center">
                            Filter years
                        </h1>

                        <YearSlider
                            min={1900}
                            max={currentYear}
                            name='SB-1'
                            forid='display1'
                            setAge={setAge}
                            onClose={onClose}
                        />
                    </div>
                </div> 
            </div>
        </div>
     )
}
