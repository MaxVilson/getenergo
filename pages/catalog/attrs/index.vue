<template>
    <div class="container">
        <div class="page__attrs">
            <h1 class="page__attrs-title">Характеристики</h1>
            <div class="page__attrs-buttons">
                <v-btn class="btn btn_br-8 page__attrs-btn mb-2">Загрузить характеристики</v-btn>
                <v-btn class="btn btn_br-8 page__attrs-btn mb-2">Скачать характеристики</v-btn>
                <nuxt-link to="/catalog/attrs/create">
                    <v-btn class="btn btn_br-8 page__attrs-btn mb-2">Создать характеристику</v-btn>
                </nuxt-link>
                <v-multiselect
                    class="multiselect-top mb-2"
                    :options="filterTypes"
                    label="text"
                    :allow-empty="false"
                    :searchable="false"
                    :showNoResults="false"
                    placeholder="Все"/>
                <input-origin type="text"
                    placeholder="Поиск"
                    class="input-origin_height-32 input-origin_br-8 input-origin_width-468 input-origin_icon-left page__attrs-search mb-2"
                    v-model="queries.query">
                        <icon-base icon="search"/>
                </input-origin>
            </div>
            <table class="table mb-4 page__attrs-table">
                <thead class="page__attrs-thead">
                    <tr>
                        <td class="page__attrs-table-filter">
                            <span @click="sort('attr_id')">ID
                                <icon-base v-if="queries.sort != 'attr_id'" icon="filter"/>
                                <icon-base v-if="queries.sort == 'attr_id' && queries.order == 'desc'" icon="filter-up"/>
                                <icon-base v-if="queries.sort == 'attr_id' && queries.order == 'asc'" icon="filter-down"/>
                            </span>
                        </td>
                        <td class="page__attrs-table-filter">
                            <span @click="sort('name')">Название
                                <icon-base v-if="queries.sort != 'name'" icon="filter"/>
                                <icon-base v-if="queries.sort == 'name' && queries.order == 'desc'" icon="filter-up"/>
                                <icon-base v-if="queries.sort == 'name' && queries.order == 'asc'" icon="filter-down"/>
                            </span></td>
                        <td>Тип</td>
                        <td>Используются в</td>
                        <td class="page__attrs-table-filter">
                            <span @click="sort('description')">Описание
                                <icon-base v-if="queries.sort != 'description'" icon="filter"/>
                                <icon-base v-if="queries.sort == 'description' && queries.order == 'desc'" icon="filter-up"/>
                                <icon-base v-if="queries.sort == 'description' && queries.order == 'asc'" icon="filter-down"/>
                            </span></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    <tr class="page__attrs-table-tr" v-for="(attr, index) in attrs" :key="index">
                        <td>{{ attr.attr_id }}</td>
                        <td class="page__attrs-table-td-name">
                            <span @click="editAttr(attr.attr_id)">{{ attr.name }}</span>
                        </td>
                        <td class="page__attrs-table-td-type">
                            <div class="page__attrs-table-td-type-wrapper">
                                <icon-base :icon="attrTypes[attr.field].icon" />
                                <span class="page__attrs-table-td-type-text">{{ attrTypes[attr.field].name }}</span>
                            </div>
                        </td>
                        <td>{{ attr.totalCategories }} категориях</td>
                        <td class="page__attrs-table-td-w150px">{{ !!attr.description ? 'Есть' : 'Нет' }}</td>
                        <td class="page__attrs-td-btn">
                            <v-btn class="page__attrs-table-btn" @click.prevent="del(attr)"><icon-base icon="delete"/></v-btn>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="row align-items-center">
                <div class="col-auto mr-auto page__attrs-multiselect-wrapper">
                    <span class="page__attrs-multiselect-text">Характеристик на странице</span>
                    <v-multiselect
                        class="multiselect-bottom"
                        :value="queries.limit"
                        @select="queries.limit = $event"
                        :options="perPageOptions"
                        label="text"
                        :searchable="false"
                        :allow-empty="false"
                        id="input-limit"
                        :placeholder="String.prototype.toString(queries.limit)"/>
                </div>
                <div class="col-auto">
                    <v-pagination class="page__attrs-pagination"
                        v-model="queries.page"
                        :total_pages="totalPages"
                        :queries="queries"/>
                </div>
            </div>
        </div>

        <modal-base>
            <template v-slot:title>
                <header-edit v-model="editForm.name"/>
            </template>
            <attr-edit-form v-model="editForm"
                :categories="attrCategories"/>
            <div class="popup-form-group">
                <v-btn class="btn-transparent btn-block btn_disable btn_create btn_py-12"
                    :class="{ 'btn_active': isDoneEdit }"
                    @click.prevent="update">Сохранить</v-btn>
            </div>
        </modal-base>

        <modal-base name="modal-delit" class="modal-delit" :width="416">
            <div class="popup-form-group">
                <div class="modal-delit__title">Удалить характеристику</div>
                <div class="modal-delit__text text-center">Вы действительно хотите удалить характеристику: «{{ deleteAttr.name }}»?</div>
                <div class="modal-delit__buttons">
                    <v-btn class="btn modal-delit__btn modal-delit__btn-delete" @click="deleteAttr(deleteAttr.attr_id); $modal.hide('modal-delit')">Да</v-btn>
                    <v-btn class="btn modal-delit__btn modal-delit__btn-cancel" @click="$modal.hide('modal-delit')">Нет</v-btn>
                </div>
            </div>
        </modal-base>
    </div>
