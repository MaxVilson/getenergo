<template>
    <div class="content-main__wrapper">
        <div class="top-text">Электродвигатели и приводная техника — Предохранители на номинальное напряжение до 1000 В <span>— Подвесные и консольные светильники для уличного освещения</span></div>
        <div class="d-flex align-items-end mb-4">
            <h1 class="title">Каталог</h1>
            <div class="buttons">
                <v-parser class="d-inline-block"
                    v-model="imported"
                    @input="onImport"><v-btn class="btn_transparent mb-2 btn-group">Загрузить эталоны</v-btn></v-parser>
                <v-btn class="btn_transparent mb-2 btn-group"
                    @click.prevent="getExport">Скачать эталоны</v-btn>
                <v-btn class="btn_transparent mb-2 btn-group">Загрузить фотографии</v-btn>
                <nuxt-link to="/catalog/model/create">
                    <v-btn class="btn_transparent mb-2 btn-group">Создать эталон</v-btn>
                </nuxt-link>
            </div>
        </div>
        <div class="d-flex flex-wrap align-items-center mb-2">
            <v-multiselect
                class="multiselect-filter mb-2"
                v-model="params.etalon"
                :options="filterEtalon"
                label="text"
                :allow-empty="false"
                :searchable="false"
                :showNoResults="false"
                placeholder="Новый эталон"/>

            <v-multiselect
                class="multiselect-filter mb-2"
                v-model="params.accessory"
                :options="filterProducts"
                label="text"
                :allow-empty="false"
                :searchable="false"
                :showNoResults="false"
                placeholder="Аксессуар"/>

            <v-multiselect
                class="multiselect-filter multiselect-filter-manufacturer mb-2"
                v-model="params.manufacturer"
                :options="filterManufacturer"
                label="text"
                :allow-empty="false"
                :showNoResults="false"
                placeholder="Все производители"/>

            <v-btn class="btn_transparent mb-2 btn-id" @click="$modal.show('model-search')">Найти эталоны по ID</v-btn>

            <input-origin type="text"
                placeholder="Поиск"
                class="input-origin_br-8 input-origin_icon-left mb-2"
                v-model="params.query">
                    <icon-base icon="search"/>
            </input-origin>
        </div>
        <table class="table w-100 mb-4">
             <thead class="page__attrs-thead">
                    <tr>
                        <td class="header-check" @click="!isAllSelected ? selected = models.map(model => model.model_id) : selected = []">
                            <icon-base icon="check" v-if="isAllSelected"/>
                        </td>
                        <td class="page__attrs-table-filter">
                            <span @click="updateSort('model_id')">ID
                                <icon-base v-if="params.sort != 'model_id'" icon="filter"/>
                                <icon-base v-if="params.sort == 'model_id' && params.order == 'desc'" icon="filter-up"/>
                                <icon-base v-if="params.sort == 'model_id' && params.order == 'asc'" icon="filter-down"/>
                            </span>
                        </td>
                        <td class="page__attrs-table-filter">
                            <span @click="updateSort('image')">Image
                                <icon-base v-if="params.sort != 'image'" icon="filter"/>
                                <icon-base v-if="params.sort == 'image' && params.order == 'desc'" icon="filter-up"/>
                                <icon-base v-if="params.sort == 'image' && params.order == 'asc'" icon="filter-down"/>
                            </span>
                        </td>
                        <td class="td-name">
                            <span @click="updateSort('name')">Название
                                <icon-base v-if="params.sort != 'name'" icon="filter"/>
                                <icon-base v-if="params.sort == 'name' && params.order == 'desc'" icon="filter-up"/>
                                <icon-base v-if="params.sort == 'name' && params.order == 'asc'" icon="filter-down"/>
                            </span>
                        </td>
                        <td class="td-date">
                            <span @click="updateSort('created_at')">Дата создания
                                <icon-base v-if="params.updateSort != 'created_at'" icon="filter"/>
                                <icon-base v-if="params.updateSort == 'created_at' && params.order == 'desc'" icon="filter-up"/>
                                <icon-base v-if="params.updateSort == 'created_at' && params.order == 'asc'" icon="filter-down"/>
                            </span>
                        </td>
                        <td></td>
                    </tr>
                </thead>
            <tbody>
                <tr v-for="model in models" :key="model.model_id">
                    <td style="width: 1%">
                        <div class="checkbox"
                             @click="toggleSelect(model.model_id)"
                             :class="{ 'checkbox_active': selected.indexOf(model.model_id) !== -1 }">
                            <icon-base icon="check"/>
                        </div>
                    </td>
                    <td style="width: 1%">{{ model.model_id }}</td>
                    <td style="width: 1%">
                        <img class="img-fluid img" v-if="!!model.images.length" :src="model.images[0].url" :alt="model.name">
                    </td>
                    <td class="col-name">
                        <span class="col-name__title" @click="$modal.show('model-edit')">{{ model.name }}</span>
                        <div class="col-name__subtitle">
                            Кол-во предложений:
                            <span>0</span>
                        </div>
                    </td>
                    <td style="width: 1%">{{ model.created_at | date }}</td>
                    <td class="td-delete" style="width: 1%">
                        <v-btn class="table-btn-delete mx-3" @click.prevent="del(model)">
                            <icon-base icon="delete"/>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="row align-items-center">
            <div class="col-auto mr-auto d-flex align-items-center">
                <span class="bottom-multiselect-text">Эталонов на странице</span>
                <v-multiselect
                    class="multiselect-bottom"
                    v-model="params.limit"
                    :options="perPageOptions"
                    label="text"
                    :searchable="false"
                    :allow-empty="false"
                    id="input-limit"
                    :placeholder="String.prototype.toString(params.limit)"/>
            </div>
            <div class="col-auto">
                <v-pagination v-model="params.page"
                    :total_pages="totalPages"
                    :params="params"/>
            </div>
        </div>
        <div>
            <modal-base name="model-edit">
                <template v-slot:title>
                    <header-edit v-model="editForm.name"/>
                </template>
                <model-edit-form></model-edit-form>
                <div class="modal-base-footer d-flex">
                    <v-btn class="btn btn_disable modal-base-footer__btn-create">Сохранить</v-btn>
                    <v-btn class="btn modal-base-footer__btn-preview ml-auto">
                        <icon-base icon="view" />
                        Предпросмотр
                    </v-btn>
                </div>
            </modal-base>

            <modal-base name="model-search" :width="400">
                <model-search-by-id v-model="params.filter_id"
                                    @input="$modal.hide('model-search')"/>
            </modal-base>

            <modal-base name="modal-delit" class="modal-delit" :width="416">
                <div class="popup-form-group">
                    <div class="modal-delit__title">Удалить эталон</div>
                    <div class="modal-delit__text">Вы действительно хотите удалить эталон: «{{ modelToRemove.name }}»?</div>
                    <div class="modal-delit__buttons">
                        <v-btn class="btn modal-delit__btn modal-delit__btn-delete" @click="deleteModel(modelToRemove.model_id); $modal.hide('modal-delit')">Да</v-btn>
                        <v-btn class="btn modal-delit__btn modal-delit__btn-cancel" @click="$modal.hide('modal-delit')">Нет</v-btn>
                    </div>
                </div>
            </modal-base>
        </div>
        <div class="model-move"
            :class="{ 'model-move_active': !!selected.length }">
            <div class="container">
                <v-btn @click="$modal.show('select-category')">{{ moveText }}</v-btn>
            </div>
        </div>
        <modal-select-category @select="onSelectCategory"/>
    </div>
