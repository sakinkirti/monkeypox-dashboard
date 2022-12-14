import { React, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Map from './components/MapView'
import ChartView from './components/ChartView'
import Navbar from './components/Navbar'
import Cases from './components/CasesTable'
import PredictiveStatTable from './components/PredictiveStatTable'
import Help from './components/Help'
import { Container, VStack } from '@chakra-ui/react'

const Home = () => {
  const [markerIndex, setMarkerIndex] = useState()

  return (
    <Container minWidth='full' minHeight='full' p={0}>
      <Map.Legend top={'35%'} right={'2%'} />
      <Map.MapView markerIndex={markerIndex} />
      <Container
        p={0}
        ml={12}
        zIndex={20}
        display={['none', 'none', 'block', 'block']}
        maxWidth={'300px'}
        centerContent
      >
        <VStack>
          <Cases.CasesTable top={'35%'} view={'Map'} setMarkerIndex={setMarkerIndex} />
          <Cases.USTable top={'20%'} />
        </VStack>
      </Container>
      <PredictiveStatTable
        bottom={'3%'}
        right={'50%'}
        mr={'7'}
        zIndex={10}
        heading={'National Public Health Statistics For Today'}
        type={'current'}
      />
      <PredictiveStatTable
        bottom={'3%'}
        left={'50%'}
        ml={'7'}
        zIndex={10}
        heading={'National Predictive Statistics For Next Week'}
        type={'Predictive'}
      />
    </Container>
  )
}

const Chart = () => {
  const [state, setState] = useState('United States')
  const [chartType, setChartType] = useState('Cumulative')

  return (
    <Container minWidth='full' minHeight='full' p={0}>
      <Container
        p={0}
        ml={8}
        zIndex={20}
        display={['none', 'none', 'none', 'flex']}
        maxWidth={'300px'}
        centerContent
      >
        <Cases.CasesTable top={'30%'} setState={setState} view={'Chart'} />
      </Container>
      <Container
        p={0}
        ml={8}
        zIndex={20}
        display={['none', 'none', 'none', 'flex']}
        maxWidth={'300px'}
        centerContent
      >
        <Cases.USTable top={'45%'} right={'2%'} setState={setState} view={'Chart'} />
      </Container>
      <ChartView state={state} chartType={chartType} setChartType={setChartType} />
    </Container>
  )
}

const App = () => {
  return (
    <Container minWidth='full' minHeight='full' p={0}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/charts" element={<Chart />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Container>
  )
}

export default App