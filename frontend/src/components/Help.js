import React from 'react'
import { Container, Text, Heading, HStack, Image } from '@chakra-ui/react'

const Help = () => {
    return (
        <Container minWidth='full' minHeight='full' p={28}>
            <Heading pb={4}>Help</Heading>
            <Heading pb={2} fontSize={'xl'}>Introduction</Heading>
            <Text pb={2} fontSize={'l'}>
                Monkeypox Dashboard provides geospatial data visualizations and tabulated data about the 2022 Monkeypox Outbreak in the U.S.
                In addition, predictive analysis of national public health statistics — prevalence rate, incidience rate, and case-fatality ratio — are provided.
                In the Charts section, users can view confirmed Monkeypox cases in timeseries format as well as predictive analysis for the 14-day progression of cases for each state.
            </Text>
            <br />
            <Heading pb={2} fontSize={'xl'}>Information About Data Sources</Heading>
            <Text pb={2} fontSize={'l'}>
                Data about confirmed cases that is displayed in the map and chart views is taken from Global.health and the CDC.
                Data is updated daily.
            </Text>
            <br />
            <Heading pb={2} fontSize={'xl'}>Map Guide</Heading>
            <Text fontSize={'l'}>
                States are color-coded according to the legend of confirmed Monkeypox cases.
            </Text>
            <HStack>
                <Text fontSize={'l'}>
                    Click on a red circle
                </Text>
                <Image alt='Red Circle Icon' src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Red_circle_frame_transparent.svg/2048px-Red_circle_frame_transparent.svg.png" width={'20px'} height={'20px'} />
                <Text fontSize={'l'}>
                    on the map or a state in the "States by Confirmed Cases" table to view a popup window of timeseries data for that state.
                </Text>
            </HStack>
            <Text pb={2} fontSize={'l'}>
                States can also be searched for in the "States by Confirmed Cases" table for easier navigation to a state.
            </Text>
            <br />
            <Heading pb={2} fontSize={'xl'}>Chart Guide</Heading>
            <Text pb={2} fontSize={'l'}>
                The Charts section displays timeseries data for confirmed Monkeypox cases in a state or nationwide.
                <br />
                Switch between cumulative case count timeseries data and 7-day moving average timeseries data using the given tabs above the chart.
                <br />
                Hover over the chart to view the case count for a specific date.
                <br />
                States can also be searched for in the "States by Confirmed Cases" table for easier navigation to a state.
            </Text>
            <br />
            <Heading pb={2} fontSize={'xl'}>Notes</Heading>
            <Text pb={2} fontSize={'l'}>
                Monkeypox Dashboard intended for use by public health experts in the U.S. Created by Saketh Dendi, Felix Huang, and Sakin Kirti for CSDS 393 @cwru
            </Text>
        </Container>
    )
}

export default Help