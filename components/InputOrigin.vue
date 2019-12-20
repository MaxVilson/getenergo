<template>
    <div class="input-origin">
        <label :for="id" class="input-origin__label">
            <input :value="value"
                :type="type"
                :id="id"
                v-bind="$attrs"
                v-on="inputListeners"
                class="input-origin__input"
                :placeholder="placeholder">
            <slot/>
        </label>
    </div>
</template>

<script>
    export default {
        name: 'input-origin',
        props: {
            value: {type: String, default: ''},
            type: {type: String, default: 'text'},
            placeholder: {type: String},
            id: {type: String}
        },
        computed: {
            inputListeners: function () {
                var vm = this
                return Object.assign({}, this.$listeners, {
                    input: function (event) {
                        vm.$emit('input', event.target.value)
                    },
                    change: function (event) {
                        vm.$emit('change', event.target.value)
                    },
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .input-origin {
        height: 56px;

        &_width-468 {
            width: 468px;
        }

        &_height-32 {
            height: 32px;
        }

        &_br-8 {
            & .input-origin__input {
                border-radius: 8px;
            }
        }

        &_icon-left {
            & .input-origin__input {
                padding-left: 48px;
            }

            & .icon {
                left: 19px;
            }
        }

        &__label {
            position: relative;
            margin-bottom: 0;
            width: 100%;
            height: 100%;

            & svg {
                position: absolute;
                top: 50%;
                right: (20 / 16 + rem);
                width: 18px;
                height: 18px;
                transform: translateY(-50%);
            }
        }

        &__input {
            padding-top: 0;
            padding-bottom: 0;
            padding-right: 0;
            padding-left: 16px;
            width: 100%;
            height: 100%;
            border: 1px solid $border-color;
            border-radius: 4px;
            font-size: (15 / 16 + rem);

            &:placeholder {
                color: $gray-400;
            }
        }
    }
</style>