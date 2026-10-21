import { findNode, formatSize, parseTree, searchTree, subtreeSize } from '../tree'

const sample = JSON.stringify({
  name: 'root',
  type: 'folder',
  children: [
    {
      name: 'src',
      type: 'folder',
      children: [
        { name: 'index.ts', type: 'file', size: 1024 },
        { name: 'components', type: 'folder', children: [{ name: 'Button.tsx', type: 'file', size: 512 }] },
      ],
    },
    { name: 'package.json', type: 'file', size: 300 },
  ],
})

const tree = parseTree(sample)

describe('parseTree', () => {
  test('accepts the example from the brief', () => {
    expect(tree.name).toBe('root')
  })

  test.each([
    ['not json', 'Invalid JSON'],
    ['[]', 'missing name'],
    ['{"name":"a","type":"link"}', 'type must be'],
    ['{"name":"a","type":"file"}', 'invalid size'],
    ['{"name":"a","type":"folder"}', 'folder needs children'],
    ['{"name":"a/b","type":"file","size":1}', 'cannot contain'],
    [
      '{"name":"r","type":"folder","children":[{"name":"x","type":"file","size":1},{"name":"x","type":"file","size":2}]}',
      'duplicate name',
    ],
  ])('rejects %s', (input, message) => {
    expect(() => parseTree(input)).toThrow(message)
  })

  test('points at the broken node', () => {
    const input = '{"name":"r","type":"folder","children":[{"name":"src","type":"folder","children":[{"name":"x","type":"file"}]}]}'
    expect(() => parseTree(input)).toThrow('root/src/x: invalid size')
  })
})

test('findNode resolves paths', () => {
  expect(findNode(tree, '')).toBe(tree)
  expect(findNode(tree, 'src/components/Button.tsx')?.name).toBe('Button.tsx')
  expect(findNode(tree, 'src/missing')).toBeUndefined()
  expect(findNode(tree, 'package.json/nope')).toBeUndefined()
})

test('subtreeSize sums all files below', () => {
  expect(subtreeSize(tree)).toBe(1836)
  expect(subtreeSize(findNode(tree, 'src')!)).toBe(1536)
})

test('searchTree matches names case-insensitively with full paths', () => {
  expect(searchTree(tree, 'BUTTON').map((r) => r.path)).toEqual(['src/components/Button.tsx'])
  expect(searchTree(tree, 's').map((r) => r.path)).toEqual([
    'src',
    'src/index.ts',
    'src/components',
    'src/components/Button.tsx',
    'package.json',
  ])
  expect(searchTree(tree, '  ')).toEqual([])
})

test('formatSize', () => {
  expect(formatSize(300)).toBe('300 B')
  expect(formatSize(1536)).toBe('1.5 KB')
  expect(formatSize(5 * 1024 * 1024)).toBe('5.0 MB')
})
