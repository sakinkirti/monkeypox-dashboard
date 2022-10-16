import { Routes, Route } from 'react-router-dom'
import Map from './components/MapView'
import ChartView from './components/ChartView'
import Navbar from './components/Navbar'
import { Container } from '@chakra-ui/react'

const Home = () => {
  return (
    <Container minWidth='full' minHeight='full' p={0}>
      <Map.Legend />
      <Map.MapView />
      <Map.StatesDataTable />
    </Container>
  )
}

const App = () => {
  return (
    <Container minWidth='full' minHeight='full' p={0}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chartsview" element={<ChartView />} />
      </Routes>
    </Container>
  )
}

export default App