<script lang="ts">
    import { redirect, setCookie } from '$lib/utils.js'
    import { createEventDispatcher } from 'svelte'
    import { API_URL } from '$lib/consts'
    import type { IResponse } from '$lib/types'

    const dispatch = createEventDispatcher()

    export let path: string
    export let redirectTo = ''
    export let autocomplete: 'on' | 'off' = 'on'
    export let content: 'application/json' | 'multipart/form-data' = 'application/json'

    let successMessage = ''
    let errorMessage = ''

    const handleSubmit = async (e) => {
        const ACTION_URL = e.target.action
        const formData = new FormData(e.target)
        const data:any = {}
        formData.forEach((value, key) => data[key] = value)

        try {
            let res = await fetch(ACTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': content,
                },
                body: JSON.stringify(data)
            })

            const jsonResult: IResponse = await res.json()

            if (res.ok) {
                errorMessage = ''
                successMessage = jsonResult.successMsg

                if (ACTION_URL == `${API_URL}/auth/login`) {
                    setCookie('token', jsonResult.result, 3, true)
                }
    
                dispatch('success')

                // e.target.reset()
                if (redirectTo) redirect(redirectTo)
            } else {
                errorMessage = jsonResult.errorMsg
                successMessage = ''
            }
        } catch (error) {
            console.error(error)
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