import { React, useEffect, useState } from 'react'
import { LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, Legend, Label } from 'recharts'
import { Container, Text, Icon, HStack, Tabs, TabList, Tab, Heading } from '@chakra-ui/react'
import caseService from '../services/cases'
import predictionService from '../services/predictionFetch'

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Container p={4} bg='rgba(250,250,250,0.8)' color='black'>
                <Text as='b'>{label}</Text>
                <HStack>
                    {payload[0].payload.num_cases !== undefined
                        ? <LineIcon boxSize={4} color='#EBFCF9' />
                        : null}
                    {payload[0].payload.num_cases !== undefined
                        ? <Text color='#0E6495'>{`Case count: ${payload[0].payload.num_cases}`}</Text>
                        : <Text color='#8884d8'>{`Predicted case count: ${(isNaN(payload[0].payload.predicted_cases) ? 0.0 : payload[0].payload.predicted_cases)}`}</Text>}
                </HStack>
            </Container>
        )
    }
}

const ChartView = ({ state, chartType, setChartType }) => {
    const [data, setData] = useState([])

    useEffect(() => {
        var predictions = []
        predictionService.getProgression(state).then(res => {
            predictions = res
        })
        caseService.getStateCases(state, chartType).then(res => {
            var modified = res
            var currentTime = new Date();
            for (let i = 0; i < 14; i++) {
                currentTime.setDate(currentTime.getDate() + 1)
                const formattedDate = new Date(currentTime).toLocaleDateString('en-CA')
                var predicted_cases = null
                if (i === 0) {
                    predicted_cases = modified[modified.length - 1].num_cases + predictions[i]
                } else {
                    predicted_cases = modified[modified.length - 1].predicted_cases + predictions[i]
                }
                const pred = ({ "date": formattedDate.toString(), "predicted_cases": chartType === "Cumulative" ? predicted_cases : (predicted_cases / 2).toFixed(2) })
                modified.push(pred)
            }
            setData(modified)
        })
    }, [state, chartType])

    return (
        <Container minWidth='100%' minHeight='100vh' pt={28} pl={8} display={['none', 'none', 'flex', 'flex']} centerContent>
            <Heading fontSize={20} mb={4}>{state}</Heading>
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
                    <Line
                        name={chartType === "Cumulative" ? "Total Confirmed Case Count" : "7-day Case Count Moving Average"}
                        type="monotone"
                        dataKey="num_cases"
                        stroke="#0E6495"
                        dot={false}
                    />
                    <Line
                        name={chartType === "Cumulative" ? "Predicted Case Count" : "7-day Case Count Moving Average Predictions"}
                        type="monotone"
                        dataKey="predicted_cases"
                        stroke="#8884d8"
                        dot={false}
                        strokeDasharray="5 5"
                    />
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