<template>
    <div class="input-textarea"> 
        <label for="input-textarea__label" class="input-textarea__label">
            <textarea type="textarea" class="form-control"
                :value="value"
                v-bind="$attrs"
                v-on="inputListeners"/>
        </label>
        <slot name="error"/>
    </div>
</template>

<script>
export default {
    name: 'input-textarea',
    props: {
        value: { type: String | Number, default: '' },
    },
    computed: {
        inputListeners: function () {
            var vm = this
            return Object.assign({}, this.$listeners, {
                input: function (event) {
                    vm.$emit('input', event.target.value)
                }
            })
        },
    },
}
</script>

<style lang="scss">
    .input-textarea {
        &__label {
            margin-bottom: 0;
            width: 100%;
        }

        & textarea {
            width: 100%;
            height: 255px;
            border-radius: 0px 0px 4px 4px;
            resize: none;
        }
    }
</style>