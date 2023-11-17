import React, {useState} from 'react';
import './index.css'
import Sidebar from './Components/Sidebar'
import Navbar from './Components/Navbar'

function App() {

  const [isToggleStateSidebar, setToggleStateSidebar] = useState<boolean>(true)

  const toggleStateSidebar = () => {
    setToggleStateSidebar(!isToggleStateSidebar)
  }

  return (
    <div className="App block">
      {/* Pass the function to the navbar component in order to change the state of the sidebar*/}
      <Navbar toggleSidebar={toggleStateSidebar}/>
      <div className='flex justify-between'>
        <Sidebar isVisible={isToggleStateSidebar}/>
      </div>
      
    </div>
  );
}

export default App
