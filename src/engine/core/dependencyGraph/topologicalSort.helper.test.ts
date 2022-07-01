import { findTopologicalSort } from './topologicalSort.helper';

describe('topologicalSort', () => {
  it('returns an empty topological sort when no vertex is passed in input', () => {
    expect(findTopologicalSort({})).toEqual([]);
  });
  it('returns a valid topological sort when only one vertex is passed in input', () => {
    expect(findTopologicalSort({ a: [] })).toEqual(['a']);
  });

  it('throws an error when a dependency does not exist', () => {
    expect(() => findTopologicalSort({ a: ['b'] })).toThrow(
      `Dependency "b" of vertex "a" does not exist`,
    );
  });

  it('returns a valid topological sort for a simple example', () => {
    const dependencyList: Record<string, string[]> = {
      a: ['b', 'c'],
      b: ['c'],
      c: [],
    };

    const result = findTopologicalSort(dependencyList);
    expect(result).toEqual(['c', 'b', 'a']);
  });

  it('returns a valid topological sort for a more complex example', () => {
    const dependencyList: Record<string, string[]> = {
      a: [],
      b: ['a'],
      c: ['a', 'b'],
      d: ['b'],
      e: ['c', 'd'],
      f: ['d', 'g'],
      g: [],
    };

    const result = findTopologicalSort(dependencyList);
    expect(result).toEqual(['a', 'g', 'b', 'c', 'd', 'e', 'f']);
  });

  it('throws if cycles are found inside dependencies', () => {
    const dependencyList: Record<string, string[]> = {
      a: ['b'],
      b: ['a'],
    };

    expect(() => findTopologicalSort(dependencyList)).toThrow(
      'Dependency cycle found',
    );
  });
});
