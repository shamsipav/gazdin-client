<script lang="ts">
    import axios from 'axios'
    import dayjs from 'dayjs'
    import { Form } from '$components'
    import { API_URL, VARIANT_FIELDS } from '$lib/consts'
    import type { IVariant, IResponse, IUser } from '$lib/types'
    import type { PageData } from './$types'
    import { getCookie } from '$lib/utils'

    export let data: PageData

    let user: IUser = data.user
    let defaultState = data.default
    let variants: IVariant[] = data.variants
    let saveVariant = false

    let notifyMessage = ''

    let selectedVariant

    const getCurrentVariant = (selectedVariant: number) => {
        defaultState = selectedVariant == 0 ? data.default : variants.find(x => x.id == selectedVariant)
        saveVariant = false

        notifyMessage = `Вариант №${defaultState.id} успешно загружен`
        setTimeout(() => notifyMessage = '', 2500)
    }

    const getVariants = async () => {
        try {
            const token = getCookie('token')
            if (token) {
                const response = await axios.get(`${API_URL}/variants`, { headers: { 'Authorization': `Bearer ${token}` } })
                const responseResult: IResponse = response.data
                variants = responseResult.result

            } else {
                console.log('Не удалось получить токен для обновления списка вариантов')
            }
        } catch (error) {
            console.log(`Не удалось обновить варианты исходных данных: ${error}`)
        }
    }

    const successHandler = async () => {
        if (user) {
            await getVariants()
        }

        if (defaultState.id > 0 && !saveVariant)
            notifyMessage = `Вариант №${defaultState.id} от ${defaultState.saveDate ? dayjs(defaultState.saveDate).format('DD.MM.YYYY') : 'неизвестной даты'} обновлен`
        else
            notifyMessage = 'Расчет базового периода выполнен успешно'

        setTimeout(() => notifyMessage = '', 2500)
    }
</script>

<svelte:head>
	<title>GazDinWeb: Главная</title>
</svelte:head>

<div class="container">
    <h4>Расчет базового периода</h4>
    {#if user}
        <h6>Варианты исходных данных</h6>
        {#if variants?.length > 0}
            <select class="browser-default" bind:value={selectedVariant} on:change={() => getCurrentVariant(selectedVariant)} style="margin-bottom: 1rem;">
                <option selected disabled>Вариант исходных данных</option>
                <option selected value="0">По умолчанию</option>
                {#each variants as variant}
                    <option value={variant.id}>
                        Вариант №{variant.id} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
                    </option>
                {/each}
            </select>
        {:else}
            <p class="mt-3" style="margin-bottom: 1rem;">Нет сохраненных вариантов, загружен вариант по умолчанию</p>
        {/if}
    {/if}
    {#if Object.keys(defaultState).length > 0}
        <Form path="{API_URL}/calculate" on:success={successHandler}>
            {#if defaultState.id > 0}
                <input type="number" name="id" value={defaultState.id} hidden>
            {/if}
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Параметр</th>
                        <th scope="col">Значение</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><i>Содержание элементов в шлаке</i></td>
                        <td></td>
                    </tr>
                    {#each VARIANT_FIELDS as field}
                        {#if field.name === 'i40'}
                            <tr>
                                <td><i>Гранулометрический состав кокса<br/>Содержание фракции, % (по размеру фракции, мм)</i></td>
                                <td></td>
                            </tr>
                        {:else if field.name === 'i45'}
                            <tr>
                                <td><i>Гранулометрический состав и порозность агломерата<br/>Содержание фракции, % (по размеру фракции, мм)</i></td>
                                <td></td>
                            </tr>
                        {:else if field.name === 'j50'}
                            <tr>
                                <td><i>Гранулометрический состав окатышей<br/>Содержание фракции, % (по размеру фракции, мм)</i></td>
                                <td></td>
                            </tr>
                        {/if}
                        <tr>
                            <td>{field.description}</td>
                            <td>
                                <input type="text" class="form-control" name={field.name} value={defaultState ? defaultState[`${field.name}`] : 0} autocomplete="off" required>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <div style="display: flex; align-items: center; margin-top: 1rem;">
                <button type="submit" class="btn btn-primary mt-3">Отправить</button>
                {#if user}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="d-flex align-items-center" style="margin-left: 2rem;">
                        <label>
                            <input bind:checked={saveVariant} type="checkbox" name="save" class="filled-in" value={saveVariant} />
                            <span>Сохранить вариант исходных данных</span>
                        </label>
                    </div>
                {/if}
            </div>
            {#if notifyMessage}
                <p class="text-success">{notifyMessage}</p>
            {/if}
        </Form>
    {:else}
        <p>Не удалось получить исходных вариант исходных данных для расчета с сервера WebAPI</p>
    {/if}
</div>
