<template>
    <div class="model-search">
        <div class="model-search__wrapper">
            <div class="model-search__title category__control">Поиск эталонов по ID</div>
            <input-textarea class="category__control model-search__textarea"
                placeholder="Введите ID эталонов"
                v-model="query"/>
            <div class="d-flex justify-content-center">
                <v-btn class="btn_disable model-search__btn btn_active"
                    @click.prevent="$emit('input', query)">Найти</v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import InputTextarea from '@/components/InputTextarea'
import VBtn from '@/components/VBtn'

export default {
    data() {
        return {
            query: this.value,
        }
    },
    props: {
        value: { type: String, default: '' },
    },
    components: {
        InputTextarea,
        VBtn,
    }
}
</script>

<style lang="scss">
    .model-search {

        &__wrapper {
            padding: (30 / 16 + rem) (40 / 16 + rem);
            padding-bottom: 0.5rem;
        }

        &__title {
            font-size: (15 / 16 + rem);
            font-weight: 500;
            text-align: center;
        }

        &__textarea {

            & textarea {
                height: 180px;
            }
        }

        &__btn {
            padding: (3 / 16 + rem) (39 / 16 + rem);
        }
    }
</style>
