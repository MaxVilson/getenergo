<template>
    <div class="sortable-category-catalog category-tabs-list">
        <div class="category-tabs-list__wrapper">
            <ul class="category-tabs-list__sidebar">
                <draggable v-model="categoryList" @end="onEnd">
                    <li class="category-tabs-list__sidebar-item" 
                        :class="{'category-tabs-list__sidebar-item_active': activeCategory == index}" 
                        v-for="(category, index) in categoryList" 
                        :key="category.category_id"
                        @click="activeCategory = index">
                        <svg class="icon" width="10" height="7" viewBox="0 0 10 7" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.66671 1.00016H0.333374V0.333496H9.66671V1.00016ZM9.66671 3.66683H0.333374V3.00016H9.66671V3.66683ZM0.333374 6.3335H9.66671V5.66683H0.333374V6.3335Z" />
                        </svg>
                        <span class="category-tabs-list__sidebar-link">
                            {{ category.name }}
                        </span>         
                    </li>
                </draggable>
            </ul>

            <div class="category-tabs-list__content">
                <div v-for="(category, index) in categoryList" :key="category.category_id">
                    <template v-if="!!category.path.length && activeCategory == index">
                        <ul class="category-tabs-list__content-list">
                            <draggable class="category-tabs-list__content-list-wrapper" v-model="category.path" @end="changed = true">
                                <li v-for="child in category.path" 
                                    :key="child.category_id"         
                                    class="category-tabs-list__content-list-item"
                                    :class="{'category-tabs-list__content-list-item_active': child.category_id == hoverTitle}">
                                    <span class="category-tabs-list__content-list-item-title"
                                          @mouseover="hoverTitle = child.category_id"
                                          @mouseleave="hoverTitle = ''">
                                        <svg class="icon" width="10" height="7" viewBox="0 0 10 7" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.66671 1.00016H0.333374V0.333496H9.66671V1.00016ZM9.66671 3.66683H0.333374V3.00016H9.66671V3.66683ZM0.333374 6.3335H9.66671V5.66683H0.333374V6.3335Z" />
                                        </svg>
                                        {{ child.name }}
                                    </span>
                                    <template v-if="!!child.path.length">
                                        <ul class="category-tabs-list__content-sublist">
                                            <draggable v-model="child.path" @end="changed = true">
                                                <li v-for="subchild in child.path" :key="subchild.category_id" class="category-tabs-list__content-sublist-item">
                                                    <svg class="icon" width="10" height="7" viewBox="0 0 10 7" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9.66671 1.00016H0.333374V0.333496H9.66671V1.00016ZM9.66671 3.66683H0.333374V3.00016H9.66671V3.66683ZM0.333374 6.3335H9.66671V5.66683H0.333374V6.3335Z" />
                                                    </svg>   
                                                    {{ subchild.name }}
                                                </li>
                                            </draggable>
                                        </ul>
                                    </template>
                                </li>
                            </draggable>
                        </ul>
                    </template>
                </div>
            </div>
        </div>
        <div class="sortable-category-catalog__footer">
            <div class="sortable-category-catalog__footer-btn-wrapper">
                <v-btn type="submit"
                    class="btn-transparent btn-block btn_disable btn_create category__btn-create"
                    :class="{ 'btn_active': changed }"
                    :loading="loading"
                    @click.prevent="onUpdateSort(); changed = false">
                            Сохранить
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import draggable from 'vuedraggable'
import VBtn from '@/components/VBtn'
import subcategoriesVue from '../../pages/catalog/category/subcategories.vue'

export default {
    name: 'sortable-category-catalog',
    components: {
        draggable,
        VBtn
    },
    data() {
        return {
            categoryList: [],
            activeCategory: '',
            hoverTitle: false,
            changed: false,
            loading: false,
        }
    },
    computed: {
        ...mapGetters({
            categories: 'categories/getCategories'
        }),
    },
    created() {
        this.categoryList = JSON.parse(JSON.stringify(this.categories))
    },
    methods: {
        ...mapActions('categories', {
            updateSort: 'updateSortCatalog'
        }),
        onEnd(event) {
            this.changed = true
            this.activeCategory = event.newDraggableIndex
        },
        onUpdateSort() {
            this.updateSort(this.categoryList)
            this.categoryList.forEach(subcats => {
                this.updateSort(subcats.path)
                subcats.path.forEach(subsubcats => {
                    this.updateSort(subsubcats.path)
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .sortable-category-catalog {

        &__footer {
            display: flex;
            justify-content: center;

            &-btn-wrapper {
                width: 100%;
                max-width: 500px;
            }
        }
    }
</style>