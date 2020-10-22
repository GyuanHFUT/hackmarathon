<template>
    <div class="wrapper">
        <div id="biaodiwu_pop" style="width:100%;height: 32vw">
            <!-- <el-button style="z-index:999">点击</el-button> -->
        </div>
        <!--        <div id="zoom_button">-->
        <!--            &lt;!&ndash; <el-button style="z-index:999;">放大</el-button>-->
        <!--            <el-button style="z-index:999">缩小</el-button> &ndash;&gt;-->
        <!--            <div class="zoom_wrapper">-->
        <!--              <i class="el-icon-zoom-in" @click="zoomIn"></i>-->
        <!--              &lt;!&ndash; <el-button @click="zoomView"></el-button> &ndash;&gt;-->
        <!--            </div>-->
        <!--            <div class="zoom_wrapper">-->
        <!--              <i class="el-icon-zoom-out" @click="zoomOut"></i>-->
        <!--            </div>-->
        <!--        </div>-->

    </div>
</template>

<script>
    import {Network} from "vis/index-network";

    export default {
        components: {},
        props: ['source','display'],
        data() {
            return {
                myChart:null,
                count:1,
                count_out:1,
                data:[],
                link:[],
            };
        },
        watch: {
            source:'changeSource',
            display:'changeDisplay'
        },
        computed: {},
        methods: {
            changeSource(){
                this.formatJson(this.source)
                this.initCharts()
            },
            changeDisplay(){
                if (this.display && this.myChart == null) this.changeSource()
            },
            initCharts(){
                var options={
                    //clickToUse: true,
                    interaction: {
                        hover: true,
                        navigationButtons: true,
                        keyboard: true
                    },
                    physics: {stabilization: {enabled: true, iterations: 2000, updateInterval: 25}},
                    layout: {randomSeed: 35},
                    nodes: {borderWidthSelected: 2, labelHighlightBold: true},
                    edges: {
                        arrows: {to: true},
                        arrowStrikethrough: true,
                        font: {color: "#8d8d8d", strokeWidth: 0, align: "horizontal", face: "微软雅黑", size: 10},
                        dashes: true,
                        length:200,
                    },
                    groups: {
                        main:{
                            shape:'box',
                            shapeProperties:{borderRadius:20},
                            margin:{left:10,right:10},
                            color:{border:'#47787f', background:'#47787f',
                                hover:{border:'#47787f', background:'#47787f'},
                                highlight:{border:'#47787f', background:'#47787f'}
                            },
                            font:{color: '#fafaff',size:14,face: "微软雅黑"}
                        }
                    }
                }
                // 使用刚指定的配置项和数据显示图表。
                this.myChart = new Network(document.getElementById("biaodiwu_pop"),{nodes: this.data, edges: this.link},options);
            },

            //格式转换
            formatJson(o){
                this.link = []
                this.data = []
                for(let i=1; i <= Math.floor(o.length/2); i++){
                    let wrapper = {}
                    let container = {}
                    let index = i*2-1
                    wrapper.label = o[index];
                    wrapper.from =  index-1;
                    wrapper.to = index+1;
                    this.link.push(wrapper)
                }
                for(let i=0; i < o.length; i+=2){
                    this.data.push({id:i, label:o[i], group:'main'})
                }
            },
        },
        created() {},
        mounted() {
            setTimeout(() => {
                this.formatJson(this.source)
                this.initCharts()
            }, 400);
            // this.data = this.formatJson(this.source)[0]
            // this.link = this.formatJson(this.source)[1]
            // this.initCharts()
        }
    };
</script>

<style lang="scss" scoped>
    // @import "../assets/css/navigationHandler.css";
</style>