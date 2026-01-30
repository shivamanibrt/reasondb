import { describe, it, expect, beforeEach } from 'vitest'
import { useUiStore } from './uiStore'

describe('uiStore', () => {
  beforeEach(() => {
    // Reset to default state
    useUiStore.setState({
      theme: 'system',
      sidebarOpen: true,
      sidebarWidth: 30,
    })
  })

  describe('theme', () => {
    it('should have default theme as system', () => {
      expect(useUiStore.getState().theme).toBe('system')
    })

    it('should set theme to dark', () => {
      useUiStore.getState().setTheme('dark')
      expect(useUiStore.getState().theme).toBe('dark')
    })

    it('should set theme to light', () => {
      useUiStore.getState().setTheme('light')
      expect(useUiStore.getState().theme).toBe('light')
    })

    it('should set theme back to system', () => {
      useUiStore.getState().setTheme('dark')
      useUiStore.getState().setTheme('system')
      expect(useUiStore.getState().theme).toBe('system')
    })
  })

  describe('sidebar', () => {
    it('should have sidebar open by default', () => {
      expect(useUiStore.getState().sidebarOpen).toBe(true)
    })

    it('should toggle sidebar closed', () => {
      useUiStore.getState().toggleSidebar()
      expect(useUiStore.getState().sidebarOpen).toBe(false)
    })

    it('should toggle sidebar open', () => {
      useUiStore.getState().toggleSidebar()
      useUiStore.getState().toggleSidebar()
      expect(useUiStore.getState().sidebarOpen).toBe(true)
    })

    it('should have default sidebar width of 30', () => {
      expect(useUiStore.getState().sidebarWidth).toBe(30)
    })

    it('should set sidebar width', () => {
      useUiStore.getState().setSidebarWidth(40)
      expect(useUiStore.getState().sidebarWidth).toBe(40)
    })

    it('should accept various sidebar widths', () => {
      useUiStore.getState().setSidebarWidth(20)
      expect(useUiStore.getState().sidebarWidth).toBe(20)

      useUiStore.getState().setSidebarWidth(35)
      expect(useUiStore.getState().sidebarWidth).toBe(35)
    })
  })

  describe('state independence', () => {
    it('should not affect other state when changing theme', () => {
      useUiStore.getState().setSidebarWidth(25)
      useUiStore.getState().toggleSidebar()
      
      useUiStore.getState().setTheme('dark')
      
      expect(useUiStore.getState().sidebarWidth).toBe(25)
      expect(useUiStore.getState().sidebarOpen).toBe(false)
    })

    it('should not affect other state when toggling sidebar', () => {
      useUiStore.getState().setTheme('light')
      useUiStore.getState().setSidebarWidth(35)
      
      useUiStore.getState().toggleSidebar()
      
      expect(useUiStore.getState().theme).toBe('light')
      expect(useUiStore.getState().sidebarWidth).toBe(35)
    })
  })
})
