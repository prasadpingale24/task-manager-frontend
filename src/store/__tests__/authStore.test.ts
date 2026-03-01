import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';
import { UserResponse } from '../../types/api';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('should set authentication', () => {
    const user: UserResponse = {
      id: '1',
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'MANAGER',
    };
    const token = 'test-token';

    useAuthStore.getState().setAuth(token, user);

    const state = useAuthStore.getState();
    expect(state.token).toBe(token);
    expect(state.user).toEqual(user);
  });

  it('should logout', () => {
    const user: UserResponse = {
      id: '1',
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'MANAGER',
    };
    useAuthStore.getState().setAuth('token', user);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });
});
