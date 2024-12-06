import { useNavigate } from 'react-router-dom'

export default function Index() {
  const navigate = useNavigate()
  return <div>
    <h1>hello world</h1>
    <p>this is the index page</p>
  </div>
}

