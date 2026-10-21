import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { parseTree } from '../lib/tree'
import { useTreeStore } from '../store'

const json = JSON.stringify({
  name: 'root',
  type: 'folder',
  children: [
    {
      name: 'src',
      type: 'folder',
      children: [
        { name: 'index.ts', type: 'file', size: 1024 },
        { name: 'components', type: 'folder', children: [{ name: 'Button.tsx', type: 'file', size: 512 }] },
      ],
    },
    { name: 'my file#1.txt', type: 'file', size: 300 },
  ],
})

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>,
  )
}

beforeEach(() => useTreeStore.setState({ tree: null, expanded: [] }))

test('loads pasted JSON and shows the tree', async () => {
  renderAt('/')
  await userEvent.click(screen.getByLabelText('Tree JSON'))
  await userEvent.paste(json)
  await userEvent.click(screen.getByRole('button', { name: 'Load' }))
  expect(screen.getByRole('link', { name: '📁 src' })).toBeInTheDocument()
})

test('shows validation errors', async () => {
  renderAt('/')
  await userEvent.type(screen.getByLabelText('Tree JSON'), 'nope')
  await userEvent.click(screen.getByRole('button', { name: 'Load' }))
  expect(screen.getByText('Invalid JSON')).toBeInTheDocument()
})

test('redirects to home without a tree', () => {
  renderAt('/tree')
  expect(screen.getByLabelText('Tree JSON')).toBeInTheDocument()
})

describe('with a tree', () => {
  beforeEach(() => useTreeStore.setState({ tree: parseTree(json) }))

  test('expands and collapses folders', async () => {
    renderAt('/tree')
    expect(screen.queryByText(/index\.ts/)).not.toBeInTheDocument()
    await userEvent.click(screen.getByLabelText('Expand src'))
    expect(screen.getByText(/index\.ts/)).toBeInTheDocument()
    await userEvent.click(screen.getByLabelText('Collapse src'))
    expect(screen.queryByText(/index\.ts/)).not.toBeInTheDocument()
  })

  test('lists folders before files', () => {
    useTreeStore.setState({
      tree: parseTree('{"name":"r","type":"folder","children":[{"name":"a.txt","type":"file","size":1},{"name":"lib","type":"folder","children":[]}]}'),
    })
    renderAt('/tree')
    expect(screen.getAllByRole('link').map((l) => l.textContent)).toEqual(['FileTree Explorer', '📁 lib', '📄 a.txt'])
  })

  test('restores search results from the URL', () => {
    renderAt('/tree?q=button')
    expect(screen.getByRole('link', { name: 'root/src/components/Button.tsx' })).toBeInTheDocument()
  })

  test('shows file details', () => {
    renderAt('/tree/src/components/Button.tsx')
    expect(screen.getByRole('heading', { name: 'Button.tsx' })).toBeInTheDocument()
    expect(screen.getByText('root/src/components/Button.tsx')).toBeInTheDocument()
    expect(screen.getByText('512 B')).toBeInTheDocument()
  })

  test('shows folder details with child links', async () => {
    renderAt('/tree/src')
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('1.5 KB')).toBeInTheDocument()
    await userEvent.click(screen.getByLabelText('Expand components'))
    expect(screen.getByRole('link', { name: '📄 Button.tsx' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('link', { name: '📁 components' }))
    expect(screen.getByRole('heading', { name: 'components' })).toBeInTheDocument()
  })

  test('handles names that need encoding', async () => {
    renderAt('/tree?q=%23')
    await userEvent.click(screen.getByRole('link', { name: 'root/my file#1.txt' }))
    expect(screen.getByRole('heading', { name: 'my file#1.txt' })).toBeInTheDocument()
  })

  test('navigates up via breadcrumbs', async () => {
    renderAt('/tree/src/components/Button.tsx')
    const crumbs = within(screen.getByRole('navigation', { name: 'Breadcrumbs' }))
    expect(crumbs.getAllByRole('link').map((l) => l.textContent)).toEqual(['root', 'src', 'components'])
    await userEvent.click(crumbs.getByRole('link', { name: 'src' }))
    expect(screen.getByRole('heading', { name: 'src' })).toBeInTheDocument()
  })

  test('shows not found for unknown paths', () => {
    renderAt('/tree/nope')
    expect(screen.getByText('Node not found: nope')).toBeInTheDocument()
  })
})
