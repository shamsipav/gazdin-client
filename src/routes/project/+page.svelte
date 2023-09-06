<script lang="ts">
    import dayjs from 'dayjs'
    import type { PageData } from './$types'
    import { API_URL, VARIANT_FIELDS, PROJECT_FIELDS, RESULT_FIELDS } from '$lib/consts'
    import type { IVariant, IResponse, IUnionFullResult } from '$lib/types'
    import { fade } from 'svelte/transition'
    import axios from 'axios'
    import { exportResultToExcel, getCookie } from '$lib/utils'
    import { Toast } from '$components'

    export let data: PageData

    let authorized: boolean = data.authorized
    let variants: IVariant[] = data.variants

    let successMessage: string
    let errorMessage: string

    let selectedVariant

    let baseVariant: IVariant
    let fullResults = false

    let notifyMessage = ''

    let inputProgData: any = undefined

    const getCurrentVariant = async (selectedVariant: number) => {
        baseVariant = variants.find(x => x.id == selectedVariant)
        console.log(baseVariant)

        const token = getCookie('token')

        try {
            const response = await axios.get(`${API_URL}/calculate/progdata`, { headers: { 'Authorization': `Bearer ${token}` } })
            const responseResult: IResponse = response.data
            inputProgData = responseResult.result
        } catch (error) {
            successMessage = ''
            errorMessage = error.response.data.errorMessage
            console.log(`Не удалось выполнить расчет проектного периода: ${error}`)
        }

        notifyMessage = `Вариант №${baseVariant.id}" успешно загружен`
        setTimeout(() => notifyMessage = '', 2500)
    }

    let result: IUnionFullResult

    const getProjectResult = async (e) => {
        const formData = new FormData(e.target)
        const data: any = {}
        formData.forEach((value, key) => data[key] = value)

        const token = getCookie('token')

        try {
            const response = await axios.post(`${API_URL}/calculate/project?basePeriodId=${selectedVariant}`, data, { params: { inputDataId: selectedVariant }, headers: { 'Authorization': `Bearer ${token}` } })
            const responseResult: IResponse = response.data
            result = responseResult.result
        } catch (error) {
            successMessage = ''
            errorMessage = error.response.data.errorMessage
            console.log(`Не удалось выполнить расчет проектного периода: ${error}`)
        }
    }
</script>

<svelte:head>
	<title>GazDinWeb: Проектный режим</title>
</svelte:head>

