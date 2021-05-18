var metrics     = 'pv_count' // 统计访问次数 PV 填写 'pv_count'，统计访客数 UV 填写 'visitor_count'，二选一
var metricsName = (metrics === 'pv_count' ? '访问次数' : (metrics === 'visitor_count' ? '访客数' : ''))

// 访问地图
function mapChart () {
    let script = document.createElement("script")
    fetch('./data/map.json?date'+new Date()).then(data => data.json()).then(data => {
        let mapName = data.result.items[0]
        let mapValue = data.result.items[1]
        let mapArr = []
        let max = mapValue[0][0]
        for (let i = 0; i < mapName.length; i++) {
            mapArr.push({ name: mapName[i][0].name, value: mapValue[i][0] })
        }
        let mapArrJson = JSON.stringify(mapArr)
        script.innerHTML = `
        var mapChart = echarts.init(document.getElementById('map_container'), 'light');
        var mapOption = {
            title: { text: '访问地点', x: 'center' },
            tooltip: { trigger: 'item' },
            visualMap: {
                min: 0,
                max: ${max},
                left: 'left',
                top: 'bottom',
                text: ['高','低'],
                color: ['#1E90FF', '#AAFAFA'],
                calculable: true
            },
            series: [{
                name: '${metricsName}',
                type: 'map',
                mapType: 'china',
                showLegendSymbol: false,
                label: {
                    emphasis: { show: false }
                },
                itemStyle: {
                    normal: {
                        areaColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: '#121212'
                    },
                    emphasis: { areaColor: 'gold' }
                },
                data: ${mapArrJson}
            }]
        };
        mapChart.setOption(mapOption);
        window.addEventListener("resize", () => { 
            mapChart.resize();
        });`
        document.getElementById('map_container').after(script);
    }).catch(function (error) {
        console.log(error);
    });
}

function get_year(s) {
    return parseInt(s.substr(0, 4))
}
function get_month(s) {
    return parseInt(s.substr(5, 2))
}

// 访问趋势
function trendsChart () {
    let script = document.createElement("script")
    fetch('./data/trends.json?date'+new Date()).then(data => data.json()).then(data => {
        let date = new Date();
        let monthValueArr = {};
        let monthName = data.result.items[0];
        let monthValue = data.result.items[1];
        for (let i =2020; i <= date.getFullYear(); i++)   monthValueArr[String(i)] = [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ];
        monthValueArr
        for (let i = 0; i < monthName.length; i++) {
            let year = get_year(monthName[i][0]);
            let month = get_month(monthName[i][0]);
            monthValueArr[String(year)][String(month-1)] = monthValue[i][0];
        }
        script.innerHTML = `
        var trendsChart = echarts.init(document.getElementById('trends_container'), 'light');
        var trendsOption = {
            title: { text: '访问趋势', x: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { data: ['2020', '2021'], x: 'right' },
            xAxis: {
                name: '日期', type: 'category', boundaryGap: false,
                data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            },
            yAxis: { name: '${metricsName}', type: 'value' },
            series: [
                {
                    name: '2020', type: 'line',
                    data: [,,,1506,127,21,80,137,719,495,185,443],
                    markLine: { data: [{type: 'average', name: '平均值'}] }
                },
                {
                    name: '2021', type: 'line',
                    data: [${monthValueArr["2021"]}],
                    markLine: { data: [{type: 'average', name: '平均值'}] }
                }
            ]
        };
        trendsChart.setOption(trendsOption);
        window.addEventListener("resize", () => { 
            trendsChart.resize();
        });`
        document.getElementById('trends_container').after(script);
    }).catch(function (error) {
        console.log(error);
    });
}

