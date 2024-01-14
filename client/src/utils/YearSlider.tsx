import React, {useState, useEffect} from 'react'
import '../styles/sliderStyle.css'
interface Props {
    min: number
    max: number
    name: string
    forid: string
    setAge: (from: number, to: number) => void
    onClose: () => void
}

export const YearSlider: React.FC<Props> = ({min, max, name, forid, setAge, onClose}) => {
    const [inputFrom, setInputFrom] = useState(min)
    const [inputTo, setInputTo] = useState(max)

    useEffect(() => {
        const display = document.getElementById(forid)
        const slider = document.getElementById(`slider-${forid}`)
    
        if (inputFrom > inputTo) {
          if (display) 
            display.innerHTML = `${inputTo - inputFrom}`
          if (slider) {
            slider.style.right = `${100 - (inputFrom - min) / (max - min) * 100}%`
            slider.style.left = `${(inputTo - min) / (max - min) * 100}%`
          }
        } 
        else {
            if (display) 
                display.innerHTML = `${inputFrom} - ${inputTo}`
            if (slider) {
                slider.style.right = `${100 - (inputTo - min) / (max - min) * 100}%`
                slider.style.left = `${(inputFrom - min) / (max - min) * 100}%`
          }
        }
    }, [inputFrom, inputTo, min, max, name, forid])
    

    const handleValueMin = (value: number) => {
        const newInputFrom = Math.min(Math.max(value, min), max)
        setInputFrom(newInputFrom)
    }

    const handleValueMax = (value: number) => {
        const newInputTo = Math.min(Math.max(value, min), max)
        setInputTo(newInputTo)
    }

    return (
         <div className={`${name}`}>
            <div className='flex w-full justify-between'>
                <div className='my-4 flex'>
                    <label 
                        htmlFor="start-year"
                        className='text-gray-800 dark:text-white font-semibold'
                    >
                        Start year
                        <input 
                            type="number" 
                            id='start-year'
                            name='start-year'
                            value={inputFrom}
                            onChange={(e) => handleValueMin(parseInt(e.target.value))}
                            className='pl-2 mx-2 mb-8 w-1/3 rounded-md border border-black dark:border-0 dark:text-black'
                        />
                    </label>
                </div>

                <div className='flex my-4'>
                    <label 
                        htmlFor="end-year"
                        className='flex justify-end text-gray-800 dark:text-white font-semibold'
                    >
                        End year
                        <input 
                            type="number"
                            id='end-year'
                            name='end-year' 
                            value={inputTo}
                            onChange={(e) => handleValueMax(parseInt(e.target.value))}
                            className='pl-2 mx-2 mb-8 w-1/3 border rounded-md  border-black dark:border-0 dark:text-black'
                        />
                    </label>
                </div>
            </div>

            <div className='range-slider'>
                <span 
                    className='range-selected'
                    id={`slider-${forid}`}
                >
                </span>
            </div>

            <div className='range-input'>
                <input 
                    type="range"
                    min={min}
                    max={max}
                    step={1}
                    value={inputFrom}
                    onChange={(e) => setInputFrom(parseInt(e.target.value))}
                />

                <input 
                    type="range"
                    min={min}
                    max={max}
                    step={1}
                    value={inputTo}
                    onChange={(e) => setInputTo(parseInt(e.target.value))}
                />
            </div>

            <p className='mt-8 text-lg text-black text-center dark:text-white'>
                Selected range of years
                <span className='font-semibold mx-2'>
                    {`${inputFrom} - ${inputTo}`}
                </span>
            </p>

           <div className='flex justify-end text-end items-end'>
            <button
                    onClick={() => {setAge(inputFrom, inputTo); onClose()}}
                    className='flex text-md font-semibold mt-6 p-2 rounded-md shadow-lg bg-blue-500 dark:bg-blue-600 hover:dark:bg-indigo-700'
                >
                    Confirm
                </button>
           </div>
         </div>
    )
}
