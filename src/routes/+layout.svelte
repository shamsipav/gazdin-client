<script lang='ts'>
    import 'dayjs/locale/ru'
    import dayjs from 'dayjs'
    import type { IModal, IUser } from '$lib/types'
    import { Modal, NewForm } from '$components'
    import { API_URL } from '$lib/consts'
    import type { PageData } from './$types'
    import { logout } from '$lib/utils'

    dayjs.locale('ru')

    export let data: PageData

    let user: IUser = data.user

    let loginModal: IModal = undefined
    let registerModal: IModal = undefined

    let successMessage = ''

    const authentificate = async () => {
        successMessage = 'Вход в аккаунт выполнен'
    }

    const registration = async () => {
        successMessage = 'Успешная регистрация'
        setTimeout(() => registerModal.close(), 1000)
        loginModal.open()
    }
</script>

<Modal bind:this={loginModal} hasFooter={false} title="Вход в систему">
    <NewForm path="{API_URL}/auth/login" on:success={authentificate} redirectTo="/">
        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Email</label>
            <input type="email" name="email" class="form-control" placeholder="name@example.com">
        </div>
        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Пароль</label>
            <input type="password" name="password" class="form-control">
        </div>
        <button class="btn" style="margin-top: 1rem;">Войти</button>
    </NewForm>
</Modal>

<Modal bind:this={registerModal} hasFooter={false} title="Новый аккаунт">
    <NewForm path="{API_URL}/auth/reg" on:success={registration}>
        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Имя</label>
            <input type="text" name="firstName" class="form-control">
        </div>
        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Фамилия</label>
            <input type="text" name="lastName" class="form-control">
        </div>
        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Email</label>
            <input type="email" name="email" class="form-control" placeholder="name@example.com">
        </div>
        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Пароль</label>
            <input type="password" name="password" class="form-control">
        </div>
        <button class="btn" style="margin-top: 1rem;">Создать аккаунт</button>
    </NewForm>
</Modal>

<div class="navbar-fixed">
    <nav class="brown lighten-2">
        <div class="nav-wrapper container">
            <a href="/" class="brand-logo">GazDinWeb</a>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li>
                    <a href="/comparison">Сравнение</a>
                </li>
                <li>
                    <a href="/project">Проектный режим</a>
                </li>
                <li>
                    <a href="/materials">Справочник шихтовых материалов</a>
                </li>
                {#if user}
                    <li style="display: flex; align-items: center; height: 64px; margin-left: 2rem;">
                        <p class="link-bold" style="margin-right: 1rem">{user.firstName}</p>
                        <button type="button" class="btn btn-outline-secondary btn-sm" on:click={logout}>Выйти</button>
                    </li>
                {:else}
                    <li style="margin-left: 2rem;">
                        <button type="button" class="btn btn-primary btn-sm me-2" on:click={loginModal.open}>Войти</button>
                        <button type="button" class="btn btn-primary btn-sm" on:click={registerModal.open}>Зарегистрироваться</button>
                    </li>
                {/if}
            </ul>
    
        </div>
    </nav>
</div>

<main>
    <slot />
</main>

<footer>
    <div class="container">
        <p class="mt-5 mb-3 text-center">Магистерская диссертация<br/>Иван Уланов НМТМ-223901</p>
    </div>
</footer>

<style>

</style>
