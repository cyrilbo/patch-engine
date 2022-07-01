import { adaptDependencyListToAdjacencyList } from './dependencyToAdjacencyList.adapter';
describe('adaptDependencyListToAdjacencyList', () => {
  it('map a dependency list to its equivalent adjacency list', () => {
    const dependencyList: Record<string, string[]> = {
      a: ['b', 'c'],
      b: ['c'],
      c: [],
    };

    const expectedAdjacencyList: Map<string, string[]> = new Map();

    expectedAdjacencyList.set('a', []);
    expectedAdjacencyList.set('b', ['a']);
    expectedAdjacencyList.set('c', ['a', 'b']);

    expect(adaptDependencyListToAdjacencyList(dependencyList)).toMatchObject(
      expectedAdjacencyList,
    );
  });
});
