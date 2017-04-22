<template>
  <svg class="bar-chart"/>
</template>

<script type="text/javascript">
  import * as d3 from 'd3';

  export default {
    name: 'bar-chart',
    data() {
      return {
        chartData: [],
        width: 420,
        barHeight: 20
      }
    },
    methods: {
      renderChart () {
        let data = this.chartData;

        // let width = this.width;
        // let barHeight = this.barHeight;

        let parseDate = d3.timeParse("%m/%d/%Y %H:%M:%S %p"),
          formatCount = d3.format(",.0f");

        let margin = {top: 10, right: 30, bottom: 30, left: 30},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

        let x = d3.scaleTime()
          .domain([new Date(2015, 0, 1), new Date(2016, 0, 1)])
          .rangeRound([0, width]);

        let y = d3.scaleLinear()
          .range([height, 0]);

        let histogram = d3.histogram()
          .value(function (d) {
            return d.date;
          })
          .domain(x.domain())
          .thresholds(x.ticks(d3.timeWeek));

        let svg = d3.select(this.$el)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        d3.csv("./static/json/homicides.csv", type, function (error, data) {
          if (error) throw error;

          let bins = histogram(data);

          y.domain([0, d3.max(bins, function (d) {
            return d.length;
          })]);

          let bar = svg.selectAll(".bar")
            .data(bins)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function (d) {
              return "translate(" + x(d.x0) + "," + y(d.length) + ")";
            });

          bar.append("rect")
            .attr("x", 1)
            .attr("width", function (d) {
              return x(d.x1) - x(d.x0) - 1;
            })
            .attr("height", function (d) {
              return height - y(d.length);
            });

          bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", function (d) {
              return (x(d.x1) - x(d.x0)) / 2;
            })
            .attr("text-anchor", "middle")
            .text(function (d) {
              return formatCount(d.length);
            });
        });

        function type(d) {
          d.date = parseDate(d.date);
          return d;
        }
      },
    },
    mounted () {
      this.$http.get('./static/json/bar.json').then(function (res) {
        this.chartData = res.data.lists;
        this.renderChart()

      })
    },
    watch: {
      width: 'renderChart',
      barHeight: 'renderChart'
    }
  }

</script>

<style lang="scss">
  $blue: #5697f1;
  .bar-chart {
    rect {
      fill: $blue;
    }
    text {
      fill: $blue;
      font: 10px sans-serif;
    }
    .bar text {
      fill:#fff
    }
  }

</style>
