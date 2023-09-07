<script lang="ts">
    import dayjs from 'dayjs'
    import axios from 'axios'
    import type { IVariant, IResponse, IUnionFullResult } from '$lib/types'
    import { API_URL, VARIANT_FIELDS, RESULT_FIELDS, PRE_RESULT_FIELDS } from '$lib/consts'
    import type { PageData } from './$types'
    import { exportResultToExcel } from '$lib/utils'

    export let data: PageData
    
    let authorized: boolean = data.authorized
    let variants: IVariant[] = data.variants

    let baseVariantSelected
    let compVariantSelected

    let disabled = false

    let result: IUnionFullResult

    let errorMessage: string

    disabled = true

    const checkVariants = () => {
        if (baseVariantSelected == 0 || compVariantSelected == 0) {
            disabled = true
        } else if (baseVariantSelected == compVariantSelected) {
            disabled = true
            errorMessage = 'Необходимо выбрать разные варианты исходных данных'
        } else {
            disabled = false
            errorMessage = ''
        }
    }

    const getDifference = async () => {
        try {
            const response = await axios.get(`${API_URL}/calculate`, { params: { basePeriodId: baseVariantSelected, comparativePeriodId: compVariantSelected } })
            const jsonResult: IResponse = response.data
            result = jsonResult.result
            errorMessage = ''
        } catch (error) {
            errorMessage = error.response.data.errorMessage
            console.log(`Не удалось обновить варианты исходных данных: ${error}`)
        }
    }
</script>

<svelte:head>
	<title>GazDinWeb: Сравнение</title>
</svelte:head>

