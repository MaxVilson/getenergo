<template>
    <div class="input-base" :class="{ 'input-base_active':changeFocus, 'input-base_error': isError }">
        <label :for="id" class="input-base__label">
            <slot name="icon"/>
            <input  class="form-control input-base__input"
                    :value="value"
                    :type="type"
                    :readonly="readonly"
                    :id="id"
                    v-bind="$attrs"
                    v-on="inputListeners"
                    @focus="isFocus = true; !!validator && validator.$reset()"
                    @blur="isFocus = false; !!validator && validator.$touch()">
            <span :label="label" class="input-base__placeholder">{{ label }}</span>
            <div class="invalid-feedback d-block" v-if="validator && activeErrorMessages.length">{{ firstErrorMessage }}</div>
            <slot name="error"/>
            <slot name="hint"/>
            <slot name="delete"/>
            <slot name="icon-right"/>
        </label>
    </div>
</template>

<script>
import { singleErrorExtractorMixin } from 'vuelidate-error-extractor'

    export default {
        name: 'input-base',
        inheritAttrs: false,
        mixins: [singleErrorExtractorMixin],
        props: {
            value: { type: String | Number, default: '' },
            type: { type: String, default: 'text' },
            id: { type: String, default: '' },
            inputClass: { type: String },
            label: { type: String },
            readonly: { type: Boolean, default: false },
            validator: { type: Object, default: () => { } },
        },
        data() {
            return {
                isFocus: false
            }
        },
        computed: {
            changeFocus() {
                return (this.isFocus && !this.readonly) || !!this.value;
            },
            inputListeners: function () {
                var vm = this
                return Object.assign({}, this.$listeners, {
                    input: function (event) {
                        vm.$emit('input', event.target.value)
                    }
                })
            },
            isValid: function() {
                return this.validator && (!this.activeErrorMessages.length && this.isValid)
            },
            isError: function() {
                return this.validator && (this.hasErrors || this.activeErrorMessages.length)
            },
        },
    }
</script>

<style lang="scss">
    .input-base {
        position: relative;
        width: 100%;
        white-space: nowrap;

        &_outline-none {
            & input {
                border: none;
            }
        }

        &_readonly-white {
            & .input-base__input {
                &[readonly] {
                    background-color: $white;
                }
            }
        }

        &__label {
            margin-bottom: 0;
            width: 100%;
        }

        &__placeholder {
            position: absolute;
            top: 19px;
            left: 16px;
            width: auto;
            height: auto;
            font-size: (15 / 16 + rem);
            color: $black;
            transition: all .2s ease;
        }

        &__input {
            padding-top: 20px;
            padding-left: 16px;
            height: 56px;
            letter-spacing: .01em;
            transition: all .15s ease;
        }

        &_active {
            & .input-base__placeholder {
                font-size: (12 / 16 + rem);
                color: $placeholder-active;
                transform: translateY(-15px);
            }
        }

        &_error .form-control {
            border-color: #dc3545;
        }

        &_error .input-base__placeholder {
            //color: #dc3545;
        }

        &_delete {

            &:hover {
                & .icon {
                    opacity: 1;
                    transition: opacity .15s;
                }
            }
            & .icon {
                width: 14px;
                height: 14px;
                opacity: 0;
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
    }
</style>
