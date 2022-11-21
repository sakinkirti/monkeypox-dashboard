import casesService from '../services/cases'
import { React, useState, useEffect } from 'react'
import {
    Box,
    Heading,
    Table,
    Tbody,
    Tr,
    Td,
    Text
} from '@chakra-ui/react'

const CasesTable = (props) => {
    const [stateFlags, setStateFlags] = useState([])
    const [statesData, setStatesData] = useState([])

    useEffect(() => {
        casesService.getCumulativeCounts().then(data => {
            const reformatted = data.sort((a, b) => {
                return b.cumulative_cases - a.cumulative_cases
            })
            setStatesData(reformatted)
        })
    }, [])

    useEffect(() => {
        casesService.getStateFlags().then(data => {
            const flags = data.map(state => {
                return ({ name: state.state, flag: state.state_flag_url })
            })
            setStateFlags(flags)
        })
    }, [])

    return (
        <Box
            position='absolute'
            top={props.top}
            p={4}
            bg='rgba(250,250,250,0.8)'
            color='black'
            zIndex={15}
            display={['none', 'none', 'block', 'block']}
        >
            <Heading fontSize={20} pb={5} textAlign='center'>States By Confirmed Cases</Heading>
            <Box overflowY="auto" maxHeight="300px" maxWidth='300px'>
                <Table variant="simple">
                    <Tbody maxWidth='full' fontSize={16}>
                        {statesData.map((state => {
                            const flagUrl = stateFlags?.find(stateFlag => stateFlag.name === state.name)?.flag
                            return (
                                <Tr
                                    key={state.name}
                                    onClick={() => props.setState(state.name)}
                                    cursor='pointer'
                                    _hover={{ bg: "gray.200" }}
                                    _active={{ bg: "gray.100" }}
                                    fontWeight={14}
                                >
                                    <Td p={2}>
                                        <img
                                            src={flagUrl}
                                            alt={state.name}
                                        />
                                    </Td>
                                    <Td p={4} whiteSpace='nowrap'>{state.name}</Td>
                                    <Td p={4}>{state.cumulative_cases}</Td>
                                </Tr>
                            )
                        }))}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    )
}

const USTable = (props) => {
    const [cases, setCases] = useState(null)

    useEffect(() => {
        casesService.getUSTotalCases().then(data => {
            setCases(data)
        })
    }, [])

    return (
        <Box
            position='absolute'
            top={props.top}
            p={4}
            bg='rgba(250,250,250,0.8)'
            color='black'
            zIndex={15}
            display={['none', 'none', 'block', 'block']}
        >
            <Heading fontSize={20} pb={5} textAlign='center' as='b'>U.S. Total Confirmed Cases</Heading>
            <Text fontSize={20} textAlign='center'>{cases}</Text>
        </Box>
    )
}

const Cases = { CasesTable, USTable }
export default Cases