import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '@/store/ui-store';

// 重置zustand store的状态以确保测试隔离
function resetUIStore() {
  const { sidebarOpen, mobileMenuOpen, activeTab } = useUIStore.getState();
  useUIStore.setState({ sidebarOpen, mobileMenuOpen, activeTab });
}

describe('ui-store', () => {
  beforeEach(() => {
    resetUIStore();
  });

  it('initial state should be correct', () => {
    const state = useUIStore.getState();
    expect(state.sidebarOpen).toBe(true);
    expect(state.mobileMenuOpen).toBe(false);
    expect(state.activeTab).toBe('overview');
  });

  it('toggleSidebar should flip sidebarOpen', () => {
    const { toggleSidebar } = useUIStore.getState();
    toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);
    toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(true);
  });

  it('toggleMobileMenu should flip mobileMenuOpen and closeMobileMenu should set false', () => {
    const { toggleMobileMenu, closeMobileMenu } = useUIStore.getState();
    toggleMobileMenu();
    expect(useUIStore.getState().mobileMenuOpen).toBe(true);
    closeMobileMenu();
    expect(useUIStore.getState().mobileMenuOpen).toBe(false);
  });

  it('setActiveTab should update activeTab', () => {
    const { setActiveTab } = useUIStore.getState();
    setActiveTab('details');
    expect(useUIStore.getState().activeTab).toBe('details');
  });
});
