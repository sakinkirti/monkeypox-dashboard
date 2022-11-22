import { MapContainer, TileLayer, GeoJSON, ZoomControl, Popup, CircleMarker, useMap } from 'react-leaflet'
import { React, useState, useEffect, useRef } from 'react'
import casesService from '../services/cases'
import {
    Box,
    Text,
    Icon,
    List,
    ListItem,
    HStack
} from '@chakra-ui/react'
import { LineChart, ResponsiveContainer, XAxis, YAxis, Line } from 'recharts'

const coords = [
    { lat: 32.318231, lng: -86.902298 }, // Alabama
    { lat: 63.588753, lng: -154.493062 }, // Alaska
    { lat: 34.048928, lng: -111.093731 }, // Arizona
    { lat: 35.20105, lng: -91.831833 }, // Arkansas
    { lat: 36.778261, lng: -119.417932 }, // California
    { lat: 39.550051, lng: -105.782067 }, // Colorado
    { lat: 41.603221, lng: -73.087749 }, // Connecticut
    { lat: 38.910832, lng: -75.52767 }, // Delaware
    { lat: 27.664827, lng: -81.515754 }, // Florida
    { lat: 32.157435, lng: -82.907123 }, // Georgia
    { lat: 19.898682, lng: -155.665857 }, // Hawaii
    { lat: 44.068202, lng: -114.742041 }, // Idaho
    { lat: 40.633125, lng: -89.398528 }, // Illinois
    { lat: 40.551217, lng: -85.602364 }, // Indiana
    { lat: 41.878003, lng: -93.097702 }, // Iowa
    { lat: 39.011902, lng: -98.484246 }, // Kansas
    { lat: 37.839333, lng: -84.270018 }, // Kentucky
    { lat: 31.244823, lng: -92.145024 }, // Louisana
    { lat: 45.253783, lng: -69.445469 }, // Maine
    { lat: 39.045755, lng: -76.641271 }, // Maryland
    { lat: 42.407211, lng: -71.382437 }, // Massachusetts
    { lat: 44.314844, lng: -85.602364 }, // Michigan
    { lat: 46.729553, lng: -94.6859 }, // Minnesota
    { lat: 32.354668, lng: -89.398528 }, // Mississippi
    { lat: 37.964253, lng: -91.831833 }, // Missouri
    { lat: 46.879682, lng: -110.362566 }, // Montana
    { lat: 41.492537, lng: -99.901813 }, // Nebraska
    { lat: 38.80261, lng: -116.419389 }, // Nevada
    { lat: 43.193852, lng: -71.572395 }, // New Hampshire
    { lat: 40.058324, lng: -74.405661 }, // New Jersey
    { lat: 34.97273, lng: -105.032363 }, // New Mexico
    { lat: 43.299428, lng: -74.217933 }, // New York
    { lat: 35.759573, lng: -79.0193 }, // North Carolina
    { lat: 47.551493, lng: -101.002012 }, // North Dakota
    { lat: 40.417287, lng: -82.907123 }, // Ohio
    { lat: 35.007752, lng: -97.092877 }, // Oklahoma
    { lat: 43.804133, lng: -120.554201 }, // Oregon
    { lat: 41.203322, lng: -77.194525 }, // Pennsylvania
    { lat: 41.580095, lng: -71.477429 }, // Rhode Island
    { lat: 33.836081, lng: -81.163725 }, // South Carolina
    { lat: 43.969515, lng: -99.901813 }, // South Dakota
    { lat: 35.517491, lng: -86.580447 }, // Tennessee
    { lat: 31.968599, lng: -99.901813 }, // Texas
    { lat: 39.32098, lng: -111.093731 }, // Utah
    { lat: 44.558803, lng: -72.577841 }, // Vermont
    { lat: 37.431573, lng: -78.656894 }, // Virginia
    { lat: 47.751074, lng: -120.740139 }, // Washington
    { lat: 38.597626, lng: -80.454903 }, // West Virginia
    { lat: 43.78444, lng: -88.787868 }, // Wisconsin
    { lat: 43.075968, lng: -107.290284 } // Wyoming
]

const MapHook = ({ positions }) => {
    const map = useMap()
    if (positions) {
        map.flyTo(positions, 5)
    }
    return null
}

