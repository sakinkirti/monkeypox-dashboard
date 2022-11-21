import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { describe, expect, jest, test, afterEach } from '@jest/globals'
import '@testing-library/jest-dom'
import PredictiveStatTable from '../components/PredictiveStatTable'

jest.mock('../App', () => ({ App: () => 'mocked app' }))

describe('Prediction Table Rendering', () => {
    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = '';
    })
    test('Prediction Table Content', async () => {
        render(<PredictiveStatTable />)
        const prevRate = screen.getByText('Prevalence Rate')
        const incidence = screen.getByText('Incidence Rate')
        return expect(prevRate).toBeDefined() && expect(incidence).toBeDefined()
    })
})
