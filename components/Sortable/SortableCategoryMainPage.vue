<template>
    <div>
        <draggable v-model="categoryList" class="list-group" v-bind="dragOptions" @end="changed = true">
            <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                <div class="item list-group-item" 
                     v-for="category in categoryList" 
                     :key="category.category_id" 
                     :class="{'item_active' : isActive}" 
                     @mousedown="isActive = true"
                     @mouseup="isActive = false">
                    <span class="number">{{ category.category_id }}</span>
                    {{ category.name }}
                </div>
            </transition-group>
        </draggable>
        <v-btn class="btn-transparent btn-block btn_disable btn_create btn_py-12 btn-save"
            :class="{ 'btn_active': changed }"
            @click.prevent="updateSort(categoryList); changed = false"
               type="submit">Сохранить</v-btn>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import draggable from 'vuedraggable'
import VBtn from '@/components/VBtn'

export default {
    name: 'sortable-category-main-page',
    display: "Transitions",
    order: 7,
    components: {
        draggable,
        VBtn
    },
    data() {
        return {
            drag: false,
            isActive: false,
            changed: false,
            categoryList: []
        }
    },
    created() {
        this.categoryList = JSON.parse(JSON.stringify(this.categories))
    },
    computed: {
        ...mapGetters({
            categories: 'categories/getCategoriesMainPage'
        }),
         dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            };
        }
    },
    methods: {
        ...mapActions('categories', {
            updateSort: 'updateSortMainPage'
        }),
    }
}
</script>

<style lang="scss" scoped>
    .item {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 4px;
        width: 500px;
        height: 80px;
        border: 1px dashed rgba(0, 0, 0, 0.1);
        border-radius: 0;
        font-size: (15 / 16 + rem);
        line-height: (18 / 16 + rem);
        font-weight: 500;
        letter-spacing: 0.01em;
        cursor: pointer;
        transition: all .3s;

        &:after {
            content: 'перенести категорию';
            position: absolute;
            top: 45px;
            left: 50%;
            font-weight: 400;
            color: $disable;
            transform: translateX(-50%);
            transition: all .3s;
            opacity: 0;
        }

        &:hover {
            border-color: #0092FF;
            color: $color-main;

            &:after {
                opacity: 1;
            }
        }

        &_active {
            border: 1px dashed rgba(0, 0, 0, 0.1);
            color: $color-text-dark;
            &:hover {
                border: 1px dashed rgba(0, 0, 0, 0.1);
                color: $color-text-dark;

                &:after {
                    opacity: 0;
                }
            }
        }
    }

    .number {
        position: absolute;
        top: 50%;   
        left: -60px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        background-color: #FAFAFA;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
        font-size: (14 / 16 + rem);
        color: $color-text-dark;
        transform: translateY(-50%);
    }

    .btn-save {
        margin-top: 28px;
    }

    .flip-list-move {
        transition: transform 0.5s;
    }
    .no-move {
        transition: transform 0s;
    }
    .ghost {
        border: none;
        background: $primary;
        color: $white;
    }
    .list-group-item {
        cursor: move;
    }
    .list-group-item i {
        cursor: pointer;
    }
</style>