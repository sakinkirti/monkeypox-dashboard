import { Routes, Route } from 'react-router-dom'
import MapView from './components/MapView';
import Navbar from './components/Navbar';
import { Container } from '@chakra-ui/react';

const App = () => {
  return (
    <Container minWidth='full' minHeight='full' p={0}>
      <Navbar />
      <Routes>
        <Route path="/" element={<MapView />} />
      </Routes>
    </Container>
  )
}

export default App