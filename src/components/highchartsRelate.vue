<template>
    <div class="test_wrapper" id="testWrapper">
        
    </div>
</template>

<script>
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';
import Highmaps from 'highcharts/modules/map';

HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
Highmaps(Highcharts);
export default {
    components: {},
    props: ['opt'],
    name:'',
    data() {
        return {
            chart:null,
            options:[],
            index:0,
            seriesList:[],
            yAxisList:[],
            colors: ['#90ed7d', '#f7a35c', '#8085e9',
                '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1','#434348'],
            // options:[43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
        };
    },
    watch: {
        
            opt:'changeSource'
        
    },
    computed: {},
    methods: {
        changeSource(){
            this.options = this.formatHichartsData(this.opt)
            this.initChart()
        },
        initChart() {
            let ele = document.getElementById('testWrapper')
            //console.log(ele)
            //ele.style.width = (this.styles.width || 500) + 'px';
            //ele.style.height = (this.styles.height || 300) + 'px';
            let that = this;
            this.chart = new Highcharts.stockChart('testWrapper', {
                title:{
                    //text:this.asociateList[0].name.slice(this.asociateList[0].name.lastIndexOf('@')+1),
                    text:null,
                },
                lang:{noData:"Loading..."},
                chart: {
                    //backgroundColor:'#F7F8F9',
                    backgroundColor:'transparent',
                    //marginTop:28,
                    //renderTo: 'testWrapper'
                },
                credits: {
                    enabled: false
                },
                rangeSelector:false,
                legend: {
                    align: 'left',
                    enabled: true,
                    verticalAlign: 'top',
                    floating: false,
                    margin: 0,
                    itemStyle: {
                        color: '#fafaff',
                        fontSize: '12px',
                        fontWeight: 'normal'
                    },
                    itemHoverStyle: {
                        color: '#fafaff'
                    },
                    itemHiddenStyle: {
                        color: '#787373'
                    },
                    useHTML: false,
                    labelFormatter: function () {
                        let index = this.index;
                        let ydata = that.yAxisList;
                        let flag = '',
                        data_change = null;
                        //data_change = that.opt[index].data_change;
                        data_change = that.seriesList[index].ud_range;
                        //console.log(that.seriesList[index].ud_range)
                        let unit =  that.opt[index].data.unit;
                        console.log(isFinite(data_change))
                        if ((data_change != null)&&(isFinite(data_change)==true)) {
                            let arrow = ''
                            let flag = 'middle';
                            if (data_change>0) {
                                flag = 'up';
                                arrow = '↑'
                            } else if (data_change < 0) {
                                flag = 'down';
                                arrow = '↓'
                            }
                            let str = this.index%2==0?'左':'右'
                            return this.name.replace(/@/g,' ') + ' (<span class="value">'+unit+'，'+ str+'轴</span>）<span class="' + flag + '"> ' + arrow + (data_change*100).toFixed(2) + '%</span>';
                        } else {
                            return this.name + ' (<span class="value">'+unit+'</span>）'
                        }
                    }
                },
                navigator: {
                    outlineColor: "#363f4c",
                    maskFill: "rgba(54,63,46,0.5)",
                    handles: {
                        backgroundColor: "#b0b0c1",
                        borderColor: "#363f4c",
                    },
                    height:20,
                    margin:15,
                    xAxis: {
                        dateTimeLabelFormats: {
                            millisecond: '%H:%M:%S.%L',
                            second: '%H:%M:%S',
                            minute: '%H:%M',
                            hour: '%H:%M',
                            day: '%m-%d',
                            week: '%m-%d',
                            month: '%Y-%m',
                            year: '%Y'
                        },
                    },
                    series: {
                        data: []
                    }
                },
                scrollbar: {
                    enabled:false,
                    barBackgroundColor: "#363f4c",
                    barBorderColor: "#363f4c",
                    trackBackgroundColor: "#6bf",
                    trackBorderColor: "#6bf",
                    buttonBackgroundColor: "#6bf",
                    buttonBorderColor: "#6bf",
                    buttonBorderWidth: 0,
                    buttonArrowColor: "#4b80a6",
                    height:20
                },
                xAxis: {
                    dateTimeLabelFormats: {
                        millisecond: '%H:%M:%S.%L',
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%m-%d',
                        week: '%m-%d',
                        month: '%Y-%m',
                        year: '%Y'
                    },
                    tickLength: 0,
                    lineWidth: 0,
                    crosshair: {
                        width: 2,
                        color: '#367ab3'
                    },
                    labels: {
                        style: {
                            color: '#A0A4AA'
                        }
                    },
                    //range: 200 * 24 * 3600 * 1000 // one months
                },
                yAxis: this.yAxisList,
                plotOptions: {
                    series: {
                        turboThreshold: 5000,
                        events: {
                            legendItemClick: function () {
                                //console.log(this.index)
                               // that.opt[this.index].active = !this.visible;
                            },
                        }
                    }
                },
                tooltip: {
                    split: false,
                    shared: true,
                    dateTimeLabelFormats: {
                        millisecond: '%H:%M:%S.%L',
                        second: '%Y-%m-%d %H:%M:%S',
                        minute: '%Y-%m-%d %H:%M',
                        hour: '%Y-%m-%d %H:%M',
                        day: '%Y-%m-%d',
                        week: '%Y-%m-%d',
                        month: '%Y-%m',
                        year: '%Y'
                    },
                    xDateFormat: '%Y-%m-%d %H:%M',
                    
                },
                series: this.seriesList,
                turboThreshold:0,
            });
        },
        //highcharts数据格式处理
        formatHichartsData(a){
            this.seriesList = []
            this.yAxisList = []
            var left_num = 0, right_num = 0;  //用来计算多个坐标轴之间的间距
            // if(a.length==1){

            // }
            //console.log(a)
            a.forEach((e, i) => {
                let yAxisObj={
                    labels: {
                        align: i%2==0?'left':'right',
                        x: -3,
                        style:{
                            color: this.colors[i%10]
                        },
                    },
                    gridLineColor:"#4b4b4b",
                    offset: i%2==0 ? 10-left_num*50 : 10-right_num*50,
                    opposite: i%2==0? false : true,
                    resize: {
                        enabled: true
                    },
                    lineColor: this.colors[i%10],
                    tickAmount: 5,
                }
                i%2==0 ? left_num ++ : right_num ++
                this.yAxisList.push(yAxisObj)
                let obj = {name:e.name, data:[], type:'line', visible:true, yAxis:i, color: this.colors[i%10],ud_range:null}
                //console.log(e.data.data.length)
                //如果数据只有一条，添加数据
                if(e.data.data.length==1){
                    let d = e.data.data[0]
                    let t = new Date(d.time).valueOf()
                    //console.log(t)
                    let arr = []
                    for(let m = 0;m<7;m++){
                        arr.push([t-86400000*(m+1),0])
                    }
                    obj.data = obj.data.concat(arr)
                    obj.data.push([new Date(d.time).valueOf(), parseFloat(d.value)])
                }else{
                    if(e.data.data.length > 1500){
                        e.data.data = e.data.data.slice(0,1500)
                    }
                    for(let j = e.data.data.length-1; j >= 0; j--){
                        let d = e.data.data[j]
                        if (d.value){
                            obj.data.push([new Date(d.time).valueOf(), parseFloat(d.value)])
                        }
                    }
                }
                obj.data.sort()
                //console.log(obj.data)
                let len = obj.data.length
                //console.log(len)
                // console.log(obj.data[len-1])
                // console.log(obj.data[len-2])
                //如果前一条数据是0，百分比为infinity，取消显示
                let val = obj.data[len-1][1] - obj.data[len-2][1]
                let per = val/obj.data[len-2][1]
                //console.log(per)
                obj.ud_range = per
                this.seriesList.push( obj )
                //console.log(this.seriesList)
            })
        },
    },
    created() {},
    mounted() {
        setTimeout(() => {
            this.options = this.formatHichartsData(this.opt)
            this.initChart()
        }, 600);
    }
};
</script>
<style>
    svg tspan.down{
        fill:#2FC25B
    }
    svg tspan.up{
        fill:#F6473E
    }
    svg tspan.middle{
        fill:yellow;
    }
</style>
<style lang="scss" scoped>
    .test_wrapper{
        width:100%;
        height:400px;
    }
</style>