import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TreeNode } from './lib/tree'

type TreeStore = {
  tree: TreeNode | null
  setTree: (tree: TreeNode | null) => void
}

export const useTreeStore = create<TreeStore>()(
  persist(
    (set) => ({
      tree: null,
      setTree: (tree) => set({ tree }),
    }),
    { name: 'file-tree' },
  ),
)
