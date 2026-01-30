import { useState } from 'react'
import {
  Plus,
  Trash,
  Key,
  CaretUp,
  CaretDown,
} from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Switch } from '@/components/ui/Switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { useTableStore, type TableColumn } from '@/stores/tableStore'
import { cn } from '@/lib/utils'

interface CreateTableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DATA_TYPES = [
  { value: 'uuid', label: 'UUID' },
  { value: 'text', label: 'Text' },
  { value: 'varchar(255)', label: 'Varchar(255)' },
  { value: 'integer', label: 'Integer' },
  { value: 'bigint', label: 'BigInt' },
  { value: 'numeric', label: 'Numeric' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'timestamp', label: 'Timestamp' },
  { value: 'date', label: 'Date' },
  { value: 'jsonb', label: 'JSONB' },
  { value: 'vector(1536)', label: 'Vector(1536)' },
  { value: 'vector(768)', label: 'Vector(768)' },
  { value: 'vector(384)', label: 'Vector(384)' },
]

interface ColumnDefinition {
  id: string
  name: string
  type: string
  nullable: boolean
  primaryKey: boolean
  defaultValue: string
}

export function CreateTableDialog({ open, onOpenChange }: CreateTableDialogProps) {
  const { addTable } = useTableStore()
  
  const [tableName, setTableName] = useState('')
  const [schema, setSchema] = useState('public')
  const [columns, setColumns] = useState<ColumnDefinition[]>([
    {
      id: crypto.randomUUID(),
      name: 'id',
      type: 'uuid',
      nullable: false,
      primaryKey: true,
      defaultValue: 'gen_random_uuid()',
    },
  ])
  const [isCreating, setIsCreating] = useState(false)

  const addColumn = () => {
    setColumns([
      ...columns,
      {
        id: crypto.randomUUID(),
        name: '',
        type: 'text',
        nullable: true,
        primaryKey: false,
        defaultValue: '',
      },
    ])
  }

  const updateColumn = (id: string, updates: Partial<ColumnDefinition>) => {
    setColumns(
      columns.map((col) => (col.id === id ? { ...col, ...updates } : col))
    )
  }

  const removeColumn = (id: string) => {
    setColumns(columns.filter((col) => col.id !== id))
  }

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= columns.length) return
    
    const newColumns = [...columns]
    const [removed] = newColumns.splice(index, 1)
    newColumns.splice(newIndex, 0, removed)
    setColumns(newColumns)
  }

  const handleCreate = async () => {
    if (!tableName.trim() || columns.length === 0) return
    
    setIsCreating(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const newTable = {
      id: crypto.randomUUID(),
      name: tableName.trim().toLowerCase().replace(/\s+/g, '_'),
      schema,
      columns: columns.map((col) => ({
        name: col.name,
        type: col.type,
        nullable: col.nullable,
        primaryKey: col.primaryKey,
        defaultValue: col.defaultValue || undefined,
      })),
      indexes: columns
        .filter((col) => col.primaryKey)
        .map((col) => ({
          name: `${tableName}_${col.name}_pkey`,
          columns: [col.name],
          unique: true,
          type: 'btree' as const,
        })),
      rowCount: 0,
      sizeBytes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    addTable(newTable)
    setIsCreating(false)
    onOpenChange(false)
    
    // Reset form
    setTableName('')
    setColumns([
      {
        id: crypto.randomUUID(),
        name: 'id',
        type: 'uuid',
        nullable: false,
        primaryKey: true,
        defaultValue: 'gen_random_uuid()',
      },
    ])
  }

  const isValid = tableName.trim() && columns.every((col) => col.name.trim())

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Table</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6 py-4">
          {/* Table name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tableName">Table Name</Label>
              <Input
                id="tableName"
                placeholder="my_table"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schema">Schema</Label>
              <Select value={schema} onValueChange={setSchema}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">public</SelectItem>
                  <SelectItem value="private">private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Columns */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Columns</Label>
              <Button size="sm" variant="outline" onClick={addColumn} className="gap-1">
                <Plus size={14} />
                Add Column
              </Button>
            </div>

            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-[1fr_140px_80px_80px_120px_60px] gap-2 px-2 text-xs font-medium text-overlay-0">
                <span>Name</span>
                <span>Type</span>
                <span>Nullable</span>
                <span>Primary</span>
                <span>Default</span>
                <span />
              </div>

              {/* Columns */}
              {columns.map((col, index) => (
                <div
                  key={col.id}
                  className={cn(
                    'grid grid-cols-[1fr_140px_80px_80px_120px_60px] gap-2 items-center',
                    'p-2 rounded-md bg-surface-0/50 border border-border'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {col.primaryKey && <Key size={14} className="text-yellow shrink-0" />}
                    <Input
                      value={col.name}
                      onChange={(e) => updateColumn(col.id, { name: e.target.value })}
                      placeholder="column_name"
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <Select
                    value={col.type}
                    onValueChange={(value) => updateColumn(col.id, { type: value })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DATA_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex justify-center">
                    <Switch
                      checked={col.nullable}
                      onCheckedChange={(checked) => updateColumn(col.id, { nullable: checked })}
                      disabled={col.primaryKey}
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <Switch
                      checked={col.primaryKey}
                      onCheckedChange={(checked) =>
                        updateColumn(col.id, {
                          primaryKey: checked,
                          nullable: checked ? false : col.nullable,
                        })
                      }
                    />
                  </div>
                  
                  <Input
                    value={col.defaultValue}
                    onChange={(e) => updateColumn(col.id, { defaultValue: e.target.value })}
                    placeholder="default"
                    className="h-8 text-xs font-mono"
                  />
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveColumn(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-surface-1 rounded text-overlay-0 hover:text-text disabled:opacity-30"
                    >
                      <CaretUp size={12} />
                    </button>
                    <button
                      onClick={() => moveColumn(index, 'down')}
                      disabled={index === columns.length - 1}
                      className="p-1 hover:bg-surface-1 rounded text-overlay-0 hover:text-text disabled:opacity-30"
                    >
                      <CaretDown size={12} />
                    </button>
                    <button
                      onClick={() => removeColumn(col.id)}
                      disabled={columns.length === 1}
                      className="p-1 hover:bg-surface-1 rounded text-overlay-0 hover:text-red disabled:opacity-30"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>SQL Preview</Label>
            <pre className="p-3 bg-surface-0 rounded-md text-xs font-mono text-subtext-0 overflow-auto max-h-32">
              {generateCreateSQL(tableName || 'table_name', schema, columns)}
            </pre>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!isValid || isCreating}>
            {isCreating ? 'Creating...' : 'Create Table'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function generateCreateSQL(
  name: string,
  schema: string,
  columns: ColumnDefinition[]
): string {
  const columnDefs = columns
    .map((col) => {
      let def = `  ${col.name} ${col.type}`
      if (col.primaryKey) def += ' PRIMARY KEY'
      if (!col.nullable && !col.primaryKey) def += ' NOT NULL'
      if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`
      return def
    })
    .join(',\n')

  return `CREATE TABLE ${schema}.${name} (\n${columnDefs}\n);`
}
