import { z } from 'zod'

export const mediaFolderSchema = z.enum(['evidencias', 'perfiles', 'storage'])

export type MediaFolder = z.infer<typeof mediaFolderSchema>

export interface MediaUploadResponse {
  storageId: string
  url: string
  optimizedUrl: string
}

export interface StorageRecord {
  _id?: string
  filename: string
  url: string
  optimizedUrl?: string
}
