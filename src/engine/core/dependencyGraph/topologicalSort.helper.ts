import { adaptDependencyListToAdjacencyList } from './dependencyToAdjacencyList.adapter';
import { detectCyclesInDependencyList } from './detectCyclesInAdjacencyList.helper';

// Algorithm adapted from https://medium.com/@konduruharish/topological-sort-in-typescript-and-c-6d5ecc4bad95#:~:text=Topological%20sort%20or%20topological,before%20B%20in%20the%20ordering.

export const findTopologicalSort = (
  dependencyList: Record<string, string[]>,
): string[] => {
  const tSort: string[] = [];

  const inDegree: Map<string, number> = new Map();

  const adjacencyList = adaptDependencyListToAdjacencyList(dependencyList);

  const hasCycles = detectCyclesInDependencyList(adjacencyList);
  if (hasCycles) {
    throw new Error('Dependency cycle found');
  }

  for (const [key, value] of Object.entries(dependencyList)) {
    inDegree.set(key, value.length);
  }

  const queue: string[] = [];

  inDegree.forEach((degree, vertex) => {
    if (degree == 0) {
      queue.push(vertex);
    }
  });

  while (queue.length > 0) {
    const current = queue.shift();
    tSort.push(current);
    if (adjacencyList.has(current)) {
      adjacencyList.get(current).forEach((edge) => {
        if (inDegree.has(edge) && inDegree.get(edge) > 0) {
          const newDegree = inDegree.get(edge) - 1;
          inDegree.set(edge, newDegree);

          if (newDegree == 0) {
            queue.push(edge);
          }
        }
      });
    }
  }
  return tSort;
};
