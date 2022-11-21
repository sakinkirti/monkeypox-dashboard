import '@testing-library/jest-dom/extend-expect'
import { describe, expect, jest, test } from '@jest/globals'
import caseService from '../services/cases'
import axios from 'axios'

jest.mock('axios')

describe('US Total', () => {
    test('Get US Total Cases', async () => {
        const res = { data: [999] }
        axios.get.mockResolvedValue(res)
        return caseService.getUSTotalCases().then(data => {
            expect(data).toEqual(res.data)
        })
    })
})


describe('Get All Cumulative Case Counts', () => {
    test('Get All States Cumulative', async () => {
        const res = {
            data: [{
                "cumulative_cases": 171,
                "name": "Alabama"
            }]
        }
        axios.get.mockResolvedValue(res)
        return caseService.getCumulativeCounts().then(data => {
            expect(data).toEqual(res.data)
        })
    })
})

describe('Get Specific State Counts', () => {
    test('Get Cumulative', async () => {
        const res = {
            data: [{
                "date": "2022-05-27",
                "num_cases": 2
            },
            {
                "date": "2022-05-28",
                "num_cases": 2
            }]
        }
        axios.get.mockResolvedValue(res)
        return caseService.getStateCases('California', 'Cumulative').then(data => {
            expect(data).toEqual(res.data)
        })
    })
})

describe('State Cases Call', () => {
    test('Get States Data', async () => {
        const cases = {
            "cases": [
                {
                    "date": "2022-11-07",
                    "num_cases": 52
                }
            ],
            "name": 'Alabama'
        }
        const res = { data: cases }
        axios.get.mockResolvedValue(res)
        return caseService.getAllStateCases().then(data => {
            expect(data).toEqual(cases)
        })
    })
})

describe('State Flags Call', () => {
    test('Get Flags Data', async () => {
        const flags = {
            state: "Alabama",
            state_flag_url: "https://cdn.civil.services/us-states/flags/alabama-large.png",
        }
        const res = { data: flags }
        axios.get.mockResolvedValue(res)
        return caseService.getStateFlags().then(data => {
            expect(data).toEqual(flags)
            expect(data.state).toEqual(flags.state)
            expect(data.state_flag_url).toEqual(flags.state_flag_url)
        })
    })
})

