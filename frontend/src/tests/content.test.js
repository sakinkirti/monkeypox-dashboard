import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Navbar from '../components/Navbar'
import { describe, expect, jest, test } from '@jest/globals'
import Map from '../components/MapView'
import PredictiveStatTable from '../components/PredictiveStatTable'
import Cases from '../components/CasesTable'

jest.mock('../App', () => ({ App: () => 'mocked mapview' }))

describe('Map', () => {
    test('MapView Renders', () => {
        render(<Map.MapView />)
        const zoomControl = screen.getAllByRole('button')
        expect(zoomControl).toBeDefined()
    })
    test('Map Legend Renders', () => {
        render(<Map.Legend />)
        const tableHeader = screen.getByText('Confirmed Cases')
        expect(tableHeader).toBeDefined()
    })
})

describe('Prediction Table Rendering', () => {
    test('Prediction Table Content', () => {
        render(<PredictiveStatTable />)
        const prevRate = screen.getByText('Prevalence Rate')
        expect(prevRate).toBeDefined()
        const incidence = screen.getByText('Incidence Rate')
        expect(incidence).toBeDefined()
    })
})

describe('State Cases Table', () => {
    test('Cases Table Rendered', () => {
        render(<Cases.CasesTable />)
        const heading = screen.getAllByText('States By Confirmed Cases')
        expect(heading).toBeDefined()
    })
    test('US Total Table Rendered', () => {
        render(<Cases.USTable />)
        const heading = screen.getAllByText('U.S. Total Confirmed Cases')
        expect(heading).toBeDefined()
    })
})

describe('Navbar', () => {
    // test('Navbar Content', () => {
    //     render(<Navbar />)
    //     const heading = screen.getByText('Monkeypox Dashboard')
    //     expect(heading).toBeDefined()
    // })
})
