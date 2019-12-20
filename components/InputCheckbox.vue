<template>
    <div class="input-checkbox" :class="{'input-checkbox_urgent': isUrgent}">
        <slot/>
        <label :for="id" class="input-checkbox__label">
            <input type="checkbox" 
                   :id="id" 
                   class="input-checkbox__input"
                   :checked="!!value"
                   @click="isUrgent = !isUrgent"
                    v-on="inputListeners"> {{ text }}
            <icon-base icon="check"/>
        </label>
    </div>
</template>

<script>
    export default {
        name: 'input-checkbox',
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            id: {type: String},
            text: {type: String},
            value: {type: Number},
        },
        data() {
            return {
                isUrgent: !!this.value
            }
        },
        computed: {
            inputListeners: function () {
                var vm = this
                return Object.assign({},
                    this.$listeners,
                    {
                        change: function (event) {
                            vm.$emit('change', event.target.checked ? 1 : 0)
                        }
                    }
                )
            }
        },
    }
</script>

<style lang="scss" scoped>
    .input-checkbox {
        position: relative;
        padding: 15px 19px;
        border: 1px solid $border-color;
        border-radius: 4px;

        & svg {
            position: absolute;
            top: 50%;
            left: -8px;
            width: 13px;
            transform: translateY(-50%);
            display: none;
        }

        &_origin {
            padding: 0;

            &:after {
                display: none;
            }

            & .icon {
                left: 30px;
            }

            .input-checkbox__label {
                padding: 18px 19px 17px 61px;
                width: 100%;
                height: 100%;
                font-size: (13 / 16 + rem);

                &:after {
                    left: 28px;
                    width: 18px;
                    height: 18px;
                    border-radius: 2px;
                }
            }
        }

        &_urgent {
            &:after {
                content: 'Обязательная характеристика';
                position: absolute;
                top: -8px;
                left: 16px;
                padding-right: 4px;
                padding-left: 4px;
                background-color: $white;
                font-size: (11 / 16 + rem);
                color: $red-light;
            }
        }

        &__delete {
            position: absolute;
            top: 18px;
            right: 17px;
            width: 17px;
            height: 17px;
            border: none;
            background-color: transparent;

            & svg {
                display: block;
                width: 17px;
                height: 17px;
            }
        }

        &__label {
            position: relative;
            margin-bottom: 0;
            padding-left: 18px;
            cursor: pointer;

            &:after {
                content: '';
                position: absolute;
                top: 50%;
                left: -11px;
                width: 18px;
                height: 18px;
                border: 1px solid $gray-600;
                transform: translateY(-50%);
            }
        }

        &__input {
            display: none;

            &:checked + svg {
                display: block;
            }
        }
    }

    .input-checkbox {
        margin-bottom: 12px;
    }
</style>