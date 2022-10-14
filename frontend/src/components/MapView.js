import { MapContainer, TileLayer } from 'react-leaflet'

const MapView = () => {
    return (
        <MapContainer style={{ height: "100vh", minWidth: "100%", zIndex: '1'}} center={[39.8283, -98.5795]} zoom={4} minZoom={4} maxZoom={10} zoomControl={false} zoomSnap={0.5} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    )
}

export default MapView