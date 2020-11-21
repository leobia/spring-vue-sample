<template>
    <div id="test">test</div>
</template>

<style>
#test {
  color: green
}
</style>

<script>
export default {
  mounted() {
    this.$http('/test').then(response => {
      console.log(response)
    })
  }
};
</script>