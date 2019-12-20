<template>
    <modal :name="name"
        class="modal-base"
        height="auto"
        :width="524"
        v-bind="$attrs"
        :scrollable="true">
        <div class="modal-base__wrapper">
            <div class="modal-base__top-line">
                <slot name="title">{{ title }}</slot>
                <button type="button"
                    class="modal-base__close"
                    @click="$modal.hide(name)">
                    <icon-base icon="close"/>
                </button>
            </div>
            <div class="modal-base__content">
                <slot>{{ content }}</slot>
            </div>
        </div>
    </modal>
</template>

<script>
import VBtn from '@/components/VBtn'

export default {
    name: 'modal-base',
    components: {
        VBtn
    },
    props: {
        name: { type: String, default: 'modal-base' },
        title: { type: String, default: '' },
        content: { type: String, default: '' },
    }
}
</script>

<style lang="scss">
    .modal-base {

        &__wrapper {
            padding-top: (20 / 16 + rem);
            padding-bottom: (20 / 16 + rem);
        }

        &__top-line {
            position: relative;
            padding-right: (40 / 16 + rem);
            padding-left: (40 / 16 + rem);
        }

        &__close {
            position: absolute;
            top: 0;
            right: 20px;
            padding: 0;
            border: none;
            background-color: transparent;

            & .icon {
                width: 24px;
                height: 24px;
            }
        }
    }
</style>
