import React from 'react'

const uploadDate = [
    {
        id: 0,
        text: 'This week',
    },
    {
        id: 1,
        text: 'This month',
    },
    {
        id: 2,
        text: 'This year',
    }
]

export const Filters: React.FC = () => {
  return (
    <div className='absolute flex right-40 mt-2 py-6 px-2 w-6/12 shadow-lg bg-white border border-gray-500 dark:border-0 rounded-md shadow-lg z-10 shadow-lg dark:bg-slate-900 dark:text-white dark:border-slate-700'>
        <div className='w-1/2'>
            <h1>Sort by</h1>
            <ul>
                
            </ul>
        </div>

        <div className='w-1/2'>
            <h1 className='text-lg font-bold mb-4'>Upload date</h1>
            <ul>
                {uploadDate.map((date, i) => {
                    return (
                        <div className='my-2 text-lg hover:dark:text-blue-500 cursor-pointer dark:text-white'>
                            <li key={i}>{date.text}</li>
                        </div>
                    )
                })}
            </ul>
        </div>
    </div>
  )
}
