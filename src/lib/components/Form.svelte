<script lang="ts">
    import dayjs from 'dayjs'
    import { exportResultToExcel, getCookie, redirect } from '$lib/utils.js'
    import type { IFullResult, IResponse } from '$lib/types'
    import { VARIANT_FIELDS, RESULT_FIELDS, PRE_RESULT_FIELDS } from '$lib/consts'
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    export let path: string
    export let redirectTo = ''
    export let autocomplete: 'on' | 'off' = 'on'
    export let content: 'application/json' | 'multipart/form-data' = 'application/json'

    let result: IFullResult = undefined

    let successMessage = ''
    let errorMessage = ''
    let loaderShow = false

    const handleSubmit = async (e) => {
        const ACTION_URL = e.target.action
        const formData = new FormData(e.target)
        const data:any = {}
        formData.forEach((value, key) => data[key] = value)

        // TODO: Убрать этот велосипед
        let CURRENT_URL = data.save == 'true' ? ACTION_URL + '?save=true' : ACTION_URL
        const token = getCookie('token')

        try {
            loaderShow = true
            let res = await fetch(CURRENT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': content,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            let jsonResult: IResponse = await res.json()
            result = jsonResult.result

            if (res.ok) {
                loaderShow = false
                errorMessage = ''
                dispatch('success', result)

                // e.target.reset()
                if (redirectTo) redirect(redirectTo)
            } else {
                loaderShow = false
                errorMessage = jsonResult.errorMsg
                successMessage = ''
            }
        } catch (error) {
            loaderShow = false
            errorMessage = 'Попробуйте повторить запрос позже'
        }
    }
</script>

<form class="form" action={path} on:submit|preventDefault={handleSubmit} autocomplete={autocomplete}>
    <slot />
</form>
{#if successMessage}
    <p class="mt-2 mb-0 text-success">{successMessage}</p>
{/if}
{#if errorMessage}
    <p class="mt-2 mb-0 text-danger">{errorMessage}</p>
{/if}
{#if loaderShow}
    <p>Загрузка...</p>
{/if}
<!-- TODO: Вынести отсюда в отдельный компонент -->
{#if result}
    <div class="result">
        <div class="result__full mt-4">
            <h5>Результаты расчета</h5>
            <button type="button" class="btn btn-light mb-3" on:click={() => exportResultToExcel(result)}>Экспорт в Excel</button>
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
                    <tr>
                        <td><i>Содержание элементов в шлаке</i></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Fe</td>
                        <td>{result.resultData['c3']}</td>
                    </tr>
                    {#each VARIANT_FIELDS as field}
                        {#if field.name === 'i40'}
                            <tr>
                                <td><i>Гранулометрический состав кокса<br/>Содержание фракции, % (по размеру фракции, мм)</i></td>
                                <td></td>
                            </tr>
                        {:else if field.name === 'i45'}
                            <tr>
                                <td>Сумма</td>
                                <td>{Math.round(result.resultData['n40'] * 100) / 100}</td>
                            </tr>
                            <tr>
                                <td>Порозность</td>
                                <td>{Math.round(result.resultData['h41'] * 100) / 100}</td>
                            </tr>
                            <tr>
                                <td><i>Гранулометрический состав и порозность агломерата<br/>Содержание фракции, % (по размеру фракции, мм)</i></td>
                                <td></td>
                            </tr>
                        {:else if field.name === 'j50'}
                            <tr>
                                <td>Сумма</td>
                                <td>{Math.round(result.resultData['m45'] * 100) / 100}</td>
                            </tr>
                            <tr>
                                <td>Порозность</td>
                                <td>{Math.round(result.resultData['h46'] * 100) / 100}</td>
                            </tr>
                            <tr>
                                <td><i>Гранулометрический состав окатышей<br/>Содержание фракции, % (по размеру фракции, мм)</i></td>
                                <td></td>
                            </tr>
                        {/if}
                        <tr>
                            <td>{field.description}</td>
                            <td>{result.inputData[`${field.name}`]}</td>
                        </tr>
                    {/each}
                    <tr>
                        <td>Сумма</td>
                        <td>{Math.round(result.resultData['m50'] * 100) / 100}</td>
                    </tr>
                    <tr>
                        <td>Порозность</td>
                        <td>{Math.round(result.resultData['h51'] * 100) / 100}</td>
                    </tr>
                    {#each PRE_RESULT_FIELDS as field, i}
                        {#if i > 0 && i <= 10}
                            <tr>
                                <td>{field.description}</td>
                                <td>{Math.round(result.resultData[`${field.name}`] * 10000) / 10000}</td>
                            </tr>
                        {/if}
                    {/each}
                    <tr>
                        <td colspan="7" class="text-center">Результаты расчета</td>
                    </tr>
                    {#each RESULT_FIELDS as field}
                        <tr>
                            <td>{field.description}</td>
                            <td><mark>{Math.round(result.resultData[`${field.name}`] * 10000) / 10000}</mark></td>
                        </tr>
                    {/each}
                    <tr>
                        <td>Дата проведения расчета</td>
                        <td><mark>{dayjs(new Date()).format('DD.MM.YYYY HH:mm:ss')}</mark></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
{/if}

<style>

</style>