describe('Geo JSON Call', () => {
    test('Get Geo JSON', async () => {
        const geoJSON = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    id: "01",
                    properties: {
                        name: "Alabama",
                        density: 94.65
                    },
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [-87.359296, 35.00118],
                                [-85.606675, 34.984749],
                                [-85.431413, 34.124869],
                                [-85.184951, 32.859696],
                                [-85.069935, 32.580372],
                                [-84.960397, 32.421541],
                                [-85.004212, 32.322956],
                                [-84.889196, 32.262709],
                                [-85.058981, 32.13674],
                                [-85.053504, 32.01077],
                                [-85.141136, 31.840985],
                                [-85.042551, 31.539753],
                                [-85.113751, 31.27686],
                                [-85.004212, 31.003013],
                                [-85.497137, 30.997536],
                                [-87.600282, 30.997536],
                                [-87.633143, 30.86609],
                                [-87.408589, 30.674397],
                                [-87.446927, 30.510088],
                                [-87.37025, 30.427934],
                                [-87.518128, 30.280057],
                                [-87.655051, 30.247195],
                                [-87.90699, 30.411504],
                                [-87.934375, 30.657966],
                                [-88.011052, 30.685351],
                                [-88.10416, 30.499135],
                                [-88.137022, 30.318396],
                                [-88.394438, 30.367688],
                                [-88.471115, 31.895754],
                                [-88.241084, 33.796253],
                                [-88.098683, 34.891641],
                                [-88.202745, 34.995703],
                                [-87.359296, 35.00118]
                            ]
                        ]
                    },
                    "cumulative_cases": 160
                }
            ]
        }
        axios.get
            .mockImplementationOnce(() => Promise.resolve({
                status: 200,
                data: geoJSON
            }))
            .mockImplementationOnce(() => Promise.resolve({
                status: 200,
                data: [{
                    "cases": [
                        {
                            "date": "2022-11-07",
                            "num_cases": 52
                        }
                    ],
                    "cumulative_cases": 169,
                    "name": 'Alabama'
                }]
            }))
        return caseService.getMapGeoJSON().then(data => {
            expect(data.features).toHaveLength(1)
            expect(data).toEqual(geoJSON)
        })
    })
    test('Filter out Puerto Rico and DC', async () => {
        const geoJSON = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    id: "01",
                    properties: {
                        name: "Alabama",
                        density: 94.65
                    },
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [-87.359296, 35.00118],
                                [-85.606675, 34.984749],
                                [-85.431413, 34.124869],
                                [-85.184951, 32.859696],
                                [-85.069935, 32.580372],
                                [-84.960397, 32.421541],
                                [-85.004212, 32.322956],
                                [-84.889196, 32.262709],
                                [-85.058981, 32.13674],
                                [-85.053504, 32.01077],
                                [-85.141136, 31.840985],
                                [-85.042551, 31.539753],
                                [-85.113751, 31.27686],
                                [-85.004212, 31.003013],
                                [-85.497137, 30.997536],
                                [-87.600282, 30.997536],
                                [-87.633143, 30.86609],
                                [-87.408589, 30.674397],
                                [-87.446927, 30.510088],
                                [-87.37025, 30.427934],
                                [-87.518128, 30.280057],
                                [-87.655051, 30.247195],
                                [-87.90699, 30.411504],
                                [-87.934375, 30.657966],
                                [-88.011052, 30.685351],
                                [-88.10416, 30.499135],
                                [-88.137022, 30.318396],
                                [-88.394438, 30.367688],
                                [-88.471115, 31.895754],
                                [-88.241084, 33.796253],
                                [-88.098683, 34.891641],
                                [-88.202745, 34.995703],
                                [-87.359296, 35.00118]
                            ]
                        ]
                    }
                },
                {
                    type: "Feature",
                    id: "11",
                    properties: {
                        name: "District of Columbia",
                        density: 10065
                    },
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [-77.035264, 38.993869],
                                [-76.909294, 38.895284],
                                [-77.040741, 38.791222],
                                [-77.117418, 38.933623],
                                [-77.035264, 38.993869]
                            ]
                        ]
                    }
                },
                {
                    type: "Feature",
                    id: "72",
                    properties: {
                        name: "Puerto Rico",
                        density: 1082
                    },
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [-66.448338, 17.984326],
                                [-66.771478, 18.006234],
                                [-66.924832, 17.929556],
                                [-66.985078, 17.973372],
                                [-67.209633, 17.956941],
                                [-67.154863, 18.19245],
                                [-67.269879, 18.362235],
                                [-67.094617, 18.515589],
                                [-66.957694, 18.488204],
                                [-66.409999, 18.488204],
                                [-65.840398, 18.433435],
                                [-65.632274, 18.367712],
                                [-65.626797, 18.203403],
                                [-65.730859, 18.186973],
                                [-65.834921, 18.017187],
                                [-66.234737, 17.929556],
                                [-66.448338, 17.984326]
                            ]
                        ]
                    }
                }
            ]
        }
        axios.get
            .mockImplementationOnce(() => Promise.resolve({
                status: 200,
                data: geoJSON
            }))
            .mockImplementationOnce(() => Promise.resolve({
                status: 200,
                data: [{
                    "cases": [
                        {
                            "date": "2022-11-07",
                            "num_cases": 52
                        }
                    ],
                    "cumulative_cases": 169,
                    "name": 'Alabama'
                }]
            }))
        return caseService.getMapGeoJSON().then(data => {
            expect(data.features).toHaveLength(1)
            expect(data.features).not.toContain(
                {
                    type: "Feature",
                    id: "11",
                    properties: {
                        name: "District of Columbia",
                        density: 10065
                    },
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [-77.035264, 38.993869],
                                [-76.909294, 38.895284],
                                [-77.040741, 38.791222],
                                [-77.117418, 38.933623],
                                [-77.035264, 38.993869]
                            ]
                        ]
                    }
                },
            )
        })
    })
})