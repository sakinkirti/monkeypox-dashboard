import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet'
import casesService from '../services/cases'
import { useState, useEffect } from 'react'
import {
    Box,
    Text,
    Icon,
    List,
    ListItem,
    HStack,
    Heading,
    Table,
    Tbody,
    Tr,
    Td,
} from '@chakra-ui/react'

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
            zoomDelta={0.5}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON key={statesData} data={statesData} style={style} />
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
        density > 500 ? '#0E6495' :
            density > 100 ? '#399BC6' :
                density > 50 ? '#5BD4C0' :
                    density > 10 ? '#ACF5E9' :
                        density > 0 ? '#EBFCF9' :
                            '#FFFFFF'
    )
}

// 1 to 10, 11 to 50, 51 to 100, 101 to 500, and >500
const Legend = () => {
    return (
        <Box
            position='absolute'
            top='35%'
            right='3%'
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
                        <Text>11-50</Text>
                    </HStack>
                </ListItem>
                <ListItem>
                    <HStack>
                        <CircleIcon boxSize={4} color='#5BD4C0' />
                        <Text>51-100</Text>
                    </HStack>
                </ListItem>
                <ListItem>
                    <HStack>
                        <CircleIcon boxSize={4} color='#399BC6' />
                        <Text>101-00</Text>
                    </HStack>
                </ListItem>
                <ListItem>
                    <HStack>
                        <CircleIcon boxSize={4} color='#0E6495' />
                        <Text>{'>'}500</Text>
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

const StatesDataTable = () => {
    const [stateFlags, setStateFlags] = useState([])
    const [statesData, setStatesData] = useState([])
    useEffect(() => {
        casesService.getStateCases().then(data => {
            const reformatted = data.features.map(state => {
                return ({ name: state.properties.name, density: state.properties.density })
            }).sort((a, b) => {
                return b.density - a.density
            }).filter(state => state.name !== 'District of Columbia' && state.name !== 'Puerto Rico')
            setStatesData(reformatted)
        })
    }, [])

    useEffect(() => {
        casesService.getStateFlags().then(data => {
            const flags = data.map(state => {
                return ({name: state.state, flag: state.state_flag_url})
            })
            setStateFlags(flags)
        })
    }, [])

    return (
        <Box
            position='absolute'
            top='30%'
            left='3%'
            alignContent='center'
            p={4}
            bg='rgba(250,250,250,0.8)'
            color='black'
            zIndex={15}
            display={['none', 'none', 'block', 'block']}
        >
            <Heading fontSize={20} pb={5} textAlign='center'>States By Confirmed Cases</Heading>
            <Box overflowY="auto" maxHeight="300px" maxWidth='300px'>
                <Table variant="simple">
                    <Tbody maxWidth='full' fontSize={14}>
                        {statesData.map((state => {
                            const flagUrl = stateFlags.find(stateFlag => stateFlag.name === state.name).flag
                            return (
                                <Tr key={state.name}>
                                    <Td p={0}>
                                        <img 
                                            src={flagUrl}
                                            alt={state.name}
                                        />
                                    </Td>
                                    <Td>{state.name}</Td>
                                    <Td>{state.density}</Td>
                                </Tr>
                            )
                        }))}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    )
}

const Map = { MapView, Legend, StatesDataTable }
export default Map