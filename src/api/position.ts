import axios from '../plugins/axios'
const request = axios.request
export default {
    async query(platform: string) {
        return request<API.PositionData>({ url: `/position/${platform}/list` })
    }
}