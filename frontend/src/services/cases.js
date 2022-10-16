import axios from 'axios'

// change URL to whatever backend API we're serving
const baseUrl = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'
const flagsUrl ='https://raw.githubusercontent.com/CivilServiceUSA/us-states/master/data/states.json'

const getStateCases = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getStateFlags = async () => {
    const response = await axios.get(flagsUrl)
    return response.data
}

const service = {
    getStateCases,
    getStateFlags
}

export default service
