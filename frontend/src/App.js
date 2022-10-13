import { Routes, Route } from 'react-router-dom'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

const Home = () => {
  return (
    <MapContainer style={{ height: "98vh", width: "100%" }} center={[39.8283, -98.5795]} zoom={5} minZoom={4} maxZoom={10} zoomSnap={0.5} zoomDelta={0.5} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
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