</template>

<script>
import API from '@/utils/api'
import Papa from 'papaparse'
import { mapGetters, mapActions } from 'vuex'
import { debounce } from 'throttle-debounce'
import VPagination from '@/components/VPagination'
import VMultiselect from '@/components/VMultiselect'
import VBtn from '@/components/VBtn'
import InputOrigin from '@/components/InputOrigin'
import ModelEditForm from '@/components/Forms/ModelEditForm'
import ModelSearchById from '@/components/Forms/ModelSearchById'
import ModalBase from '@/components/Modal/ModalBase'
import HeaderEdit from '@/components/HeaderEdit'
import InputTextarea from '@/components/InputTextarea'
import VParser from '@/components/VParser'
import ModalSelectCategory from '@/components/Modal/ModalSelectCategory'

export default {
    async fetch({ store, query }) {
        await store.dispatch('models/getModels', query)
        await store.dispatch('categories/getCategories')
    },
    asyncData({ query }) {
        return {
            imported: [],
            params: {
                page: query.page || 1,
                limit: query.limit || 20,
                sort: query.sort || '',
                order: query.order || '',
                query: query.query || '',
                etalon: null,
                accessory: null,
                filter_id: query.filter_id || ''
            },
            editForm: {
                attr_id: '',
                id: '',
                name: '',
                description: '',
                field: '',
                filter: '',
            },
        }
    },
    components: {
        VPagination,
        VMultiselect,
        VBtn,
        InputOrigin,
        ModelEditForm,
        ModalBase,
        HeaderEdit,
        ModelSearchById,
        VParser,
        ModalSelectCategory,
        InputTextarea
    },
    computed: {
        ...mapGetters({
            models: 'models/getModels',
            page: 'models/getPage',
            limit: 'models/getLimit',
            query: 'models/getQuery',
            totalPages: 'models/getTotalPages',
            sort: 'models/getSort',
            order: 'models/getOrder',
        }),
        debounceFetch() {
            this.selected = []
            return debounce(500, this.fetch)
        },
        isAllSelected: function() {
            return this.selected.length == this.models.length
        },
        moveText: function() {
            const total = this.selected.length

            if (total == 1) {
                return 'Перенести 1 эталон'
            } else if (total > 1 && total < 5) {
                return 'Перенести ' + total + ' эталона'
            } else {
                return 'Перенести ' + total + ' эталонов'
            }
        }
    },
    data() {
        return {
            selected: [],
            modelToRemove: '',
            searchId: '',
            perPageOptions: [
                { name: 10, text: '10' },
                { name: 20, text: '20' },
                { name: 50, text: '50' },
                { name: 0, text: 'Все' },
            ],
            filterEtalon: [
                { name: 'all', text: 'Все' },
                { name: 'new', text: 'Новый эталон' },
                { name: 'this', text: 'Эталон' },
            ],
            filterProducts: [
                { name: 'product', text: 'Товар' },
                { name: 'accessory', text: 'Аксессуар' },
                { name: 'allProducts', text: 'Все' },
            ],
            filterManufacturer: [
                { name: 'allManufacturers', text: 'Все производители' },
                { name: 'manufacturer1', text: 'Произволитель 1' },
                { name: 'manufacturer2', text: 'Произволитель 2' },
                { name: 'manufacturer3', text: 'Произволитель 3' },
                { name: 'manufacturer4', text: 'Произволитель 4' },
            ],
            loading: false
        }
    },
    watch: {
        params: {
            deep: true,
            async handler(value) {
                return this.debounceFetch()
            }
        },
    },
    methods: {
        ...mapActions('models', {
            getModels: 'getModels',
            deleteModel: 'deleteModel',
            getImportErrors: 'getImportErrors',
        }),
        async onSelectCategory(category_id) {

        },
        toggleSelect(model_id) {
            const index = this.selected.indexOf(model_id)

            if (index == -1) {
                this.selected.push(model_id)
            } else {
                this.selected.splice(index, 1)
            }
        },
        async onImport(value) {
            if (value.length) {
                const importErrors = await this.getImportErrors(value)
                console.log(importErrors)
                console.log(importErrors.length)

                if (importErrors.length) {
                    let text = ''
                    text += '<code class="mt-4 d-block"><pre>'
                    text += importErrors.slice(0, 10).join('<br>')
                    text += '</pre></code>'
                    this.$modal.show('dialog', {
                        title: 'Ошибка формата файла',
                        text: text,
                        buttons: [
                            {
                                title: 'Закрыть'
                            }
                        ]
                    })
                    this.imported = []
                    return
                }

                const response = await API.create(this.$axios, 'manager/category/import/models', { models: value })

                let added = 0
                let updated = 0

                let errors = {}

                response.forEach((item, index) => {
                    if (Object.keys(item.errors).length || item.errors.length) {
                        let itemErrors = []
                        if (typeof(item.errors) == 'object') {
                            itemErrors = Object.values(item.errors)
                        } else {
                            itemErrors = item.errors.slice()
                        }
                        errors[index] = itemErrors
                    } else if (item.new) {
                        added++
                    } else {
                        updated++
                    }
                })

                let text = "Добавлено новых эталонов: " + added + "<br>"
                text += "Обновлено эталонов: " + updated + "<br>"

                if (Object.keys(errors).length) {
                    text += "Ошибок: " + Object.keys(errors).length + "<br>"
                    text += '<code class="mt-4 d-block"><pre>'
                    for (const index in errors) {
                        if (errors.hasOwnProperty(index)) {
                            text += (parseInt(index) + 2) + ' стр.: ' + errors[index] + "\n"
                        }
                    }
                    text += '</pre></code>'
                }

                this.$modal.show('dialog', {
                    title: 'Импорт эталонов',
                    text: text,
                    buttons: [
                        {
                            title: 'Закрыть'
                        }
                    ]
                })
                this.imported = []
                return this.debounceFetch()
            }
        },
        async fetch() {
            await this.getModels(this.params)
            this.$router.replace({ path: this.$route.path, query: this.params })
        },
        updateSort(field) {
            if (this.params.sort == field) {
                this.params.order = this.params.order == 'asc' ? 'desc' : 'asc'
            } else {
                this.params.sort = field
                this.params.order = 'asc'
            }
        },
        async getExport() {
            const response = await API.get(this.$axios, 'manager/category/export/models')

            var csvData = new Blob(["\ufeff", Papa.unparse(response, { delimiter: ';' })], { type: 'text/csv;charset=utf-8;' })
            var csvURL =  null
            if (navigator.msSaveBlob) {
                csvURL = navigator.msSaveBlob(csvData, 'export.csv')
            } else {
                csvURL = window.URL.createObjectURL(csvData)
            }
            var tempLink = document.createElement('a')
            tempLink.href = csvURL
            tempLink.setAttribute('download', 'export.csv')
            tempLink.click()
        },
        del(model) {
            this.modelToRemove = model
            this.$modal.show('modal-delit', {
                // buttons: [
                //     {
                //         title: 'Да',
                //         handler: () => {
                //             this.deleteModel(model_id)
                //             this.$modal.hide('dialog')
                //         }
                //     },
                //     {
                //         title: 'Нет'
                //     }
                // ]
            })
        },
    },
    filters: {
        date(value) {
            let date = value.split(/[- :]/)
            date = new Date(Date.UTC(date[0], date[1]-1, date[2], date[3], date[4], date[5]))
            return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
        }
    }
}
</script>

