import { React, useState, useEffect } from 'react'
import {
    Stat,
    StatLabel,
    StatNumber,
    // StatArrow,
    StatGroup,
    VStack,
    Flex,
    Heading
} from '@chakra-ui/react'
// import { MinusIcon } from '@chakra-ui/icons'
import predictionService from '../services/predictionFetch'

const PredictiveStatTable = (props) => {
    // need to fetch increase or decrease from backend
    // need to fetch amount of inrease or decrease
    // need to know if fetching for nationwide or statewide
    const [stats, setStats] = useState([])

    useEffect(() => {
        predictionService.getStatsChanges().then(data => {
            setStats(data[data.length - 1])
        })
    }, [])

    return (
        <VStack
            position='absolute'
            bottom={props.bottom}
            left={props.left}
            right={props.right}
            zIndex={props.zIndex}
            p={4}
            bg='rgba(250,250,250,0.8)'
            color='black'
            display={['none', 'none', 'none', 'flex']}
        >
            <Heading size='sm'>{props.heading}</Heading>
            <StatGroup>
                <Flex justifyContent="space-between" flex="1" gap={4}>
                    <Stat>
                        <StatLabel whiteSpace='nowrap' color='gray.600'>Prevalence Rate</StatLabel>
                        <Flex justifyContent='center'>
                            <StatNumber>
                                {/* {stats[0] == 0.00 ? <MinusIcon w={6} h={6} color='gray.400' p={1} /> :
                                    <StatArrow type={stats[0] > 0 ? 'increase' : 'decrease'} />} */}
                                {stats[0]}
                            </StatNumber>
                        </Flex>
                    </Stat>
                    <Stat>
                        <StatLabel whiteSpace='nowrap' color='gray.600'>Incidence Rate</StatLabel>
                        <Flex justifyContent='center'>
                            <StatNumber>
                                {/* {stats[1] == 0.00 ? <MinusIcon w={6} h={6} color='gray.400' p={1} /> :
                                    <StatArrow type={stats[1] > 0 ? 'increase' : 'decrease'} />} */}
                                {stats[1]}
                            </StatNumber>
                        </Flex>
                    </Stat>
                    <Stat>
                        <StatLabel whiteSpace='nowrap' color='gray.600'>Case-fatality Ratio</StatLabel>
                        <Flex justifyContent='center'>
                            <StatNumber>
                                {/* {stats[2] == 0.00 ? <MinusIcon w={6} h={6} color='gray.400' p={1} /> :
                                    <StatArrow type={stats[1] > 0 ? 'increase' : 'decrease'} />} */}
                                {stats[2]}
                            </StatNumber>
                        </Flex>
                    </Stat>
                </Flex>
            </StatGroup>
        </VStack>
    )
}

export default PredictiveStatTable