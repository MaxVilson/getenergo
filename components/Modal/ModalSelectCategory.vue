<template>
    <modal name="select-category" height="auto" :max-width="1000" width=100% :adaptive="true">
        <div class="select-category">
            <div class="select-category__top-line d-flex align-items-center">
                <div class="select-category__title">Выберите категорию</div>
                <input-origin class="select-category__search ml-auto" type="text" placeholder="Введите название характеристики">
                    <icon-base icon="search"/>
                </input-origin> 
            </div>
            <div class="category-tabs-list">
                <div class="category-tabs-list__wrapper">
                    <ul class="category-tabs-list__sidebar">
                        <li class="category-tabs-list__sidebar-item"
                            :class="{'category-tabs-list__sidebar-item_active': activeCategory == index}"
                            @click="activeCategory = index"  
                            v-for="(category, index) in categoryList" 
                            :key="category.category_id">
                            <svg class="icon" width="10" height="7" viewBox="0 0 10 7" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.66671 1.00016H0.333374V0.333496H9.66671V1.00016ZM9.66671 3.66683H0.333374V3.00016H9.66671V3.66683ZM0.333374 6.3335H9.66671V5.66683H0.333374V6.3335Z" />
                            </svg>
                            <span class="category-tabs-list__sidebar-link" 
                                  @click="activeCategory = index">{{ category.name }}
                            </span>         
                        </li>
                    </ul>

                    <div class="category-tabs-list__content">
                        <div v-for="(category, index) in categoryList" :key="category.category_id">
                            <template v-if="!!category.path.length && activeCategory == index">
                                <ul class="category-tabs-list__content-list">
                                    <div class="category-tabs-list__content-list-wrapper">
                                        <li v-for="child in category.path" 
                                            :key="child.category_id"         
                                            class="category-tabs-list__content-list-item">
                                            <span class="category-tabs-list__content-list-item-title"
                                                @click="$emit('select', child.category_id)">
                                                <svg class="icon" width="10" height="7" viewBox="0 0 10 7" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.66671 1.00016H0.333374V0.333496H9.66671V1.00016ZM9.66671 3.66683H0.333374V3.00016H9.66671V3.66683ZM0.333374 6.3335H9.66671V5.66683H0.333374V6.3335Z" />
                                                </svg>
                                                {{ child.name }}
                                            </span>
                                            <template v-if="!!child.path.length">
                                                <ul class="category-tabs-list__content-sublist">
                                                    <li v-for="subchild in child.path" :key="subchild.category_id" class="category-tabs-list__content-sublist-item"
                                                    @click="$emit('select', subchild.category_id)">
                                                        <svg class="icon" width="10" height="7" viewBox="0 0 10 7" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.66671 1.00016H0.333374V0.333496H9.66671V1.00016ZM9.66671 3.66683H0.333374V3.00016H9.66671V3.66683ZM0.333374 6.3335H9.66671V5.66683H0.333374V6.3335Z" />
                                                        </svg>   
                                                        {{ subchild.name }}
                                                    </li>
                                                </ul>
                                            </template>
                                        </li>
                                    </div>
                                </ul>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="select-category__footer d-flex justify-content-center">
                <v-btn @click="$modal.hide('select-category')" class="btn_gray-dark btn_md border-0 py-2" type="submit">Закрыть</v-btn>
            </div>
        </div>
    </modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import InputOrigin from '@/components/InputOrigin'
import VBtn from '@/components/VBtn'

export default {
    name: 'select-category',
    components: {
        InputOrigin,
        VBtn
    },
    data() {
        return {
            categoryList: [],
            activeCategory: '',
            hoverTitle: false,
        }
    },
    created() {
        this.categoryList = JSON.parse(JSON.stringify(this.categories))
    },
    methods: {
        ...mapActions('categories', {
            updateSort: 'updateSortCatalog'
        }),
    },
    computed: {
        ...mapGetters({
            categories: 'categories/getCategories'
        }),
    },
}
</script>

<style lang="scss">
    .select-category {
        padding: 20px;

        &__top-line {
            margin-bottom: 30px;
        }

        &__title {
            font-size: (20 / 16 + rem);
            font-weight: 700;
        }

        &__footer {
            margin-top: 30px;
            margin-bottom: 10px;
        }

        & .icon {
            display: none;
        }

        & .select-category__search {
            width: 71%;
            height: 40px;
        }

        & .category-tabs-list__sidebar-link {
            padding-left: 16px;
        }

        & .category-tabs-list__content-list-item-title {
            cursor: pointer;
        }

        & .category-tabs-list__content-list-item {
            cursor: context-menu;
        }

        & .category-tabs-list__content-sublist-item {
            cursor: pointer;
        }
    }
</style>