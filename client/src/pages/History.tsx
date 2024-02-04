import React, {useState, useEffect} from 'react'
import { 
  BsClockFill
} from "react-icons/bs"
import { useNavigate } from "react-router"
import { getHistory } from '../API/getHistory'
import { getUserInfoFromToken } from '../API/verifyToken'
import LoadingScreen from '../utils/LoadingScreen'
import { MdDelete } from "react-icons/md"
import { DeleteDialog } from '../Components/DeleteDialog'

interface HistoryObj {
  date: Date,
  query: string
}

interface Props {
  handleConfirmationDialog: (value: boolean) => void
  handleResearch: (value: string) => void
}

export const History: React.FC<Props> = ({handleConfirmationDialog, handleResearch}) => {
    const navigate=useNavigate()  
    const user = getUserInfoFromToken()?.sub?.username
    const [historyList, setHistoryList] = useState<HistoryObj[]>([])
    const [isFetched, setIsFetched] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedItem, setSlectedItem] = useState<HistoryObj | null>(null) 

    useEffect(() => {
      if (isFetched === false) {
        handleFetchHistory()
        setIsFetched(true)
      }
      setTimeout(() => {setIsLoading(false)}, 1500)
    }, [historyList, isFetched])

    const handleFetch = (value: boolean) => {
      setIsFetched(false)
    }

    const handleFetchHistory = async () => {
      if (!user)
        return

      const response = await getHistory(user)

      if (response) {
        const data = JSON.parse(await response.text())
        setHistoryList(data.history.reverse())
      }
    }

    const dateParser = (date: string) => {
      return date.slice(0, 22)
    }

    return (
      isLoading ? <LoadingScreen /> :
      <div className='h-full text-xl bg-gray-50 dark:bg-slate-800 dark:text-white'>
      <div className='block pt-24'>
        <div className='flex'>
          <BsClockFill className='mt-1 dark:text-white'/>
          <h1 className='ml-2 font-bold'>History</h1>
        </div>

        <div className='w-2/3 mx-auto p-6  rouned-lg bg-gray-50  dark:bg-gray-800'>
          <table className='w-full bg-gray-100 dark:bg-slate-700'>
            <thead>
              <tr className='bg-gray-900 text-white' >
                <th className='px-4 py-2'>
                  Title
                </th>

                <th className=' px-4 py-2'>
                  Date
                </th>

                <th className='text-center text-white px-4 py-2'>
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {historyList.map((item, id) => (
                <tr
                  key={id}
                  className={`${id % 2 ? 'bg-gray-300 dark:bg-slate-900' : ''} text-center `}
                >
                  <td 
                    className='px-4 py-2 cursor-pointer'
                    onClick={() => {handleResearch(historyList[id].query); navigate("/")}}
                  >
                    {item.query}
                  </td> 

                  <td className='px-4 py-2'>
                    {dateParser(item.date.toString())}
                  </td>

                  <td className='flex text-2xl text-center items-center justify-center px-4 py-2 text-red-500'>
                    <MdDelete 
                      onClick={() => {setIsDeleteOpen(true); setSlectedItem(historyList[id])}}
                      className='hover:bg-gray-400 hover:rounded-md cursor-pointer'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {
          isDeleteOpen && 
          <DeleteDialog 
            text={"Are you sure you want to delete this item from history ?"}
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            item={selectedItem}
            username={user}
            handleFetch={handleFetch}
            handleConfirmationDialog={handleConfirmationDialog}
          />
        }

      </div>
    </div>
    )
}
