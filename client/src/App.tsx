import React, {useState} from 'react';
import './index.css'
import Sidebar from './Components/Sidebar'
import Login from './Authentication/Login';
import Navbar from './Components/Navbar'

function App() {

  const [isToggleStateSidebar, setToggleStateSidebar] = useState<boolean>(true)

  const toggleStateSidebar = () => {
    setToggleStateSidebar(!isToggleStateSidebar)
  }

  return (
    <div className="App block">
      {<><Navbar toggleSidebar={toggleStateSidebar} /><div className='flex justify-between'>
        <Sidebar isVisible={isToggleStateSidebar} />
      </div></>
  }
  <Login />
      
    </div>
  );
}

export default App
