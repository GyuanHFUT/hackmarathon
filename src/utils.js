/**
 * 工具类封装
 * (1)在main.js中引用，并添加为vue的原型方法：
 *      import utils from './utils.js';
 *      Vue.prototype.$utils = utils
 * (2)使用：a.在组件中使用时，$utils.方法名；b.在其他钩子使用时，使用this.$utils.方法名
 */
export default{
    //1.年月日转时间戳
    

    //2.时间戳转格式：年-月-日
    formatMillsecondsToYMD(mills){
        let date = new Date(mills)
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month < 10 ? ('0' + month) : month;
        let day= date.getDate();
		day = day < 10 ? ('0' + day) : day;
		return year + '-'+ month + '-' + day
    },
    
}