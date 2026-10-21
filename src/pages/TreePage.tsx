import { Link, useSearchParams } from 'react-router-dom'
import TreeView from '../components/TreeView'
import { searchTree } from '../lib/tree'
import { nodeUrl } from '../lib/url'
import { useTreeStore } from '../store'

export default function TreePage() {
  const tree = useTreeStore((s) => s.tree)!
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const results = searchTree(tree, query)

  return (
    <div className="space-y-4">
      <input
        type="search"
        aria-label="Search"
        placeholder="Search by name…"
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-2 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none"
        value={query}
        onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
      />
      {query.trim() ? (
        <ul className="space-y-1 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-lg shadow-black/30">
          {results.length === 0 && <li className="text-zinc-500">No results</li>}
          {results.map(({ path }) => (
            <li key={path}>
              <Link to={nodeUrl(path)} className="font-mono text-sm text-cyan-400 hover:text-cyan-300 hover:underline">
                {tree.name}/{path}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-lg shadow-black/30">
          <TreeView folder={tree} path="" />
        </div>
      )}
    </div>
  )
}
