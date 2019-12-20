<template>
    <aside class="main-sidebar" :class="{ 'main-sidebar_active': sideBarShow || isFixed }"
           @mouseover="sideBarShow = true" @mouseleave="sideBarShow = false">
        <div class="main-sidebar__inner">
            <button type="button" class="main-sidebar__control" :class="{'main-sidebar__control_active': sideBarShow || isFixed}" @click='sideBarShow = !sideBarShow'>
                    <icon-base icon="arrow-left" />
            </button>
            <div class="main-sidebar__wrapper">
                <input-origin type="text"
                    placeholder="Поиск"
                    class="input-origin_icon-left mb-1"
                    v-model="query">
                    <icon-base icon="search"/>
                </input-origin>
                <ul class="p-1 main-sidebar__list">
                    <template v-for="category in categories">
                        <li class="mb-2 main-sidebar__item" :key="category.category_id"
                            v-if="!query || searchResults.indexOf(category.category_id) !== -1">
                            <div class="main-sidebar__item-text"
                                :class="{'main-sidebar__item-text_active': isOpen(category.category_id), 'main-sidebar__item_active': category.category_id == activeCategory, 'main-sidebar__item_active-search': isHighlight(category.category_id) }"
                                @click="toggleCategory(category.category_id)">
                                    <icon-base icon="triangle" v-if="category.path.length"/>
                                    {{ category.name }}
                            </div>
                            <transition name="fade">
                                <ul class="main-sidebar__sublist" v-if="category.path && isOpen(category.category_id)">
                                    <template v-for="child in category.path">
                                        <li class="main-sidebar__subitem"
                                            v-if="!query || searchResults.indexOf(child.category_id) !== -1"
                                            :key="child.category_id">
                                            <div class="main-sidebar__subitem-text"
                                                :class="{'main-sidebar__subitem-text_active': isOpen(child.category_id), 'main-sidebar__item_active': child.category_id == activeCategory, 'main-sidebar__item_active-search': isHighlight(child.category_id)}"
                                                @click="toggleCategory(child.category_id)">
                                                <icon-base icon="triangle" v-if="child.path.length"/>
                                                {{ child.name }}
                                            </div>
                                            <transition name="fade">
                                                <ul class="main-sidebar__sublist2" v-if="child.path && isOpen(child.category_id)">
                                                    <template v-for="subchild in child.path">
                                                        <li class="main-sidebar__subitem2"
                                                            :class="{ 'main-sidebar__item_active': subchild.category_id == activeCategory }"
                                                            @click="toggleCategory(subchild.category_id)"
                                                            v-if="!query || searchResults.indexOf(subchild.category_id) !== -1"
                                                            :key="subchild.category_id">
                                                            <div class="py-2 main-sidebar__subitem2-text"
                                                                :class="{ 'main-sidebar__item_active-search': isHighlight(subchild.category_id) }">
                                                                {{ subchild.name }}
                                                            </div>
                                                        </li>
                                                    </template>
                                                </ul>
                                            </transition>
                                        </li>
                                    </template>
                                </ul>
                            </transition>
                        </li>
                    </template>
                </ul>
            </div>
            <div class="main-sidebar__footer">
                <div class="main-sidebar__row">
                    <v-btn class="btn main-sidebar__btn btn_w149 btn_fz14"
                        @click.prevent="getExport">Скачать</v-btn>
                    <v-parser class="d-inline-block"
                        id="category-parser"
                        v-model="imported"
                        @input="onImport">
                        <v-btn class="btn main-sidebar__btn btn_w149 btn_fz14">Загрузить</v-btn>
                    </v-parser>
                </div>
                <div class="main-sidebar__row">
                    <v-btn class="btn main-sidebar__btn btn_w149 btn_fz14"
                        @click="$modal.show('category-type')">Добавить</v-btn>
                    <nuxt-link to="/catalog/category/settings">
                        <v-btn class="btn border-0 btn_manage main-sidebar__btn btn_primary-light btn_w149 btn_fz14 text-primary">
                            <icon-base icon="manage" />
                            Настройки
                        </v-btn>
                    </nuxt-link>
                </div>
                <div class="main-sidebar__row">
                    <v-btn class="main-sidebar__btn btn_w149 btn_fz14"
                        :class="{ 'btn_primary-transparent': activeCategory }"
                        :disabled="!activeCategory"
                        @click.prevent="editCategory">Редактировать</v-btn>
                    <v-btn class="main-sidebar__btn btn_w149 btn_fz14"
                        :class="{ 'btn_eror': activeCategory }"
                        :disabled="!activeCategory"
                        @click.prevent="deleteModal">Удалить</v-btn>
                </div>
                <div class="main-sidebar__bottom-line">
                    <input-checkbox class="input-checkbox_origin main-sidebar__input-checkbox" text="Зафиксировать дерево категорий" v-model="isFixed"></input-checkbox>
                </div>
            </div>
        </div>
        <modal-category-type></modal-category-type>
        <modal-base></modal-base>

        <modal-base name="category-edit"
            v-if="!!editForm">
            <template v-slot:title>
                <header-edit v-model="editForm.name"/>
            </template>
            <category-edit-form v-model="editForm"/>
            <div class="popup-form-group">
                <v-btn class="btn-transparent btn-block btn_disable btn_create btn_py-12"
                    :class="{ 'btn_active': isDoneEdit }"
                    @click.prevent="update">Сохранить</v-btn>
            </div>
        </modal-base>
    </aside>
