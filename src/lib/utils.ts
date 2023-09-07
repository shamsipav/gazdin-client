import axios from 'axios'
import https from 'https'
import { API_URL, VARIANT_FIELDS, RESULT_FIELDS, PROJECT_RESULT_FIELDS, PROJECT_FIELDS } from '$lib/consts'
import type { IResponse } from '$lib/types'
import xlsx from 'json-as-xlsx'
import dayjs from 'dayjs'

export const handleAnchorClick = (event) => {
    event.preventDefault()
    const link = event.currentTarget
    const anchorId = new URL(link.href).hash.replace('#', '')
    const anchor = document.getElementById(anchorId)
    window.scrollTo({
        top: anchor.offsetTop,
        behavior: 'smooth'
    })
}

const redirectDelay = 500
export const redirect = (location: string) => setTimeout(() => { window.location.href = location }, redirectDelay)

export async function logout() {
    setCookie('token', null, null)
    redirect('/')
}

export function getCookie(name) {
    const cookieName = name + '='
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(';')
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(cookieName) == 0) {
            return c.substring(cookieName.length, c.length)
        }
    }
    return ''
}

export function setCookie(name, value, exdays, secure?) {
    const d = new Date()
    d.setTime(d.getTime() + (exdays*24*60*60*1000))
    const expires = 'expires='+ d.toUTCString()
    if (secure) {
        document.cookie = name + '=' + value + ';' + expires + ';path=/; secure'
    } else {
        document.cookie = name + '=' + value + ';' + expires + ';path=/'
    }
}

export function deleteCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;'
}

export const truncate = (str: string, n = 18) => {
    const split = str.split('.')
    const extension = split[1]

    return (str.length > n) ? str.slice(0, n-1) + '..' + `.${extension}` : str
}

export const filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate))
export const removeKeyNames = (obj) => {
    const newObj = {}
    Object.keys(obj).forEach(function(key) {
        newObj[key.split('.')[1]] = obj[key]
    })
    return newObj
}

export const getUserInformation = async (token: string) => {
    try {
        // TODO: Удалить НЕБЕЗОПАСНЫЙ код
        const httpsAgent = new https.Agent({ rejectUnauthorized: false })
        const response = await axios.get(`${API_URL}/auth/info`, { headers: { 'Authorization': `Bearer ${token}` }, httpsAgent })
        const responseResult: IResponse = response.data

        return responseResult.result

    } catch(error) {
        // TODO: Обработать ошибку не нужно?
        return undefined
    }
}

export const exportResultToExcel = async (result: any, union = false, mode: 'project' | 'comparative' | 'base' = 'base') => {
    const settings = {
        fileName: `Расчет_газодинамического_режима_${dayjs(new Date()).format('DD.MM.YYYY HH:mm:ss')}`, // Name of the resulting spreadsheet
        extraLength: 3, // A bigger number means that columns will be wider
        writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
        writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
    }

    if (!union) {
        let inputsForExcel = undefined
        let resultsForExcel = undefined

        if (mode === 'project') {
            inputsForExcel = PROJECT_FIELDS.map(field => ({
                parameter: field.description,
                value: result.comparativeResult.inputProgData[`${field.name}`]
            }))

            resultsForExcel = PROJECT_RESULT_FIELDS.map(field => ({
                parameter: field.description,
                value: result.comparativeResult.resultProgData[`${field.name}`]
            }))

        } else {

            inputsForExcel = VARIANT_FIELDS.map(field => ({
                parameter: field.description,
                value: result.inputData[field.name]
            }))

            resultsForExcel = RESULT_FIELDS.map(field => ({
                parameter: field.description,
                value: result.resultData[field.name]
            }))
        }

        const data = [
            {
                sheet: `Расчет газ. режима (${mode === 'project' ? 'проект.' : 'баз.'})`,
                columns: [
                    { label: 'Параметр', value: 'parameter' },
                    { label: 'Значение', value: 'value' },
                ],
                content: [
                    { parameter: 'Исходные данные', value: '' },
                    ...inputsForExcel,
                    { parameter: 'Результаты расчета', value: ''},
                    ...resultsForExcel
                ],
            }
        ]

        xlsx(data, settings)

    } else {
        const baseInputsForExcel = VARIANT_FIELDS.map(field => ({
            parameter: field.description,
            baseValue: result.baseResult.inputData[field.name],
            compValue: result.comparativeResult.inputData[field.name],
            delta: field.name !== 'resultDate' ? Math.abs(Math.round((result.comparativeResult.inputData[`${field.name}`] - result.baseResult.inputData[`${field.name}`]) * 100) / 100) : ''
        }))

        const baseResultsForExcel = RESULT_FIELDS.map(field => ({
            parameter: field.description,
            baseValue: result.baseResult.resultData[field.name],
            compValue: result.comparativeResult.resultData[field.name],
            delta: field.name !== 'resultDate' ? Math.abs(Math.round((result.comparativeResult.resultData[`${field.name}`] - result.baseResult.resultData[`${field.name}`]) * 100) / 100) : ''
        }))

        const data = [
            {
                sheet: `Расчет газ. режима (${mode === 'comparative' ? 'сравн.' : 'проект.'})`,
                columns: [
                    { label: 'Параметр', value: 'parameter' },
                    { label: 'Значение (базовый)', value: 'baseValue' },
                    { label: `Значение (${mode === 'comparative' ? 'сравнительный' : 'проектный'})`, value: 'compValue' },
                    { label: 'Отклонение', value: 'delta' },
                ],
                content: [
                    { parameter: 'Исходные данные', value: '' },
                    ...baseInputsForExcel,
                    { parameter: 'Результаты расчета', value: ''},
                    ...baseResultsForExcel
                ],
            }
        ]

        xlsx(data, settings)
    }
}