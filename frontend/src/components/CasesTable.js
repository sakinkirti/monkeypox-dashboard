import casesService from '../services/cases'
import { React, useState, useEffect } from 'react'
import {
    Box,
    Heading,
    Table,
    Tbody,
    Tr,
    Td
} from '@chakra-ui/react'

const CasesTable = (positions) => {
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
            top={positions.top}
            left={positions.left}
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

export default CasesTable