</template>

<script>
    import API from '@/utils/api'
    import VParser from '@/components/VParser'
    import Papa from 'papaparse'
    import VBtn from '@/components/VBtn'
    import ModalCategoryType from '@/components/Modal/ModalCategoryType'
    import ModalBase from '@/components/Modal/ModalBase'
    import CategoryGroupEditForm from '@/components/Forms/CategoryGroupEditForm'
    import CategoryEditForm from '@/components/Forms/CategoryEditForm'
    import SubCategoryEditForm from '@/components/Forms/SubCategoryEditForm'
    import ModelEditForm from '@/components/Forms/ModelEditForm'
    import HeaderEdit from '@/components/HeaderEdit'
    import InputOrigin from '@/components/InputOrigin'
    import InputCheckbox from '@/components/InputCheckbox'
    import { mapActions, mapGetters } from 'vuex'

    export default {
        name: 'MainSidebar',
        components: {
            VBtn,
            ModalCategoryType,
            VParser,
            ModalBase,
            HeaderEdit,
            CategoryGroupEditForm,
            CategoryEditForm,
            SubCategoryEditForm,
            ModelEditForm,
            InputOrigin,
            InputCheckbox,
        },
        data() {
            return {
                imported: [],
                isFixed: false,
                loading: false,
                sideBarShow: false,
                openCategories: [],
                query: '',
                searchResults: [],
                searchOpened: [],
                searchHighlight: [],
                editForm: {
                    category_id: '',
                    level: '',
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
                    root_id: '',
                    unit_id: '',
                    parent_id: '',
                    name: '',
                    attrs: []
                }
            }
        },
        created() {
            this.isFixed = this.$cookies.get('is-sidebar-fixed')
        },
        computed: {
            ...mapGetters({
                categories: 'categories/getCategories',
                activeCategory: 'models/getCategoryId',
            }),
            isDoneEdit() {
                if (this.editForm.level == 'root') {
                    return !!this.editForm.url && !!this.editForm.name
                }
                if (this.editForm.level == 'child') {
                    return !!this.editForm.url && !!this.editForm.name && !!this.editForm.root_id && !!this.editForm.unit_id
                }
                if (this.editForm.level == 'subchild') {
                    return !!this.editForm.url && !!this.editForm.name && !!this.editForm.root_id && !!this.editForm.parent_id && !!this.editForm.unit_id
                }
            },
        },
        watch: {
            isFixed: function(value) {
                this.$cookies.set('is-sidebar-fixed', value, { path: '/' })
            },
            query: function(value) {
                value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                //this.activeCategory = value.category_id
                this.searchResults = []
                this.searchOpened = []
                this.searchHighlight = []
                if (value) {
                    const reg = new RegExp(value, 'gi')
                    this.categories.forEach(root => {
                        if (reg.test(root.name)) {
                            this.searchResults.push(root.category_id)
                            this.searchHighlight.push(root.category_id)
                        }
                        root.path.forEach(child => {
                            if (reg.test(child.name)) {
                                this.searchOpened.push(child.parent_id)
                                this.searchResults.push(child.parent_id)
                                this.searchResults.push(child.category_id)
                                this.searchHighlight.push(child.category_id)
                            }
                            child.path.forEach(subchild => {
                                if (reg.test(subchild.name)) {
                                    this.searchOpened.push(subchild.root_id)
                                    this.searchOpened.push(subchild.parent_id)
                                    this.searchResults.push(subchild.root_id)
                                    this.searchResults.push(subchild.parent_id)
                                    this.searchResults.push(subchild.category_id)
                                    this.searchHighlight.push(subchild.category_id)
                                }
                            })
                        })
                    })
                }
            }
        },
        methods: {
            ...mapActions('categories', {
                updateCategory: 'updateCategory',
                deleteCategory: 'deleteCategory',
            }),
            ...mapActions('models', {
                getModels: 'getModels',
            }),
            async onImport(value) {
                if (value.length) {
                    const importErrors = []

                    if (importErrors.length) {
                        let text = ''
                        text += '<code class="mt-4 d-block" style="height: 500px; overflow-y: auto;"><pre>'
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

                    let response = await API.create(this.$axios, 'manager/category/import/categories', { categories: value })

                    let updated = []
                    let added = 0
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
                            updated.push(item.name)
                        }
                    })

                    let text = "Добавлено новых категорий: " + added + "<br>"

                    if (!updated.length || Object.keys(errors).length) {
                        await API.create(this.$axios, 'manager/category/import/categories?import=1', { categories: value })

                        if (Object.keys(errors).length) {
                            text += "Ошибок: " + Object.keys(errors).length + "<br>"
                            text += '<code class="mt-4 d-block" style="height: 500px; overflow-y: auto;"><pre>'
                            for (const index in errors) {
                                if (errors.hasOwnProperty(index)) {
                                    text += (parseInt(index) + 2) + ' стр.: ' + errors[index] + "\n"
                                }
                            }
                            text += '</pre></code>'
                        }

                        this.$modal.show('dialog', {
                            title: 'Импорт категорий',
                            text: text,
                            buttons: [
                                {
                                    title: 'Закрыть'
                                }
                            ]
                        })
                        this.imported = []
                        await this.$store.dispatch('categories/getCategories')
                    } else {
                        text += 'В категориях(' + updated.length + '):<br>'
                        text += updated.join(', ')
                        text += 'данные были изменены. Применить изменения?'

                        this.$modal.show('dialog', {
                            title: 'Изменены данные в категории',
                            text: text,
                            buttons: [
                                {
                                    title: 'Да',
                                    handler: async () => {
                                        await API.create(this.$axios, 'manager/category/import/categories?import=1', { categories: value })
                                        await this.$store.dispatch('categories/getCategories')
                                        this.$modal.hide('dialog')

                                        this.$modal.show('dialog', {
                                            title: 'Импорт категорий',
                                            text: 'Успешно завершен',
                                            buttons: [
                                                {
                                                    title: 'Закрыть'
                                                }
                                            ]
                                        })
                                    }
                                },
                                {
                                    title: 'Нет'
                                }
                            ]
                        })
                    }
                }
            },
            async getExport() {
                const response = await API.get(this.$axios, 'manager/category/export/categories')
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
            isOpen(category_id) {
                if (!!this.query) {
                    return this.searchOpened.indexOf(category_id) != -1
                }
                return this.openCategories.indexOf(category_id) != -1
            },
            isHighlight(category_id) {
                return !!this.query && this.searchHighlight.indexOf(category_id) != -1
            },
            async toggleCategory(category_id) {
                //this.activeCategory = category_id
                const index = this.openCategories.indexOf(category_id)
                if (index === -1) {
                    this.openCategories.push(category_id)
                } else {
                    this.openCategories.splice(index, 1)
                }
                //await this.getModels({ category_id: category_id })
                this.$router.replace({ path: '/catalog', query: { category_id: category_id } })
            },
            async editCategory() {
                if (!this.activeCategory) {
                    return
                }

                await this.$store.dispatch('attrs/getAttrs', { page: 1, limit: 8 })
                await this.$store.dispatch('units/getUnits')
                await this.$store.dispatch('categories/getCategories')

                const category = await API.get(this.$axios, 'manager/category/categories/' + this.activeCategory, { expand: 'level,categoryAttrs,imageBase64,iconBase64' })

                this.editForm.category_id = category.category_id
                this.editForm.name = category.name
                this.editForm.description = category.description
                this.editForm.imageBase64 = category.imageBase64
                this.editForm.iconBase64 = category.iconBase64
                this.editForm.hidden = category.hidden
                this.editForm.hide_robots = category.hide_robots
                this.editForm.hide_sitemap = category.hide_sitemap
                this.editForm.url = category.url
                this.editForm.title = category.title
                this.editForm.alt_image = category.alt_image
                this.editForm.meta_description = category.meta_description
                this.editForm.root_id = category.root_id
                this.editForm.unit_id = category.unit_id
                this.editForm.parent_id = category.parent_id
                this.editForm.name = category.name
                this.editForm.level = category.level
                this.editForm.attrs = category.categoryAttrs.map(attr => { return { attr_id: attr.attr_id, name: attr.attr.name, required: attr.required } })

                this.$modal.show('category-edit')
            },
            async update() {
                
                if (!this.isDoneEdit) {
                    return
                }
                this.loading = true
                await this.updateCategory(this.editForm)
                this.$modal.hide('category-edit')
                this.loading = false
                // this.$modal.show('dialog', {
                //     title: 'Изменены данные в категории',
                //     text: `В категории «${this.editForm.name}» ID №«${this.editForm.category_id}» — данные были изменены.<br>Применить изменения?`,
                //     buttons: [
                //         {
                //             title: 'Да',
                //             handler: async () => {
                //                 await this.updateCategory(this.editForm)
                //                 this.loading = false
                //                 this.$modal.hide('category-edit')
                //                 this.$modal.hide('dialog')
                //             }
                //         },
                //         {
                //             title: 'Нет'
                //         }
                //     ]
                // })

            },
            async deleteModal() {
                const category = await API.get(this.$axios, 'manager/category/categories/' + this.activeCategory)
                this.$modal.show('dialog', {
                    height: '416',
                    title: 'Удалить категорию',
                    text: `Вы действительно хотите удалить категорию: «${category.name}»?`,
                    buttons: [
                        {
                            title: 'Да',
                            handler: () => {
                                this.deleteCategory(category.category_id)
                                this.$modal.hide('dialog')
                            }
                        },
                        {
                            title: 'Нет'
                        }
                    ]
                })
            }
        }
    }
