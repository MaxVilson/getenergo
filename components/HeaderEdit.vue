<template>
    <div class="header-edit">
        <div class="header-edit__wrapper">
            <input-origin :value="value" 
                @change="!!$event.target.value && $emit('input', $event.target.value)"
                v-if="showInput" 
                type="text" 
                :placeholder="placeholder" 
                class="header-edit__input category__control">
                <button @click="showInput = !showInput" 
                        type="button" 
                        class="header-edit__input-save">Сохранить</button>
            </input-origin>

            <div v-else @click="showInput = !showInput" class="header-edit__title">
                <icon-base icon="pencil"/>
                {{ value }}
            </div>
        </div>
    </div>
</template>

<script>
    import InputOrigin from '@/components/InputOrigin'

    export default {
        name: 'header-edit',
        components: {
            InputOrigin
        },
        props: {
            value: { type: String, default: '' },
            placeholder: { type: String, default: 'Название' },
        },
        data() {
            return {
                showInput: false,
            }
        }
    }
</script>

<style lang="scss">
    .header-edit {

        &__wrapper {
            
        }

        &__title {
            display: inline-block;
            margin-bottom: 20px;
            max-width: 428px;
            font-size: (20 / 16 + rem);
            font-weight: 500;
            line-height: (27 / 16 + rem);
            vertical-align: top;
            cursor: pointer;

            & .icon {
                margin-right: 3px;
                width: 24px;
                height: 24px;
                vertical-align: top;
            }
        }

        &__input {
            width: 100%;
            max-width: 430px;
        }

        &__input-save {
            position: absolute;
            top: 50%;
            right: 10px;
            border: none;
            background-color: transparent;
            font-size: (12 / 16 + rem);
            color: $primary;
            transform: translateY(-50%);
        }
    }
</style>