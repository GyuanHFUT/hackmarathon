<template>
    <div class="wrapper">
        <div id="main">
            <!-- <el-button style="z-index:999">点击</el-button> -->
        </div>
        <!-- <div id="zoom_button">
            <div class="zoom_wrapper">
              <i class="el-icon-zoom-in" @click="zoomIn"></i>
            </div>
            <div class="zoom_wrapper">
              <i class="el-icon-zoom-out" @click="zoomOut"></i>
            </div>
        </div> -->
        <div id="pop_button">
            <span @click="handleClick"><i class="el-icon-full-screen"></i>&nbsp;查看大图</span>
        </div>

    </div>
</template>

<script>
    import { DataSet, Network } from 'vis/index-network';
    export default {
        components: {},
        props: ['source'],
        data() {
            return {
                network:null,
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
            source:'changeSource'
        },
        computed: {},
        methods: {
            changeSource(){
                if (this.source && this.source.nodes){
                    this.formatJson(this.source)
                    if (this.myChart != null){
                        this.myChart.setData({nodes:this.data, edges:this.link})
                    }else{
                        this.initCharts()
                    }
                }
            },
            initCharts(){
                var options={
                    //clickToUse: true,
                    interaction:{
                        hover: true,
                        //navigationButtons:true
                    },
                    physics: {stabilization: {enabled: true, iterations: 2000, updateInterval: 25}},
                    layout: {randomSeed: 35},
                    nodes: {borderWidthSelected: 2, labelHighlightBold: true},
                    edges: {
                        arrows: {to: true},
                        arrowStrikethrough: true,
                        font: {color: "#9e9e9e", strokeWidth: 0, align: "horizontal", face: "微软雅黑", size: 10},
                        dashes: true
                    },
                    groups: {
                        main:{
                            shape:'circle',
                            shapeProperties:{borderRadius:20},
                            margin:{left:10,right:10},
                            color:{border:'#47787f', background:'#47787f',
                                hover:{border:'#47787f', background:'#47787f'},
                                highlight:{border:'#47787f', background:'#47787f'}
                            },
                            font:{color: '#fafaff',size:14,face: "微软雅黑"}
                        },
                        company:{
                            shape:'dot',
                            size:8,
                            margin:{left:10,right:10},
                            color:{border:'#47787f', background:'#47787f',
                                hover:{border:'#47787f', background:'#47787f'},
                                highlight:{border:'#47787f', background:'#47787f'}
                            },
                            font:{color: '#fafaff',size:14,face: "微软雅黑"}
                        },
                        product:{
                            shape:'box',
                            shapeProperties:{borderRadius:20},
                            margin:{left:10,right:10},
                            color:{border:'#47787f', background:'#47787f',
                                hover:{border:'#47787f', background:'#47787f'},
                                highlight:{border:'#47787f', background:'#47787f'}
                            },
                            font:{color: '#fafaff',size:14,face: "微软雅黑"}
                        },
                        concept:{
                            shape:'ellipse',
                            //shapeProperties:{borderRadius:20},
                            //margin:{left:10,right:10},
                            color:{border:'#47787f', background:'#47787f',
                                hover:{border:'#47787f', background:'#47787f'},
                                highlight:{border:'#47787f', background:'#47787f'}
                            },
                            font:{color: '#fafaff',size:14,face: "微软雅黑"}
                        },
                        industry:{
                            shape:'triangleDown',
                            size:8,
                            //shapeProperties:{borderRadius:20},
                            //margin:{left:10,right:10},
                            color:{border:'#47787f', background:'#47787f',
                                hover:{border:'#47787f', background:'#47787f'},
                                highlight:{border:'#47787f', background:'#47787f'}
                            },
                            font:{color: '#fafaff',size:14,face: "微软雅黑"}
                        }
                    }
                }
                // 使用刚指定的配置项和数据显示图表。
                this.network = new Network(document.getElementById("main"),{nodes: this.data, edges: this.link},options);
            },

            //格式转换
            formatJson(o){
                this.data = []
                this.link = []
                for(let i in o.relations){
                    o.relations[i].map((item,index) => {
                        let wrapper = {}
                        wrapper.label = i;
                        wrapper.from =  item[0];
                        wrapper.to = item[1];
                        this.link.push(wrapper)
                    })
                }
                //console.log(relation)
                o.nodes.map((item,index) => {
                    let container = {}
                    container['id'] = item.key;
                    container['label'] = item.name.split('@').join('\n')
                    container['group'] = item.type
                    //container['group'] = 'main'
                    //container['draggable']=true
                   this.data.push(container)
                })
                this.data[0].group='main'
            },
            zoomIn(){
                this.count_out = this.count
                this.myChart.setOption({ series: { zoom:this.count } })
                this.count = this.count*1.1
                console.log(this.myChart._model.option)
            },
            zoomOut(){
                this.count = this.count_out
                this.myChart.setOption({ series: { zoom:this.count_out } })
                this.count_out = this.count_out*0.9
                console.log(this.myChart._model.option)
            },
            handleClick(){
                this.$emit('showDialog')
            }

        },
        created() {},
        mounted() {
            setTimeout(() => {
                if (this.source && this.source.nodes){
                    this.formatJson(this.source)
                    this.initCharts()
                }

            }, 800);
            // this.data = this.formatJson(this.source)[0]
            // this.link = this.formatJson(this.source)[1]
            // this.initCharts()
        }
    };
</script>

<style lang="scss" scoped>
    .wrapper{
        //z-index: 1;
        //width:1000px;
        position: relative;
        #zoom_button{
            //background-color: aqua;
            position: absolute;
            width:40px;
            height:100px;
            //right:0;

            margin-top:-100px;
            //z-index:9999;
            // display:flex;
            // flex-direction: column;
            // align-items: center;
            // justify-content: flex-start;
            .zoom_wrapper{
                height:50px;
                display:flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
        }
        #pop_button{
            position: absolute;
            right: .5rem;
            top: .5rem;
            color: #8d8d8d;
            cursor: pointer;
        }
        #main{
            width: 100%;
            height: 400px;
            background: #3A3A3E;
            box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.43);
            border-radius: 4px;
        }
    }
</style>