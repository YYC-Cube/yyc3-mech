import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '@/store/user-store';

function resetUserStore() {
  const { preferences } = useUserStore.getState();
  useUserStore.setState({ preferences });
}

describe('user-store', () => {
  beforeEach(() => {
    resetUserStore();
  });

  it('initial preferences should be correct', () => {
    const { preferences } = useUserStore.getState();
    expect(preferences.theme).toBe('dark');
    expect(preferences.language).toBe('zh');
    expect(preferences.soundEnabled).toBe(true);
    expect(preferences.soundVolume).toBeCloseTo(0.5);
  });

  it('setTheme should update theme', () => {
    const { setTheme } = useUserStore.getState();
    setTheme('light');
    expect(useUserStore.getState().preferences.theme).toBe('light');
  });

  it('setLanguage should update language', () => {
    const { setLanguage } = useUserStore.getState();
    setLanguage('en');
    expect(useUserStore.getState().preferences.language).toBe('en');
  });

  it('setSoundEnabled should update flag', () => {
    const { setSoundEnabled } = useUserStore.getState();
    setSoundEnabled(false);
    expect(useUserStore.getState().preferences.soundEnabled).toBe(false);
  });

  it('setSoundVolume should update volume', () => {
    const { setSoundVolume } = useUserStore.getState();
    setSoundVolume(0.8);
    expect(useUserStore.getState().preferences.soundVolume).toBeCloseTo(0.8);
  });
});
