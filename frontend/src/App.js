import { Routes, Route } from 'react-router-dom'
import Map from './components/MapView'
import ChartView from './components/ChartView'
import Navbar from './components/Navbar'
import { Container, Flex } from '@chakra-ui/react'

const Home = () => {
  return (
    <Flex justify='space-between' minWidth='full' minHeight='full' flex="1" p={0}>
      <Map.MapView />
      <Map.Legend />
    </Flex>
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