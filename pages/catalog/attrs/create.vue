<template>
    <div class="container">
        <head-line title="Создание характеристики"></head-line>
        <div class="category__form">
            <form @submit.prevent="onSubmit" class="category__form-wrapper">
                <!-- <input-base
                    class="category__control"
                    v-model="form.id"
                    id="input-id"
                    label="ID"/> -->
                <input-base
                    class="category__control"
                    v-model="form.name"
                    id="input-name"
                    label="Введите название и единица измерения (если есть)"
                    :validator="$v.form.name"/>

                <v-multiselect
                    class="category__control"
                    v-model="form.field"
                    :options="types"
                    label="text"
                    :allow-empty="false"
                    id="input-field"
                    placeholder=""
                    innerText="Выберите тип поля"
                    :validator="$v.form.field"/>
                <v-redactor
                    class="category__control"
                    v-model="form.description"
                    id="input-description"
                    placeholder="Введите описание характеристики"/>
                <v-multiselect
                    class="category__control select select"
                    v-model="form.filter"
                    :options="types"
                    label="text"
                    :allow-empty="false"
                    id="input-filter"
                    placeholder=""
                    innerText="Выберите тип фильтра"
                    :validator="$v.form.filter"/>
                <v-btn class="btn-transparent btn-block btn_disable btn_create btn_py-12"
                    :class="{ 'btn_active': isDone }"
                    type="submit"
                    :loading="loading">Создать</v-btn>
            </form>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import { debounce } from 'throttle-debounce'
import VMultiselect from '@/components/VMultiselect'
import InputBase from '@/components/InputBase'
import VRedactor from '@/components/VRedactor'
import VBtn from '@/components/VBtn'
import HeadLine from '@/components/HeadLine'
import { required, minLength } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

export default {
    layout: 'default-without-sidebar',
    mixins: [
        validationMixin,
    ],
    validations() {
        return {
            form: {
                name: {
                    required,
                    minLength: minLength(2),
                },
                field: {
                    required,
                },
                filter: {
                    required,
                },
            }
        }
    },
    data() {
        return {
            loading: false,
            form: {
                id: '',
                name: '',
                field: '',
                description: '',
                filter: '',
            },
            types: [
                { name: 'checkbox', text: 'Чекбокс' },
                { name: 'slider', text: 'Слайдер' },
                { name: 'radio', text: 'Радио' },
                { name: 'empty', text: 'Без фильтра' },
            ],
            fieldType: '',
            filterType: '',
        }
    },
    watch: {
        fieldType: function(value) { this.form.field = value.name },
        filterType: function(value) { this.form.filter = value.name },
    },
    computed: {
        isDone() {
            return !!this.form.name && !!this.form.field && !!this.form.filter
        },
    },
    components: {
        VMultiselect,
        InputBase,
        VRedactor,
        VBtn,
        HeadLine
    },
    methods: {
        ...mapActions('attrs', {
            createAttr: 'createAttr',
        }),
        async onSubmit() {
            this.$v.form.$touch()
            if (this.loading || this.$v.form.$pending || this.$v.form.$error) return
            this.loading = true
            try {
                await this.createAttr(this.form)
                this.$router.push('/catalog/attrs')
            } catch (error) {
                
            }
            this.loading = false
        }
    }
}
</script>

<style lang="scss">

</style>