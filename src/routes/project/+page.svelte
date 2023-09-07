<script lang="ts">
    import dayjs from 'dayjs'
    import type { PageData } from './$types'
    import { API_URL, PROJECT_FIELDS, PROJECT_RESULT_FIELDS } from '$lib/consts'
    import type { IVariant, IResponse, IUnionProgFullResult } from '$lib/types'
    import axios from 'axios'
    import { exportResultToExcel, getCookie } from '$lib/utils'

    export let data: PageData

    let authorized: boolean = data.authorized
    let variants: IVariant[] = data.variants

    let successMessage: string
    let errorMessage: string

    let selectedVariant

    let baseVariant: IVariant

    let notifyMessage = ''

    let inputProgData: any = undefined

    const getCurrentVariant = async (selectedVariant: number) => {
        baseVariant = variants.find(x => x.id == selectedVariant)

        const token = getCookie('token')

        try {
            const response = await axios.get(`${API_URL}/calculate/progdata`, { headers: { 'Authorization': `Bearer ${token}` } })
            const responseResult: IResponse = response.data
            inputProgData = responseResult.result
        } catch (error) {
            successMessage = ''
            errorMessage = error.response.data.errorMessage
            console.log(`Не удалось получить исходные данные для проектного периода: ${error}`)
        }

        notifyMessage = `Вариант №${baseVariant.id} успешно загружен`
        setTimeout(() => notifyMessage = '', 2500)
    }

    let result: IUnionProgFullResult

    const getProjectResult = async (e) => {
        const formData = new FormData(e.target)
        const data: any = {}
        formData.forEach((value, key) => data[key] = value)

        const token = getCookie('token')

        try {
            const response = await axios.post(`${API_URL}/calculate/project`, data, { params: { basePeriodId: selectedVariant }, headers: { 'Authorization': `Bearer ${token}` } })
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
    <h4>Проектный режим</h4>
    {#if authorized}
        <h6 style="margin-bottom: 1rem;">Вариант исходных данных</h6>
        {#if variants?.length > 0}
            <select class="browser-default" style="margin-top: 1rem;" bind:value={selectedVariant} on:change={() => getCurrentVariant(selectedVariant)}>
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
        {#if notifyMessage}
            <p>{notifyMessage}</p>
        {/if}
        {#if baseVariant && inputProgData}
            <form on:submit|preventDefault={getProjectResult}>
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
                            {#if field.name === 'p_K16'}
                                <tr>
                                    <td><i>Гранулометрический состав кокса ММК<br/>Содержание фракции, % (по размеру фракции, мм)</i></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            {:else if field.name === 'p_K20'}
                                <tr>
                                    <td><i>Гранулометрический состав и порозность агломерата<br/>Содержание фракции, % (по размеру фракции, мм)</i></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            {:else if field.name === 'p_K21'}
                                <tr>
                                    <td><i>Порозность, м3/м3(по размеру фракции, мм)</i></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            {/if}
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
                <div class="d-flex align-items-center" style="margin-top: 1rem;">
                    <button type="submit" class="btn btn-primary">Отправить</button>
                </div>
            </form>
            {#if errorMessage}
                <p class="text-danger mt-3">{errorMessage}</p>
            {/if}
        {/if}
        {#if result}
            <div class="result mt-4">
                <h5 style="margin-bottom: 1rem;">Результаты прогноза показателей газодинамического режима доменной плавки</h5>
                <button type="button" class="btn btn-light mb-3" on:click={() => exportResultToExcel(result, false, 'project')}>Экспорт в Excel</button>
                <table class="table table-result">
                    <thead>
                        <tr>
                            <th scope="col">Параметр</th>
                            <th scope="col">Значение</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="7" class="text-center">Исходные данные</td>
                        </tr>
                        {#each PROJECT_FIELDS as field}
                            {#if field.name === 'p_K16'}
                                <tr>
                                    <td><i>Гранулометрический состав кокса ММК<br/>Содержание фракции, % (по размеру фракции, мм)</i></td>
                                    <td></td>
                                </tr>
                            {:else if field.name === 'p_K20'}
                                <tr>
                                    <td><i>Гранулометрический состав и порозность агломерата<br/>Содержание фракции, % (по размеру фракции, мм)</i></td>
                                    <td></td>
                                </tr>
                            {:else if field.name === 'p_K21'}
                                <tr>
                                    <td><i>Порозность, м3/м3(по размеру фракции, мм)</i></td>
                                    <td></td>
                                </tr>
                            {/if}
                            <tr>
                                <td>{field.description}</td>
                                <td><mark>{Math.round(result.comparativeResult.inputProgData[`${field.name}`] * 10000) / 10000}</mark></td>
                            </tr>
                        {/each}
                        <tr>
                            <td colspan="7" class="text-center">Результаты расчета</td>
                        </tr>
                        <tr>
                            <td><i>Изменение высоты слоя шихты в печи</i></td>
                            <td></td>
                        </tr>
                        {#each PROJECT_RESULT_FIELDS as field}
                            {#if field.name === 'd18'}
                                <tr>
                                    <td><i>Влияние приращения гранулометрического состава шихтовых материалов на газодинамические характеристики слоя шихты в печи<br/>Влияние гранулометрического состава агломерата и кокса на газодинамические характеристики столба шихты в печи</i></td>
                                    <td></td>
                                </tr>
                            {:else if field.name === 'd46'}
                                <tr>
                                    <td><i>Влияние гранулометрического состава кокса и удельного выхода шлака на газодинамические характеристики слоя шихты в нижней зоне печи</i></td>
                                    <td></td>
                                </tr>
                            {:else if field.name === 'd79'}
                                <tr>
                                    <td><i>Влияние параметров комбинированного дутья на газодинамический режим доменной плавки</i></td>
                                    <td></td>
                                </tr>
                            {:else if field.name === 'd152'}
                                <tr>
                                    <td><i>Влияние давления колошникового газа на газодинамический режим доменной плавки</i></td>
                                    <td></td>
                                </tr>
                            {:else if field.name === 'd160'}
                                <tr>
                                    <td><i>Влияние системы загрузки на газодинамический режим доменной плавки</i></td>
                                    <td></td>
                                </tr>
                            {/if}
                            <tr>
                                <td>{field.description}</td>
                                <td><mark>{Math.round(result.comparativeResult.resultProgData[`${field.name}`] * 10000) / 10000}</mark></td>
                            </tr>
                        {/each}
                        <tr>
                            <td>Дата проведения расчета</td>
                            <td>{dayjs(new Date()).format('DD.MM.YYYY HH:mm:ss')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        {/if}
    {:else}
        <p>Войдите в систему, чтобы воспользоваться функционалом</p>
    {/if}
</div>