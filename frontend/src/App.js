import { Routes, Route } from 'react-router-dom'
import Map from './components/MapView'
import ChartView from './components/ChartView'
import Navbar from './components/Navbar'
import Cases from './components/CasesTable'
import PredictiveStatTable from './components/PredictiveStatTable'
import { Container, Flex, VStack } from '@chakra-ui/react'
import React from 'react'

const Home = () => {
  return (
    <Container minWidth='full' minHeight='full' p={0}>
      <Map.Legend top={'35%'} right={'3%'} />
      <Map.MapView />
      <Container
        p={0}
        ml={16}
        zIndex={20}
        display={['none', 'none', 'block', 'block']}
        maxWidth={'300px'}
        centerContent
      >
        <VStack>
          <Cases.CasesTable top={'35%'} />
          <Cases.USTable top={'20%'} />
        </VStack>
      </Container>
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