import axios from 'axios'

// change URL to whatever backend API we're serving
// const baseUrl = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'
const baseUrl = '/api'
const flagsUrl ='https://raw.githubusercontent.com/CivilServiceUSA/us-states/master/data/states.json'

const getStateCases = async () => {
    const response = await axios.get(`${baseUrl}/cases`)
    console.log(response.data)
    return response.data
}

const getStateFlags = async () => {
    const response = await axios.get(flagsUrl)
    const mod = response.data
    .concat({state: "District of Columbia", state_flag_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flag_of_the_District_of_Columbia.svg/510px-Flag_of_the_District_of_Columbia.svg.png"})
    .concat({state: "Puerto Rico", state_flag_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Flag_of_Puerto_Rico.svg/255px-Flag_of_Puerto_Rico.svg.png"})
    return mod
}

const caseService = {
    getStateCases,
    getStateFlags
}

export default caseService
