import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Navbar from '../components/Navbar'
import { describe, expect, jest, test, afterEach } from '@jest/globals'
import '@testing-library/jest-dom'
import Map from '../components/MapView'

jest.mock('../App', () => ({ App: () => 'mocked app' }))

describe('Map', () => {
    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = '';
    })
    test('Map Legend Renders', async () => {
        render(<Map.Legend />)
        const tableHeader = screen.getByText('Confirmed Cases')
        return expect(tableHeader).toBeDefined()
    })
})

describe('Navbar', () => {
    // test('Navbar Content', () => {
    //     render(<Navbar />)
    //     const heading = screen.getByText('Monkeypox Dashboard')
    //     expect(heading).toBeDefined()
    // })
})