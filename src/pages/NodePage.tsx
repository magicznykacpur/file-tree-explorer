import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import TreeView from '../components/TreeView'
import { findNode, formatSize, joinPath, subtreeSize } from '../lib/tree'
import { useTreeStore } from '../store'

export default function NodePage() {
  const tree = useTreeStore((s) => s.tree)!
  const path = useParams()['*'] ?? ''
  const node = findNode(tree, path)

  if (!node) {
    return (
      <div className="space-y-2">
        <p>Node not found: {path}</p>
        <Link to="/tree" className="text-cyan-400 hover:underline">Back to tree</Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs rootName={tree.name} path={path} />
      <h2 className="text-2xl font-semibold text-zinc-50">{node.name}</h2>
      <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-lg shadow-black/30">
        <dt className="text-zinc-500">Path</dt>
        <dd className="font-mono text-violet-300">{joinPath(tree.name, path)}</dd>
        {node.type === 'file' ? (
          <>
            <dt className="text-zinc-500">Size</dt>
            <dd>{formatSize(node.size)}</dd>
          </>
        ) : (
          <>
            <dt className="text-zinc-500">Children</dt>
            <dd>{node.children.length}</dd>
            <dt className="text-zinc-500">Total size</dt>
            <dd>{formatSize(subtreeSize(node))}</dd>
          </>
        )}
      </dl>
      {node.type === 'folder' && node.children.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-lg shadow-black/30">
          <TreeView folder={node} path={path} />
        </div>
      )}
    </div>
  )
}
