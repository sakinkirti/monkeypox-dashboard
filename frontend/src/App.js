import { Routes, Route } from 'react-router-dom'
import Map from './components/MapView'
import ChartView from './components/ChartView'
import Navbar from './components/Navbar'
import CasesTable from './components/CasesTable'
import PredictiveStatTable from './components/PredictiveStatTable'
import { Container, Flex } from '@chakra-ui/react'

const Home = () => {
  return (
    <Container minWidth='full' minHeight='full' p={0}>
      <Map.Legend top={'35%'} right={'3%'} />
      <Map.MapView />
      <CasesTable top={'30%'} left={'3%'} />
      <Flex minWidth='full' minHeight='full' p={0} justifyContent='center'>
        <PredictiveStatTable
          bottom={'3%'}
          zIndex={10}
          heading={'National Predictive Statistics Changes For Next Week'}
        />
      </Flex>

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