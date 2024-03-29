/**
 * Identities a cycle in the given graph
 * @param adjList Adjacency List that represent a graph with vertices and edges
 */
export const detectCyclesInDependencyList = (
  adjList: Map<string, string[]>,
): boolean => {
  let count = 0;
  const inDegree: Map<string, number> = new Map();

  // find in-degree for each vertex
  adjList.forEach((edges, vertex) => {
    // If vertex is not in the map, add it to the inDegree map
    if (!inDegree.has(vertex)) {
      inDegree.set(vertex, 0);
    }

    edges.forEach((edge) => {
      // Increase the inDegree for each edge
      if (inDegree.has(edge)) {
        inDegree.set(edge, inDegree.get(edge) + 1);
      } else {
        inDegree.set(edge, 1);
      }
    });
  });

  // Queue for holding vertices that has 0 inDegree Value
  const queue: string[] = [];
  inDegree.forEach((degree, vertex) => {
    // Add vertices with inDegree 0 to the queue
    if (degree == 0) {
      queue.push(vertex);
    }
  });

  // Traverse through the leaf vertices
  while (queue.length > 0) {
    const current = queue.shift();
    // Increase the visited node count
    count++;
    // Mark the current vertex as visited and decrease the inDegree for the edges of the vertex
    // Imagine we are deleting this current vertex from our graph,
    // by which the edges from this vertex also gets deleted. Once the edges are deleted, inDegree will also be reduced
    if (adjList.has(current)) {
      adjList.get(current).forEach((edge) => {
        if (inDegree.has(edge) && inDegree.get(edge) > 0) {
          // Decrease the inDegree for the adjacent vertex
          const newDegree = inDegree.get(edge) - 1;
          inDegree.set(edge, newDegree);

          // if inDegree becomes zero, we found new leaf node.
          // Add to the queue to traverse through its edges
          if (newDegree == 0) {
            queue.push(edge);
          }
        }
      });
    }
  }
  return !(count == inDegree.size);
};
