import axios from '../plugins/axios'
const request = axios.request
export default {
    async query() {
        return request<API.GoldData>({ url: `/wechat/gold/create` })
    }
}