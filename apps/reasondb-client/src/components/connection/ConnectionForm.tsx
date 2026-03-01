import { useState, useCallback, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Switch } from '@/components/ui/Switch'
import { useConnectionStore, type Connection } from '@/stores/connectionStore'
import { CircleNotch, FloppyDisk, Lightning, CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { createClient } from '@/lib/api'

interface ConnectionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editConnection?: Connection
}

interface FormData {
  name: string
  host: string
  port: string
  apiKey: string
  ssl: boolean
  color: string
  group: string
}

interface FormErrors {
  name?: string
  host?: string
  port?: string
}


export function ConnectionForm({ open, onOpenChange, editConnection }: ConnectionFormProps) {
  const { addConnection, updateConnection } = useConnectionStore()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    host: 'localhost',
    port: '4444',
    apiKey: '',
    ssl: false,
    color: '#60a5fa',
    group: '',
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [testMessage, setTestMessage] = useState<string>('')
  const [serverVersion, setServerVersion] = useState<string>('')

  // Reset form when dialog opens or editConnection changes
  useEffect(() => {
    if (open) {
      setFormData({
        name: editConnection?.name ?? '',
        host: editConnection?.host ?? 'localhost',
        port: editConnection?.port?.toString() ?? '4444',
        apiKey: editConnection?.apiKey ?? '',
        ssl: editConnection?.ssl ?? false,
        color: editConnection?.color ?? '#60a5fa',
        group: editConnection?.group ?? '',
      })
      setErrors({})
      setTestResult(null)
      setTestMessage('')
      setServerVersion('')
    }
  }, [open, editConnection])

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Connection name is required'
    }

    if (!formData.host.trim()) {
      newErrors.host = 'Host is required'
    } else if (!/^[a-zA-Z0-9.-]+$/.test(formData.host)) {
      newErrors.host = 'Invalid host format'
    }

    const portNum = parseInt(formData.port, 10)
    if (!formData.port.trim()) {
      newErrors.port = 'Port is required'
    } else if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      newErrors.port = 'Port must be between 1 and 65535'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleTestConnection = async () => {
    if (!validateForm()) return

    setIsTesting(true)
    setTestResult(null)
    setTestMessage('')
    setServerVersion('')

    try {
      const client = createClient({
        host: formData.host,
        port: parseInt(formData.port, 10),
        apiKey: formData.apiKey || undefined,
        useSsl: formData.ssl,
      })

      const result = await client.testConnection()
      
      if (result.success) {
        setTestResult('success')
        setTestMessage('Connection successful!')
        if (result.version) {
          setServerVersion(result.version)
        }
      } else {
        setTestResult('error')
        setTestMessage(result.error || 'Connection failed')
      }
    } catch (error) {
      setTestResult('error')
      setTestMessage(error instanceof Error ? error.message : 'Connection failed')
    } finally {
      setIsTesting(false)
    }
  }

  const handleSave = () => {
    if (!validateForm()) return

    const connectionData = {
      name: formData.name.trim(),
      host: formData.host.trim(),
      port: parseInt(formData.port, 10),
      apiKey: formData.apiKey || undefined,
      ssl: formData.ssl,
      color: formData.color,
      group: formData.group || undefined,
    }

    if (editConnection) {
      updateConnection(editConnection.id, connectionData)
    } else {
      addConnection(connectionData)
    }

    onOpenChange(false)
  }

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    setTestResult(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {editConnection ? 'Edit Connection' : 'New Connection'}
          </DialogTitle>
          <DialogDescription>
            Configure your ReasonDB server connection details.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Connection Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Connection Name</Label>
            <Input
              id="name"
              placeholder="My ReasonDB Server"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={errors.name}
            />
          </div>

          {/* Host and Port */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 grid gap-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                placeholder="localhost"
                value={formData.host}
                onChange={(e) => updateField('host', e.target.value)}
                error={errors.host}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                placeholder="4444"
                value={formData.port}
                onChange={(e) => updateField('port', e.target.value)}
                error={errors.port}
              />
            </div>
          </div>

          {/* API Key */}
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key (Optional)</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter API key for authentication"
              value={formData.apiKey}
              onChange={(e) => updateField('apiKey', e.target.value)}
            />
          </div>

          {/* SSL Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Use SSL/TLS</Label>
              <p className="text-xs text-overlay-0">
                Enable secure connection (recommended for production)
              </p>
            </div>
            <Switch
              checked={formData.ssl}
              onCheckedChange={(checked) => updateField('ssl', checked)}
            />
          </div>

          {/* Test Result */}
          {testResult && (
            <div
              className={`p-3 rounded-md text-sm flex items-start gap-2 ${
                testResult === 'success'
                  ? 'bg-green/10 text-green border border-green/20'
                  : 'bg-red/10 text-red border border-red/20'
              }`}
            >
              {testResult === 'success' ? (
                <CheckCircle size={18} weight="fill" className="shrink-0 mt-0.5" />
              ) : (
                <WarningCircle size={18} weight="fill" className="shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium">{testMessage}</p>
                {serverVersion && (
                  <p className="text-xs opacity-80 mt-0.5">Server version: {serverVersion}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={isTesting}
          >
            {isTesting ? (
              <CircleNotch size={16} className="mr-2 animate-spin" />
            ) : (
              <Lightning size={16} className="mr-2" weight="fill" />
            )}
            Test
          </Button>
          <Button onClick={handleSave}>
            <FloppyDisk size={16} className="mr-2" />
            {editConnection ? 'Update' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
