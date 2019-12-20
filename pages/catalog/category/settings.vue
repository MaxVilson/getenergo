<template>
    <div>
        <head-line title="Настройка категорий"></head-line>
        <ul class="nav nav-tabs">
            <div class="container">
                <div class="nav__wrapper">
                    <li class="nav-item">
                        <a class="nav-link"
                            href="#"
                            :class="{ active: activeTab == 'units' }"
                            @click.prevent="activeTab = 'units'">Единицы измерения</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"
                            href="#"
                            :class="{ active: activeTab == 'main-page-category-sort' }"
                            @click.prevent="activeTab = 'main-page-category-sort'">Порядок категорий на главной</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"
                            href="#"
                            :class="{ active: activeTab == 'catalog-category-sort' }"
                            @click.prevent="activeTab = 'catalog-category-sort'">Порядок категорий в каталоге</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"
                            href="#"
                            :class="{ active: activeTab == 'seo-templates' }"
                            @click.prevent="activeTab = 'seo-templates'">SEO шаблоны</a>
                    </li>
                </div>
            </div>
        </ul>
        <div class="tab-content">
            <div class="tab-pane"
                :class="{ active: activeTab == 'units' }">
                <form @submit.prevent="onSaveUnits" class="form">
                    <div class="form-row"
                         v-for="(unit, index) in units" :key="unit.unit_id">
                        <div class="col-6">
                            <input-base :id="'input-name-' + index" class="category__control mt-0" 
                                        :value="unit.name" 
                                        @input="updateUnit({ index: index, name: $event })"
                                        label="Полное название ед. изм."
                                        :validator="$v.units.$each[index].name"/>
                        </div>
                        <div class="col-6">
                            <input-base :id="'input-short-' + index" 
                                        class="category__control mt-0" 
                                        :value="unit.short" 
                                        @input="updateUnit({ index: index, short: $event })"
                                        label="Сокращенное название ед. изм."
                                        :validator="$v.units.$each[index].short"/>
                        </div>
                    </div>
                    <div class="form-row justify-content-center">
                        <v-btn @click.prevent="addUnit({ name: '', short: '', unit_id: null })"
                        type="button" class="btn btn_gray btn_md px-3 mt-2">Добавить единицу измерения</v-btn>
                    </div>
                    <div class="form-row justify-content-center mt-4">
                        <v-btn type="submit" class="btn-block btn_disable btn_gray-light btn_lg"
                            :class="{ 'btn_active': unitsChanged }">Сохранить</v-btn>
                    </div>
                </form>
            </div>
            <div class="tab-pane"
                :class="{ active: activeTab == 'main-page-category-sort' }">
                <sortable-category-main-page/>
            </div>
            <div class="tab-pane"
                :class="{ active: activeTab == 'catalog-category-sort' }">
                <sortable-category-catalog/>
            </div>
            <div class="tab-pane"
                :class="{ active: activeTab == 'seo-templates' }">
                <form @submit.prevent="updateSeo">
                    <div class="category__form-wrapper">
                        <div class="form-group category__control">
                            <form-group-title title="Категория" @click="formVision = !formVision" />
                            <transition-expand>
                                <div v-if="!formVision">
                                    <input-base 
                                        class="category__control"
                                        id="input-category.url"
                                        label="URL"
                                        v-model="seo['category.url']"/>
                                    <input-base id="input-category.title"
                                        class="category__control"
                                        label="Title"
                                        v-model="seo['category.title']"/>
                                    <input-base id="input-category.alt_image"
                                        class="category__control"
                                        label="Alt photo"
                                        v-model="seo['category.alt_image']"/>
                                    <input-base id="input-category.meta_description"
                                        class="category__control"
                                        label="Meta description"
                                        v-model="seo['category.meta_description']"/>
                                </div>
                            </transition-expand>
                        </div>

                        <div class="form-group category__control">
                            <form-group-title title="Эталон" @click="formVision2 = !formVision2"/>
                            <transition-expand>
                                <div v-if="!formVision2">
                                    <input-base 
                                        class="category__control"
                                        id="input-model.url"
                                        label="URL"
                                        v-model="seo['model.url']"/>
                                    <input-base 
                                        class="category__control"
                                        id="input-model.title"
                                        label="Title"
                                        v-model="seo['model.title']"/>
                                    <input-base 
                                        class="category__control"
                                        id="input-model.alt_image"
                                        label="Alt photo"
                                        v-model="seo['model.alt_image']"/>
                                    <input-base 
                                        class="category__control"
                                        id="input-model.meta_description"
                                        label="Meta description"
                                        v-model="seo['model.meta_description']"/>
                                </div>
                            </transition-expand>
                        </div>
                        
                        <v-btn type="submit"
                               class="btn-transparent btn-block btn_disable btn_create category__btn-create"
                               :class="{ 'btn_active': seoChanged }"
                               :loading="loading">
                                  Сохранить
                        </v-btn>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
