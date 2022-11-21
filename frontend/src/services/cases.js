import axios from 'axios'

// change URL to whatever backend API we're serving
const baseUrl = '/api'
const geoJSONUrl = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'
const flagsUrl = 'https://raw.githubusercontent.com/CivilServiceUSA/us-states/master/data/states.json'

const getUSTotalCases = async () => {
    const response = await axios.get(`${baseUrl}/cases/USTotal`)
    return response.data
}

const getAllStateCases = async () => {
    const response = await axios.get(`${baseUrl}/cases`)
    return response.data
}

const getStateCases = async (state, dataType) => {
    const response = await axios.get(`${baseUrl}/cases/state`, { params: { name: state, dataType: dataType } })
    return response.data
}

const getStateFlags = async () => {
    const response = await axios.get(flagsUrl)
    return response.data
}

const getCumulativeCounts = async () => {
    const response = await axios.get(`${baseUrl}/cases/total`)
    return response.data
}

const getMapGeoJSON = async () => {
    const response = await axios.get(geoJSONUrl)
    const stateCases = await getCumulativeCounts()
    const modified = response.data.features.filter(state =>
        state.properties.name !== 'Puerto Rico'
        && state.properties.name !== 'District of Columbia'
    )
    modified.forEach((state, index) => {
        state.properties.density = stateCases[index].cumulative_cases
    })
    var geoJSONObject = { "type": "FeatureCollection", "features": modified }
    return geoJSONObject
}

const caseService = {
    getUSTotalCases,
    getAllStateCases,
    getStateCases,
    getStateFlags,
    getCumulativeCounts,
    getMapGeoJSON
}

export default caseService
