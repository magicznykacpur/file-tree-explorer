import { Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Routes>
        <Route path="/" element={<h1 className="text-2xl font-bold">FileTree Explorer</h1>} />
        <Route path="/tree" element={<p>Tree</p>} />
        <Route path="/tree/*" element={<p>Node details</p>} />
      </Routes>
    </main>
  )
}
