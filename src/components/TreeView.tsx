import { Link } from 'react-router-dom'
import { joinPath, type FolderNode, type TreeNode } from '../lib/tree'
import { nodeUrl } from '../lib/url'
import { useTreeStore } from '../store'

export default function TreeView({ folder, path }: { folder: FolderNode; path: string }) {
  return (
    <ul className="font-mono text-sm">
      {foldersFirst(folder.children).map((child) => (
        <TreeItem key={child.name} node={child} path={joinPath(path, child.name)} />
      ))}
    </ul>
  )
}

function TreeItem({ node, path }: { node: TreeNode; path: string }) {
  const isOpen = useTreeStore((s) => s.expanded.includes(path))
  const toggle = useTreeStore((s) => s.toggle)

  return (
    <li>
      <div className="flex items-center gap-1 rounded px-1 py-0.5 hover:bg-zinc-800/60">
        {node.type === 'folder' ? (
          <button
            aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${node.name}`}
            className="w-5 text-zinc-500 hover:text-violet-400"
            onClick={() => toggle(path)}
          >
            {isOpen ? '▾' : '▸'}
          </button>
        ) : (
          <span className="w-5" />
        )}
        <Link to={nodeUrl(path)} className="hover:text-violet-300">
          {node.type === 'folder' ? '📁' : '📄'} {node.name}
        </Link>
      </div>
      {node.type === 'folder' && isOpen && (
        <div className="ml-3 border-l border-zinc-800 pl-2">
          <TreeView folder={node} path={path} />
        </div>
      )}
    </li>
  )
}

function foldersFirst(nodes: TreeNode[]): TreeNode[] {
  return nodes.toSorted((a, b) => Number(a.type === 'file') - Number(b.type === 'file'))
}
