<template>
    <div class="wrapper">
        <div id="main_pop" style="width:100%;height: 32vw">
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
                data:[
                ],
                link:[
                ],
                // source:{
                //     "nodes":[
                //         {"name":"比亚迪","type":"公司","key":1},
                //         {"name": "新能源汽车动力电池", "type": "产品", "key": 2},
                //         {"name": "正极材料", "type": "产品", "key": 3},
                //         {"name":"杉杉股份","type":"公司","key":4},
                //         {"name":"天赐材料","type":"公司","key":5},

                //     ],
                //     "relations":{
                //         "主营产品":[[1,2],[4,3],[5,3]],
                //         "上游":[[3,2]],

                //     }
                // }
            };
        },
        watch: {
            source:'changeSource',
            display:'changeDisplay'
        },
        computed: {},
        methods: {
            changeSource(){
                if (this.source && this.source.nodes && this.display){
                    this.formatJson(this.source)
                    this.initCharts()
                }
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
                            // shape:'circle',
                            // color:{border:'#bd4b4b', background:'#f6e8e9',
                            //     hover:{border:'#bd4b4b', background:'#f6e8e9'},
                            //     highlight:{border:'#bd4b4b', background:'#f6e8e9'}
                            // },
                            // font:{color: '#bd4b4b'}
                        },
                        // company:{
                        //     shape:'dot',
                        //     size:10,
                        //     color:{border:'#bd4b4b', background:'#f6e8e9',
                        //         hover:{border:'#bd4b4b', background:'#f6e8e9'},
                        //         highlight:{border:'#bd4b4b', background:'#f6e8e9'}},
                        //     font:{color: '#bd4b4b'}
                        // },
                        // product:{
                        //     shape:'box',
                        //     color:{border:'#ae66ae', background:'#faecfa',
                        //         hover:{border:'#ae66ae', background:'#faecfa'},
                        //         highlight:{border:'#ae66ae', background:'#faecfa'}},
                        //     font:{color: '#ae66ae'}
                        // },
                        // concept:{
                        //     color:{border:'#d4792b', background:'#f9e3d0',
                        //         hover:{border:'#d4792b', background:'#f9e3d0'},
                        //         highlight:{border:'#d4792b', background:'#f9e3d0'}},
                        //     font:{color: '#d4792b'}
                        // },
                        // industry:{
                        //     color:{border:'#6b4cb7', background:'#d1c8e4',
                        //         hover:{border:'#6b4cb7', background:'#d1c8e4'},
                        //         highlight:{border:'#6b4cb7', background:'#d1c8e4'}},
                        //     font:{color: '#6b4cb7'}
                        // }
                    }
                }
                // 使用刚指定的配置项和数据显示图表。
                this.myChart = new Network(document.getElementById("main_pop"),{nodes: this.data, edges: this.link},options);
            },

            //格式转换
            formatJson(o){
                this.link = []
                this.data = []
                for(let i in o.relations){
                    let res1 = o.relations[i].map((item,index)=>{
                        let wrapper = {}
                        wrapper.label = i;
                        wrapper.from =  item[0];
                        wrapper.to = item[1];
                        this.link.push(wrapper)
                    })
                }
                //console.log(relation)
                let res = o.nodes.map((item,index)=>{
                    let container = {}
                    container['id'] = item.key;
                    container['label'] = item.name.split('@').join('\n')
                    //container['group'] = item.type
                    container['group'] = 'main'
                    this.data.push(container)
                })
                //this.data[0].group='main'
            },
        },
        created() {},
        mounted() {
            setTimeout(() => {
                if (this.source && this.source.nodes){
                    this.formatJson(this.source)
                    this.initCharts()
                }
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