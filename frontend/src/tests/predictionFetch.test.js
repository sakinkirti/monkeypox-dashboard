import '@testing-library/jest-dom/extend-expect'
import { describe, expect, jest, test } from '@jest/globals'
import predictionService from '../services/predictionFetch'
import axios from 'axios'

jest.mock('axios')

describe('Fetch Prediction Stats', () => {
    test('Fetch Stats for Today', () => {
        const res = {
            status: 200,
            data: ["0.17", "0.00", "0.17", "0.17", "0.00", "0.15"]
        }
        axios.get.mockResolvedValue(res)
        return predictionService.getStatsChanges().then(data => {
            expect(data).toEqual(res.data)
        })
    })
})

describe('Fetch Prediction Stats', () => {
    test('Fetch Progression', () => {
        const res = {
            status: 200,
            data: [{
                "date": "2022-06-02",
                "num_cases": 5
            },
            {
                "date": "2022-06-03",
                "num_cases": 6
            }]
        }
        axios.get.mockResolvedValue(res)
        return predictionService.getProgression('California').then(data => {
            expect(data).toEqual(res.data)
        })
    })
})