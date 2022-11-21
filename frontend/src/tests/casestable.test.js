import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { describe, expect, jest, test, afterEach } from '@jest/globals'
import '@testing-library/jest-dom'
import Cases from '../components/CasesTable'

jest.mock('../App', () => ({ App: () => 'mocked mapview' }))

describe('State Cases Table', () => {
    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = '';
    })
    test('Cases Table Rendered', async () => {
        render(<Cases.CasesTable />)
        const heading = screen.getByText('States By Confirmed Cases')
        return expect(heading).toBeDefined()
    })
    test('US Table Rendered', async () => {
        render(<Cases.USTable />)
        const heading = screen.getByText('U.S. Total Confirmed Cases')
        return expect(heading).toBeDefined()
    })
})