const MapView = ({ markerIndex }) => {
    const [geoJSONData, setGeoJSONData] = useState([])
    const [casesData, setCasesData] = useState([])
    const [refsLoadingDone, setRefsLoadingDone] = useState(false)
    const markerRefs = useRef({})
    const [markerPositions, setMarkerPositions] = useState(null)

    useEffect(() => {
        casesService.getAllStateCases().then(res => {
            setCasesData(res)
        })
    }, [])

    useEffect(() => {
        casesService.getMapGeoJSON().then(data => {
            setGeoJSONData(data)
        })
    }, [])

    useEffect(() => {
        if (markerIndex && refsLoadingDone) {
            const markerToOpen = markerRefs.current[markerIndex]
            setMarkerPositions(markerToOpen._latlng)
            markerToOpen.openPopup()
        }
    }, [markerIndex, refsLoadingDone])

    return (
        <MapContainer
            style={{ height: "100vh", minWidth: "100%", zIndex: '1' }}
            center={[39.8283, -98.5795]}
            zoom={4}
            minZoom={2}
            maxZoom={10}
            zoomControl={false}
            zoomSnap={0.75}
            zoomDelta={0.75}
            scrollWheelZoom={true}
            maxBounds={[[-5, -260], [75, 40]]}
            maxBoundsViscoity={1}
        >
            <MapHook positions={markerPositions} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {coords?.map(({ lat, lng }, index) => (
                <CircleMarker
                    ref={(marker) => {
                        markerRefs.current[index] = marker;
                        if (index === coords.length - 1 && !refsLoadingDone) {
                            setRefsLoadingDone(true);
                        }
                    }}
                    center={[lat, lng]}
                    radius={4}
                    pathOptions={{ color: '#e07a5f', weight: 1 }}
                    id={index}
                    key={index}
                    zIndex={50}
                    pane="markerPane"
                    eventHandlers={{ click: () => setMarkerPositions(markerRefs.current[index]._latlng) }}
                >
                    <Popup>
                        Total Confirmed Case Count: {casesData[index]?.state}
                        <ResponsiveContainer position='absolute' minHeight="20vh" width="100%" zIndex={25}>
                            <LineChart
                                data={casesData[index]?.cases}
                                margin={{ top: 20, right: 50, bottom: 5 }}
                            >
                                <XAxis dataKey="date" interval="preserveStartEnd" />
                                <YAxis dataKey="num_cases" />
                                <Line
                                    name="Total Confirmed Case Count"
                                    type="monotone"
                                    dataKey="num_cases"
                                    stroke="#0E6495"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Popup>
                </CircleMarker>
            ))}
            <GeoJSON
                key={geoJSONData}
                data={geoJSONData}
                style={style}
            />
            <ZoomControl position='bottomright' />
        </MapContainer>
    )
}

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
        density > 1000 ? '#0E6495' :
            density > 500 ? '#399BC6' :
                density > 100 ? '#5BD4C0' :
                    density > 10 ? '#ACF5E9' :
                        density > 0 ? '#EBFCF9' :
                            '#FFFFFF'
    )
}

const Legend = (positions) => {
    return (
        <Box
            position='absolute'
            top={positions.top}
            right={positions.right}
            alignItems='center'
            bg='rgba(250,250,250,0.8)'
            color='black'
            zIndex={15}
            p={15}
            display={['none', 'none', 'block', 'block']}
        >
            <Text as='b'>
                Confirmed Cases
            </Text>
            <List spacing={3} pt={2}>
                <ListItem>
                    <HStack>
                        <CircleIcon boxSize={4} color='#EBFCF9' />
                        <Text>1-10</Text>
                    </HStack>
                </ListItem>
                <ListItem>
                    <HStack>
                        <CircleIcon boxSize={4} color='#ACF5E9' />
                        <Text>11-100</Text>
                    </HStack>
                </ListItem>
                <ListItem>
                    <HStack>
                        <CircleIcon boxSize={4} color='#5BD4C0' />
                        <Text>101-500</Text>
                    </HStack>
                </ListItem>
                <ListItem>
                    <HStack>
                        <CircleIcon boxSize={4} color='#399BC6' />
                        <Text>501-1000</Text>
                    </HStack>
                </ListItem>
                <ListItem>
                    <HStack>
                        <CircleIcon boxSize={4} color='#0E6495' />
                        <Text>{'>'}1000</Text>
                    </HStack>
                </ListItem>
            </List>
        </Box>
    )
}

const CircleIcon = (props) => (
    <Icon viewBox='0 0 200 200' {...props}>
        <path
            fill='currentColor'
            d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
            stroke='black'
            strokeWidth={6}
        />
    </Icon>
)

const Map = { MapView, Legend }
export default Map