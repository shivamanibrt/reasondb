import { useState, useEffect } from 'react'
import {
  Table,
  CaretRight,
  CaretDown,
  Columns,
  Key,
  Hash,
  TextT,
  Calendar,
  ToggleLeft,
  ListNumbers,
  Plus,
  DotsThree,
  MagnifyingGlass,
  Trash,
  PencilSimple,
  Copy,
  Eye,
} from '@phosphor-icons/react'
import { useTableStore, type Table as TableType, type TableColumn } from '@/stores/tableStore'
import { useConnectionStore } from '@/stores/connectionStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// Mock data for demo
const mockTables: TableType[] = [
  {
    id: '1',
    name: 'documents',
    schema: 'public',
    columns: [
      { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
      { name: 'title', type: 'text', nullable: false, primaryKey: false },
      { name: 'content', type: 'text', nullable: true, primaryKey: false },
      { name: 'embedding', type: 'vector(1536)', nullable: true, primaryKey: false },
      { name: 'metadata', type: 'jsonb', nullable: true, primaryKey: false },
      { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false, defaultValue: 'now()' },
    ],
    indexes: [
      { name: 'documents_pkey', columns: ['id'], unique: true, type: 'btree' },
      { name: 'documents_embedding_idx', columns: ['embedding'], unique: false, type: 'vector' },
    ],
    rowCount: 1247,
    sizeBytes: 52428800,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:22:00Z',
    description: 'Main documents table with vector embeddings',
  },
  {
    id: '2',
    name: 'users',
    schema: 'public',
    columns: [
      { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
      { name: 'email', type: 'text', nullable: false, primaryKey: false },
      { name: 'name', type: 'text', nullable: true, primaryKey: false },
      { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false },
    ],
    indexes: [
      { name: 'users_pkey', columns: ['id'], unique: true, type: 'btree' },
      { name: 'users_email_idx', columns: ['email'], unique: true, type: 'btree' },
    ],
    rowCount: 89,
    sizeBytes: 1048576,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
  {
    id: '3',
    name: 'embeddings_cache',
    schema: 'public',
    columns: [
      { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
      { name: 'document_id', type: 'uuid', nullable: false, primaryKey: false },
      { name: 'model', type: 'text', nullable: false, primaryKey: false },
      { name: 'vector', type: 'vector(1536)', nullable: false, primaryKey: false },
      { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false },
    ],
    indexes: [
      { name: 'embeddings_cache_pkey', columns: ['id'], unique: true, type: 'btree' },
      { name: 'embeddings_cache_vector_idx', columns: ['vector'], unique: false, type: 'vector' },
    ],
    rowCount: 3521,
    sizeBytes: 209715200,
    createdAt: '2024-01-12T12:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
]

function getTypeIcon(type: string) {
  const lowerType = type.toLowerCase()
  if (lowerType.includes('uuid') || lowerType.includes('id')) return Key
  if (lowerType.includes('text') || lowerType.includes('varchar') || lowerType.includes('char')) return TextT
  if (lowerType.includes('int') || lowerType.includes('numeric') || lowerType.includes('decimal')) return ListNumbers
  if (lowerType.includes('timestamp') || lowerType.includes('date') || lowerType.includes('time')) return Calendar
  if (lowerType.includes('bool')) return ToggleLeft
  if (lowerType.includes('vector')) return Hash
  return Columns
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

interface TableItemProps {
  table: TableType
  isSelected: boolean
  onSelect: () => void
  onViewData: () => void
}

function TableItem({ table, isSelected, onSelect, onViewData }: TableItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className={cn('border-b border-border/30', isSelected && 'bg-surface-0/50')}>
      {/* Table header */}
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 cursor-pointer',
          'hover:bg-surface-0/50 transition-colors group'
        )}
        onClick={() => {
          onSelect()
          setIsExpanded(!isExpanded)
        }}
      >
        <button className="p-0.5 hover:bg-surface-1 rounded">
          {isExpanded ? (
            <CaretDown size={12} weight="bold" className="text-overlay-0" />
          ) : (
            <CaretRight size={12} weight="bold" className="text-overlay-0" />
          )}
        </button>
        
        <Table 
          size={16} 
          weight={isSelected ? 'fill' : 'duotone'} 
          className={isSelected ? 'text-mauve' : 'text-overlay-1'} 
        />
        
        <span className={cn('flex-1 text-sm truncate', isSelected ? 'text-text font-medium' : 'text-subtext-0')}>
          {table.name}
        </span>
        
        <span className="text-xs text-overlay-0">
          {table.rowCount.toLocaleString()}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewData()
            }}
            className="p-1 hover:bg-surface-1 rounded text-overlay-0 hover:text-text"
            title="View data"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-1 hover:bg-surface-1 rounded text-overlay-0 hover:text-text"
          >
            <DotsThree size={14} weight="bold" />
          </button>
        </div>
      </div>

      {/* Expanded columns */}
      {isExpanded && (
        <div className="pl-8 pr-3 pb-2 space-y-0.5">
          {table.columns.map((col) => (
            <ColumnItem key={col.name} column={col} />
          ))}
          
          {/* Table info */}
          <div className="mt-2 pt-2 border-t border-border/30 flex items-center gap-4 text-xs text-overlay-0">
            <span>{formatBytes(table.sizeBytes)}</span>
            <span>{table.indexes.length} indexes</span>
          </div>
        </div>
      )}
    </div>
  )
}

function ColumnItem({ column }: { column: TableColumn }) {
  const TypeIcon = getTypeIcon(column.type)
  
  return (
    <div className="flex items-center gap-2 py-1 text-xs group">
      <TypeIcon 
        size={12} 
        weight="duotone" 
        className={column.primaryKey ? 'text-yellow' : 'text-overlay-0'} 
      />
      <span className={cn('flex-1', column.primaryKey ? 'text-text font-medium' : 'text-subtext-0')}>
        {column.name}
        {column.primaryKey && <Key size={10} weight="fill" className="inline ml-1 text-yellow" />}
      </span>
      <span className="text-overlay-0 font-mono">{column.type}</span>
      {column.nullable && <span className="text-overlay-0 italic">null</span>}
    </div>
  )
}

export function TableBrowser() {
  const { activeConnectionId } = useConnectionStore()
  const { 
    tables, 
    selectedTableId, 
    setTables, 
    selectTable, 
    isLoadingTables,
    setLoadingTables,
  } = useTableStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Load mock tables when connected
  useEffect(() => {
    if (activeConnectionId) {
      setLoadingTables(true)
      // Simulate API call
      setTimeout(() => {
        setTables(mockTables)
        setLoadingTables(false)
      }, 500)
    } else {
      setTables([])
    }
  }, [activeConnectionId, setTables, setLoadingTables])

  const filteredTables = tables.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewData = (tableId: string) => {
    selectTable(tableId)
    // This would open the document viewer for this table
  }

  if (!activeConnectionId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Table size={48} weight="duotone" className="text-overlay-0 mb-3" />
        <p className="text-sm text-subtext-0">Connect to view tables</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold text-overlay-1 uppercase tracking-wide">
          Tables ({tables.length})
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => setShowCreateDialog(true)}
          title="Create table"
        >
          <Plus size={14} />
        </Button>
      </div>

      {/* Search */}
      <div className="p-2">
        <div className="relative">
          <MagnifyingGlass
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-overlay-0"
          />
          <input
            type="text"
            placeholder="Filter tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-8 pr-3 py-1.5 text-xs rounded-md',
              'bg-surface-0 border border-border',
              'text-text placeholder-overlay-0',
              'focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent'
            )}
          />
        </div>
      </div>

      {/* Table list */}
      <div className="flex-1 overflow-auto">
        {isLoadingTables ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <Table size={32} weight="duotone" className="text-overlay-0 mb-2" />
            <p className="text-xs text-overlay-0">
              {searchQuery ? 'No tables match your search' : 'No tables found'}
            </p>
          </div>
        ) : (
          filteredTables.map((table) => (
            <TableItem
              key={table.id}
              table={table}
              isSelected={selectedTableId === table.id}
              onSelect={() => selectTable(table.id)}
              onViewData={() => handleViewData(table.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
