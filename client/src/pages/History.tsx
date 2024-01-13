import React, {useState, useEffect} from 'react'
import { 
  BsClockFill
} from "react-icons/bs"
import { getHistory } from '../API/getHistory'
import { getUserInfoFromToken } from '../API/verifyToken'

interface HistoryObj {
  date: Date,
  query: string
}

const options = {day: '2-digit', month: 'short', year: 'numeric'}

export const History = () => {
    const user = getUserInfoFromToken()?.sub?.username
    const [historyList, setHistoryList] = useState<HistoryObj[]>([])
    const [isFetched, setIsFetched] = useState(false)

    useEffect(() => {
      if (isFetched === false) {
        handleFetchHistory()
        setIsFetched(true)
      }
    }, [historyList])

    const handleFetchHistory = async () => {
      if (!user)
        return

      const response = await getHistory(user)

      if (response) {
        const data = JSON.parse(await response.text())
        setHistoryList(data.history)
      }
    }

    const dateParser = (date: string) => {
      return date.slice(0, 22)
    }

    return (
      <div className='h-full text-xl bg-gray-50 dark:bg-slate-800 dark:text-white'>
          <div className='block pt-24'>
            <div className='flex'>
              <BsClockFill className='mt-1 dark:text-white'/>
              <h1 className='ml-2 font-bold'>History</h1>
            </div>

            <div className='w-2/3 mx-auto p-6 shadow-md rouned-lg bg-gray-50 dark:bg-gray-800'>
              <table className='w-full bg-gray-100 dark:bg-slate-700'>
                <thead>
                  <tr className='bg-gray-900 text-white' >
                    <th className='px-4 py-2'>
                      Title
                    </th>

                    <th className=' px-4 py2'>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.map((item, id) => (
                    <tr
                      key={id}
                      className={`${id % 2 ? 'bg-gray-300 dark:bg-slate-900' : ''} text-center`}
                    >
                      <td className='px-4 py-2'>
                        {item.query}
                      </td> 

                      <td className='px-4 py-2'>
                        {dateParser(item.date.toString())}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
    )
}
