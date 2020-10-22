<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  export default {
    data(){
      return{
      }
    },
    created() {
      // var style = localStorage.getItem("style");
      // if(style){
      //   document.getElementById("theme-style").href = style; //实现将主题保存在内存中刷新浏览器不改变
      // }
    },
    mounted() {

    }
  }
</script>
<style lang="scss">
/*#app {*/
/*  font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
/*  -webkit-font-smoothing: antialiased;*/
/*  -moz-osx-font-smoothing: grayscale;*/
/*  //text-align: center;*/
/*  color: #2c3e50;*/

/*  //*/
/*  position:relative;  */
/*  width:100%;*/
/*  min-height:100%; */
/*  height: 100%;*/
/*  */
/*}*/
/*body {overflow-y:auto !important;padding-right:0 !important;}*/

/*#nav {*/
/*  padding: 30px;*/

/*  a {*/
/*    font-weight: bold;*/
/*    color: #2c3e50;*/

/*    &.router-link-exact-active {*/
/*      color: #42b983;*/
/*    }*/
/*  }*/
/*}*/
</style>