<style lang="scss" scoped>
    .model-move {
        position: fixed;
        z-index: 100;
        bottom: 0;
        left: 0;
        right: 0;
        box-shadow: 0px -4px 4px rgba(0, 0, 0, 0.15);
        background: #F0F0F0;
        visibility: hidden;
        transition: .3s;
        padding: 20/16*1rem 0;
        text-align: right;
        transform: translateY(100%);

        &_active {
            transform: translateY(0);
            visibility: visible;
        }

        .btn {
           font-size: 15px;
           font-weight: 500;
           background-color: #fff;
           color: #333;
           box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
           padding-left: 36/16*1rem;
           padding-right: 36/16*1rem;
           border-color: transparent;
        }
    }
    .top-text {
        margin-top: 20px;
        margin-bottom: 20px;
        font-size: (13 / 16 + rem);

        & span {
            font-weight: 500;
        }
    }

    .btn-group {
        margin-left: (12 / 16 + rem);
        padding-top: (5 / 16 + rem);
        padding-bottom: (5 / 16 + rem);
        line-height: 20px;
        border-radius: 8px;
        text-decoration: none;
    }

    .buttons {
        margin-left: (122 / 16 + rem);

        & a {
            &:hover {
                text-decoration: none;
            }
        }
    }

    .btn-id {
        margin-right: (12 / 16 + rem);
        padding-top: (9 / 16 + rem);
        padding-bottom: (8 / 16 + rem);
        padding-right: 1rem;
        padding-left: 1rem;
        border-radius: 8px;
    }

    .input-origin {
        flex-grow: 1;
        flex-basis: (388 / 16 + rem);
        height: 40px;
    }

    .multiselect-filter {
        margin-right: (12 / 16 + rem);
        height: 40px;

        &::v-deep .multiselect {
            width: 160px;
            height: 40px;
        }

        &::v-deep .multiselect--active {
            & .multiselect__tags {
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }
        }

        &::v-deep .multiselect__tags {
            padding-top: (8 / 16 + rem);
            padding-bottom: (8 / 16 + rem);
            border-radius: 8px;
        }

        &::v-deep .multiselect__innerText {
            top: 11px;
        }

        &::v-deep .multiselect__select {
            top: 0px;
        }

        &::v-deep .multiselect__placeholder {
            display: block !important;
            padding: 0;
            margin: 0;
        }

        &::v-deep .multiselect__input {
            padding: 0;
            margin-bottom: 0;
        }

        &::v-deep .multiselect__single {
            margin: 0;
            padding-top: 2px;
            font-size: (15 / 16 + rem);
        }

        &::v-deep .multiselect__option {
            display: flex;
            align-items: center;
            padding-top: 0;
            padding-bottom: 0;
            height: 40px;
        }

        &-manufacturer {
            &::v-deep .multiselect {
                width: 300px;
            }
        }
    }

    thead {
        & td {
            padding-top: 12px;
            padding-bottom: 12px;
            white-space: nowrap;
        }
    }

    table tr {
        transition: all .15s;
        &:hover {
            & .table-btn-delete {
                visibility: visible;
                transition: all .15s;
                transform: scale(1);
            }
        }
    }

    td {
        padding-top: (8 / 16 + rem);
        padding-bottom: (8 / 16 + rem);
        padding-left: (20 / 16 + rem);

        &:first-child {
            padding-left: 1rem;
        }

        & span {
            font-size: 1rem;
        }
    }

    .td-name {
        width: 400px;
    }

    .col-name {

        &__title {
            font-weight: 500;
            cursor: pointer;

            &:hover {
                color: $primary;
            }
        }

        &__subtitle {
            font-size: (12 / 16 + rem);
            line-height: (14 / 16 + rem);
            color: $gray-500;

            & span {
                font-size: (12 / 16 + rem);
                font-weight: 500;
                color: #7D7D7D;
            }
        }
    }

    .td-delete {
        padding-left: 0;
    }

    .td-date {
        width: 180px;
    }

    .header-check {
        position: relative;
        text-align: center;
        font-size: 11px;

        .icon {
            position: relative;
            top: -1px;
        }

        &:after {
            content: '';
            position: absolute;
            top: 14px;
            left: 19px;
            width: 18px;
            height: 18px;
            border: 2px solid #4F4F4F;
            border-radius: 2px;
        }
    }

    .table-btn-delete {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background: $white;
        visibility: hidden;
        transform: scale(0);
        cursor: pointer;
        & .icon {
            width: 20px;
            height: 20px;
        }
    }

    .checkbox {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;
        border: 1px solid rgba(51, 51, 51, 0.5);
        box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.1);
        border-radius: 3px;
        cursor: pointer;

        & .icon {
            opacity: 0;
            transition: opacity .15s;
        }

        &_active {
            & .icon {
                opacity: 1;
                transition: opacity .15s;
            }
        }
    }

    .img {
        width: 64px;
        height: 64px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .bottom-multiselect {
        width: 63px;
        height: 34px;

        &::v-deep .multiselect__tags {
            padding-top: 8px;
            padding-left: 6px;
        }

        &::v-deep .multiselect__select {
            top: -1px;
            right: -7px;

            &:before {
                content: '';
                position: absolute;
                top: 17px;
                margin-top: 0;
                right: 15px;
                width: 10px;
                height: 10px;
                border: none;
                background-image: url("data:image/svg+xml,%3Csvg width='8' height='4' viewBox='0 0 8 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L3.9766 3.1L6.9532 1' stroke='%234F4F4F' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
                background-repeat: no-repeat;
            }
        }

        &::v-deep .multiselect__option {
            display: flex;
            align-items: center;
            padding-top: 0;
            padding-bottom: 0;
            height: 33px;
            border: none;
        }

        &::v-deep .multiselect__option--highlight {
            &:after {
                right: -16px;
                width: 10px;
                height: 10px;
                background-color: #E9F7FF;
            }
        }

        &::v-deep .multiselect__single {
            font-size: (12 / 16 + rem);
        }

        .multiselect__option--selected:after {
            right: -16px;
            width: 10px;
            height: 10px;
        }

        &-wrapper {
            display: flex;
            align-items: center;
        }

        &-text {
            display: inline-block;
            margin-right: 12px;
            padding-left: 20px;
            font-size: (12 / 16 + rem);
            white-space: nowrap;
            color: #828282;
        }
    }

    .bottom-multiselect-text {
        margin-right: (12 / 16 + rem);
        margin-left: (20 / 16 + rem);
        font-size: (12 / 16 + rem);
        font-weight: 500;
        color: #828282;
    }

    .modal-base-footer {
        padding-right: (40 / 16 + rem);
        padding-left: (40 / 16 + rem);

        &__btn {
            &-create {
                padding-right: (97 / 16 + rem);
                padding-left: (97 / 16 + rem);
            }

            &-preview {
                padding: (13.5 / 16 + rem) (22 / 16 + rem);
                background-color: #F5FBFE;
                border: none;
                font-weight: 500;
                color: $primary;

                & .icon {
                    width: 18px;
                    height: 18px;
                }
            }
        }
    }

    .modal-delit {

        &__btn {
            width: 156px;
            font-weight: 500;
            border: none;

            &-delete {
                margin-right: (24 / 16 + rem);
                background: rgba(195, 67, 67, 0.15);
            }

            &-cancel {
                background: rgba(0, 149, 232, 0.15);
            }
        }
    }


    //Стили для модального окна
    .vue-dialog {

        &::v-deep .vue-dialog-button {
            background: rgba(195, 67, 67, 0.15);
        }
    }
</style>
