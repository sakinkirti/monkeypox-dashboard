import React from 'react'
import {
    Stat,
    StatLabel,
    StatNumber,
    StatArrow,
    StatGroup,
    VStack,
    Flex,
    Heading
} from '@chakra-ui/react'

const PredictiveStatTable = (props) => {
    // need to fetch increase or decrease from backend
    // need to fetch amount of inrease or decrease
    // need to know if fetching for nationwide or statewide

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
                                <StatArrow type={'increase'} />
                                1.2%
                            </StatNumber>
                        </Flex>

                    </Stat>
                    <Stat>
                        <StatLabel whiteSpace='nowrap' color='gray.600'>Incidence Rate</StatLabel>
                        <Flex justifyContent='center'>
                            <StatNumber>
                                <StatArrow type={'decrease'} />
                                0.5%
                            </StatNumber>
                        </Flex>

                    </Stat>
                    <Stat>
                        <StatLabel whiteSpace='nowrap' color='gray.600'>Case-fatality Ratio</StatLabel>
                        <Flex justifyContent='center'>
                            <StatNumber>
                                <StatArrow type={'increase'} />
                                0.9%
                            </StatNumber>
                        </Flex>
                    </Stat>
                </Flex>
            </StatGroup>
        </VStack>
    )
}

export default PredictiveStatTable