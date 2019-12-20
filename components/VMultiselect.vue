<template>
    <div>
        <div class="multiselect-wrapper"
            :class="{'multiselect-wrapper_active': changeFocus, 'multiselect-wrapper_click-active': isFocus, 'multiselect-wrapper_error': validator.$error}">
            <multiselect
                :id="id"
                v-bind="$attrs"
                v-model="selected"
                :options="options"
                :close-on-select="true"
                @open="isFocus = true; validator.$reset"
                @close="isFocus = false"/>
            <label :for="id" class="multiselect__innerText" @click="isClick = !isClick">{{ innerText }}</label>
        </div>
        <div class="invalid-feedback d-block" v-if="validator.$error">Поле «{{ innerText }}» является обязательным</div>
    </div>
</template>

<script>
import { singleErrorExtractorMixin } from 'vuelidate-error-extractor'
    import Multiselect from 'vue-multiselect';

    export default {
        name: 'v-multiselect',
        components: {
            Multiselect
        },
        data() {
            return {
                isFocus: false,
                isActive: true
            }
        },
        props: {
            value: { type: String | Number, default: '' },
            options: { type: Array, default: () => [] },
            innerText: { type: String },
            id: { type: String },
            validator: { type: Object, default: () => { return {} } },
        },
        computed: {
            changeFocus() {
                return this.isFocus || !!this.value;
            },
            selected: {
                get() {
                    return this.options.find(option => option.name == this.value)
                },
                set(value) {
                    this.$emit('input', value.name)
                    this.$emit('select', value.name)
                }
            },
            // isValid: function() {
            //     return this.validator && (!this.activeErrorMessages.length && this.isValid)
            // },
            // isError: function() {
            //     return this.validator && (this.hasErrors || this.activeErrorMessages.length)
            // },
        },
    }
</script>

<style lang="scss">
    .multiselect-wrapper {
        position: relative;
        height: 100%;
        cursor: pointer;

        &_active {
            .multiselect__tags {
                padding-bottom: 0;
            }

            & .multiselect__innerText {
                font-size: (12 / 16 + rem);
                color: $placeholder-active;
                transform: translateY(-15px);
                transition: all .2s ease;
                z-index: 41;
            }
        }

        &_error {
            .multiselect__tags {
                border-color: #dc3545;
            }
        }

        &_click-active {
            & .multiselect--active {
                z-index: 59;
            }

            & .multiselect__innerText {
                z-index: 60;
            }
        }
    }

    .multiselect {
        width: 100%;
        min-height: auto;
        height: 100%;
        font-size: (15 / 16 + rem) !important;
        color: $color-text-dark;

        ::-webkit-input-placeholder {
            font-size: (15 / 16 + rem);
            color: $color-text-dark;
            }
        ::-moz-placeholder {
            font-size: (15 / 16 + rem);
            color: $color-text-dark;
        }
        :-ms-input-placeholder {
            font-size: (15 / 16 + rem);
            color: $color-text-dark;
        }
        :-moz-placeholder {
            font-size: (15 / 16 + rem);
            color: $color-text-dark;
        }

        &--active {
            z-index: 40;
            border-radius: 4px 4px 0px 0px;
        }

        &__label {
            width: 100%;
            height: 100%;
            cursor: pointer;
        }

        &__placeholder {
            font-size: (15 / 16 + rem);
            color: $color-text-dark;
        }

        &__innerText {
            position: absolute;
            top: 20px;
            z-index: 39;
            padding-left: 16px;
            font-size: (15 / 16 + rem);
            color: $black;
        }

        &__select {
            top: 12px;
        }

        &__content-wrapper {
            z-index: 51;
            overflow-x: hidden;
            border-bottom: none;
        }


        &__option {
            padding-top: 24px;
            height: 56px;
            border-bottom: 1px solid #D0D4D9;

            &:hover {
                color: $black;
            }

            &--highlight {
                background-color: #E9F7FF;
                color: $black;

                &:after {
                    content: '';
                    background-color: $primary-light;
                }
            }

            &--selected {
                background-color: #E9F7FF;
                color: $black;
                font-weight: 400;
                position: relative;

                &:after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    z-index: 70;
                    right: -4px;
                    width: 13px;
                    height: 13px;
                    background-image: url("data:image/svg+xml,%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 240.608 240.608' style='enable-background:new 0 0 240.608 240.608;' xml:space='preserve'%3E%3Cpath style='fill:%2328a745;' d='M208.789,29.972l31.819,31.82L91.763,210.637L0,118.876l31.819-31.82l59.944,59.942L208.789,29.972z'/%3E%3C/svg%3E%0A");
                    background-repeat: no-repeat;
                    transform: translateY(-50%);
                }

                &:hover {
                    background-color: inherit;
                }

                &.multiselect__option--highlight {
                    background-color: #E9F7FF;
                    font-weight: 400;
                    color: $black;

                    &:hover {
                        background-color: #E9F7FF;
                    }

                    &:after {
                        content: '';
                        background-color: #E9F7FF;
                        position: absolute;
                        top: 50%;
                        z-index: 70;
                        right: -4px;
                        width: 13px;
                        height: 13px;
                        background-image: url("data:image/svg+xml,%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 240.608 240.608' style='enable-background:new 0 0 240.608 240.608;' xml:space='preserve'%3E%3Cpath style='fill:%2328a745;' d='M208.789,29.972l31.819,31.82L91.763,210.637L0,118.876l31.819-31.82l59.944,59.942L208.789,29.972z'/%3E%3C/svg%3E%0A");
                        background-repeat: no-repeat;
                        transform: translateY(-50%);
                    }
                }
            }
        }

        &__tags {
            padding-top: 25px;
            padding-bottom: 8px;
            padding-left: 10px;
            height: 100%;
            min-height: auto;
            border: 1px solid #D0D4D9;
            border-radius: 4px;
        }
    }
    .multiselect__content-wrapper {
        border-bottom: 1px solid #D0D4D9;
    }
</style>
