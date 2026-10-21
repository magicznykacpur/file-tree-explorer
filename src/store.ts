import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FolderNode } from './lib/tree'

type TreeStore = {
  tree: FolderNode | null
  expanded: string[]
  setTree: (tree: FolderNode | null) => void
  toggle: (path: string) => void
}

export const useTreeStore = create<TreeStore>()(
  persist(
    (set) => ({
      tree: null,
      expanded: [],
      setTree: (tree) => set({ tree, expanded: [] }),
      toggle: (path) =>
        set(({ expanded }) => ({
          expanded: expanded.includes(path) ? expanded.filter((p) => p !== path) : [...expanded, path],
        })),
    }),
    { name: 'file-tree' },
  ),
)
