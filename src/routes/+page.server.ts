// TODO: Remove axios, add types and refactoring code
import { API_URL } from '$lib/consts'
import type { IResponse } from '$lib/types'
import axios from 'axios'
import https from 'https'

export async function load({ cookies, locals }) {
    const user = locals.user
    const token = cookies.get('token')
    try {
        // TODO: THIS IS NOT SAFE !!!
        const httpsAgent = new https.Agent({ rejectUnauthorized: false })
        const defaultResponse = await axios.get(`${API_URL}/variants/first`, { httpsAgent })
        const defaultResult: IResponse = defaultResponse.data

        if (user) {
            const variantsResponse = await axios.get(`${API_URL}/variants`, { headers: { 'Authorization': `Bearer ${token}` }, httpsAgent })
            const variantsResult: IResponse = variantsResponse.data

            return {
                user: user,
                default: defaultResult.result,
                variants: variantsResult.result
            }
        }

        return {
            default: defaultResult.result
        }
    } catch(error) {
        console.log(error.response ? error.response.data.errorMessage : 'Не удалось получить данные варианта исходных данных по умолчанию')
        return {
            default: {},
            variants: {}
        }
    }
}