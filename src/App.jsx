import React from 'react'
import Route from "./routes/Route"
import Navbar from './components/Navbar/Navbar'
import LocomotiveScroll from 'locomotive-scroll';



const App = () => {
  const locomotiveScroll = new LocomotiveScroll();
  return (
    <>
    <Navbar />
    <Route />
    </>
  )
}

export default App
