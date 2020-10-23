<template>
    <div>
        <div id="curtain">
            <header id="header">
                <a class="icon icon-magi" href="/" title="学迹" aria-label="学迹" target="_self"><h1>学迹</h1></a>
                <div id="search-wrapper">
                    <el-autocomplete
                            class="inline-input"
                            v-model="ruleFormHomeInput.inputVal"
                            :fetch-suggestions="querySearch"
                            :trigger-on-focus="false"
                            :select-when-unmatched="true"
                            @select="handleSelect"
                            @keyup.enter.native="submitSearch"
                            @focus="toResult"
                            placeholder="请输入您想要了解的事件">
                        <template class="tem_name" slot-scope="{item}">
                            <div class="name" v-html="item.value"></div>
                        </template>
                    </el-autocomplete>
                    <el-button type="primary" @click="submitSearch"><i class="search-icon"></i></el-button>
                </div>
            </header>
        </div>
        <div id="content">
            <section id="home">
                <div id="search_info">
                    <div class="icon_label_wrapper">
                        <span class="icon-hot"></span>
                        <span>推荐搜索：</span>
                    </div>
                    <div class="ul_wrapper"> 
                        <ul>
							<li v-for="(item,index) in hot_search_list" :key="index" @click="toSearchResult(item)"><a>{{item.length>10?item.slice(0,10)+'...':item}}</a></li>
						</ul>
                    </div>
                </div>
                <noscript><div class="card" data-type="warn">⚠️ 请启用浏览器的 JavaScript 功能</div></noscript>
                <div id="showcase">
                    <span>学迹正在学习最新事件中…</span>
                    <ul>
                        <li data-fade='hidden' style="" v-for="(item,index) in home_learn_source_list" :key="index">
                            <a :href="item.news_url" target="_blank" >
                                <h5>{{item.news_title}}</h5>
                                <cite>{{item.news_url}}</cite>
                            </a>
                            <div>
                                <span>从该来源学习到…</span>
                                <a>{{item.cause_standard}} -> {{item.effect_standard}}</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
            <section id="result">
                <aside id="left"></aside>
                <!--  -->
                <main v-show="!allPageShow">
                    <div>请按 回车键 以发起搜索</div>
                </main>
                <!--  -->
                <main :class="searchNoResult!=0?'noResult':''" v-show="allPageShow">
                    <div class="card-noResult" v-if="searchNoResult==10004">
                        <img :src="icon_error">
                        <span>小搜目前只支持【事件】搜搜，其它的类型正在学习中哦…</span>
                    </div>
                    <div class="card" data-type="fact" data-subtype="entity" data-folded="false" v-if="searchNoResult==0">
                        <div data-collapse="expanded">
                            <section data-scope="description" :data-truncate="conceptList.default.length<=12?'all':'peak'" style="border-top:none" v-show="conceptShow">
                                <header class="">
                                    <h4>概念描述</h4>
                                </header>
                                <div :data-clip="conceptList.default.length<=12?'false':'true'" class="conceptDataDiv" style="">
                                    <!-- 输入拆解出多个标签 -->
                                    <div style="display:block;width:100%;margin-bottom: .5rem" >
                                        <span :class="{'active':currentTag == item2, 'tagspan':true}" v-for="(item2,index2) in conceptList.tags" :key="index2" @click="changeTag(item2)">{{item2}}</span>
                                    </div>
                                    <!--  -->
                                    <div v-for="(item,index) in conceptList.default" :key="index" :data-span="!item.expanded?'cell':'row'" :data-extra="index>11?'true':false">
                                        <article class="fact" :id="item._id" data-render="cell">
                                            <dl data-answer="object" :data-color="levelColor(item)" :title="'该信息可信评分为' + item.weight">
                                                <dd data-field="object" @click="toggleTagDetail(item)">{{item._id}}</dd>
                                            </dl>
                                        </article>
                                        <transition name="router-slid">
                                            <article class="fact"  data-render="tuple" v-if="item.expanded" style="margin-top: 0.75rem;">
                                            <dl data-answer="object" :data-confidence="item.weight" :data-color="levelColor(item)" :title="'该信息可信评分为'+item.weight">
                                                <dd data-field="概念">{{currentTag}}</dd>
                                                <dd data-field="关系">描述</dd>
                                                <dd data-field="描述信息">{{item._id}}</dd>
                                            </dl>
                                            <div :data-collapse="item.expanded?'collapse':'expanded'" style="padding-bottom: 0.5rem">
                                                <span>可信度评分{{item.weight}}分，学习来源于以下等{{item.news.length}}条资讯</span>
                                                <ul>
                                                    <li v-for="(itemnew,indexnew) in item.news" :key="indexnew">
                                                        <a :href="itemnew.news_url" target="_blank" >
                                                            <div class="news-title">
                                                                <h5>{{itemnew.news_title}}</h5>
                                                                <div class="right-text">
                                                                    <time>{{itemnew.news_pubtime|formatDate}}</time>
                                                                    <cite>{{itemnew.news_source}}</cite>
                                                                </div>
                                                            </div>
                                                            <div class="news-content">{{'...'+itemnew.sent}}</div>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </article>
                                        </transition>
                                    </div>
                                </div>
                                <footer data-decoration="more" @click="toggleHeight($event)" v-if="conceptList.default.length>12"></footer>
                            </section>
                            
                            <section data-scope="cause" :data-truncate="causeList.length<=12?'all':'peak'" v-show="preCauseShow">
                                <header class="">
                                    <h4>前序原因</h4>
                                </header>
                                <div :data-clip="causeList.length<=12?'false':'true'" class="causeDataDiv" style="">
                                    <div v-for="(item,index) in causeList" :key="index" :data-span="!item.expanded?'cell':'row'" :data-extra="index>11?'true':false">
                                        <article class="fact" :id="item._id" data-render="cell">
                                            <dl data-answer="object" :data-color="levelColor(item)" :title="'该信息可信评分为' + item.weight">
                                                <dd data-field="object" @click="toggleCauseDetail(item)">{{item._id}}</dd>
                                            </dl>
                                        </article>
                                        <transition name="router-slid">
                                            <article class="fact"  data-render="tuple" v-if="item.expanded" style="margin-top: 0.75rem;">
                                                <dl data-answer="object" :data-confidence="item.weight" :data-color="levelColor(item)" :title="'该信息可信评分为'+item.weight">
                                                    <dd data-field="因事件">{{item._id}}</dd>
                                                    <dd data-field="关系">因果</dd>
                                                    <dd data-field="果事件">{{inputTemp}}</dd>
                                                    <dd data-field="产业链" v-if="item.chain && item.chain.nodes"><img :src="icon_chain" style="cursor: pointer" @click="showChainChartsPop(item)" /></dd>
                                                </dl>
                                                <div :data-collapse="item.expanded?'collapse':'expanded'" style="padding-bottom: 0.5rem">
                                                    <span>可信度评分{{item.weight}}分，学习来源于以下资讯</span>
                                                    <ul>
                                                        <li v-for="(itemnew,indexnew) in item.news" :key="indexnew">
                                                            <a :href="itemnew.news_url" target="_blank" >
                                                                <div class="news-title">
                                                                    <h5>{{itemnew.news_title}}</h5>
                                                                    <div class="right-text">
                                                                        <time>{{itemnew.news_pubtime|formatDate}}</time>
                                                                        <cite>{{itemnew.news_source}}</cite>
                                                                    </div>
                                                                </div>
                                                                <div class="news-content">{{'...'+itemnew.sent}}</div>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                    <div class="further_search_block">
                                                        <span>进一步搜索</span><a class="further_search" data-decoration="search" href="javascript:void(0)" target="_self" @click="toSearchResult(item._id)">{{item._id}}</a>
                                                    </div>
                                                        
                                                </div>
                                            </article>
                                        </transition>
                                    </div>
                                </div>
                                <footer data-decoration="more" @click="toggleHeight($event)" v-if="causeList.length>12"></footer>
                            </section>
                            <section data-scope="effect" :data-truncate="effectList.length<=12?'all':'peak'" v-show="postEffectShow">
                                <header class="">
                                    <h4>后续结果</h4>
                                </header>
                                <div :data-clip="effectList.length<=12?'false':'true'" class="effectDataDiv" style="">
                                    <div v-for="(item,index) in effectList" :key="index" :data-span="!item.expanded?'cell':'row'" :data-extra="index>11?'true':false">
                                        <article class="fact" :id="item._id" data-render="cell">
                                            <dl data-answer="object" :data-color="levelColor(item)" :title="'该信息可信评分为' + item.weight">
                                                <dd data-field="object" @click="toggleEffectDetail(item)">{{item._id}}</dd>
                                            </dl>
                                        </article>
                                        <transition name="router-slid">
                                            <article class="fact"  data-render="tuple" v-if="item.expanded" style="margin-top: 0.75rem;">
                                                <dl data-answer="object" :data-confidence="item.weight" :data-color="levelColor(item)" :title="'该信息可信评分为'+item.weight">
                                                    <dd data-field="因事件">{{inputTemp}}</dd>
                                                    <dd data-field="关系">因果</dd>
                                                    <dd data-field="果事件">{{item._id}}</dd>
                                                    <dd data-field="产业链" v-if="item.chain && item.chain.nodes"><img :src="icon_chain" style="cursor: pointer" @click="showChainChartsPop(item)" /></dd>
                                                    <!--                                            <dd data-field="置信度" class="number">{{item.confidence}}</dd>-->
                                                </dl>
                                                <div :data-collapse="item.expanded?'collapse':'expanded'" style="padding-bottom: 0.5rem">
                                                    <span>可信度评分{{item.weight}}分，学习来源于以下等{{item.news.length}}条资讯</span>
                                                    <ul>
                                                        <li v-for="(itemnew,indexnew) in item.news" :key="indexnew">
                                                            <a :href="itemnew.news_url" target="_blank" >
                                                                <div class="news-title">
                                                                    <h5>{{itemnew.news_title}}</h5>
                                                                    <div class="right-text">
                                                                        <time>{{itemnew.news_pubtime|formatDate}}</time>
                                                                        <cite>{{itemnew.news_source}}</cite>
                                                                    </div>
                                                                </div>
                                                                <div class="news-content">{{'...'+itemnew.sent}}</div>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                    <div class="further_search_block">
                                                        <span>进一步搜索</span><a class="further_search" data-decoration="search" href="javascript:void(0)" target="_self" @click="toSearchResult(item._id)">{{item._id}}</a>
                                                    </div>
                                                </div>
                                            </article>
                                        </transition>
                                    </div>
                                </div>
                                <footer data-decoration="more" @click="toggleHeight($event)" v-if="effectList.length>12"></footer>
                            </section>
                            <section data-scope="biaodiwu" v-show="subjectMatterShow">
                                <header class="">
                                    <h4>影响产业</h4>
                                </header>
                                <div>
                                    <el-table
                                            ref="filterTable"
                                            :data="showTable"
                                            border
                                            style="width: 100%">
                                        <el-table-column
                                                type="index"
                                                label="序号"
                                                align="center"
                                                width="50">
                                        </el-table-column>
                                        <el-table-column
                                                prop="name"
                                                label="标的"
                                                align="center"
                                                width="120">
                                        </el-table-column>
                                        <el-table-column
                                                prop="type"
                                                label="全部类型"
                                                align="center"
                                                width="90"
                                                :filters="biaodiTypeList"
                                                :filter-multiple="false"
                                                filter-placement="bottom"
                                                :filter-method="filterType">
                                        </el-table-column>
                                        <el-table-column
                                                prop="tag"
                                                label="利好/利空"
                                                align="center"
                                                width="100"
                                                :filters="[{ text: '利好', value: '利好' }, { text: '利空', value: '利空' }]"
                                                :filter-method="filterTag"
                                                :filter-multiple="false"
                                                filter-placement="bottom">
                                            <template slot-scope="scope">
                                                <span :style="{color:scope.row.tag=='利好'?'#F6473E':'#2FC25B'}">{{scope.row.tag}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                prop="event"
                                                align="center"
                                                label="事理逻辑">
                                            <template slot-scope="scope">
                                                <div class="event-div">
                                                    <span class="event-link">{{scope.row.event_brief}}</span>
                                                    <el-button type="text" @click="lookBiaodiwuDetail(scope.row)">查看详情</el-button>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <el-pagination
                                        @current-change="handleCurrentChange"
                                        layout="prev, pager, next"
                                        :hide-on-single-page=true
                                        :page-size="pagesize"
                                        :total="biaodiwuList.length">
                                </el-pagination>
                            </section>
                            <section data-scope="chain" v-show="industryLinkShow">
                                <header class="">
                                    <h4>产业链</h4>
                                </header>
                                <div>
                                    <div class="echarts_industry_wrapper" style="width: 100%">
                                        <echarts-industry-link v-on:showDialog="handleReceive" :source="source"></echarts-industry-link>
                                    </div>
                                </div>
                            </section>
                            <section data-scope="relatedData" style="width: 100%" v-show="associateDataShow">
                                <header class="">
                                    <h4>关联数据</h4>
                                </header>
                                <div>
                                    <div class="highcharts_wrapper" style="margin-top:-.5rem;width:100%">
                                        <highchartsRelate :opt="relatedData" ref="highchartsRelate"></highchartsRelate>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                    <div class="card" data-type="suggest" v-show="relatedSearchShow">
                        <header class="">
                            <h4 style="font-size: 1rem" v-if="searchNoResult!=10002">相关搜索</h4>
                            <h4 style="font-size: 1rem" v-else>没有搜到<span style="color:#6bf">{{inputTemp}}</span>相关事件，您是不是想找：</h4>
                        </header>
                        <ul class="queue-in">
                            <li v-for="(item,index) in relatedSearch" :key="index">
                                <a data-decoration="search" href="javascript:void(0)" target="_self" @click="toSearchResult(item)">{{item}}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="card" data-type="web" v-show="relatedNewsShow">
                        <header class="">
                            <h4 style="font-size: 1rem">相关资讯</h4>
                        </header>
                        <div class="newscard-wrap">
                            <a :href="item.news_url" target="_blank" v-for="(item,index) in relatedNews" :key="index">
                                <div class="newscard-title">
                                    <h3><img :src="loadSentimentIcon(item.news_sentiment)" />{{item.news_title}}</h3>
                                    <span>
                                        <time>{{item.news_pubtime|formatDate}}</time>
                                        <cite>{{item.news_source}}</cite>
                                    </span>
                                </div>
                                <div v-html="'...'+item.news_content" class="newscard-content"></div>
                            </a>
                        </div>
                    </div>
                    <div class="card" data-type="next" data-decoration="more" data-input="孟晚舟" data-offset="20" data-size="10" data-loading="false" @click='loadMore' v-show="relatedNewsShow" v-loading="loading_loadMore" element-loading-background="#2C2C30">加载更多</div>
                </main>
                <aside id="right" v-if="searchNoResult==0" >
                    <div id="contact-wrapper">
                        <a href="https://nlp.zhiwenben.com/">每日互动</a>
                        <el-popover
                                placement="bottom-end"
                                title=""
                                width="304"
                                trigger="hover"
                                :visible-arrow=false
                                popper-class="myPopperContact">
                            <div slot="reference">诗越云霄又见君</div>
                        </el-popover>
                    </div>
                    <div id="bibliography" v-loading="learnSourceLoading" element-loading-background="#2C2C30">
                        <h4 class="fade-in"><span style="color: #66BBFF">{{inputTemp}}</span> 学习来源</h4>
                        <el-popover
                                placement="top-end"
                                title=""
                                width="240"
                                trigger="hover"
                                :visible-arrow=false
                                popper-class="myPopper">
                            <div class="sentiment_img">
                                <span><img :src="positive" />正向情绪</span>
                                <span><img :src="neutral" />中立情绪</span>
                                <span><img :src="negative" />负向情绪</span>
                            </div>
                            <div slot="reference" id="explainEmo"><img :src="icon_sentiment" /></div>
                        </el-popover>
                        <ol class="queue-in" v-if="rightShow">
                            <li v-for="(item,index) in learnSourceList" :key="index" :data-events="item[1].keys.join('*')" :data-url="item[0]" v-if="index<10">
                                <a :href="item[0]" target="_blank">
                                    <div class="newsright-title">
                                        <h5><img :src="loadSentimentIcon(item[1].news.news_sentiment)" />{{item[1].news.news_title}}</h5>
                                        <span>
                                        <time>{{item[1].news.news_pubtime|formatDate}}</time>
                                        <cite>{{item[1].news.news_source}}</cite>
                                    </span>
                                    </div>
                                    <div v-html="'...'+item[1].news.sent" class="newsright-content"></div>
                                </a>
                            </li>
                        </ol>
                    </div>
                </aside>
            </section>
        </div>
        <!-- 每次点击el-dialog都触发其mounted钩子 -->
        <div v-if="echartsPopShow">
            <el-dialog
                :visible.sync="popIndustryTip"
                :title="industryPopTitle"
                width="80%"
                style="z-index:9999;"
                :modal-append-to-body='false'
                :before-close="handleClose"
                center>
                <div class="echarts_industry_wrapper" style="width: 100%;">
                    <echartsPop :source="chainSource" :display="popIndustryTip"></echartsPop>
                </div>
            </el-dialog>
        </div>
        <el-dialog
                :visible.sync="popChainTip"
                :title="chainPopTitle"
                width="80%"
                style="z-index:9999;"
                :modal-append-to-body='false'
                :before-close="chainHandleClose"
                center>
            <div class="echarts_industry_wrapper" style="width: 100%;">
                <chainChartsPop :source="iconChainSource" :display="popChainTip"></chainChartsPop>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="popBiaodiwuTip"
                :title="biaodiwuPopTitle"
                width="80%"
                style="z-index:9999;"
                :modal-append-to-body='false'
                :before-close="biaodiwuHandleClose"
                center>
            <div class="echarts_industry_wrapper" style="width: 100%;">
                <biaodiwuPop :source="biaodiwuSource" :display="popBiaodiwuTip"></biaodiwuPop>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Vue from 'vue';
    import axios from "axios";
    import echartsIndustryLink from '../components/visIndustryChain.vue';
    import echartsPop from '../components/echartsPop.vue';
    import chainChartsPop from '../components/chainChartsPop.vue';
    import biaodiwuPop from '../components/biaodiwuChartsPop.vue';
    import LeaderLine from '../assets/js/leader-line.min.js';
    import highchartsRelate from '../components/highchartsRelate.vue';
    import isEvent from './isEvent.json';
    import fullTextSearch from './fullTextSearch.json';
    import getDescTags from './getDescTags.json';
    import getIndustryChain from './getIndustryChain.json';
    import getMatter from './getMatter.json';
    import recordAccess from './recordAccess.json';
    import searchCause from './searchCause.json';
    import searchData from './searchData.json';
    import searchEffect from './searchEffect.json';
    import searchLearnSource from './searchLearnSource.json';
    import getDescTagNews from './getDescTagNews.json';





    // var lightCss = 'light.css',
    //     darkCss = 'dark.css',
    //     link = document.getElementById('theme-style');

    // Simple requestAnimationFrame polyfill
    var raf = (function() {

        // Fallback to setTimeout @ 60Hz
        var fn = window.requestAnimationFrame;
        if (typeof(fn) != "function") {
            fn = function(callback) {
                setTimeout(callback, 17);
            };
        }

        // Fix skip frames in Firefox Quantum
        // if (window.browser.firefox === true) {
        //     return function(callback) {
        //         fn(function() {
        //             fn(callback);
        //         });
        //     };
        // }

        return fn;
    })();
    // Get computed transition duration
    var duration = function(node) {
        var raw = window.getComputedStyle(node).transitionDuration || "";
        return (parseFloat(raw) || 0) * (raw.indexOf("ms") > 0 ? 1 : 1000);
    };

    // Common pre-process step
    var pre = function(node, type, state, instant) {

        // Unmodified or forced to change immediately
        if (instant === true || node.dataset[type] == state) {
            node.dataset[type] = state;
            return false;
        }

        return true;
    };

    // Common post-process step
    var post = function(node, callback) {

        // Only callback once
        var guard = false;

        // Cancel the pending timer
        clearTimeout(node._transitionTimer);

        // Callback wrapper
        var done = function() {

            // Clear timeout
            clearTimeout(node._transitionTimer);

            // Already fired
            if (guard === true)
                return;

            // Clear the style property after transition
            node.style.cssText = "";

            // Update flag and callback
            guard = true;
            callback();
        };

        // Listen to the transitionend event if available
        node.addEventListener("transitionend", done);

        // Fallback to the plain old setTimeout with a sufficient timeout
        node._transitionTimer = setTimeout(done, duration(node) + 10);
    };

    // Optional callback
    var complete = function(node, callback) {
        if (typeof(callback) == "function")
            callback(node);
    };

    export default {
        name:'index',
        components: {highchartsRelate,echartsIndustryLink,echartsPop,biaodiwuPop,chainChartsPop},
        data () {
            return {
                search_logo: require('../assets/image/logo.png'),
                //search_logo: require('../assets/image/home_logo.png'),
                icon_chain: require('../assets/image/icon_chain.png'),
                positive: require('../assets/image/positive.png'),
                negative: require('../assets/image/negative.png'),
                dhLogo:require('../assets/image/dhlogo.png'),
                neutral:require('../assets/image/neutral.png'),
                icon_sentiment: require('../assets/image/icon_sentiment.png'),
                icon_error:require('../assets/image/error.png'),
                themeToggle: false,
                ruleFormHomeInput:{inputVal:'黄金暴跌'},
                //保存一下ruleFormHomeInput.inputVal,有些模块的文字不应在搜索框文字变化时跟着变化
                inputTemp:'',
                feedBackTip:false,
                //输入框联想
                inputAdviceList:[],
                enToCn:{concept:'概念', relation:'关系', event:'本事件',confidence:'置信度',cause:'前序事件', effect:'后续事件'},
                conceptList:{default:[],tags:[]},
                causeList:[],
                effectList:[],
                biaodiwuList:[],
                popIndustryTip:false,
                echartsPopShow:false,
                popBiaodiwuTip:false,
                popChainTip:false,
                source:{}, //产业链数据
                chainSource:{}, //产业链弹窗数据
                iconChainSource:{}, //点击标签里icon产业链弹窗数据
                biaodiwuSource:{},//标的物图谱数据
                //右侧新闻来源
                learnSourceArr:{},
                learnSourceList:[],
                //相关搜索
                relatedSearch:[],
                //相关资讯
                relatedNews:[],
                //推荐搜索几条效果好的词条
                //hot_search_list:[],
                hot_search_list:["原油暴跌","新冠肺炎疫情蔓延","货币超发","美元贬值","英国脱欧"],
                home_learn_source_list:[],
                //当前事件md5
                current_md5:'',
                //当前原因md5
                relatedData:[],
                searchNoResult:0,
                count:0,
                industryLinkShow:false,
                preCauseShow:false,
                postEffectShow:false,
                conceptShow:false,
                subjectMatterShow:false,
                associateDataShow:false,
                relatedSearchShow:false,
                relatedNewsShow:false,
                allPageShow:false,
                rightShow:false,
                //标的物分页
                pagesize: 7, 
                currentPage: 1,
                biaodiwuPopTitle:'',
                industryPopTitle:'',
                chainPopTitle:'',
                currentTag:'',//概念描述当前选中的tag
                offset:0, //首页轮播计数
                loading_loadMore:false,
                learnSourceLoading:false,
            }
        },
        computed:{
            biaodiTypeList(){
                let arr = {}
                this.biaodiwuList.forEach((e)=>{
                    if (!arr[e.type]) arr[e.type] = e.type
                })
                let list = []
                for(let item in arr){
                    list.push({text:item,value:item})
                }
              return list;
            },
            showTable(){
                return this.biaodiwuList.slice(
                    (this.currentPage - 1) * this.pagesize,
                    this.currentPage * this.pagesize
                );
            },
            //结果页右侧学习来源-排序
            // learnSourceList(){
            //     let list = []
            //     Object.keys(this.learnSourceArr).sort().forEach((key) => {
            //         list.push(this.learnSourceArr[key]);
            //     });
            //     return list
            // }
        },
        watch:{
            $route(to,from){
                if (to.query.search){
                    document.body.dataset.layout="result"
                    this.ruleFormHomeInput.inputVal = to.query.search
                    //调接口获取数据
                    this.isEvent()
                }else {
                    document.body.dataset.layout="home"
                    this.ruleFormHomeInput.inputVal = ""
                    //this.getHotWords()
                    this.getHomeLearnSource()
                }
            }
        },
        filters:{
            //年月日
            formatDate(value){
                if(typeof(value)=='string'){
                    return value.slice(0,value.indexOf(' '))
                }
                value = 1000 * value
                let date = new Date(value);
                let y = date.getFullYear();
                let MM = date.getMonth() + 1;
                MM = MM < 10 ? ('0' + MM) : MM;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-'+ MM + '-' + d
            }
        },
        //landmark
        created() {
            // var theme = localStorage.getItem("themeLight");
            // if(theme == 'dark'){
            //     this.themeToggle = false;
            // }else{
            //     this.themeToggle = true;
            // }
        },
        mounted() {
            //import("../assets/css/light.css")
            // localStorage.removeItem("style");
            // localStorage.removeItem("themeLight");
            if (this.$route.query.search){
                this.ruleFormHomeInput.inputVal = this.$route.query.search
                document.body.dataset.layout="result"
                //调接口获取数据
                this.isEvent()
            }else{
                this.ruleFormHomeInput.inputVal = ""
                document.body.dataset.layout="home"
                //this.getHotWords()
                this.getHomeLearnSource()
            }
            document.querySelectorAll(".card[data-type=fact]").forEach((e, i)=>{
                let content1 = e.querySelector('.conceptDataDiv')
                this.tween(content1).clip('true',content1, true)
                let content2 = e.querySelector('.causeDataDiv')
                this.tween(content2).clip('true',content2, true)
                let content3 = e.querySelector('.effectDataDiv')
                this.tween(content3).clip('true',content3, true)
            })
            //结果页面-右侧学习来源
            setTimeout(()=>{
                //this.rightInitLine()
            }, 900)

        },
        methods: {
            toResult(){
                document.body.dataset.layout="result"
            },
            toSearchResult(str){
                this.$router.push('?search=' + str)
                this.ruleFormHomeInput.inputVal = str
                document.body.dataset.layout="result"
                //调接口获取数据
                this.isEvent()
            },
            // changeTheme(val){
            //     //link.href= this.themeToggle ? lightCss : darkCss;
            //     this.themeToggle = val;
            //     if (!val){
            //         link.href = darkCss;
            //         localStorage.setItem("style",darkCss);
            //         localStorage.setItem("themeLight",'dark');
            //     }else{
            //         link.href = lightCss;
            //         localStorage.setItem("style",lightCss);
            //         localStorage.setItem("themeLight",'light');
            //     }
            // },
            querySearch(queryString, cb) {
                axios.get('/api/xueji/inputAssociate', {params:{event:this.ruleFormHomeInput.inputVal}}).then((response) => {
                    let res = response.data
                    if (res.errorcode == '0') {
                        //console.log("成功")
                        this.inputAdviceList = this.formatInputAssociate(res.items)
                        var inputAdviceList = this.inputAdviceList
                        var results = inputAdviceList
                        // 调用 callback 返回建议列表的数据
                        cb(results);
                    }else if (res.errorcode == '10002') {
                        console.log("无此事件")
                    }else if(res.errorcode == '10003'){
                        console.log("系统错误")
                    }
                }).catch((error) => {
                    console.log(error)
                });
            },
            //输入联想json格式化
            formatInputAssociate(arr){
                let res = arr.map(function(item,index){
                    let container = {}
                    container['value'] = item
                    return container
                })
                return res
            },
            handleSelect(item){
                let str = item.value
                let res = str.replace(/<\/?.+?>/g,"")
                this.ruleFormHomeInput.inputVal = res
                this.submitSearch()
            },
            //搜索按钮
            submitSearch(){
                if(this.ruleFormHomeInput.inputVal==''){
                    this.$message({type:'error', message:'输入不能为空', duration: 2000})
                    return
                }
                // axios.get('/api/sousou/addEventWeight', {params:{event:this.ruleFormHomeInput.inputVal}}).then((response) => {
                //     let res = response.data
                //     if (res.errorcode == '0') {
                //         console.log("成功")
                //         this.$router.push({path:'result',query:{search:this.ruleFormHomeInput.inputVal}})
                        
                //     }else if (res.errorcode == '10002') {
                //         console.log("无此事件")
                //     }else if(res.errorcode == '10003'){
                //         console.log("系统错误")
                //     }
                // }).catch((error) => {
                //     console.log(error)
                // });
                
                this.toSearchResult(this.ruleFormHomeInput.inputVal)
                //this.isEvent()
            },
            changeTag(item){
                console.log(item)
                this.currentTag = item
                axios.get('/api/xueji/getDescTagContent', {params:{event:this.currentTag}}).then((response) => {
                    let res = response.data
                    if (res.errorcode == '0') {
                        //this.hot_search_list = res.items.slice(0,5)
                        let temp = res.items
                        temp.sort(function(a,b){
                            return b.weight - a.weight
                        })
                        Vue.set(this.conceptList,'default', temp)
                        //切换标签重新构建指示线
                        //this.rightInitLine()
                        this.getSearchLearnSource()
                        //Vue.set(item,'expanded', true)
                        return this.getSearchLearnSource()
                    }else if (res.errorcode == '10002') {
                        //console.log("无此事件")
                    }else if(res.errorcode == '10003'){
                        //console.log("系统错误")
                    }
                }).catch((error) => {
                    console.log(error)
                });
            },
            toggleTagDetail(item){
                if(item.expanded){
                    Vue.set(item,'expanded', false)
                }else{
                    // 修改点mock数据改接口
                   let res = getDescTagNews
                    if (res.errorcode == '0') {
                        //this.hot_search_list = res.items.slice(0,5)
                        Vue.set(item,'news', res.items)
                        Vue.set(item,'expanded', true)
                        return
                    }else if (res.errorcode == '10002') {
                        //console.log("无此事件")
                    }else if(res.errorcode == '10003'){
                        //console.log("系统错误")
                    }     
                    // axios.get('/api/xueji/getDescTagNews', {params:{event:this.currentTag,tag:item._id}}).then((response) => {
                    //     let res = response.data
                    //     if (res.errorcode == '0') {
                    //         //this.hot_search_list = res.items.slice(0,5)
                    //         Vue.set(item,'news', res.items)
                    //         Vue.set(item,'expanded', true)
                    //         return
                    //     }else if (res.errorcode == '10002') {
                    //         //console.log("无此事件")
                    //     }else if(res.errorcode == '10003'){
                    //         //console.log("系统错误")
                    //     }     
                    // }).catch((error) => {
                    //     console.log(error)
                    // });
                }
            },
            toggleCauseDetail(item){
                //console.log(item.expanded)
                if (item.expanded){
                    Vue.set(item,'expanded', false)
                }else{
                    //展开，判断是否有news字段
                    //console.log('news' in item)
                    if('news' in item){
                        Vue.set(item,'expanded', true)
                        // return
                    }else{
                        axios.get('/api/xueji/searchCauseEffectNews', {params:{cause_md5:item.standard_md5,effect_md5:this.current_md5}}).then((response) => {
                            let res = response.data
                            if (res.errorcode == '0') {
                                Vue.set(item,'news', res.items)
                                Vue.set(item,'expanded', true)
                                //console.log(item)
                                // return
                            }else if (res.errorcode == '10002') {
                                //console.log("无此事件")
                            }else if(res.errorcode == '10003'){
                                //console.log("系统错误")
                            }
                        }).catch((error) => {
                            console.log(error)
                        });
                    }
                    //展开，判断是否有产业链
                    //console.log('news' in item)
                    if('chain' in item){
                        Vue.set(item,'expanded', true)
                        // return
                    }else{
                        axios.get('/api/xueji/getIndustryChain', {params:{event:item._id}}).then((response) => {
                            let res = response.data
                            if (res.code == '0') {
                                //this.hot_search_list = res.items.slice(0,5)
                                Vue.set(item,'chain', res.msg)
                                //Vue.set(item,'expanded', true)
                                // return
                            }else if (res.errorcode == '10002') {
                                //console.log("无此事件")
                            }else if(res.errorcode == '10003'){
                                //console.log("系统错误")
                            }
                        }).catch((error) => {
                            console.log(error)
                        });
                    }
                    //Vue.set(item,'expanded', true)
                }
            },
            toggleEffectDetail(item){
                //console.log(item.expanded)
                if (item.expanded){
                    Vue.set(item,'expanded', false)
                }else{
                    //展开，判断是否有news字段
                    //console.log('news' in item)
                    if('news' in item){
                        Vue.set(item,'expanded', true)
                        // return
                    }else{
                        axios.get('/api/xueji/searchCauseEffectNews', {params:{cause_md5:this.current_md5,effect_md5:item.standard_md5}}).then((response) => {
                            let res = response.data
                            if (res.errorcode == '0') {
                                Vue.set(item,'news', res.items)
                                Vue.set(item,'expanded', true)
                                //console.log(item)
                                // return
                            }else if (res.errorcode == '10002') {
                                //console.log("无此事件")
                            }else if(res.errorcode == '10003'){
                                //console.log("系统错误")
                            }
                        }).catch((error) => {
                            console.log(error)
                        });
                    }
                    //展开，判断是否有产业链
                    //console.log('news' in item)
                    if('chain' in item){
                        Vue.set(item,'expanded', true)
                        // return
                    }else{
                        axios.get('/api/xueji/getIndustryChain', {params:{event:item._id}}).then((response) => {
                            let res = response.data
                            if (res.code == '0') {
                                //this.hot_search_list = res.items.slice(0,5)
                                Vue.set(item,'chain', res.msg)
                                //Vue.set(item,'expanded', true)
                                // return
                            }else if (res.errorcode == '10002') {
                                //console.log("无此事件")
                            }else if(res.errorcode == '10003'){
                                //console.log("系统错误")
                            }
                        }).catch((error) => {
                            console.log(error)
                        });
                    }
                    //Vue.set(item,'expanded', true)
                }
            },
            levelColor(item){
                if (item.weight > 60){
                    return 'red'
                }else if (item.weight <= 60&&item.weight>30){
                    return 'yellow'
                }else{
                    return 'green'
                }
            },
            toggleHeight(e){
                let section = e.target.parentNode
                let content = section.children[1]
                if (section.dataset.truncate == 'peak'){
                    section.dataset.truncate = 'all'
                    content.clip('false',content)
                }else{
                    section.dataset.truncate = 'peak'
                    content.clip('true',content)
                }
            },
            tween(node) {
                //node.fade = fade.bind(node);
                //node.collapse = collapse.bind(node);
                node.clip = this.clip.bind(node);
                return node;
            },
            tweenFade(node) {
                //node.fade = fade.bind(node);
                //node.collapse = collapse.bind(node);
                node.fade = this.fade.bind(node);
                return node;
            },
            // Height clipping
            clip (state, content, instant, callback) {

                // Pre-process
                var node = content;
                if (!pre(node, "clip", state, instant))
                    return;

                // Get current height
                var prev = node.dataset.clip;
                var from = node.scrollHeight + "px";

                // Get target height
                node.dataset.clip = state;
                var to = node.scrollHeight + "px";

                // Show all inner elements during the transition
                node.dataset.clip = "false";
                node.style.maxHeight = from;

                raf(function () {
                    node.style.maxHeight = to;
                    post(node, function () {
                        node.dataset.clip = state;
                        complete(node, callback || instant);
                    });
                });
            },
            // Fading transition
            fade (state, content, instant, callback) {

                // Pre-process
                let node = content;
                if (!pre(node, "fade", state, instant))
                    return;

                // Ensure the element is rendered as block during the transition
                node.style.display = "block";

                // Update state
                raf(function() {
                    node.dataset.fade = state;
                    post(node, function() {
                        complete(node, callback || instant);
                    });
                });
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            filterType(value, row) {
                return row.type === value;
            },
            handleReceive(){
                this.popIndustryTip=true
                 //mounted
                this.echartsPopShow = true
                this.industryPopTitle = this.ruleFormHomeInput.inputVal
                this.chainSource = this.source
            },
            //获取产业链
            getIndustryLink(){  
                // 修改点，mock数据改接口，代码逻辑见下
                let res = getIndustryChain;
                if (res.code == '0') {
                    if(Object.keys(res.msg).length==0){
                        this.industryLinkShow = false
                    }else{
                        this.industryLinkShow = true
                        this.source = res.msg
                        this.chainSource = res.msg
                    }
                }
                // axios.get('/api/xueji/getIndustryChain', {params:{event:this.ruleFormHomeInput.inputVal}}).then((response) => {
                //     let res = response.data
                //     if (res.code == '0') {
                //         //console.log("成功")
                //         //console.log(Object.keys(res.msg).length)
                //         if(Object.keys(res.msg).length==0){
                //             this.industryLinkShow = false
                //         }else{
                //             this.industryLinkShow = true
                //             this.source = res.msg
                //             this.chainSource = res.msg
                //         }
                //         //console.log(this.source)
                //     }else if (res.errorcode == '10002') {
                //         console.log("无此事件")
                //     }else if(res.errorcode == '10003'){
                //         console.log("系统错误")
                //     }
                // }).catch((error) => {
                //     console.log(error)
                // });
            },
            loadSentimentIcon(s){
                let icon = this.positive
                if (s==0) icon = this.neutral
                else if (s < 0) icon = this.negative
                return icon
            },
            //首页学习来源轮播效果
            carouselNext (offset) {
                if (document.body.dataset.layout != "home")
                    return;
                let wrapper = document.getElementById("showcase");
                let list = wrapper.getElementsByTagName("ul")[0];
                //console.log(list)
                //console.log(list.children)
                let record = list.children[(offset++) % list.children.length];
                let that = this
                // Fade in and out
                record.fade("visible", record, function() {
                    setTimeout(function() {
                        record.fade("hidden", record, function() {
                            setTimeout(that.carouselNext(offset), 1000);
                        });
                    }, 9000);
                });
                // record.setAttribute('data-fade','visible')
                // setTimeout(()=>{
                //     record.setAttribute('data-fade','hidden')
                //     setTimeout(this.carouselNext, 1000);
                // }, 9000)
            },
            // Collect top sources from facts
            // collect (count) {

            //     // Initialize candidate collector
            //     var candidates = Object.create(null);
            //     // Super nasty DFS ;-P
            //     var cards = document.querySelectorAll(".card[data-type=fact]");
            //     var sources =  document.getElementById('bibliography').querySelectorAll('ol>li>a[href]')
            //     var facts = cards[0].querySelectorAll(".fact");
            //     for (var k = 0; k < facts.length; k++) {
            //         var fact = facts[k];
            //         for (var n = 0; n < sources.length; n++) {
            //             var source = sources[n];
            //             if (fact.getAttribute('id') == source.getAttribute('href')){
            //                 this.add(candidates, fact, source, k, n);
            //             }
            //         }
            //     }

            //     // Flatten candidates
            //     var top = [];
            //     for (var id in candidates)
            //         top.push(candidates[id]);

            //     // Sort by scores
            //     top.sort(function(a, b) {
            //         return b.score - a.score;
            //     });
            //     // Limit result count
            //     return top.slice(0, count);
            // },
            collect (count) {

                // Initialize candidate collector
                var candidates = Object.create(null);
                // Super nasty DFS ;-P
                //var cards = document.querySelectorAll(".card[data-type=fact]");
                var sources =  document.getElementById('bibliography').querySelectorAll('ol>li')
                //var facts = cards[0].querySelectorAll(".fact");
                for (var i = 0; i < sources.length; i++) {
                    var source = sources[i];
                    var keys = source.dataset.events.split('*');
                    for(var j = 0; j < keys.length; j++){
                        var fact = document.getElementById(keys[j])
                        this.add(candidates, fact, source, i, j);
                        // if(fact!=null){
                        //     this.add(candidates, fact, source, i, j);
                        // }else{
                        //     this.add(candidates, [], source, i, j);
                        // }
                        //this.add(candidates, fact, source, i, j);
                    }
                }
                // Flatten candidates
                var top = [];
                for (var id in candidates)
                    top.push(candidates[id]);

                // Sort by scores
                // top.sort(function(a, b) {
                //     return b.score - a.score;
                // });
                // Limit result count
                return top.slice(0, count);
            },
            add (candidates, fact, source, i, j) {

                // Confidence level
                // var dl = fact.children[0];
                // var confidence = parseInt(dl.dataset.confidence) || 0;
                //var color = dl.dataset.color;
                // Initialize candidate record
                var id = source.dataset.url;
                var candidate = candidates[id];
                if (candidate === undefined) {
                    candidate = candidates[id] = {
                        origin: source,
                        score: 0,
                        //confidence: confidence,
                        //color: color,
                        edges: []
                    };
                }

                // Update candidate
                // candidate.score += score;
                candidate.edges.push(fact);
                // if (candidate.confidence < confidence) {
                //     candidate.confidence = confidence;
                //     candidate.color = color;
                // }
            },
            //画指示线
            connect(data, elems){
                // Nothing to connect
                if (data.length === 0 || elems.length === 0)
                    return;
                // Leader line options
                var options = {
                    color: window.getComputedStyle(document.getElementById("bibliography")).color,
                    endPlug: "disc",
                    size: 2,
                    startSocket: "left",
                    endSocket: "right",
                    hide: true
                };
                // Anchor styles
                var styles = {
                    paddingTop: null,
                    paddingRight: null,
                    paddingBottom: null,
                    paddingLeft: null,
                    cursor: null,
                    backgroundColor: null,
                    backgroundImage: null,
                    backgroundSize: null,
                    backgroundPosition: null,
                    backgroundRepeat: null
                };
                let svg_arr = document.querySelectorAll('svg.leader-line')
                for(let i = 0; i < svg_arr.length; i++){
                    svg_arr[i].parentNode.removeChild(svg_arr[i])
                }
                // Draw leader lines
                data.forEach(function(record, index) {

                    // Reference to line instances
                    var lines = [];
                    var limit = Math.min(record.edges.length, 5);

                    // Create anchor
                    var anchor = LeaderLine.mouseHoverAnchor(elems[index], "draw", {
                        style: styles,
                        hoverStyle: styles,
                        animOptions: {
                            duration: 500
                        },
                        onSwitch: function(event) {

                            // Only respond to entering events
                            if (event.type != "mouseenter")
                                return;

                            // Update lines
                            for (var i = 0; i < limit; i++) {
                                var line = lines[i];
                                var fact = record.edges[i];
                                var section = fact.parentNode.parentNode.parentNode;
                                var card = section.parentNode.parentNode;

                                // Select the best target
                                var target = card.dataset.folded == "true" ? card : (fact.offsetTop < 1 ? section : fact);
                                line.setOptions({
                                    end: target,
                                    dash: target !== fact
                                });
                                // Redraw the line
                                line.position();
                            }
                        }
                    });

                    // Create lines
                    for (var i = 0; i < limit; i++)
                        //if (record.edges[i] != null){
                            lines.push(new LeaderLine(anchor, record.edges[i], options));
                        //}
                });
            },
            rightInitLine(){
                let right = document.getElementById('right')
                if (right.offsetLeft < 1)
                    return;
                // let svg_arr = document.querySelectorAll('svg.leader-line')
                // for(let i = 0; i < svg_arr.length; i++){
                //     svg_arr[i].parentNode.removeChild(svg_arr[i])
                // }
                setTimeout(() => {
                    // this.connect(data, elems);
                    var data =this.collect(10);
                    var elems = document.getElementById('bibliography').getElementsByTagName('ol')[0].children;
                    this.connect(data, elems);
                }, 900);
            },
            //今日热门事件--暂时注释掉
            // getHotWords(){
            //     axios.get('/api/xueji/getTopTen', {params:{}}).then((response) => {
            //         let res = response.data
            //         if (res.errorcode == '0') {
            //             this.hot_search_list = res.items.slice(0,5)
            //         }else if (res.errorcode == '10002') {
            //             //console.log("无此事件")
            //         }else if(res.errorcode == '10003'){
            //             //console.log("系统错误")
            //         }     
            //     }).catch((error) => {
            //         console.log(error)
            //     });
            // },
            //热门搜索项点击
            hotItemClick(i){
                this.ruleFormHomeInput.inputVal = i
                //this.submitSearch()
                this.toResult()
            },
            handleClose(){
                this.popIndustryTip = false
                //mounted
                this.echartsPopShow = false
            },
            chainHandleClose(){
                this.popChainTip = false
            },
            biaodiwuHandleClose(){
              this.popBiaodiwuTip = false
            },
            //首页学习来源
            getHomeLearnSource(){
                axios.get('/api/xueji/homePageLearnSource', {params:{}}).then((response) => {
                    let res = response.data
                    if (res.errorcode == '0') {
                        // let temp = []
                        // let num = Math.floor(Math.random()*10);
                        // let selected = res.items[num]
                        // temp.push(selected)
                        // this.home_learn_source_list = temp
                        this.home_learn_source_list = res.items
                        //首页学习来源
                        let that =this
                        setTimeout(() => {
                            let list = document.getElementById("showcase").getElementsByTagName("ul")[0];
                            for (let i = 0; i < list.children.length; i++){
                                that.tweenFade(list.children[i]).fade("hidden",list.children[i], true);
                            }
                            this.carouselNext(that.offset)
                        }, 1000);
                        // let list = document.getElementById("showcase").getElementsByTagName("ul")[0];
                        // for (let i = 0; i < list.children.length; i++){
                        //     this.tweenFade(list.children[i]).fade("hidden",list.children[i], true);
                        // }
                    }else if (res.errorcode == '10002') {
                        //console.log("无此事件")
                    }else if(res.errorcode == '10003'){
                        //console.log("系统错误")
                    }     
                }).catch((error) => {
                    console.log(error)
                });
            },
            //判断是否为事件
            isEvent(){
                this.inputTemp = this.ruleFormHomeInput.inputVal
                this.industryLinkShow = false
                this.preCauseShow = false
                this.postEffectShow = false
                this.conceptShow = false
                this.subjectMatterShow = false
                this.associateDataShow = false
                this.relatedSearchShow = false
                this.relatedNewsShow = false
                this.allPageShow = false
                this.rightShow = false
                //this.learnSourceLoading = true
                let CancelToken = axios.CancelToken
                this.cancelGetMsg()
                let self = this;
                // 修改点1,接口连调
                console.log(isEvent)
                let res = isEvent
                if (res.errorcode == '0') {
                    //是事件
                    this.current_md5 = res.items.standard_md5
                    this.relatedSearch = res.items.related_events
                    //
                    this.relatedSearchShow = true
                    //
                    this.allPageShow = true
                    this.searchNoResult = 0
                    return this.getEveryItems()
                }

                // axios.get('/api/xueji/isEvent', {params:{event: this.ruleFormHomeInput.inputVal},cancelToken: new CancelToken(function executor(c) {
                //     self.cancel = c
                // })}).then((response) => {
                //     let res = response.data
                //     if (res.errorcode == '0') {
                //         //是事件
                //         //this.showPage = true
                //         //this.showPageLoading = true
                //         this.current_md5 = res.items.standard_md5
                //         this.relatedSearch = res.items.related_events
                //         //
                //         this.relatedSearchShow = true
                //         //
                //         this.allPageShow = true
                //         this.searchNoResult = 0
                //         return this.getEveryItems()
                //     }else if (res.errorcode == '10002') {
                //         //console.log("无此事件")
                //         //this.notFoundTip = true
                //         //this.recommendList = res.items
                //         //this.showPage = true
                //         //this.getExceptionNews(1,'NF')
                //         //this.searchNoResult = 10002
                //         this.relatedSearch = res.items
                //         this.relatedSearchShow = true
                //         this.allPageShow = true
                //         this.searchNoResult = 10002
                //         //this.rightShow = false
                //         return this.getFullText()
                //     }else if(res.errorcode == '10004'){
                //         //this.notEventTip = true
                //         //console.log("非事件")
                //         //this.recommendList = res.items
                //         //this.showPage = true
                //         //this.getExceptionNews(1,'NE')
                //         //this.searchNoResult = 10004
                //         this.relatedSearch = res.items
                //         this.relatedSearchShow = true
                //         this.allPageShow = true
                //         this.searchNoResult = 10004
                //         //this.rightShow = false
                //         return this.getFullText()
                //     }     
                // }).catch((error) => {
                //     console.log(error)
                // });
            },
            //事件学习来源
            getSearchLearnSource(){
                let url_p = '/api/xueji/searchLearnSource?md5='+ this.current_md5;
                // this.conceptList.tags.forEach((e)=>{
                //     url_p += '&tags=' + e
                // })
                url_p += '&tags=' + this.currentTag
                //修改点，mock改接口
                let res = searchLearnSource
                if (res.errorcode == '0') {
                    this.learnSourceList = res.items
                    this.rightShow = true

                        this.rightInitLine()
                    
                }
                // axios.get(url_p).then((response) => {
                //     let res = response.data
                //     if (res.errorcode == '0') {
                //         this.learnSourceList = res.items
                //         this.rightShow = true

                //             this.rightInitLine()
                        
                //     }else if (res.errorcode == '10002') {
                //         //console.log("无此事件")
                //     }else if(res.errorcode == '10003'){
                //         //console.log("系统错误")
                //     }     
                // }).catch((error) => {
                //     console.log(error)
                // });
            },
            //
            getSearchLearnSource2(){        
                axios.get('/api/xueji/searchLearnSource', {params:{md5:this.current_md5}}).then((response) => {
                    let res = response.data
                    if (res.errorcode == '0') {
                        this.learnSourceList = res.items
                        this.rightShow = true
                        
                            this.rightInitLine()
                        
                    }else if (res.errorcode == '10002') {
                        //console.log("无此事件")
                    }else if(res.errorcode == '10003'){
                        //console.log("系统错误")
                    }     
                }).catch((error) => {
                    console.log(error)
                });
            },
            cancelGetMsg () {
                if(this.cancel){
                    this.cancel()
                }
            },
            //获取概念描述tag（用户输入可能包含多个概念，分为多个标签渲染，同时返回第一个标签的所有子标签，其他标签的子标签通过下一个接口获得）
            getTags(){
                //修改点，mock改接口
                let res = getDescTags
                if (res.errorcode == '0') {
                    if(Object.keys(res.items).length==0){
                        return this.getSearchLearnSource2()
                    }else{
                        //描述排序
                        let temp = res.items[Object.keys(res.items)[0]]
                        temp.sort(function(a,b){
                            return b.weight - a.weight
                        })
                        //this.conceptList.default = res.items[Object.keys(res.items)[0]]
                        this.conceptList.default = temp
                        this.conceptList.tags = Object.keys(res.items)
                        this.currentTag = Object.keys(res.items)[0]

                        this.conceptShow = true
                        return this.getSearchLearnSource()
                    }
                    // //描述排序
                    // let temp = res.items[Object.keys(res.items)[0]]
                    // temp.sort(function(a,b){
                    //     return b.weight - a.weight
                    // })
                    // //this.conceptList.default = res.items[Object.keys(res.items)[0]]
                    // this.conceptList.default = temp
                    // this.conceptList.tags = Object.keys(res.items)
                    // this.currentTag = Object.keys(res.items)[0]

                    // this.conceptShow = true
                    // return this.getSearchLearnSource()
                }
                // axios.get('/api/xueji/getDescTags', {params:{event:this.ruleFormHomeInput.inputVal}}).then((response) => {
                //     let res = response.data
                //     if (res.errorcode == '0') {
                //         if(Object.keys(res.items).length==0){
                //             return this.getSearchLearnSource2()
                //         }else{
                //             //描述排序
                //             let temp = res.items[Object.keys(res.items)[0]]
                //             temp.sort(function(a,b){
                //                 return b.weight - a.weight
                //             })
                //             //this.conceptList.default = res.items[Object.keys(res.items)[0]]
                //             this.conceptList.default = temp
                //             this.conceptList.tags = Object.keys(res.items)
                //             this.currentTag = Object.keys(res.items)[0]

                //             this.conceptShow = true
                //             return this.getSearchLearnSource()
                //         }
                //         // //描述排序
                //         // let temp = res.items[Object.keys(res.items)[0]]
                //         // temp.sort(function(a,b){
                //         //     return b.weight - a.weight
                //         // })
                //         // //this.conceptList.default = res.items[Object.keys(res.items)[0]]
                //         // this.conceptList.default = temp
                //         // this.conceptList.tags = Object.keys(res.items)
                //         // this.currentTag = Object.keys(res.items)[0]

                //         // this.conceptShow = true
                //         // return this.getSearchLearnSource()
                //     }else if (res.errorcode == '10002') {
                //         //console.log("无此事件")
                //     }else if(res.errorcode == '10003'){
                //         //console.log("系统错误")
                //     }     
                // }).catch((error) => {
                //     console.log(error)
                // });
            },
            //获取非首个标签的子标签
            getTagItems(){

            },
            //获得子标签的展开新闻
            getTagItemNews(x){

            },
            //获取原因集合
            getCause(){
                //修改点，mock数据改接口
                let res = searchCause
                if (res.errorcode == '0') {
                    //console.log('tongguo')
                    this.causeList = res.items
                    if(this.causeList.length!=0){
                        this.preCauseShow = true
                        res.items.forEach((e)=>{
                            if (!this.learnSourceArr[e.news_pubtime]){
                                this.learnSourceArr[e.news_pubtime] = e
                            }
                        })
                    }
                }
                // axios.get('/api/xueji/searchCause', {params:{md5:this.current_md5}}).then((response) => {
                //     let res = response.data
                //     if (res.errorcode == '0') {
                //         //console.log('tongguo')
                //         this.causeList = res.items
                //         if(this.causeList.length!=0){
                //             this.preCauseShow = true
                //             res.items.forEach((e)=>{
                //                 if (!this.learnSourceArr[e.news_pubtime]){
                //                     this.learnSourceArr[e.news_pubtime] = e
                //                 }
                //             })
                //         }
                //     }else if (res.errorcode == '10002') {
                //         //console.log("无此事件")
                //     }else if(res.errorcode == '10003'){
                //         //console.log("系统错误")
                //     }     
                // }).catch((error) => {
                //     console.log(error)
                // });
            },
            //获取结果集合
            getEffect(){
                //修改点，mock改接口
                let res = searchEffect
                if (res.errorcode == '0') {
                    this.effectList = res.items
                    if(this.effectList.length!=0){
                        this.postEffectShow = true
                        res.items.forEach((e)=>{
                            if (!this.learnSourceArr[e.news_pubtime]){
                                this.learnSourceArr[e.news_pubtime] = e
                            }
                        })
                    }
                }
                // axios.get('/api/xueji/searchEffect', {params:{md5:this.current_md5}}).then((response) => {
                //     let res = response.data
                //     if (res.errorcode == '0') {
                //         this.effectList = res.items
                //         if(this.effectList.length!=0){
                //             this.postEffectShow = true
                //             res.items.forEach((e)=>{
                //                 if (!this.learnSourceArr[e.news_pubtime]){
                //                     this.learnSourceArr[e.news_pubtime] = e
                //                 }
                //             })
                //         }
                //     }else if (res.errorcode == '10002') {
                //         //console.log("无此事件")
                //     }else if(res.errorcode == '10003'){
                //         //console.log("系统错误")
                //     }     
                // }).catch((error) => {
                //     console.log(error)
                // });
            },
            //全文检索
            getFullText(){
                let res = fullTextSearch
                if (res.errorcode == '0') {
                    this.relatedNews = res.items[1]
                    if(this.relatedNews.length!=0){
                        this.relatedNewsShow = true
                    }
                    //清空加载更多的计数器
                    this.count = 0
                }
                // axios.get('/api/xueji/fullTextSearch', {params:{event:this.ruleFormHomeInput.inputVal,start:0,size:3}}).then((response) => {
                //     let res = response.data
                //     if (res.errorcode == '0') {
                //         this.relatedNews = res.items[1]
                //         if(this.relatedNews.length!=0){
                //             this.relatedNewsShow = true
                //         }
                //         //清空加载更多的计数器
                //         this.count = 0
                //     }else if (res.errorcode == '10002') {
                //         //console.log("无此事件")
                //     }else if(res.errorcode == '10003'){
                //         //console.log("系统错误")
                //     }     
                // }).catch((error) => {
                //     console.log(error)
                // });
            },
            //加载更多
            loadMore(){
                this.loading_loadMore = true
                // 修改点，mock改接口
                let res = fullTextSearch
                if (res.errorcode == '0') {
                    this.relatedNews=this.relatedNews.concat(res.items[1])
                    console.log(res.items[1])
                    console.log(this.relatedNews)
                    this.loading_loadMore = false
                    this.count++
                }
                // axios.get('/api/xueji/fullTextSearch', {params:{event:this.ruleFormHomeInput.inputVal,start:3+20*this.count,size:20}}).then((response) => {
                //     let res = response.data
                //     if (res.errorcode == '0') {
                //         this.relatedNews=this.relatedNews.concat(res.items[1])
                //         console.log(res.items[1])
                //         console.log(this.relatedNews)
                //         this.loading_loadMore = false
                //         this.count++
                //     }else if (res.errorcode == '10002') {
                //         //console.log("无此事件")
                //     }else if(res.errorcode == '10003'){
                //         //console.log("系统错误")
                //     }     
                // }).catch((error) => {
                //     console.log(error)
                // });
            },
            //获取标的物biaodiwu
            getSubjectMatter(){
                //每次搜索新标的物时，重置上次标的物分页状态
                this.currentPage = 1
                //修改点，mock改接口
                let res = getMatter
                if (res.errorcode == '0') {
                    // this.biaodiwuList = this.formatSubjectMatter(res.items)
                    this.subjectMatterShow = true
                }
                // axios.get('/api/xueji/getMatter', {params:{event:this.ruleFormHomeInput.inputVal}}).then((response) => {
                //     let res = response.data
                //     if (res.errorcode == '0') {
                //         this.biaodiwuList = this.formatSubjectMatter(res.items)
                //         this.subjectMatterShow = true
                //     }else if (res.errorcode == '10002') {
                //         //console.log("无此事件")
                //     }else if(res.errorcode == '10003'){
                //         //console.log("系统错误")
                //     }     
                // }).catch((error) => {
                //     console.log(error)
                // });
            },
            //标的物接口数据格式化
            formatSubjectMatter(a){
                let res = a.map(function(item,index){
                    let wrapper = {}
                    wrapper.name = item.matter
                    if(item.type=='product'){
                        wrapper.type = '产品'
                    }else if(item.type=='company'){
                        wrapper.type = '公司'
                    }else if(item.type=='industry'){
                        wrapper.type = '行业'
                    }
                    if(item.sentiflag==-1){
                        wrapper.tag = '利空'
                    }else if(item.sentiflag==1){
                        wrapper.tag = '利好'
                    }
                    let temp_arr = [item.logic_path[0],item.logic_path[1],'...',item.logic_path[item.logic_path.length-1]]
                    temp_arr = temp_arr.join('->')
                    let temp = item.logic_path.join('->')
                    wrapper.event = temp//完整路径
                    wrapper.event_brief = temp_arr//缩略路径
                    return wrapper
                })
                return res
            },
            //
            handleCurrentChange(currentPage){
                this.currentPage = currentPage;
            },
            newsHandleCurrentChange(currentPage) {
                this.newsCurrentPage = currentPage;
            },
            //获取关联数据指标
            getAssociateData(){
                // 修改点，mock数据改接口
                let res = searchData
                if (res.errorcode == '0') {
                    this.relatedData = res.items
                    if(this.relatedData.length!=0){
                        this.associateDataShow = true
                    }    
                }
                // axios.get('/api/xueji/searchData', {params:{md5:this.current_md5}}).then((response) => {
                //     let res = response.data
                //     if (res.errorcode == '0') {
                //         this.relatedData = res.items
                //         // let test = res.items[0].data.data
                //         // console.log(test)
                //         //console.log(new Date('2000-13-23'))
                //         // for(let i=0;i<test.length;i++){
                //         //     console.log(new Date(test[i].time).valueOf())
                //         // }
                //         // console.log(this.$utils.formatMillsecondsToYMD(958780800000))
                //         // console.log(this.$utils.formatMillsecondsToYMD(1271376000000))
                //         // console.log(new Date.valueOf())
                //         if(this.relatedData.length!=0){
                //             this.associateDataShow = true
                //         }    
                //     }else if (res.errorcode == '10002') {
                //         //console.log("无此事件")
                //     }else if(res.errorcode == '10003'){
                //         //console.log("系统错误")
                //     }     
                // }).catch((error) => {
                //     console.log(error)
                // });
            },
            getEveryItems(){
                //如果是事件，调用此函数获取各栏目的数据
                this.getIndustryLink()
                this.getAssociateData()
                this.getCause()
                this.getEffect()
                this.getFullText()
                this.getSubjectMatter()
                this.getTags()
                // this.getStatistics()                
            },
            lookBiaodiwuDetail(item){
                this.biaodiwuPopTitle = item.name;
                this.biaodiwuSource = item.event.split('->');
                this.popBiaodiwuTip = true
            },
            //标签显示产业链弹窗
            showChainChartsPop(item){
                this.popChainTip = true;
                this.chainPopTitle = item._id
                this.iconChainSource = item.chain
            },
            //用户输入统计
            // getStatistics(){
            //     axios.get('/api/xueji/recordAccess', {params:{event:this.ruleFormHomeInput.inputVal}}).then((response) => {
            //         let res = response.data
            //         if (res.errorcode == '0') {
                         
            //         }else if (res.errorcode == '10002') {
            //             //console.log("无此事件")
            //         }else if(res.errorcode == '10003'){
            //             //console.log("系统错误")
            //         }     
            //     }).catch((error) => {
            //         console.log(error)
            //     });
            // }
        }
    }
</script>
<style lang="scss">
    body[data-layout="home"] .icon-magi {
       background-image: url("../assets/image/logo.svg");
    }
    body[data-layout="result"] .icon-magi {
        background-image: url("../assets/image/search_logo.svg");
        background-size: contain;
        width: 2.75rem !important;
        height: 2.75rem !important;
        top: 0.625rem;
    }
    #search-wrapper{
        display: flex;
        .inline-input{
            flex: 1 1;
            .el-input{
                font-size: 16px;
                .el-input__inner{
                    line-height: normal;
                    padding: 0 .5rem;
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
            }
        }
        .el-button{
            border-radius: 0 4px 4px 0;
            .search-icon{
                //background-image: url("../assets/image/icon_search.png");
                background-image: url("../assets/image/icon_search_re7.png");
                width: 20px;
                height: 15px;
                //width:32px;
                //height:32px;
                display: inline-block;
            }
        }
    }
    #search_info{
        display: flex;
        .icon_label_wrapper{
            //width: 110px;
            flex-shrink: 0;
        }
        .ul_wrapper{
            width:80%;
        }
        span{
            white-space: nowrap;
        }
        .icon-hot{
            display: inline-block;
            width: 16px;
            height: 10px;
            background-image: url("../assets/image/icon_hot.png");
            margin-right: 5px;
        }
        color: #fafafa;
        font-size: .875rem;
        ul{
            display:inline;
            li{
                display:inline-block;
                margin-left:1rem;
                margin-bottom: .5rem;
                max-width: 10rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                a{
                    text-decoration: none;
                    outline: none;
                    cursor:pointer;
                }
            }
        }
        
    }
    #showcase{
        margin-top:3rem;
        margin-bottom: 4rem;
        height: 140px;
    }
    #result{
        .news-title{
            display: flex;
            justify-content: space-between;
            time{
                margin-right: .25rem;
            }
        }
        .news-content{
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .el-table{
            color:#d0d0d0;
            background: transparent;
            font-size: 0.8125rem;
            thead{
                color: #fff;
            }
            th,tr{
                background: transparent;
            }
            td,th{
                padding:0;
            }
            .cell{
                white-space: nowrap;
            }
            .event-div{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .event-link{
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-right: 0px;
                }
                .el-button--text{
                    font-size: 12px;
                    color: #66BBFF;
                }
            }
            .el-table__column-filter-trigger i{
                color: #fff;
                font-size: 14px;
            }
        }
        .el-table--border, .el-table--group {
            border: 1px solid #4b4b4b;
            border-right: none;
            border-bottom: none;
        }
        .el-table td, .el-table th.is-leaf {
            border-bottom: 1px solid #4b4b4b;
        }
        .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
            border-right: 1px solid #4b4b4b;
        }
        .el-table--border::after, .el-table--group::after, .el-table::before{
            background: transparent;
        }
        .el-table--enable-row-hover .el-table__body tr:hover>td {
            background-color: #26262a;
        }
        .newscard-wrap{
            margin-top: -.5rem;
            .newscard-title{
                display: flex;
                justify-content: space-between;
                align-items: center;
                h3{
                    img{
                        margin-right: .25rem;
                        margin-bottom: .125rem;
                    }
                }
                >span{
                    display: flex;
                    align-items: center;
                    flex:none;
                    flex-shrink: 0;
                    time{
                        color: #8E8E92;
                        margin-right: .5rem;
                    }
                }
            }
            .newscard-content{
                overflow : hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                margin-bottom: 1.25rem;
                line-height: 1.5;
                //高亮
                .highlight-active{
                    color:#FF557D;
                }
            }
        }
        //
        section{
            .el-pagination{
                display: block;
                text-align: center;
                .btn-next, .btn-prev{
                    background: center center no-repeat #2c2c30;
                    color: #d0d0d0;
                }
                .el-pager{
                    padding-top: 3px;
                    li{
                        border-radius: 50%;
                        font-size: .8125rem;
                        min-width: 20px;
                        height: 20px;
                        line-height: 20px;
                        margin: 0 2px;
                        background: #2c2c30;
                        color: #d0d0d0;
                    }
                    li.active{
                        color: #fff;
                        background-color: #49AAFE;
                    }
                    li.btn-quicknext, li.btn-quickprev{
                        line-height: 20px;
                        color: #d0d0d0;
                    }
                    .more::before{
                        line-height: 24px;
                    }
                }
            }
            .conceptDataDiv{
                margin-top:.5rem;
            }
            .tagspan{
                padding: .15rem .25rem;
                border-radius: .25rem;
                border: 1px solid #777575;
                color: #dcdce0;
                margin-right: .5rem;
                cursor: pointer;
            }

            .tagspan.active,.tagspan:hover{
                background-color: #49AAFE;
                border-color: #49AAFE;
                color: #fff;
            }
        }
        #right{
            position: relative;
            .newsright-title{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    h5{
                        img{
                            margin-right: .25rem;
                            margin-bottom:.125rem;
                        }
                    }
                    >span{
                        display: flex;
                        align-items: center;
                        flex:none;
                        time{
                            color: #8E8E92;
                            margin-right: .5rem;
                        }
                    }
                }
            .newsright-content{
                overflow : hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #8E8E92;
                display: block;
            }
            #bibliography{
                position: relative;
                .el-popover__reference{
                    position:absolute;
                    top:-3px;
                    right:.5rem;
                }
            }
        }
    }
    body[data-layout='home'] #contact-wrapper{
        display: none;
    }
    // #contact-wrapper{
    //     position: absolute;
    //     right: 6rem;
    //     top: 1.5rem;
    //     font-size: 14px;
    //     color: #7e7e7e;
    // }
    #contact-wrapper{
        position: absolute;
        // right: 6rem;
        top: -3.25rem;
        font-size: 14px;
        color: #7e7e7e;
        width:100%;
        padding-right:0.75rem;
        justify-content: flex-end;
        z-index: 999;
        // display:flex;
        >a{
            text-decoration: none;
            margin-right: .75rem;
        }
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-to {
        transform: translate3d(0, -3rem, 0);
        opacity: 0;
    }
    .el-table-filter{
        border: 1px solid #3A3A3E !important;
        background-color: #3A3A3E !important;
        .el-checkbox{
            color: #fff;
            font-size: .8125rem;
        }
        .el-checkbox__inner{
            width: .8125rem;
            height: .8125rem;
        }
        .el-table-filter__bottom{
            border-top: 1px solid #4b4b4b;
            button{
                color: #fff;
            }
        }
    }
    .el-dialog{
        background-color: #3A3A3E !important;
        box-shadow: 0px 5px 13px 3px rgba(0,0,0,0.36) !important;
        .el-dialog__header{
            //padding:.5rem 0 0 .5rem;
            text-align: left;
            .el-dialog__title{
                font-size: 1rem;
                color: #fff;
            }
            .el-dialog__headerbtn{
                top:.5rem;
                right: .5rem;
            }
        }
        .el-dialog__body{
            padding:0 !important;
        }
    }
    .myPopper{
        background: #2c2c30 !important;
        border: 1px solid #4b4b4b !important;
        color:#fff !important;
        .sentiment_img{
            display: flex;
            justify-content: space-between;
            font-size:12px;
            img{
                margin-right: .125rem;
            }
        }
    }
    .el-popover__reference{
        cursor:pointer;
    }
    .myPopperContact{
        background:rgba(44,44,48,1) !important;
        box-shadow:0px 2px 5px 0px rgba(0,0,0,0.5) !important;
        border:none !important;
        color:#fff !important;
        .contact_content{
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            .wxcode_div{
                flex-shrink: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                img{
                    margin-bottom:.125rem;
                    width: 80px;
                }
            }
            .text_div{
                // width:120px;
                p{
                    margin:0
                }
                img{
                    width:120px;
                    margin-bottom: 10px;
                }
            }
        }
    }
    .card-noResult{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2.5rem 0;
        img{
            margin-right: 2px;
            flex-shrink: 0;
        }
    }
    @media screen and (min-width: 760px){
        #result > main.noResult {
            flex: 0 0 76.25rem;
            width: 76.25rem;
        }
    }

    @media screen and (min-width: 760px){
         body[data-layout="result"] #footer.noResult {
            width: 76.25rem;
        }
    }
    .el-scrollbar {
        .highlight-active {
            color: #49AAFE;
        }
    }
    .further_search_block{
        display:flex;
    }
    .further_search{
        display: block;
        font-size: .875rem;
        color: #66BBFF;
        background-color: #2C2C30;
        padding: .5rem .5rem;
        border-radius: .2rem;
        text-align: left;
        text-decoration: none;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