import API from '@/utils/api'
import HeadLine from '@/components/HeadLine'
import InputBase from '@/components/InputBase'
import VBtn from '@/components/VBtn'
import SortableCategoryMainPage from '@/components/Sortable/SortableCategoryMainPage'
import SortableCategoryCatalog from '@/components/Sortable/SortableCategoryCatalog'
import FormGroupTitle from '@/components/FormGroupTitle'
import TransitionExpand from '@/components/TransitionExpand'

export default {
    layout: 'default-without-sidebar',
    async fetch ({ store }) {
        await store.dispatch('units/getUnits')
        await store.dispatch('categories/getCategories')
        await store.dispatch('categories/getCategoriesMainPage')
    },
    async asyncData({ $axios }) {
        const seo = await API.get($axios, 'manager/metas')
        return {
            seo:  {
                'category.url': seo['category.url'] || '',
                'category.title': seo['category.title'] || '',
                'category.alt_image': seo['category.alt_image'] || '',
                'category.meta_description': seo['category.meta_description'] || '',
                'model.url': seo['model.url'] || '',
                'model.title': seo['model.title'] || '',
                'model.alt_image': seo['model.alt_image'] || '',
                'model.meta_description': seo['model.meta_description'] || '',
            }
        }
    },
    data() {
        return {
            activeTab: 'units',
            loading: false,
            formVision: false,
            formVision2: false,
            unitsChanged: false,
            seoChanged: false,
        }
    },
    watch: {
        seo: {
            deep: true,
            handler(value) {
                this.seoChanged = true
            }
        },
        units: {
            deep: true,
            handler(value) {
                this.unitsChanged = true
            }
        },
    },
    computed: {
        ...mapGetters({
            units: 'units/getUnits'
        }),
    },
    mixins: [
        validationMixin,
    ],
    validations() {
        return {
            units: {
                $each: {
                    name: { required },
                    short: { required }
                }
            },
        }
    },
    components: {
        InputBase,
        VBtn,
        HeadLine,
        SortableCategoryMainPage,
        SortableCategoryCatalog,
        FormGroupTitle,
        TransitionExpand
    },
    methods: {
        ...mapActions('units', {
            updateUnit: 'updateUnit',
            saveUnits: 'saveUnits',
            addUnit: 'addUnit',
        }),
        async onSaveUnits() {
            this.$v.units.$touch()
            if (this.loading || this.$v.units.$pending || this.$v.units.$error) return
            this.unitsChanged = false
            await this.saveUnits()
            
        },
        async updateSeo() {
            this.seoChanged = false

            this.loading = true
            let requests = []
            for (const meta in this.seo) {
                if (this.seo.hasOwnProperty(meta)) {
                    requests.push(new Promise(() => API.create(this.$axios, 'manager/metas/set/' + meta, { value: this.seo[meta] })).then(() => resolve()).catch(() => resolve()))
                }
            }
            await Promise.all(requests)
            this.loading = false
        }
    }
}
</script>

<style lang="scss" scoped>
    .form {
        width: 500px;
    }
    
    .input-base {
        margin-bottom: 12px;
    }
</style>