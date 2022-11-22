import casesService from '../services/cases'
import { React, useState, useEffect } from 'react'
import {
    Box,
    Heading,
    Table,
    Tbody,
    Tr,
    Td,
    Text,
    Input
} from '@chakra-ui/react'

const CasesTable = ({ top, setState, view, setMarkerIndex }) => {
    const [stateFlags, setStateFlags] = useState([])
    const [statesData, setStatesData] = useState([])
    const [filter, setFilter] = useState('')
    const [filteredStates, setFilteredStates] = useState([])

    useEffect(() => {
        casesService.getCumulativeCounts().then(data => {
            var id = 0
            const reformatted = data.map(state => ({ ...state, id: id++ })).sort((a, b) => {
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

    useEffect(() => {
        if (filter) {
            const regex = new RegExp(filter, 'i');
            const filtered = () =>
                statesData.filter(state =>
                    state.name.match(regex)
                )
            setFilteredStates(filtered)
        }
    }, [filter, statesData])

    return (
        <Box
            position='absolute'
            top={top}
            p={4}
            bg='rgba(250,250,250,0.8)'
            color='black'
            zIndex={15}
            display={['none', 'none', 'block', 'block']}
        >
            <Heading fontSize={20} pb={5} textAlign='center'>States By Confirmed Cases</Heading>
            <Input placeholder="Search for a state" mb={4} value={filter} onChange={(e) => setFilter(e.target.value)} />
            {(filteredStates.length === 0 && filter.length !== 0)
                ? <Text fontSize={16}>No matching state found.</Text>
                : <Box overflowY="auto" maxHeight="300px" maxWidth='300px'>
                    <Table variant="simple">
                        <Tbody maxWidth='full' fontSize={16}>
                            {((filteredStates.length !== 0 && filter.length !== 0)
                                ? filteredStates
                                : statesData).map((state => {
                                    const flagUrl = stateFlags?.find(stateFlag => stateFlag.name === state.name)?.flag
                                    return (
                                        <Tr
                                            key={state.name}
                                            onClick={(e) => {
                                                if (view === "Chart") {
                                                    setState(state.name)
                                                } else if (view === "Map") {
                                                    setMarkerIndex(state.id)
                                                }
                                            }}
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
                                }))
                            }
                        </Tbody>
                    </Table>
                </Box>
            }
        </Box>
    )
}

const USTable = ({ top }) => {
    const [cases, setCases] = useState(null)

    useEffect(() => {
        casesService.getUSTotalCases().then(data => {
            setCases(data)
        })
    }, [])

    return (
        <Box
            position='absolute'
            top={top}
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