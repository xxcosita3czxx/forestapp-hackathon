import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChooseGame from './chooseGame'
import Index from './index'
import Game from './Game'


export default function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}


