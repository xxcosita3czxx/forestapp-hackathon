import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './home'
import Chat from './chat'


export default function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}


