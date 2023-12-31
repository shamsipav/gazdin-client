<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte'
    import { fade } from 'svelte/transition'
    import { clickOutside } from '$lib/actions'
    
    export let closable = true
    export let hasFooter = true
    export let title = 'Modal'

    let ready = false
    let visible = false
    const TRANSITION_DELAY = 50
    const TRANSITION_DURATION = 50
    const dispatch = createEventDispatcher()

    export const open = () => {
        if (visible) return
        visible = true
        setTimeout(() => ready = true, (TRANSITION_DELAY + TRANSITION_DURATION))
        dispatch('open')
    }

    export const close = () => {
        if (!visible) return
        if (closable && ready) {
            visible = false
            setTimeout(() => ready = false, (TRANSITION_DELAY + TRANSITION_DURATION))
            dispatch('close')
        }
    }

    export const toggle = () => visible ? close() : open()

    onMount(() => {
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            if (event.key == 'Escape') {
                close()
            }
        })
    })
</script>

{#if visible}
    <div class="modal-overlay" in:fade="{{ duration: TRANSITION_DURATION }}" out:fade="{{ delay: TRANSITION_DELAY, duration: TRANSITION_DURATION }}">
        <div class="modal">
            <div class="modal-content" use:clickOutside={close}>
                <div class="modal-header">
                    <h4 class="modal-title">{ title }</h4>
                </div>
                <div class="modal-body">
                    <slot />
                </div>
                {#if hasFooter}
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            on:click={close}
                            >Отмена</button>
                        <button type="button" class="btn btn-primary" on:click={() => dispatch('confirm')}>Подтвердить</button>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .modal {
        display: block;
        z-index: 5;
        top: 10%;
        transform: scaleX(1) scaleY(1);
    }
    .modal-overlay {
        display: block;
        background-color: rgba(0,0,0,0.5);
    }
</style>
