<template>
  <div class="site">
    <main-header/>
    <div class="content-wrapper">
        <main-sidebar/>
        <main class="content-main">
            <nuxt />
        </main>
    </div>
    <v-dialog/>
  </div>
</template>

<script>
  import mainHeader from '@/components/MainHeader';
  import MainSidebar from '@/components/MainSideBar';

  export default {
      components: {
          mainHeader,
          MainSidebar,
      }
  }
</script>
