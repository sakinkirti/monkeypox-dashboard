import '@testing-library/jest-dom/extend-expect'
import { describe, expect, test } from '@jest/globals'
import caseService from '../services/cases'

describe('State Cases Call', () => {
    test('Get States Data', async () => {
        const res = await caseService.getAllStateCases()
        expect(res.features).toHaveLength(50)
    })
    test('Contain States', async () => {
        const res = await caseService.getAllStateCases()
        expect(res.features[0].properties.name).toBe("Alabama")
        expect(res.features[1].properties.name).toBe("Alaska")
        expect(res.features[49].properties.name).toBe("Wyoming")
    })
})

describe('State Flags Call', () => {
    test('Get Flags Data', async () => {
        const res = await caseService.getStateFlags()
        expect(res).toHaveLength(50)
        expect(res[0]).toHaveProperty("state_flag_url")
        expect(res[0].state).toBe("Alabama")
        expect(res[48].state).toBe("Wisconsin")
        expect(res[49].state).toBe("Wyoming")
    })
    test('Has Flags Url', async () => {
        const res = await caseService.getStateFlags()
        expect(res[49].state_flag_url).toMatch('https://cdn.civil.services/us-states/flags/wyoming-large.png')
    })
})