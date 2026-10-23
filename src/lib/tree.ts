export type FileNode = { name: string; type: 'file'; size: number }
export type FolderNode = { name: string; type: 'folder'; children: TreeNode[] }
export type TreeNode = FileNode | FolderNode

export function parseTree(json: string): FolderNode {
  let data: unknown
  try {
    data = JSON.parse(json)
  } catch {
    throw new Error('Invalid JSON')
  }
  validateNode(data, 'root')
  if (data.type !== 'folder') throw new Error('root: must be a folder')
  return data
}

function validateNode(value: unknown, at: string): asserts value is TreeNode {
  if (typeof value !== 'object' || value === null) throw new Error(`${at}: expected an object`)
  const node = value as Record<string, unknown>

  if (typeof node.name !== 'string' || node.name === '') throw new Error(`${at}: missing name`)
  if (node.name.includes('/')) throw new Error(`${at}: name cannot contain "/"`)

  if (node.type === 'file') {
    if (typeof node.size !== 'number' || node.size < 0) throw new Error(`${at}: invalid size`)
    return
  }
  if (node.type !== 'folder') throw new Error(`${at}: type must be "file" or "folder"`)
  if (!Array.isArray(node.children)) throw new Error(`${at}: folder needs children`)

  const names = new Set<string>()
  node.children.forEach((child, i) => {
    validateNode(child, `${at}/${(child as { name?: unknown })?.name ?? i}`)
    if (names.has(child.name)) throw new Error(`${at}: duplicate name "${child.name}"`)
    names.add(child.name)
  })
}

export function findNode(root: TreeNode, path: string): TreeNode | undefined {
  let node: TreeNode | undefined = root
  for (const name of path.split('/').filter(Boolean)) {
    if (node?.type !== 'folder') return undefined
    node = node.children.find((child) => child.name === name)
  }
  return node
}

export function subtreeSize(node: TreeNode): number {
  if (node.type === 'file') return node.size
  return node.children.reduce((sum, child) => sum + subtreeSize(child), 0)
}

export function searchTree(root: TreeNode, query: string): string[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  const results: string[] = []
  const walk = (node: TreeNode, path: string) => {
    if (path && node.name.toLowerCase().includes(needle)) results.push(path)
    if (node.type === 'folder') node.children.forEach((child) => walk(child, joinPath(path, child.name)))
  }
  walk(root, '')
  return results
}

export function joinPath(parent: string, name: string): string {
  return parent ? `${parent}/${name}` : name
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
