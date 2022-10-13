import { Routes, Route } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      Testing
    </div>
  )
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App;
