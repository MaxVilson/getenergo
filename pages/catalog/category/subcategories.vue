<template>
    <div>
        <modal-add-characteristic :value="attrs"
            @input="attrs = $event.slice()"/>
        <head-line title="Создание подкатегории"></head-line>
        <form @submit.prevent="onSubmit" class="category__form">
            <div class="category__form-wrapper">
                <div class="form-group category__control">
                    <form-group-title title="Общее" @click="isHidden = !isHidden"/>
                    <transition-expand>
                        <div v-if="!isHidden">
                            <v-multiselect
                                class="category__control"
                                v-model="form.root_id"
                                :options="categoryOptions"
                                label="text"
                                :allow-empty="false"
                                id="input-filter"
                                placeholder=""
                                :showNoResults="false"
                                innerText="Выберите группу категорий"/>

                            <v-multiselect
                                class="category__control"
                                v-model="form.parent_id"
                                :options="childCategoryOptions"
                                label="text"
                                :allow-empty="false"
                                id="input-filter2"
                                placeholder=""
                                :showNoResults="false"
                                innerText="Выберите категорию"/>

                            <input-base id="input-text" class="input-text category__control mt-0" label="Название подкатегории"
                            v-model="form.name"/> 

                            <v-multiselect
                                class="category__control"
                                v-model="form.unit_id"
                                :options="unitsOptions"
                                label="text"
                                :allow-empty="false"
                                id="input-filter3"
                                placeholder=""
                                :showNoResults="false"
                                innerText="Выберите единицу измерения"/>  

                            <v-redactor class="category__control"
                                v-model="form.description"/>
                        </div>
                    </transition-expand>                
                </div>
                <input-file class="category__control" v-model="imageBase64" />

                <div class="form-group category__control">
                    <form-group-title title="Характеристики" @click="isHidden2 = !isHidden2"/>
                    <transition-expand>
                        <div v-if="!isHidden2">
                            <input-checkbox v-for="(attr, index) in attrs" :key="attr.attr_id"
                                :id="'attr-requared-' + index"
                                class="category__control"
                                v-model="required[attr.attr_id]"
                                :text="attr.name">
                                <button type="button" class="input-checkbox__delete"
                                    @click.prevent="unsetAttr(index)"><icon-base icon="delete"/></button>
                            </input-checkbox>

                            <div class="d-flex justify-content-center">
                                <v-btn class="btn_gray btn_md category__control"
                                    @click.prevent="$modal.show('add-characteristic')">Добавить</v-btn>
                            </div>
                        </div>
                    </transition-expand>
                </div>
                <input-checkbox class="input-checkbox_origin category__control" text="Скрыть от пользователей"></input-checkbox>
                <v-btn class="btn btn-transparent btn-block btn_disable btn_create category__btn-create"
                    type="submit">Создать</v-btn>
            </div>
        </form>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import API from '@/utils/api'
import textHelper from '@/utils/textHelper'
import TransitionExpand from '@/components/TransitionExpand'
import VMultiselect from '@/components/VMultiselect'
import HeadLine from '@/components/HeadLine'
import InputBase from '@/components/InputBase'
import VRedactor from '@/components/VRedactor'
import VBtn from '@/components/VBtn'
import InputFile from '@/components/InputFile'
import FormGroupTitle from '@/components/FormGroupTitle'
import InputCheckbox from '@/components/InputCheckbox'
import ModalAddCharacteristic from '@/components/ModalAddCharacteristic'

export default {
    layout: 'default-without-sidebar',
    async fetch ({ store, query }) {
        await store.dispatch('attrs/getAttrs', { page: 1, limit: 8 })
        await store.dispatch('units/getUnits')
        await store.dispatch('categories/getCategories')
    },
    mixins: [
        textHelper
    ],
    data() {
        return {
            isHidden: false,
            isHidden2: false,
            attrs: [],
            required: {},
            form: {
                root_id: null,
                parent_id: null,
                name: '',
                unit_id: null,
                description: '',
                image: '',
                url: '',
                hidden: 0
            },
            imageBase64: '',
            loading: false,
            types: [
                { name: 'checkbox', text: 'Чекбокс' },
                { name: 'slider', text: 'Слайдер' },
                { name: 'radio', text: 'Радио' },
                { name: 'empty', text: 'Без фильтра' },
            ],
        }
    },
    components: {
        HeadLine,
        InputBase,   
        VRedactor,
        VBtn,  
        InputFile,
        FormGroupTitle,
        InputCheckbox,
        ModalAddCharacteristic,
        TransitionExpand,
        VMultiselect
    },
    computed: {
        ...mapGetters({
            units: 'units/getUnits',
            categories: 'categories/getCategories',
        }),
        categoryOptions() {
            return this.categories.filter(category => category.path.length).map(category => { return { name: category.category_id, text: category.name }})
        },
        childCategoryOptions() {
            if (!this.form.root_id) {
                return []
            }
            return this.categories.find(category => category.category_id === this.form.root_id).path.map(category => { return { name: category.category_id, text: category.name }})
        },
        unitsOptions() {
            return this.units.map(unit => { return { name: unit.unit_id, text: unit.name }})
        }
    },
    methods: {
        ...mapActions('categories', {
            createCategory: 'createCategory',
        }),
        unsetAttr(index) {
            Vue.delete(this.required, this.attrs[index].attr_id)
            this.attrs.splice(index, 1)
        },
        async onSubmit() {
            this.loading = true
            try {
                const attrs = this.attrs.map(attr => { return { attr_id: attr.attr_id, required: this.required[attr.attr_id] } })
                this.form.url = this.urlFormatter(this.translit(this.form.name))
                if (this.imageBase64) {
                    this.form.image = await API.updloadBase64Image(this.$axios, this.imageBase64)
                }
                await this.createCategory({ form: this.form, attrs: attrs })
                this.$router.push('/catalog/catalog')

            } catch (error) {
                
            }
            this.loading = false
        }
    },
    watch: {
        attrs: function(value) {
            value.forEach(attr => {
                if (!this.required[attr.attr_id]) {
                    Vue.set(this.required, attr.attr_id, false)
                }
            })
        }
    }
}
</script>

<style lang="scss">
    .select {
        height: 56px;

        & .multiselect__select {
            margin-top: 10px;
            color: #000;
        }

        & .multiselect__tags {
            padding-top: 20px;
            padding-left: 16px;
        }

        & .multiselect__placeholder {
            padding-top: 0;
            margin-bottom: 0;
            color: #000;
        }
    }
</style>