</script>

<style lang="scss">
    .main-sidebar {

        &_active {
            .main-sidebar__inner {
                transform: translateX(0);
                transition: transform .3s ease;
            }
            + .content-main {
                padding-left: 434px;
                transition: padding-left .3s;
            }
        }

        &__inner {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            display: flex;
            flex-direction: column;
            flex: 0 0 437px;
            padding-bottom: 20px;
            width: 437px;
            min-height: 100%;
            height: auto;
            transform: translateX(-405px);
            transition: transform .3s ease;
            box-shadow: 4px 0px 8px rgba(0, 0, 0, 0.25);
            background-color: $white;

            &_active {
                transform: translateX(0);
                transition: transform .3s ease;

                + .content-main {
                    padding-left: 434px;
                    transition: padding-left .3s;
                }
            }
        }

        &__wrapper {
            padding-top: 40px;
            padding-bottom: 5px;
            padding-right: 44px;
            padding-left: 15px;
        }

        &__control {
            position: absolute;
            top: 0;
            right: 0;
            width: 32px;
            height: 100%;
            border: none;
            background-color: $gray-100;
            outline: none;

            &_active {
                & svg {
                    transform: rotate(180deg);
                }
            }
        }

        &__list {
            margin-top: 0;
            padding-left: 0;
            list-style: none;
            border-radius: 4px;
            background-color: $gray-light;
        }

        &__item {

            &:last-child {
                margin-bottom: 0 !important;
            }

            &-text {
                position: relative;
                z-index: 3;
                padding-top: 5px;
                padding-bottom: 5px;
                padding-left: 36px;
                border-radius: 4px;
                background-color: $white;
                font-weight: $text-medium;
                color: $color-text-dark;
                cursor: pointer;

                &:hover {
                    background-color: $primary;
                    color: $white;
                    transition: all .3s;
                }

                & svg {
                    position: absolute;
                    top: 9px;
                    left: 15px;
                    width: 12px;
                    transform: rotate(-90deg);
                    transition: transform .2s;
                }

                &_active {
                    border-radius: 4px 4px 0px 0px;
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
                    color: $gray-500;

                    & svg {
                        transform: rotate(0deg);
                    }
                }
            }

            &_active {
                background-color: $primary;
                color: $white;

                &-search {
                    background: rgba(0, 149, 232, 0.3);
                    color: $color-text-dark;
                }
            }
        }

        &__sublist {
            margin-top: 0;
            padding-left: 0;
            list-style: none;
            background-color: $white;
            color: $color-text-dark;
        }

        &__subitem {

            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.01);

            &-text {
                position: relative;
                padding-top: 5px;
                padding-bottom: 5px;
                padding-left: 36px;
                cursor: pointer;

                &:hover {
                    background-color: $primary;
                    color: $white;
                    transition: all .3s;
                }

                & svg {
                    position: absolute;
                    top: 9px;
                    left: 15px;
                    width: 12px;
                    transform: rotate(-90deg);
                    transition: transform .2s;
                }

                &_active {
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
                    // color: $gray-500;

                     & svg {
                        transform: rotate(0deg);
                    }
                }
            }
        }

        &__sublist2 {
            margin-top: 0;
            padding-left: 0;
            list-style: none;
        }

        &__subitem2 {

            &:last-child {
                border-radius: 0 0 4px 4px;
            }

            &-text {
                padding-left: 36px;
                cursor: pointer;

                &:hover {
                    background-color: $primary;
                    color: $white;
                    transition: all .3s;
                }
            }
        }

        &__footer {
            // flex: 0 0 auto;
            padding-top: 20px;
            padding-right: 44px;
            padding-left: 20px;
            border-top: 1px solid $gray-400;
        }

        &__row {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }

        &__bottom-line {
            padding-right: 17px;
            padding-left: 18px;
        }

        &__btn {
            margin-bottom: 15px;

            &-lg {
                border-radius: 24px;
                line-height: 1.15
            }
        }

        &__input-checkbox {
            border-radius: 24px !important;

            & .input-checkbox__label {
                padding-top: (6 / 16 + rem)!important;
                padding-bottom: (5 / 16 + rem) !important;
            }
        }
    }

    .input-origin {
        height: 37px !important;

        .input-origin__input {
            border-radius: 6px;
            border: 1px solid rgba(0, 0, 0, 0.1);
        }
    }

    .fade-enter-active, .fade-leave-active {
        max-height: 99em;
        overflow: hidden;
        transition: max-height .5s ease-in-out;
    }
    .fade-enter, .fade-leave-to {
        max-height: 0px;
        overflow: hidden;
        transition: max-height .5s cubic-bezier(0, 1, 0, 1);
    }
</style>