<div class="container">
    <h4>Сравнение параметров расчета базовых периодов</h4>
    {#if authorized}
        <h6 style="margin-bottom: 1rem;">Варианты исходных данных</h6>
        {#if variants?.length > 0}
            <div class="row">
                <div class="col">
                    <select class="browser-default" bind:value={baseVariantSelected} aria-label="Default select example" on:change={checkVariants}>
                        <option value=0 selected disabled>Базовый период</option>               
                        {#each variants as variant}
                            <option value={variant.id}>
                                Вариант №{variant.id} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
                            </option>
                        {/each}
                    </select>
                </div>
                <div class="col">
                    <select class="browser-default" bind:value={compVariantSelected} aria-label="Default select example" on:change={checkVariants}>
                        <option value=0 selected disabled>Сравнительный период</option>
                        {#each variants as variant}
                            <option value={variant.id}>
                                Вариант №{variant.id} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
                            </option>
                        {/each}
                    </select>
                </div>
            </div>
            <button type="button" class="btn btn-primary" on:click={getDifference} disabled={disabled}>Сравнить</button>
        {:else}
            <p class="mt-3">Нет сохраненных вариантов</p>
        {/if}
        {#if errorMessage}
            <p class="text-danger mt-3">{errorMessage}</p>
        {/if}
        {#if result}
            <div class="result mt-4">
                <h5 style="margin-bottom: 1rem;">Результаты сопоставления</h5>
                <button type="button" class="btn btn-light mb-3" on:click={() => exportResultToExcel(result, true, 'comparative')}>Экспорт в Excel</button>
                <table class="table table-result">
                    <thead>
                        <tr>
                            <th scope="col">Параметр</th>
                            <th scope="col">Значение (баз. пер.)</th>
                            <th scope="col">Значение (сравн. пер.)</th>
                            <th scope="col">Отклонение</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="7" class="text-center">Исходные данные</td>
                        </tr>
                        <tr>
                            <td><i>Содержание элементов в шлаке</i></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Fe</td>
                            <td>{Math.round(result.baseResult.resultData['c3'] * 100) / 100}</td>
                            <td>{Math.round(result.comparativeResult.resultData['c3'] * 100) / 100}</td>
                            <td>{Math.abs(Math.round(result.comparativeResult.resultData['c3'] - result.baseResult.resultData['c3']))}</td>
                        </tr>
                        {#each VARIANT_FIELDS as field}
                            {#if field.name === 'i40'}
                                <tr>
                                    <td><i>Гранулометрический состав кокса<br/>Содержание фракции, % (по размеру фракции, мм)</i></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            {:else if field.name === 'i45'}
                                <tr>
                                    <td>Сумма</td>
                                    <td>{Math.round(result.baseResult.resultData['n40'] * 100) / 100}</td>
                                    <td>{Math.round(result.comparativeResult.resultData['n40'] * 100) / 100}</td>
                                    <td>{Math.abs(Math.round(result.comparativeResult.resultData['n40'] - result.baseResult.resultData['n40']))}</td>
                                </tr>
                                <tr>
                                    <td>Порозность</td>
                                    <td>{Math.round(result.baseResult.resultData['h41'] * 100) / 100}</td>
                                    <td>{Math.round(result.comparativeResult.resultData['h41'] * 100) / 100}</td>
                                    <td>{Math.abs(Math.round(result.comparativeResult.resultData['h41'] - result.baseResult.resultData['h41']))}</td>
                                </tr>
                                <tr>
                                    <td><i>Гранулометрический состав и порозность агломерата<br/>Содержание фракции, % (по размеру фракции, мм)</i></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            {:else if field.name === 'j50'}
                                <tr>
                                    <td>Сумма</td>
                                    <td>{Math.round(result.baseResult.resultData['m45'] * 100) / 100}</td>
                                    <td>{Math.round(result.comparativeResult.resultData['m45'] * 100) / 100}</td>
                                    <td>{Math.abs(Math.round(result.comparativeResult.resultData['m45'] - result.baseResult.resultData['m45']))}</td>
                                </tr>
                                <tr>
                                    <td>Порозность</td>
                                    <td>{Math.round(result.baseResult.resultData['h46'] * 100) / 100}</td>
                                    <td>{Math.round(result.comparativeResult.resultData['h46'] * 100) / 100}</td>
                                    <td>{Math.abs(Math.round(result.comparativeResult.resultData['h46'] - result.baseResult.resultData['h46']))}</td>
                                </tr>
                                <tr>
                                    <td><i>Гранулометрический состав окатышей<br/>Содержание фракции, % (по размеру фракции, мм)</i></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            {/if}
                            <tr>
                                <td>{field.description}</td>
                                <td>{Math.round(result.baseResult.inputData[`${field.name}`] * 10000) / 10000}</td>
                                <td>{Math.round(result.comparativeResult.inputData[`${field.name}`] * 10000) / 10000}</td>
                                <td>{Math.abs(Math.round((result.comparativeResult.inputData[`${field.name}`] - result.baseResult.inputData[`${field.name}`]) * 10000) / 10000)}</td>
                            </tr>
                        {/each}
                        <tr>
                            <td>Сумма</td>
                            <td>{Math.round(result.baseResult.resultData['m50'] * 100) / 100}</td>
                            <td>{Math.round(result.comparativeResult.resultData['m50'] * 100) / 100}</td>
                            <td>{Math.abs(Math.round(result.comparativeResult.resultData['m50'] - result.baseResult.resultData['m50']))}</td>
                        </tr>
                        <tr>
                            <td>Порозность</td>
                            <td>{Math.round(result.baseResult.resultData['h51'] * 100) / 100}</td>
                            <td>{Math.round(result.comparativeResult.resultData['h51'] * 100) / 100}</td>
                            <td>{Math.abs(Math.round(result.comparativeResult.resultData['h51'] - result.baseResult.resultData['h51']))}</td>
                        </tr>
                        {#each PRE_RESULT_FIELDS as field, i}
                            {#if i > 0 && i <= 10}
                                <tr>
                                    <td>{field.description}</td>
                                    <td>{Math.round(result.baseResult.resultData[`${field.name}`] * 10000) / 10000}</td>
                                    <td>{Math.round(result.comparativeResult.resultData[`${field.name}`] * 10000) / 10000}</td>
                                    <td>{Math.abs(Math.round((result.comparativeResult.resultData[`${field.name}`] - result.baseResult.resultData[`${field.name}`]) * 10000) / 10000)}</td>
                                </tr>
                            {/if}
                        {/each}
                        <tr>
                            <td colspan="7" class="text-center">Результаты расчета</td>
                        </tr>
                        {#each RESULT_FIELDS as field}
                            <tr 
                                class="{field.name == 'indexOfTheBottomOfTheFurnace' ||
                                field.name == 'indexOfTheFurnaceTop' ||
                                field.name == 'theoreticalBurningTemperatureOfCarbonCoke' ? 'table-primary' : ''}" 
                               
                            >
                                <td>{field.description}</td>
                                <td><mark>{Math.round(result.baseResult.resultData[`${field.name}`] * 10000) / 10000}</mark></td>
                                <td><mark>{Math.round(result.comparativeResult.resultData[`${field.name}`] * 10000) / 10000}</mark></td>
                                <td>{Math.abs(Math.round((result.comparativeResult.resultData[`${field.name}`] - result.baseResult.resultData[`${field.name}`]) * 10000) / 10000)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    {:else}
        <p>Войдите в систему, чтобы воспользоваться функционалом</p>
    {/if}
</div>

<style>
</style>