</template>

<script>
import API from '@/utils/api'
import { mapGetters, mapActions } from 'vuex'
import { debounce } from 'throttle-debounce'
import ModalBase from '@/components/Modal/ModalBase'
import HeaderEdit from '@/components/HeaderEdit'
import AttrEditForm from '@/components/Forms/AttrEditForm'
import VMultiselect from '@/components/VMultiselect'
import VPagination from '@/components/VPagination'
import VBtn from '@/components/VBtn'
import InputOrigin from '@/components/InputOrigin'

export default {
    layout: 'default-without-sidebar',
    components: {
        VMultiselect,
        VPagination,
        VBtn,
        InputOrigin,
        ModalBase,
        AttrEditForm,
        HeaderEdit
    },
    async fetch ({ store, query }) {
        const queries = {
            page: typeof(query.page) != 'undefined' ? parseInt(query.page) : 1,
            limit: typeof(query.limit) != 'undefined' ? parseInt(query.limit) : 20,
            query: typeof(query.search) != 'undefined' ? query.search : '',
            sort: typeof(query.sort) != 'undefined' ? query.sort : '',
            order: typeof(query.order) != 'undefined' ? query.order : 'asc',
        }

        await store.dispatch('attrs/getAttrs', queries)
    },
    asyncData({ query }) {
        const page = typeof(query.page) != 'undefined' ? parseInt(query.page) : 1
        const limit = typeof(query.limit) != 'undefined' ? parseInt(query.limit) : 20
        const search = typeof(query.search) != 'undefined' ? query.search : ''
        const sort = typeof(query.sort) != 'undefined' ? query.sort : ''
        const order = typeof(query.order) != 'undefined' ? query.order : 'asc'

        return {
            deleteAttr: '',
            queries: {
                page: page,
                limit: limit,
                query: search,
                sort: sort,
                order: order,
            },
            editForm: {
                attr_id: '',
                id: '',
                name: '',
                description: '',
                field: '',
                filter: '',
            },
            attrCategories: [],
        }
    },
    data() {
        return {
            perPageOptions: [
                { name: 10, text: '10' },
                { name: 20, text: '20' },
                { name: 50, text: '50' },
                { name: 0, text: 'Все' },
            ],
            attrTypes: {
                checkbox: {name: 'Чекбокс', icon: 'checkbox'},
                slider: {name: 'Слайдер', icon: 'slider'},
                radio: {name:'Радио', icon: 'radio'},
                empty: {name:'Без фильтра', icon: 'empty'}
            },
            filterTypes: [
                { name: 'slider', text: 'Слайдер' },
                { name: 'checkbox', text: 'Чекбокс' },
                { name: 'radio', text: 'Радио' },
                { name: 'all', text: 'Все' },
            ],
            loading: false
        }
    },
    computed: {
        ...mapGetters({
            attrs: 'attrs/getAttrs',
            totalPages: 'attrs/getTotalPages',
        }),
        debounceUpdateTable() {
            return debounce(500, this.updateTable)
        },
        isDoneEdit() {
            return !!this.editForm.field && !!this.editForm.filter
        },
    },
    watch: {
        queries: {
            deep: true,
            async handler(value) {
                return this.debounceUpdateTable()
            }
        },
    },
    methods: {
        ...mapActions('attrs', {
            loadAttrs: 'getAttrs',
            deleteAttr: 'deleteAttr',
            updateAttr: 'updateAttr',
        }),
        async updateTable() {
            await this.loadAttrs(this.queries)
            this.$router.replace({ path: this.$route.path, query: this.queries })
        },
        del(attr) {
            this.deleteAttr = attr
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
        sort(field) {
            if (this.queries.sort == field) {
                this.queries.order = this.queries.order == 'asc' ? 'desc' : 'asc'
            } else {
                this.queries.sort = field
                this.queries.order = 'asc'
            }
        },
        async editAttr(attr_id) {
            const attr = await API.get(this.$axios, 'manager/category/attrs/' + attr_id, { expand: 'categories' })
            this.editForm.attr_id = attr.attr_id
            this.editForm.id = attr.id
            this.editForm.name = attr.name
            this.editForm.description = attr.description
            this.editForm.field = attr.field
            this.editForm.filter = attr.filter
            this.attrCategories = attr.categories
            this.$modal.show('modal-base')
        },
        async update() {
            this.loading = true
            await this.updateAttr(this.editForm)
            this.debounceUpdateTable()
            this.loading = false
            this.$modal.hide('modal-base')
        }
    }
}
</script>

<style lang="scss" scoped>
    .page__attrs {

        th {
            white-space: nowrap;
        }

        &-title {
            margin-top: 40px;
            margin-bottom: 20px;
        }

        &-buttons {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin-bottom: (12 / 16 + rem);
        }

        &-btn {
            margin-right: 1rem;
            padding: (6 / 16 + rem) 1rem;
            font-size: (13 / 16 + rem);
            line-height: (18 / 16 + rem);
        }

        &-table {

            &-thead {
                &:last-child {
                    padding: 0;
                }
                & svg {
                    margin-top: -2px;
                }
            }

            &-btn {
                padding: 0;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: $white;
                visibility: hidden;
                transform: scale(0);
                cursor: pointer;
                & svg {
                    width: 24px;
                    height: 24px;
                }
            }

            &-filter {
                & span {
                    cursor: pointer;
                }
            }

            &-tr {
                position: relative;
                &:hover {
                    & .page__attrs-table-btn {
                        visibility: visible;
                        transition: all .3s;
                        transform: scale(1);
                    }
                }
            }

            &-td {
                &-name {
                    width: 400px;
                    font-size: 1rem !important;
                    font-weight: 500;

                    & span {
                        cursor: pointer;
                        transition: all .15s;

                        &:hover {
                            color: $primary;
                            transition: all .15s;
                        }
                    }
                }

                &-w150px {
                    width: 150px;
                }

                &-btn {
                    margin-right: 5px;
                    padding: 0;
                    width: 64px;
                    height: 40px;
                }

                &-type {
                    &-text {
                        margin-left: 4px;
                    }

                    &-wrapper {
                        position: relative;
                        display: flex;
                        align-items: center;
                        padding-left: 30px;

                        .icon {
                            position: absolute;
                            top: 50%;
                            left: 0;
                            margin-right: 2px;
                            transform: translateY(-50%);

                            &-checkbox {
                                width: 24px;
                                height: 24px;
                            }
                            &-slider {
                                width: 24px;
                                height: 24px;
                            }
                            &-radio {
                                width: 24px;
                                height: 24px;
                            }
                            &-empty {
                                width: 24px;
                                height: 24px;
                            }
                        }
                    }
                }
            }
        }

        &-multiselect {
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
    }

    //Стили для модального окна
    .vue-dialog {
        width: 416px !important;
    }
    .dialog-content {
        padding-top: 28px !important;
        padding-right: 40px !important;
        padding-left: 40px !important;
        text-align: center;
    }

    .dialog-c-text {
        text-align: left;
    }
    .vue-dialog-buttons {
        display: flex;
        justify-content: space-between;
        padding-bottom: 28px;
        padding-right: 40px;
        padding-left: 40px;
        border: none !important;
    }
    .vue-dialog-button {
        flex: inherit !important;
        width: 156px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 4px;
    }

    .input-origin {
        width: 461px;
    }

    .multiselect-top {
        margin-right: 1rem;
        height: 32px;

        &::v-deep .multiselect {
            width: 110px;
            height: 32px;
        }

        &::v-deep .multiselect--active {
            & .multiselect__tags {
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }
        }

        &::v-deep .multiselect__tags {
            padding-top: (4 / 16 + rem);
            padding-bottom: (8 / 16 + rem);
            border-radius: 8px;
        }

        &::v-deep .multiselect__innerText {
            top: 11px;
        }

        &::v-deep .multiselect__select {
            top: -2px;
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

</style>
