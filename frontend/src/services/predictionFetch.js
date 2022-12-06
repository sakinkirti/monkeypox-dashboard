import axios from 'axios'

const baseUrl = '/api/prediction'

// 14-day confirmed cases progression for given state
// return data as json
const getProgression = async (state) => {
    const response = await axios.get(`${baseUrl}/cases`, {params: {state: state}}) // change this url
    return response.data
}

// Statistics changes for next week
const getStatsChanges = async () => {
    const response = await axios.get(`${baseUrl}/phs`) // change this url
    return response.data
}

const predictionService = { getProgression, getStatsChanges }
export default predictionService