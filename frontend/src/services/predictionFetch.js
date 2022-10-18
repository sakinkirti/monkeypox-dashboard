import axios from 'axios'

const url = ''

// 14-day confirmed cases progression for given state
// return data as json
const getProgression = async (state) => {
    const response = await axios.get(`${url}/${state}`) // change this url
    return response.data
}

// Statistics changes for next week
const getStatsChanges = async (state) => {
    const response = await axios.get(`${url}/${state}`) // change this url
    return response.data
}

const predictionService = { getProgression, getStatsChanges }
export default predictionService