import { React, useEffect, useState } from 'react'
import { LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, Legend, Label } from 'recharts'
import { Container, Text, Icon, HStack, Tabs, TabList, Tab, Heading } from '@chakra-ui/react'
import caseService from '../services/cases'

// const sampleData = [
//     { day: "Feb 19, 2022", cases: 0, PR: "0.4%", IR: "1.2%", CFR: "3.0%" },
//     { day: "Feb 20, 2022", cases: 102, PR: "0.4%", IR: "1.2%", CFR: "3.0%" },
//     { day: "Jun 21, 2022", cases: 121, PR: "0.1%", IR: "1.9%", CFR: "3.3%" },
//     { day: "Oct 22, 2022", cases: 132, PR: "0.9%", IR: "2.1%", CFR: "3.9%" },
//     { day: "Oct 23, 2022", cases: 132, PR: "0.8%", IR: "2.1%", CFR: "3.9%" },
//     { day: "Oct 24, 2022", cases: 134, PR: "0.7%", IR: "2.1%", CFR: "3.9%" },
//     { day: "Oct 25, 2022", cases: 135, PR: "0.6%", IR: "2.1%", CFR: "3.9%" },
//     { day: "Oct 26, 2022", cases: 135, PR: "0.5%", IR: "2.1%", CFR: "3.9%" },
//     { day: "Oct 27, 2022", cases: 137, PR: "0.4%", IR: "2.1%", CFR: "3.9%" },
//     { day: "Oct 28, 2022", cases: 138, PR: "0.3%", IR: "2.1%", CFR: "3.9%" },
//     { day: "Oct 29, 2022", cases: 140, PR: "0.2%", IR: "2.1%", CFR: "3.9%" },
//     { day: "Oct 30, 2022", cases: 140, PR: "0.1%", IR: "2.1%", CFR: "3.9%" },
//     { day: "Oct 31, 2022", cases: 140, PR: "0.2%", IR: "2.1%", CFR: "3.9%" },
// ]

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Container p={4} bg='rgba(250,250,250,0.8)' color='black'>
                <Text as='b'>{label}</Text>
                <HStack>
                    <LineIcon boxSize={4} color='#EBFCF9' />
                    <Text color='#0E6495'>{`Case count: ${payload[0].payload.num_cases}`}</Text>
                </HStack>
                {/* <Divider borderColor='black' my={2} />
                <Text color='#399BC6'>{`Prevalence Rate: ${payload[0].payload.PR}`}</Text>
                <Text color='#00AEEA'>{`Incidence Rate: ${payload[0].payload.IR}`}</Text>
                <Text color='#57BFBA'>{`Case-fatality Ratio: ${payload[0].payload.CFR}`}</Text> */}
            </Container>
        )
    }
}

const ChartView = ({ state, chartType, setChartType }) => {
    const [data, setData] = useState({})

    useEffect(() => {
        caseService.getStateCases(state, chartType).then(res => {
            setData(res)
        })
    }, [state, chartType])

    return (
        <Container minWidth='100%' minHeight='100vh' pt={28} pl={8} display={['none', 'none', 'flex', 'flex']} centerContent>
            <Heading fontSize={20} mb={4} >{state}</Heading>
            <Tabs isFitted variant='enclosed'>
                <TabList mb='1em'>
                    <Tab
                        _selected={{ color: 'white', bg: 'blue.500' }}
                        onClick={() => {
                            setChartType('Cumulative')
                        }}>
                        Cumulative
                    </Tab>
                    <Tab
                        _selected={{ color: 'white', bg: 'blue.500' }}
                        whiteSpace='nowrap'
                        onClick={() => {
                            setChartType('Average')
                        }}
                    >
                        7-day Moving Average
                    </Tab>
                </TabList>
            </Tabs>
            <ResponsiveContainer position='absolute' minHeight="60vh" width="55%" zIndex={25}>
                <LineChart
                    data={data}
                    margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
                >
                    <XAxis dataKey="date" minTickGap={50}>
                        <Label value="Confirmed Date" offset={-30} position="insideBottom" />
                    </XAxis>
                    <YAxis dataKey="num_cases">
                        <Label value="Number of Cases" offset={-20} position="insideLeft" angle='-90' />
                    </YAxis>
                    <Tooltip wrapperStyle={{ outline: 'none', borderWidth: 1, borderColor: 'black', borderRadius: 4 }} content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} margin={{ top: 30, right: 30, left: 30, bottom: 30 }} />
                    <Line name="Number of Confirmed Cases" type="monotone" dataKey="num_cases" stroke="#0E6495" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </Container>
    )
}

const LineIcon = (props) => {
    return (
        <Icon viewBox='0 0 200 200' {...props}>
            <path
                strokeWidth={20}
                fill="none"
                stroke="#0E6495"
                d="M 0, 90 h 60
            A 30, 30, 0, 1, 1, 120, 90
            H 180 M 120, 90
            A 30, 30, 0, 1, 1, 60, 90"></path>
        </Icon>
    )
}

export default ChartView