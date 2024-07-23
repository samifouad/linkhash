<script>
  import { writable } from 'svelte/store';
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap
  } from '@xyflow/svelte';

  // Import SvelteFlow styles
  import '@xyflow/svelte/dist/style.css';

  // Using writables for nodes and edges
  let nodes = writable([
    { id: '1', type: 'input', data: { label: 'Component 1' }, position: { x: 250, y: 0 } },
    { id: '2', data: { label: 'Component 2' }, position: { x: 100, y: 100 } },
    { id: '3', data: { label: 'Component 3' }, position: { x: 400, y: 100 } },
  ]);

  let edges = writable([
    { id: 'e1-2', source: '1', target: '2', label: 'Edge 1-2' },
    { id: 'e1-3', source: '1', target: '3', label: 'Edge 1-3' },
  ]);

  const snapGrid = [25, 25];

  function handleNodeClick(event) {
    const node = event.detail.node;
    if (!event.target.classList.contains('nodrag')) {
      console.log(`Node ${node.id} clicked`);
    }
  }
</script>

<div style="height: 500px;">
  <SvelteFlow
    bind:nodes
    bind:edges
    nodesDraggable=false
    {snapGrid}
    fitView
  >
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
    <MiniMap />
  </SvelteFlow>
</div>
