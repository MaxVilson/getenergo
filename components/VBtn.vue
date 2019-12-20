<template>
    <a v-if="!!href"
        :href="href"
        class="btn"
        :class="btnClass"
        v-on="inputListeners"><slot/></a>
    <span v-else-if="type == 'span'"
        class="btn"
        :class="btnClass"
        v-on="inputListeners"><slot/></span>
    <button v-else-if="!!type"
        :type="type"
        class="btn"
        :class="btnClass"
        v-on="inputListeners"><slot/></button>
</template>

<script>
export default {
    name: 'v-btn',
    computed: {
        btnClass: function() {
            return this.loading ? 'btn-loading' : ''
        },
        inputListeners: function () {
            return this.$listeners
        },
    },
    props: {
        href: { type: String, default: '' },
        type: { type: String, default: 'button' },
        loading: { type: Boolean, default: false },
    }
}
</script>

<style lang="scss">
    .btn {
        padding-top: (11 / 16 + rem);
        padding-bottom: (11 / 16 + rem);
        border: 1px solid $gray-400;
        border-radius: (6 / 16 + rem);

        // Размеры кнопок
        &_sm {
            padding: 3px 9px;
        }

        &_md {
            padding: 4px 77px;
            line-height: 22px;
        }

        &_height-md {
            padding-top: 12px;
            padding-bottom: 12px;
        }

        &_lg {
            padding-top: 13px;
            padding-bottom: 12px;
        }

        &_w149 {
            width: 149px;
        }

        &_w220 {
            width: 220px;
        }

        &_br-8 {
            border-radius: 8px;
        }

        &_py-12 {
            padding-top: (13 / 16 + rem);
            padding-bottom: (12 / 16 + rem);
        }

        &_py-4px {
            padding-top: 4px;
            padding-bottom: 4px;
            line-height: 22px;
        }

        &_gray {
            border: 1px solid $gray-400;
            background: linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%);

            &-dark {
                background-color: #EDEDED;
            }

            &-light {
                background-color: $gray-200;
                color: $color-btn-create;

                &-active {
                background-color: $blue;
                color: $white;
            }
            }
        }

        &_primary {
            color: $primary;

            &-light {
                background-color: $primary-light;
            }
        }

        &_primary-transparent {
            border: 1px solid $primary;
            background-color: transparent !important;
            color: $primary !important;
            cursor: pointer;
        }

        &_eror {
            border: 1px solid #C34343;
            background-color: transparent !important;
            color: #C34343 !important;
            cursor: pointer;
        }

        &_active {
            background-color: $primary !important;
            color: $white !important;
            cursor: pointer !important;
        }

        &_disable {
            border: 1px solid $gray-300;
            background-color: $gray-200;
            font-size: (14 / 16 + rem);
            font-weight: 500;
            color: $color-btn-create;

            &:hover {
                color: $color-btn-create;
                cursor: inherit;
            }

            &-color-gray {
                color: #AAAAAA;
            }

            & svg {
                margin-bottom: 2px;
            }
        }

        &_create {
            color: $color-btn-create;
        }

        // Размеры шрифта

        &_fz14 {
            font-size: (14 / 16 + rem);
            line-height: 1rem;
        }

        &_fz15 {
            font-size: (15 / 16 + rem);
            line-height: (18 / 16 + rem);
            font-weight: 500;
        }

        //  Кнопки с иконками
        &_manage{
            padding-left: 0;
            & svg {
                margin-bottom: 2px;
                width: 16px;
                height: 16px;
            }
        }

        &_check {
            position: relative;
            padding: 0;

            & svg {
                position: absolute;
                top: 8px;
                left: 24px;
                display: none;
                width: 11px;
            }

            & input {
                display: none;

                &:checked + svg {
                    display: block;
                }
            }

            & label {
                margin-bottom: 0 !important;
                padding: 7px 14px;
                width: 100%;
                height: 100%;
                font-size: (14 / 16 + rem);
                cursor: pointer;

                &:after {
                    content: '';
                    position: absolute;
                    top: 7px;
                    left: 22px;
                    width: 15px;
                    height: 15px;
                    border: 1px solid $gray-600;
                }
            }
        }

        &_check-form {
            line-height: 1.75;

            & svg {
                top: 20px;
                left: 33px;
            }

            & input {
                display: none;

                &:checked + svg {
                    display: block;
                }
            }


            & label {
                padding-top: 16px;
                padding-bottom: 16px;
                padding-left: 61px;

                &:after {
                    top: 19px;
                    left: 31px;
                }
            }
        }

        &_delete {
           border: none;

           & .icon {
               width: 17px;
               height: 17px;
           }
        }
    }
</style>
