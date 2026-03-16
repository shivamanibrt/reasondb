import { invoke } from '@tauri-apps/api/core'

/**
 * Store an API key for a connection in the OS credential store.
 * macOS  → Keychain
 * Windows → Credential Manager
 * Linux  → Secret Service / keyring
 */
export async function storeApiKey(connectionId: string, apiKey: string): Promise<void> {
  await invoke<void>('store_api_key', { connectionId, apiKey })
}

/**
 * Retrieve a stored API key, or null if none has been saved for this connection.
 */
export async function getApiKey(connectionId: string): Promise<string | null> {
  return invoke<string | null>('get_api_key', { connectionId })
}

/**
 * Remove the stored API key for a connection (e.g. when the connection is deleted).
 */
export async function deleteApiKey(connectionId: string): Promise<void> {
  await invoke<void>('delete_api_key', { connectionId })
}
