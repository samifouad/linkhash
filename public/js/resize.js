// @ts-nocheck
const resizer = document.getElementById('errors'); // Use your existing separator's ID
const leftPanel = document.getElementById('editor'); // Adjust as per your left panel's ID
const rightPanel = document.getElementById('output'); // Adjust as per your right panel's ID
let isDragging = false;

resizer.addEventListener('mousedown', function(e) {
    isDragging = true;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
});

function onMouseMove(e) {
    if (!isDragging) return;
    const containerWidth = resizer.parentNode.getBoundingClientRect().width;
    const leftWidth = e.clientX - resizer.parentNode.getBoundingClientRect().left;
    const rightWidth = containerWidth - leftWidth - resizer.offsetWidth;
    leftPanel.style.width = `${leftWidth}px`;
    rightPanel.style.width = `${rightWidth}px`;
}

function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}