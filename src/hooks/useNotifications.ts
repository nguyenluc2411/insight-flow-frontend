"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notificationService, type UpsertPreferenceRequest } from "@/services/notification.service"
import { useAuthStore } from "@/stores/auth.store"

export function useNotifications(params?: { unreadOnly?: boolean; type?: string; page?: number; size?: number }) {
  const tenantId = useAuthStore((s) => s.tenant?.id)
  return useQuery({
    queryKey: ["notifications", tenantId, params],
    queryFn: () => notificationService.getNotifications(params),
    enabled: !!tenantId,
    staleTime: 1 * 60 * 1000,
  })
}

export function useUnreadCount() {
  const tenantId = useAuthStore((s) => s.tenant?.id)
  return useQuery({
    queryKey: ["notifications-unread", tenantId],
    queryFn: () => notificationService.getUnreadCount(),
    enabled: !!tenantId,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

export function useMarkRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] })
    },
  })
}

export function useMarkAllRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] })
    },
  })
}

export function useNotificationPreferences() {
  const tenantId = useAuthStore((s) => s.tenant?.id)
  return useQuery({
    queryKey: ["notification-preferences", tenantId],
    queryFn: () => notificationService.getPreferences(),
    enabled: !!tenantId,
    staleTime: 10 * 60 * 1000,
  })
}

export function useUpsertPreference() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpsertPreferenceRequest) => notificationService.upsertPreference(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] })
    },
  })
}
