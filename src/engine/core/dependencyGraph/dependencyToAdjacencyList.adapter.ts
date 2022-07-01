export const adaptDependencyListToAdjacencyList = (
  dependencyList: Record<string, string[]>,
): Map<string, string[]> => {
  const adjacencyList: Map<string, string[]> = new Map();
  for (const id in dependencyList) {
    adjacencyList.set(id, []);
  }
  for (const id in dependencyList) {
    for (const dependencyId of dependencyList[id]) {
      if (adjacencyList.get(dependencyId) === undefined) {
        throw new Error(
          `Dependency "${dependencyId}" of vertex "${id}" does not exist`,
        );
      }
      adjacencyList.set(dependencyId, [...adjacencyList.get(dependencyId), id]);
    }
  }
  return adjacencyList;
};
