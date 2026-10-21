import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseTree } from '../lib/tree'
import { useTreeStore } from '../store'

export default function HomePage() {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const setTree = useTreeStore((s) => s.setTree)
  const navigate = useNavigate()

  const load = (json: string) => {
    try {
      setTree(parseTree(json))
      navigate('/tree')
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        aria-label="Tree JSON"
        className="h-64 w-full rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none"
        placeholder='{ "name": "root", "type": "folder", "children": [] }'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center gap-4">
        <button className="rounded-lg bg-violet-600 px-5 py-2 font-medium text-white transition hover:bg-violet-500" onClick={() => load(text)}>
          Load
        </button>
        <label className="cursor-pointer text-cyan-400 hover:text-cyan-300 hover:underline">
          or upload a file
          <input
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) load(await file.text())
            }}
          />
        </label>
      </div>
      {error && <p className="rounded-lg border border-rose-900 bg-rose-950/50 px-3 py-2 font-mono text-sm text-rose-300">{error}</p>}
    </div>
  )
}
