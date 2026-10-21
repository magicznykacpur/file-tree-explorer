import { Link, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NodePage from './pages/NodePage'
import TreePage from './pages/TreePage'
import { useTreeStore } from './store'

function RequireTree() {
  const tree = useTreeStore((s) => s.tree)
  return tree ? <Outlet /> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link
        to="/"
        className="mb-8 block bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent"
      >
        FileTree Explorer
      </Link>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<RequireTree />}>
          <Route path="/tree" element={<TreePage />} />
          <Route path="/tree/*" element={<NodePage />} />
        </Route>
      </Routes>
    </main>
  )
}
