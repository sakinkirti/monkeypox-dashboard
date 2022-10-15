import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import casesService from '../services/cases'
import { useState, useEffect } from 'react'

const style = (props) => {
    return {
        fillColor: getColor(props.properties.density),
        weight: 2,
        opacity: 1,
        color: 'black',
        dashArray: '3',
        fillOpacity: 0.7
    }
}

const getColor = (density) => {
    return (
        density > 500 ? '#0E6495' :
        density > 100 ? '#399BC6' :
        density > 50 ? '#5BD4C0' :
        density > 10 ? '#ACF5E9' :
        density > 0 ? '#EBFCF9' :
        '#FFFFFF'
    )
}

const MapView = () => {
    const [statesData, setStatesData] = useState([])
    useEffect(() => {
        casesService.getStateCases().then(data =>
            setStatesData(data)
        )  
    }, [])

    return (
        <MapContainer
            style={{ height: "100vh", minWidth: "100%", zIndex: '1' }}
            center={[39.8283, -98.5795]} zoom={4}
            minZoom={4}
            maxZoom={10}
            zoomControl={false}
            zoomSnap={0.5}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON key={statesData} data={statesData} style={style} />
        </MapContainer>
    )
}

export default MapView