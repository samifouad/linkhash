<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let data;

  onMount(() => {
    const width = 928;
    const height = 680;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const links = data.links.map(d => ({...d}));
    const nodes = data.nodes.map(d => ({...d}));

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(150))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("x", d3.forceX(0).strength(0.1))
        .force("y", d3.forceY(0).strength(0.1))
        .force("collision", d3.forceCollide().radius(d => d.isBig ? 40 : 15).strength(1));

    const svg = d3.select('#chart')
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    // Define clip paths for circular images
    const defs = svg.append('defs');

    nodes.forEach((d, i) => {
      if (d.image) {
        defs.append('clipPath')
          .attr('id', `clip-${d.id}`)
          .append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', d.isBig ? 35 : 10);
      }
    });

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
      .selectAll("g")
      .data(nodes)
      .join("g")
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    node.each(function(d) {
      const nodeElement = d3.select(this);

      if (d.image) {
        nodeElement.append("image")
          .attr("xlink:href", d.image)
          .attr("width", d.isBig ? 70 : 20)
          .attr("height", d.isBig ? 70 : 20)
          .attr("x", d.isBig ? -35 : -10)
          .attr("y", d.isBig ? -35 : -10)
          .attr("clip-path", `url(#clip-${d.id})`)
          .on('click', () => alert(`Node ${d.id} clicked`));
      } else {
        nodeElement.append("circle")
          .attr("r", d.isBig ? 35 : 10)
          .attr("fill", color(d.group))
          .on('click', () => alert(`Node ${d.id} clicked`));
      }
    });

    node.append("title")
        .text(d => d.id);

    node.filter(d => d.showLabel).append("text")
        .text(d => d.id)
        .attr("fill", "#000")
        .style("font-size", "14px")
        .attr("x", 6)
        .attr("y", 3);

    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      node
          .attr("transform", d => `translate(${d.x}, ${d.y})`);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  });
</script>

<svg id="chart"></svg>
