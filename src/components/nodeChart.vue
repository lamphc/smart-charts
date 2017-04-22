<template>
  <svg class="node-chart"/>
</template>

<script type="text/javascript">
  import * as d3 from 'd3';

  export default {
    name: 'node-chart',
    data() {
      return {
        chartData: [],
        width: 420,
        nodeHeight: 20
      }
    },
    methods: {
      renderChart () {
        var width = 800, height = 600;
        var svg = d3.select('.node-chart').attr('id','stage').attr('width',width).attr('height',height);
        //根据group取色
        var color = d3.scaleOrdinal(d3.schemeCategory20);
        //创建力模拟
        var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(100))//创建连接力
          .force("charge", d3.forceManyBody().strength(-600))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force("collide", d3.forceCollide().radius(100).strength(1));

        //d3.json("miserables.json", function(error, graph) {
        //if (error) throw error;
        //data local
        var graph = {nodes:[ { id: "桂林" ,group:0}, { id: "广州" ,group:1},
          { id: "厦门" ,group:9}, { id: "杭州" ,group:6},
          { id: "上海" ,group:2}, { id: "青岛" ,group:8},
          { id: "天津" ,group:16} ],
          links:[ { source : "桂林" , target: "杭州" } , { source : "桂林" , target: "广州" } ,
            { source : "杭州" , target: "上海" } , { source : "广州" , target: "上海" } ,
            { source : "青岛" , target: "上海" } , { source : "青岛" , target: "天津" } ,{ source : "厦门" , target: "天津" } ,{ source : "桂林" , target: "厦门" }, { source : "广州" , target: "天津" }]
        };
        console.log(graph);
        //绘制节点
        var draw = function (graph) {
          var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

          var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", 5)
            .attr("fill", function(d) { return color(d.group); })
            .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));

          var text = svg.append('g')
            .attr('class','texts').selectAll('text')
            .data(graph.nodes)
            .enter()
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'text-after-edge')
            .text(function (d) {
              return d.id;
            }).call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));
          //事件处理
          node.on('mouseover',function (d) {
            d3.select(this).transition().style('fill','#fd1800');
          })
            .on('mouseout',function (d) {
              d3.select(this).transition().style('fill', color(d.group));
            }).on('click',function (d, i) {
            console.log(d, i);
          })

          link.on('click',function (d, i) {
            console.log(d, i);
          })

          node.append("title")
            .text(function(d) { return d.id; });

          simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

          simulation.force("link")
            .links(graph.links);



          function ticked() {
            link
              .attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

            node
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });

            text
              .attr("x", function(d) { return d.x; })
              .attr("y", function (d) { return d.y - 10; })
          }
        }
        //});
        draw(graph)

        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }

      }
    },
    mounted () {
      // this.$http.get('./static/json/bar.json').then(function (res) {
      //   this.chartData = res.data.lists;
      //   this.renderChart()
      //
      // })
      this.renderChart();
    },
    watch: {
      width: 'renderChart',
      nodeHeight: 'renderChart'
    }
  }

</script>

<style lang="less">
  @blue: #5697f1;
  .links line {
    stroke: #999;
    stroke-opacity: 0.6;
  }

  .nodes circle {
    stroke: #fff;
    stroke-width: 1.5px;
  }

</style>