// 访问来源
function sourcesChart () {
    let script = document.createElement("script");
    var innerHTML = '';
    var link = 0, direct = 0, search = 0;
    fetch('./data/sources.json?date'+new Date()).then(data => data.json()).then(data => {
        let sourcesName = data.result.items[0];
        let sourcesValue = data.result.items[1];
        let sourcesArr = [];
        for (let i = 0; i < sourcesName.length; i++)
            sourcesArr.push({ name: sourcesName[i][0].name, value: sourcesValue[i][0] });
        link = sourcesArr[1]['value'] + 65;
        search = sourcesArr[2]['value'] + 84;
        direct = sourcesArr[0]['value'] + 2838;
        innerHTML += `
        var sourcesChart = echarts.init(document.getElementById('sources_container'), 'light');
        var sourcesOption = {
            title: { text: '访问来源', x: 'center', },
            tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
            legend: {
                data: ['直达', '外链', '搜索', '百度', '谷歌', '必应', 'Github', '开往/十年之约'],
                y: 'bottom'
            },
            series: [
                {
                    name: '来源明细', type: 'pie', radius: ['45%', '60%'],
                    labelLine: { length: 30 },
                    label: {
                        formatter: '{a|{a}}{abg|}\\n{hr|}\\n  {b|{b}：}{c}  {per|{d}%}  ',
                        backgroundColor: '#F6F8FC', borderColor: '#8C8D8E',
                        borderWidth: 1, borderRadius: 4,
                        rich: {
                            a: { color: '#6E7079', lineHeight: 22, align: 'center' },
                            hr: { borderColor: '#8C8D8E', width: '100%', borderWidth: 1, height: 0 },
                            b: { color: '#4C5058', fontSize: 14, fontWeight: 'bold', lineHeight: 33 },
                            per: { color: '#fff', backgroundColor: '#4C5058', padding: [3, 4], borderRadius: 4 }
                        }
                    },
                    data: [`;
    }).catch(function (error) {
        console.log(error);
    });
    fetch('./data/engine.json?date'+new Date()).then(data => data.json()).then(data => {
        let enginesName = data.result.items[0];
        let enginesValue = data.result.items[1];
        let enginesArr = [];
        for (let i = 0; i < enginesName.length; i++)
            enginesArr.push({ name: enginesName[i][0].name, value: enginesValue[i][0] });
        innerHTML += `
                        {value: ${enginesArr[1]['value']}, name: '谷歌'},
                        {value: ${enginesArr[0]['value']+84}, name: '百度'},`;
    }).catch(function (error) {
        console.log(error);
    });
    fetch('./data/link.json?date'+new Date()).then(data => data.json()).then(data => {
        let linksName = data.result.items[0];
        let linksValue = data.result.items[1];
        let linksArr = {};
        for (let i = 0; i < linksName.length; i++)
            linksArr[linksName[i][0].name] = linksValue[i][0];
        let sum = data.result.sum[0][0];
        let bing = linksArr['http://cn.bing.com']+linksArr['http://www.bing.com'];
        let github = linksArr['http://github.com'];
        let travel = linksArr['http://travellings.now.sh']+linksArr['http://travellings.vercel.app']+linksArr['http://www.foreverblog.cn'];
        innerHTML += `
                        {value: ${bing}, name: '必应'},
                        {value: ${direct}, name: '直达'},
                        {value: ${github}, name: 'Github'},
                        {value: ${travel}, name: '开往/十年之约'},
                        {value: ${sum-bing-github-travel+65}, name: '其他'}
                    ]
                },
                {
                    name: '访问来源', type: 'pie', selectedMode: 'single', radius: [0, '30%'],
                    label: { position: 'inner', fontSize: 14},
                    labelLine: { show: false },
                    data: [
                        {value: ${search+bing}, name: '搜索', itemStyle: { color : 'green' }},
                        {value: ${direct}, name: '直达'},
                        {value: ${link-bing}, name: '外链', itemStyle: { color : '#32C5E9' }}
                    ]
                },
            ]
        };
        sourcesChart.setOption(sourcesOption);
        window.addEventListener("resize", () => { 
            sourcesChart.resize();
        });`;
        script.innerHTML = innerHTML;
    }).catch(function (error) {
        console.log(error);
    });
    document.getElementById('sources_container').after(script);
}

if (document.getElementById('map_container'))   mapChart();
if (document.getElementById('trends_container'))   trendsChart();
if (document.getElementById('sources_container'))   sourcesChart();