
import './index.css'
import { ping } from '@/utils/test'

function App() {


  return (
    <>
      <h1 className='text-red-500 text-5xl'>Hello World</h1>
      <h2 className="text-5xl text-red-500 font-bold">{ping()}</h2>
    </>
  )
}

export default App
