<template>
  <router-view :key="$route.path" />
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
    };
  },
};
</script>

<style>
a {
  text-decoration: none;
}
</style>
