import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { nodeUrl } from '../lib/url'

export default function Breadcrumbs({ rootName, path }: { rootName: string; path: string }) {
  const names = path.split('/')

  return (
    <nav aria-label="Breadcrumbs" className="flex flex-wrap items-center gap-1 font-mono text-sm text-zinc-500">
      <Link to="/tree" className="text-cyan-400 hover:underline">
        {rootName}
      </Link>
      {names.map((name, i) => (
        <Fragment key={i}>
          <span>/</span>
          {i === names.length - 1 ? (
            <span className="text-zinc-300">{name}</span>
          ) : (
            <Link to={nodeUrl(names.slice(0, i + 1).join('/'))} className="text-cyan-400 hover:underline">
              {name}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
