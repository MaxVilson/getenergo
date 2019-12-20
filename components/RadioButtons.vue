<template>
    <div class="radio-buttons">
         <div class="radio-buttons__inner d-flex">
             <div class="radio-buttons__wrapper-btn" v-for="(btn, i) in options" :key="btn.value">
                <input type="radio"
                    :id="btn.value"
                    name="radio"
                    class="radio-buttons__input"
                    :checked="value == btn.value"> 
                <label :for="btn.value" class="radio-buttons__label" 
                        @click="$emit('input', btn.value), active = i"
                        :class="{ 'radio-buttons__label_active': i == active  }">{{ btn.text }}</label>
             </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'radio-buttons',
        props: {
            value: { type: String, default: '' },
            options: { type: Array, default: () => { return [] } },
        },
        data() {
            return {
                active: 0
            }
        }
    }
</script>

<style lang="scss" scoped>
    .radio-buttons {

        &__wrapper-btn {
            width: 50%;

            &:nth-child(2n) {
                & label {
                    margin-left: -1px;
                    border-radius: 0px 4px 4px 0px;
                }
            }
        }

        &__input {
            display: none;

            // &:checked+.radio-buttons__label {
            //     border: 1px solid rgba(0, 146, 255, 0.2);
            //     background-color: $blue-light;
            //     font-weight: 500;
            //     color: $primary;
            // }
        }

        &__label {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 17px;
            width: 100%;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 4px 0px 0px 4px;
            line-height: (21 / 16 + rem);
            cursor: pointer;

            &_active {
                border: 1px solid rgba(0, 146, 255, 0.2);
                background-color: $blue-light;
                font-weight: 500;
                color: $primary;
            }
        }
    }
</style>