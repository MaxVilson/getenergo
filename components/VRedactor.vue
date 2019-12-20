<template>
    <div class="redactor"
        :class="{ redactor_loaded: loaded }">
        <textarea ref="redactor"
            :name="name"
            :placeholder="placeholder"
            :value="value"/>
    </div>
</template>

<script>
import Vue from 'vue'

if (process.browser) {
    require('@/plugins/redactor')
    require('@/plugins/redactor/ru')
}

export default {
    data() {
        return {
            loaded: false,
        }
    },
    props: {
        value: {
            default: '',
            type: String
        },
        placeholder: {
            type: String,
            default: null
        },
        name: {
            type: String,
            default: null
        },
        config: {
            default: () => { return {} },
            type: Object
        }
    },
    watch: {
        value(newValue, oldValue){
            if (!this.redactor.editor.isFocus()) this.redactor.source.setCode(newValue)
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        this.destroy()
    },
    methods: {
        init () {
            var me = this;
            var callbacks = {
                started: () => { this.loaded = true },
                changed: function(html) {
                    me.handleInput(html)
                    return html
                }
            };

            // extend config
            Vue.set(this.config, 'callbacks', callbacks)
            Vue.set(this.config, 'lang', 'ru')

            // call Redactor
            var app = $R(this.$refs.redactor, this.config)

            // set instance
            this.redactor = app
            this.$parent.redactor = app
        },
        destroy () {
            // Call destroy on redactor to cleanup event handlers
            $R(this.$refs.redactor, 'destroy')
            
            // unset instance for garbage collection
            this.redactor = null
            this.$parent.redactor = null
        },
        handleInput (val) {
            this.$emit('input', val)
        }
    }
}
</script>

<style lang="scss" scoped>
.redactor {
    border: 1px solid #D0D4D9;
    border-radius: 0.25rem;
    min-height: 250/16*1rem;

    &_loaded {
        border-color: transparent;
    }

    textarea {
        opacity: 0;
        visibility: hidden;
    }
}

.redactor::v-deep .redactor-box.redactor-styles-on {
    border: 1px solid #D0D4D9;
    border-radius: 0.25rem;
    min-height: 250/16*1rem;
}

::v-deep .redactor-toolbar, .redactor-air {
    z-index: 30;
}
</style>