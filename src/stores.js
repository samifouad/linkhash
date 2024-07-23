import { atom } from 'nanostores';

export const showDependencyTree = atom(false);
export const dependencyData = atom({
  nodes: [
    { id: 'Myriel', group: 1, isBig: true, showLabel: true },
    { id: 'Napoleon', group: 1 },
    // other nodes...
  ],
  links: [
    { source: 'Napoleon', target: 'Myriel', value: 1 },
    // other links...
  ]
});

export function getDependencyData() {
  return dependencyData.get();
}

export function setDependencyData(data) {
  dependencyData.set(data);
}

export function getShowDependencyTree() {
  return showDependencyTree.get();
}

export function setShowDependencyTree(value) {
  showDependencyTree.set(value);
}
