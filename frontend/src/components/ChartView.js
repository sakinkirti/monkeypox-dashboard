import { React } from 'react'
import { LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, Legend } from 'recharts'
import { Container, Text, Divider, Icon, HStack } from '@chakra-ui/react'

const sampleData = [
    { day: "Feb 20, 2022", cases: 102, PR: "0.4%", IR: "1.2%", CFR: "3.0%" },
    { day: "Jun 21, 2022", cases: 121, PR: "0.1%", IR: "1.9%", CFR: "3.3%" },
    { day: "Oct 22, 2022", cases: 132, PR: "0.9%", IR: "2.1%", CFR: "-3.9%" }
]

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Container p={4} bg='rgba(250,250,250,0.8)' color='black'>
                <Text as='b'>{label}</Text>
                <HStack>
                    <LineIcon boxSize={4} color='#EBFCF9' />
                    <Text color='#0E6495'>{`Case count: ${payload[0].payload.cases}`}</Text>
                </HStack>
                <Divider borderColor='black' my={2} />
                <Text >{`Prevalence Rate: ${payload[0].payload.PR}`}</Text>
                <Text color='#00AEEA'>{`Incidence Rate: ${payload[0].payload.IR}`}</Text>
                <Text color='#57BFBA'>{`Case-fatality Ratio: ${payload[0].payload.CFR}`}</Text>
            </Container>
        )
    }
}

const ChartView = () => {
    return (
        <Container minWidth='100%' minHeight='100vh' pt={32} display={['none', 'none', 'none', 'flex']} centerContent>
            <ResponsiveContainer position='absolute' minHeight="70vh" width="60%" zIndex={25}>
                <LineChart
                    width={500}
                    height={500}
                    data={sampleData}
                    margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
                >
                    <XAxis dataKey="day" />
                    <YAxis dataKey="cases" />
                    <Tooltip wrapperStyle={{ outline: 'none', borderWidth: 1, borderColor: 'black', borderRadius: 4 }} content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} margin={{ top: 30, right: 30, left: 30, bottom: 30 }} />
                    <Line name="Number of Confirmed Cases" type="monotone" dataKey="cases" stroke="#0E6495" />
                </LineChart>
            </ResponsiveContainer>
        </Container>
    )
}
/* d="M 0,16 h 10.666666666666666
A 5.333333333333333, 5.333333333333333, 0, 1, 1, 21.333333333333332, 16
H 32 M 21.333333333333332, 16
A 5.333333333333333, 5.333333333333333, 0, 1, 1, 10.666666666666666, 16"*/
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