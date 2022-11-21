import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { describe, expect, jest, test } from '@jest/globals'
import '@testing-library/jest-dom'
import ChartView from '../components/ChartView'

jest.mock('../App', () => ({ App: () => 'mocked mapview' }))

global.ResizeObserver = require('resize-observer-polyfill')

describe('Cumulative Chart View Render', () => {
    test('Cumulative Chart Rendered', () => {
        render(<ChartView state={'California'} chartType={'Cumulative'} />)
        const heading = screen.getByText('California')
        return expect(heading).toBeDefined()
    })
    test('Cumulative Chart Rendered', () => {
        render(<ChartView state={'Alabama'} chartType={'Average'} />)
        const heading = screen.getByText('Alabama')
        return expect(heading).toBeDefined()
    })
})