<div class="container">
    <p class="h3 mb-3">Проектный режим</p>
    {#if authorized}
        <p class="lead mb-2">Вариант исходных данных</p>
        {#if variants?.length > 0}
            <select class="form-select mb-3" bind:value={selectedVariant} aria-label="Default select example" on:change={() => getCurrentVariant(selectedVariant)}>
                <option selected disabled>Вариант исходных данных</option>
                {#each variants as variant}
                    <option value={variant.id}>
                        Вариант №{variant.id} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
                    </option>
                {/each}
            </select>
        {:else}
            <p class="mt-3">Нет сохраненных вариантов</p>
        {/if}
        {#if baseVariant && inputProgData}
            <form on:submit|preventDefault={getProjectResult} transition:fade>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Параметр</th>
                            <th scope="col">Значение (базовый)</th>
                            <th scope="col">Значение (проектный)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each PROJECT_FIELDS as field, i}
                            <tr>
                                <td>{field.description}</td>
                                {#if field.name === 'p_E4'}
                                    <td>{baseVariant['c36']}</td>
                                    <td>
                                        <input type="text" class="form-control" name={field.name} value={inputProgData[`${field.name}`]} autocomplete="off" required>
                                    </td>
                                {:else if field.name === 'p_E6'}
                                    <td>{baseVariant['c44']}</td>
                                    <td>
                                        <input type="text" class="form-control" name={field.name} value={inputProgData[`${field.name}`]} autocomplete="off" required>
                                    </td>
                                {:else if field.name === 'p_E7'}
                                    <td>{baseVariant['c18']}</td>
                                    <td>
                                        <input type="text" class="form-control" name={field.name} value={inputProgData[`${field.name}`]} autocomplete="off" required>
                                    </td>
                                {:else if field.name === 'p_E8'}
                                    <td>{baseVariant['c20']}</td>
                                    <td>
                                        <input type="text" class="form-control" name={field.name} value={inputProgData[`${field.name}`]} autocomplete="off" required>
                                    </td>
                                {:else if field.name === 'p_E9'}
                                    <td>{baseVariant['c37']}</td>
                                    <td>
                                        <input type="text" class="form-control" name={field.name} value={inputProgData[`${field.name}`]} autocomplete="off" required>
                                    </td>
                                {:else if field.name === 'p_E10'}
                                    <td>{baseVariant['c19']}</td>
                                    <td>
                                        <input type="text" class="form-control" name={field.name} value={inputProgData[`${field.name}`]} autocomplete="off" required>
                                    </td>
                                {:else if field.name === 'p_E11'}
                                    <td>{baseVariant['c43']}</td>
                                    <td>
                                        <input type="text" class="form-control" name={field.name} value={inputProgData[`${field.name}`]} autocomplete="off" required>
                                    </td>
                                {/if}
                                {#if i > 6}
                                    <td></td>
                                    <td>
                                        <input type="text" class="form-control" name={field.name} value={inputProgData[`${field.name}`]} autocomplete="off" required>
                                    </td>
                                {/if}
                            </tr>
                        {/each}
                    </tbody>
                </table>
                <div class="d-flex align-items-center">
                    <button type="submit" class="btn btn-success">Отправить</button>
                </div>
            </form>
            {#if errorMessage}
                <p class="text-danger mt-3" transition:fade>{errorMessage}</p>
            {/if}
        {/if}
        {#if result}
            <div class="result mt-4" transition:fade>
                <p class="h5 mb-3">Результаты прогноза показателей газодинамического режима доменной плавки</p>
                <button type="button" class="btn btn-light mb-3" on:click={() => fullResults = !fullResults}>
                    {fullResults ? 'Краткая форма' : 'Полная форма'}
                </button>
                <button type="button" class="btn btn-light mb-3" on:click={() => exportResultToExcel(result, true, 'project')}>Экспорт в Excel</button>
                {#if fullResults}
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Параметр</th>
                                <th scope="col">Значение (базовый пер.)</th>
                                <th scope="col">Значение (сравнительный пер.)</th>
                                <th scope="col">Отклонение</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="table-warning">
                                <td colspan="7" class="text-center">Исходные данные</td>
                            </tr>
                            {#each VARIANT_FIELDS as field}
                                <tr transition:fade>
                                    <td>{field.description}</td>
                                    <td>{Math.round(result.baseResult.inputData[`${field.name}`] * 100) / 100}</td>
                                    <td>{Math.round(result.comparativeResult.inputData[`${field.name}`] * 100) / 100}</td>
                                    <td>{Math.abs(Math.round((result.comparativeResult.inputData[`${field.name}`] - result.baseResult.inputData[`${field.name}`]) * 100) / 100)}</td>
                                </tr>
                            {/each}
                            <tr class="table-warning">
                                <td colspan="7" class="text-center">Результаты расчета</td>
                            </tr>
                            {#each RESULT_FIELDS as field}
                                <tr 
                                    class="{field.name == 'indexOfTheBottomOfTheFurnace' ||
                                    field.name == 'indexOfTheFurnaceTop' ||
                                    field.name == 'theoreticalBurningTemperatureOfCarbonCoke' ? 'table-primary' : ''}" 
                                    transition:fade
                                >
                                    {#if field.name !== 'resultDate'}
                                        <td>{field.description}</td>
                                        {#if field.name == 'theoreticalBurningTemperatureOfCarbonCoke'}
                                            <td><mark>{Math.round(result.baseResult.resultData[`${field.name}`])}</mark></td>
                                            <td><mark>{Math.round(result.comparativeResult.resultData[`${field.name}`])}</mark></td>
                                            <td>{Math.abs(Math.round(result.comparativeResult.resultData[`${field.name}`] - result.baseResult.resultData[`${field.name}`]))}</td>
                                        {:else}
                                            <td><mark>{Math.round(result.baseResult.resultData[`${field.name}`] * 100) / 100}</mark></td>
                                            <td><mark>{Math.round(result.comparativeResult.resultData[`${field.name}`] * 100) / 100}</mark></td>
                                            <td>{Math.abs(Math.round((result.comparativeResult.resultData[`${field.name}`] - result.baseResult.resultData[`${field.name}`]) * 100) / 100)}</td>
                                        {/if}
                                    {/if}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {:else}
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Параметр</th>
                                <th scope="col">Значение (базовый пер.)</th>
                                <th scope="col">Значение (сравнительный пер.)</th>
                                <th scope="col">Отклонение</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each RESULT_FIELDS as field}
                                {#if field.name == 'indexOfTheBottomOfTheFurnace' || field.name == 'indexOfTheFurnaceTop' || field.name == 'theoreticalBurningTemperatureOfCarbonCoke' || field.name == 'resultDate'}
                                    <tr transition:fade>
                                        {#if field.name !== 'resultDate'}
                                            <td>{field.description}</td>
                                            {#if field.name == 'theoreticalBurningTemperatureOfCarbonCoke'}
                                                <td><mark>{Math.round(result.baseResult.resultData[`${field.name}`])}</mark></td>
                                                <td><mark>{Math.round(result.comparativeResult.resultData[`${field.name}`])}</mark></td>
                                                <td>{Math.abs(Math.round(result.comparativeResult.resultData[`${field.name}`] - result.baseResult.resultData[`${field.name}`]))}</td>
                                            {:else}
                                                <td><mark>{Math.round(result.baseResult.resultData[`${field.name}`] * 100) / 100}</mark></td>
                                                <td><mark>{Math.round(result.comparativeResult.resultData[`${field.name}`] * 100) / 100}</mark></td>
                                                <td>{Math.abs(Math.round((result.comparativeResult.resultData[`${field.name}`] - result.baseResult.resultData[`${field.name}`]) * 100) / 100)}</td>
                                            {/if}
                                        {/if}
                                    </tr>
                                {/if}
                            {/each}
                        </tbody>
                    </table>
                {/if}
            </div>
        {/if}
    {:else}
        <p>Проектный режим доступен только для авторизированных пользователей</p>
    {/if}
</div>
{#if notifyMessage}
    <div class="notify" transition:fade>
        <Toast variant="green">{notifyMessage}</Toast>
    </div>
{/if}