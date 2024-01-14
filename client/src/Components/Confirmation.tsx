import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Props {
    value: boolean
}

const notify = () => {
    toast.info('Item removed successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    })
}

const Confirmation: React.FC<Props> = ({value}) => {
    useEffect(() => {
        if (value === true) {
            notify()
            console.log("toast")
        }
    }, [value])
  return (
    <div>
        <ToastContainer />
    </div>
  )
}

export {Confirmation}
