<script lang="ts">
    import dayjs from 'dayjs'
    import { fade } from 'svelte/transition'
    import { exportResultToExcel, getCookie, redirect } from '$lib/utils.js'
    import type { IFullResult, IResponse } from '$lib/types'
    import { VARIANT_FIELDS, RESULT_FIELDS } from '$lib/consts'
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    export let path: string
    export let redirectTo = ''
    export let autocomplete: 'on' | 'off' = 'on'
    export let content: 'application/json' | 'multipart/form-data' = 'application/json'

    let fullResults = false
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
            console.log(result)

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
    <p class="mt-2 mb-0 text-success" transition:fade>{successMessage}</p>
{/if}
{#if errorMessage}
    <p class="mt-2 mb-0 text-danger" transition:fade>{errorMessage}</p>
{/if}
{#if loaderShow}
    <div class="spinner-border mt-4" role="status" transition:fade>
        <span class="visually-hidden">Loading...</span>
    </div>
{/if}
<!-- TODO: Вынести отсюда в отдельный компонент -->
{#if result}
    <div class="result" transition:fade>
        <div class="result__full mt-4" transition:fade>
            <p class="h5 mb-3">Результаты расчета</p>
            <button type="button" class="btn btn-light mb-3" on:click={() => exportResultToExcel(result)}>Экспорт в Excel</button>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Параметр</th>
                        <th scope="col">Значение</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="table-warning">
                        <td colspan="7" class="text-center">Исходные данные</td>
                    </tr>
                    {#each VARIANT_FIELDS as field}
                        <tr transition:fade>
                            <td>{field.description}</td>
                            <!-- <td>{Math.round(result.input[`${field}`] * 100) / 100}</td> -->
                            <td>{result.inputData[`${field.name}`]}</td>
                        </tr>
                    {/each}
                    <tr class="table-warning">
                        <td colspan="7" class="text-center">Результаты расчета</td>
                    </tr>
                    {#each RESULT_FIELDS as field}
                        <tr transition:fade>
                            <td>{field.description}</td>
                            <td><mark>{result.resultData[`${field.name}`]}</mark></td>
                        </tr>
                    {/each}
                    <tr transition:fade>
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