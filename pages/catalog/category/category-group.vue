<template>
    <div>
        <head-line title="Создание группы категорий"></head-line>
        <div class="category__form">
            <form @submit.prevent="onSubmit"
                class="category__form-wrapper">
                <input-base id="input-text" class="input-text category__control mt-0" label="Название группы категорий"
                    v-model="form.name"/>
                <v-redactor class="category__control"
                    v-model="form.description"/>
                <input-file class="category__control"
                    v-model="imageBase64"/>
                <input-file class="input-file_icon category__control" v-model="iconBase64">
                    <template v-slot:uploadTitle>Загрузите иконку</template>
                    <template v-slot:uploadText>
                        Загружено максимальное количество иконок: 1 Для удаления или замены наведите на иконку
                    </template>
                </input-file>
                <input-checkbox class="input-checkbox_origin category__control" text="Скрыть от пользователей"></input-checkbox>
                <v-btn class="btn-transparent btn-block btn_disable btn_create btn_py-12"
                    type="submit">Создать</v-btn>
            </form>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import API from '@/utils/api'
import textHelper from '@/utils/textHelper'
import HeadLine from '@/components/HeadLine'
import InputBase from '@/components/InputBase'
import VRedactor from '@/components/VRedactor'
import VBtn from '@/components/VBtn'
import InputFile from '@/components/InputFile'
import InputCheckbox from '@/components/InputCheckbox'

export default {
    layout: 'default-without-sidebar',
    mixins: [
        textHelper
    ],
    data() {
        return {
            form: {
                name: '',
                description: '',
                image: '',
                url: '',
                icon: '',
                hidden: 0
            },
            imageBase64: '',
            iconBase64: '',
            loading: false,
        }
    },
    components: {
        HeadLine,
        InputBase,
        VBtn,  
        InputFile,
        InputCheckbox,
        VRedactor,
    },
    methods: {
        ...mapActions('categories', {
            createCategory: 'createCategory',
        }),
        async onSubmit() {
            this.loading = true
            try {
                this.form.url = this.urlFormatter(this.translit(this.form.name))
                if (this.imageBase64) {
                    this.form.image = await API.updloadBase64Image(this.$axios, this.imageBase64)
                }
                if (this.iconBase64) {
                    this.form.icon = await API.updloadBase64Image(this.$axios, this.iconBase64)
                }
                await this.createCategory({ form: this.form })
                this.$router.push('/catalog/catalog')
            } catch (error) {
                
            }
            this.loading = false
        }
    }
}
</script>

<style>

</style>
