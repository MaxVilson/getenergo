<template>
  <div class="site">
    <main-header/>
    <div class="content-wrapper">
        <main class="content-main mx-0 w-100">
            <nuxt />
        </main>
    </div>
    <v-dialog/>
  </div>
</template>

<script>
  import mainHeader from '@/components/MainHeader';

  export default {
      components: {
          mainHeader,
      }
  }
</script>
