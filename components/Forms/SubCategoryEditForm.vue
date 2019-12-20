<template>
    <tabs-base :tabs="tabs">
        <template v-slot:common>
            <div class="popup-form-group">
                <v-multiselect
                    class="category__control"
                    v-model="value.root_id"
                    :options="categoryOptions"
                    label="text"
                    :allow-empty="false"
                    id="input-filter"
                    placeholder=""
                    :showNoResults="false"
                    innerText="Выберите группу категорий"/>

                <v-multiselect
                    class="category__control"
                    v-model="value.parent_id"
                    :options="childCategoryOptions"
                    label="text"
                    :allow-empty="false"
                    id="input-filter2"
                    placeholder=""
                    :showNoResults="false"
                    innerText="Выберите категорию"/>

                <v-multiselect
                    class="category__control"
                    v-model="value.unit_id"
                    :options="unitsOptions"
                    label="text"
                    :allow-empty="false"
                    :showNoResults="false"
                    id="input-filter2"
                    placeholder=""
                    innerText="Выберите единицу измерения"/>

                <v-redactor class="category__control"
                    v-model="value.description"/>

                <input-file class="category__control"
                    v-model="value.imageBase64"/>

                <input-checkbox class="input-checkbox_origin category__control"
                    text="Скрыть от пользователей"
                    v-model="value.hidden"/>
            </div>
        </template>

        <template v-slot:characteristic>
            <div class="popup-form-group">
                <input-checkbox v-for="(attr, index) in attrs" :key="index"
                    class="category__control"
                    :text="attr.name">
                    <button type="button" class="input-checkbox__delete"
                        @click.prevent="unsetAttr(index)"><icon-base icon="delete"/></button>
                </input-checkbox>
                <div class="d-flex justify-content-center">
                    <v-btn class="btn_gray btn_md category__control"
                        @click.prevent="$modal.show('add-characteristic')">Добавить</v-btn>
                </div>
            </div>
        </template>

        <template v-slot:seo>
            <div class="popup-form-group">
                <input-base id="input-text"
                    class="input-text category__control mt-0 mb-3"
                    label="Url"
                    v-model="value.url"/>

                <input-base id="input-text"
                    class="input-text category__control mt-0 mb-3"
                    label="Title"
                    v-model="value.title"/>

                <input-base id="input-text"
                    class="input-text category__control mt-0 mb-4"
                    label="Meta description"
                    v-model="value.meta_description"/>

                <input-base id="input-text"
                    class="input-text category__control mt-0 mb-3"
                    label="Alt photo"
                    v-model="value.alt_image"/>
            </div>

            <div class="popup-form-group-line">
                <input-base id="input-text"
                    class="input-text category__control mt-0 mb-4"
                    label="Meta description эталон"
                    v-model="value.meta_descriptionEtalon"/>

                <input-checkbox class="input-checkbox_origin category__control mb-3"
                    text="Закрыть от индексации"
                    v-model="value.hide_robots"/>

                <input-checkbox class="input-checkbox_origin mt-0 mb-4"
                    text="Исключить страницу из карты сайта"
                    v-model="value.hide_sitemap"/>
            </div>
        </template>
    </tabs-base>
</template>

<script>
import InputBase from '@/components/InputBase'
import InputCheckbox from '@/components/InputCheckbox'
import VRedactor from '@/components/VRedactor'
import TabsBase from '@/components/TabsBase'
import InputFile from '@/components/InputFile'
import VMultiselect from '@/components/VMultiselect'
import { mapActions, mapGetters } from 'vuex'

export default {
    async fetch ({ store, query }) {
        await store.dispatch('units/getUnits')
        await store.dispatch('categories/getCategories')
        await store.dispatch('attrs/getAttrs', { page: 1, limit: 8 })
    },
    components: {
        TabsBase,
        InputBase,
        InputCheckbox,
        VRedactor,
        InputFile,
        VMultiselect
    },
    data() {
        return {
            attrs: [
                { name: 'afa'},
                { name: 'afa'},
                { name: 'afa'},
            ],
            tabs: {
                common: 'Общее',
                characteristic: 'Характеристики',
                seo: 'SEO',
            }
        }
    },
    props: {
        value: {
            type: Object,
            default: () => {
                return {
                    description: '',
                    imageBase64: '',
                    iconBase64: '',
                    hidden: 0,
                    hide_robots: 0,
                    hide_sitemap: 0,
                    url: '',
                    title: '',
                    alt_image: '',
                    meta_description: '',
                    meta_descriptionEtalon: '',
                    root_id: '',
                    unit_id: '',
                    parent_id: '',
                }
            }
        },
    },
    computed: {
        ...mapGetters({
            units: 'units/getUnits',
            categories: 'categories/getCategories',
        }),
        categoryOptions() {
            return this.categories.map(category => { return { name: category.category_id, text: category.name }})
        },
        unitsOptions() {
            return this.units.map(unit => { return { name: unit.unit_id, text: unit.name }})
        },
        childCategoryOptions() {
            if (!this.value.root_id) {
                return []
            }
            return this.categories.find(category => category.category_id === this.value.root_id).path.map(category => { return { name: category.category_id, text: category.name }})
        },
    },
    methods: {
        ...mapActions('categories', {
            createCategory: 'createCategory',
        }),
        unsetAttr(index) {
            Vue.delete(this.required, this.attrs[index].attr_id)
            this.attrs.splice(index, 1)
        },
    }
}
</script>
