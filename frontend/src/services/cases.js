import axios from 'axios'

// change URL to whatever backend API we're serving
const baseUrl = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'

const getStateCases = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const service = {
    getStateCases
}

export default service
