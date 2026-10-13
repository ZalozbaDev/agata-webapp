import axios from 'axios'
import SERVER_CONFIG from '../config/server'

const ADMIN_TOKEN_KEY = 'agata.adminToken'

export type PersonaVisibility = 'public' | 'private'

export type AdminPersona = {
  id: string
  name: string
  slug: string
  prompt: string
  token: string
  topK: number
  webResultCount: number
  hasImage: boolean
  tag: string
  visibility: PersonaVisibility
  allowExternalDelete: boolean
  documentCount: number
  createdAt: string
  updatedAt: string
}

export type PublicPersona = {
  name: string
  tag: string
  visibility: 'public'
  canUpload: boolean
  canDelete: boolean
  documentCount: number
}

export type PersonaDocument = {
  id: string
  filename: string
  mimeType: string
  size: number
  uploadedAt: string
}

export type PersonaFormValues = {
  name: string
  slug: string
  prompt: string
  token: string
  topK: number
  webResultCount: number
  tag: string
  visibility: PersonaVisibility
  allowExternalDelete: boolean
}

export function getAdminToken(): string {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? ''
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token.trim())
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
}

export function personaAccessPath(token: string): string {
  return `${window.location.origin}/persona/${encodeURIComponent(token)}`
}

export function personaWebviewPath(slug: string): string {
  const url = new URL('/', window.location.origin)
  url.searchParams.set('persona', slug)
  return url.toString()
}

export function personaImageUrl(key: string): string {
  const base = String(SERVER_CONFIG.BASE_URL ?? '').replace(/\/$/, '')
  return `${base}/api/personas/${encodeURIComponent(key)}/image`
}

export function validatePersonaForm(input: PersonaFormValues): string | null {
  const name = input.name.trim()
  if (!name) return 'Name ist ein Pflichtfeld.'
  if (name.length > 120) return 'Name darf höchstens 120 Zeichen haben.'
  const slug = input.slug.trim().toLowerCase()
  if (!slug) return 'Der Kurzname ist ein Pflichtfeld.'
  if (!/^[a-z0-9][a-z0-9-]{0,30}[a-z0-9]$/.test(slug)) {
    return 'Der Kurzname muss 2 bis 32 Zeichen haben und darf nur Buchstaben, Ziffern und Bindestriche enthalten.'
  }
  if (input.prompt.length > 20000) return 'Prompt darf höchstens 20000 Zeichen haben.'
  if (!Number.isInteger(input.topK) || input.topK < 1 || input.topK > 50) {
    return 'RAG-Ergebnisse müssen eine ganze Zahl zwischen 1 und 50 sein.'
  }
  if (
    !Number.isInteger(input.webResultCount) ||
    input.webResultCount < 0 ||
    input.webResultCount > 20
  ) {
    return 'Web-Ergebnisse müssen eine ganze Zahl zwischen 0 und 20 sein.'
  }
  const token = input.token.trim()
  if (token && !/^[A-Za-z0-9_-]{16,128}$/.test(token)) {
    return 'Der Token muss 16 bis 128 Zeichen haben und darf nur Buchstaben, Ziffern, _ und - enthalten.'
  }
  if (input.tag.trim().length > 80) return 'Tag darf höchstens 80 Zeichen haben.'
  if (input.visibility !== 'public' && input.visibility !== 'private') {
    return 'Sichtbarkeit muss öffentlich oder privat sein.'
  }
  return null
}

export function personaErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string } | undefined
    if (data?.error) return data.error
    if (error.response?.status === 401) return 'Nicht autorisiert.'
    if (error.response?.status === 403) return 'Diese Persona ist privat.'
    if (!error.response) return 'Der Server ist nicht erreichbar.'
  }
  return fallback
}

function adminApi() {
  return axios.create({
    baseURL: SERVER_CONFIG.BASE_URL,
    timeout: 120000,
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  })
}

function publicApi() {
  return axios.create({
    baseURL: SERVER_CONFIG.BASE_URL,
    timeout: 120000,
  })
}

export async function fetchAdminPersonas(): Promise<AdminPersona[]> {
  const response = await adminApi().get<{ personas: AdminPersona[] }>(
    '/api/admin/personas',
  )
  return response.data.personas
}

export async function createPersona(
  values: PersonaFormValues,
): Promise<AdminPersona> {
  const response = await adminApi().post<{ persona: AdminPersona }>(
    '/api/admin/personas',
    {
      name: values.name.trim(),
      slug: values.slug.trim().toLowerCase(),
      prompt: values.prompt,
      token: values.token.trim() || undefined,
      topK: values.topK,
      webResultCount: values.webResultCount,
      tag: values.tag.trim(),
      visibility: values.visibility,
      allowExternalDelete: values.allowExternalDelete,
    },
  )
  return response.data.persona
}

export async function updatePersona(
  id: string,
  values: PersonaFormValues,
): Promise<AdminPersona> {
  const response = await adminApi().put<{ persona: AdminPersona }>(
    `/api/admin/personas/${id}`,
    {
      name: values.name.trim(),
      slug: values.slug.trim().toLowerCase(),
      prompt: values.prompt,
      token: values.token.trim(),
      topK: values.topK,
      webResultCount: values.webResultCount,
      tag: values.tag.trim(),
      visibility: values.visibility,
      allowExternalDelete: values.allowExternalDelete,
    },
  )
  return response.data.persona
}

export async function deletePersona(id: string): Promise<void> {
  await adminApi().delete(`/api/admin/personas/${id}`)
}

export async function uploadPersonaImage(
  id: string,
  file: File,
): Promise<AdminPersona> {
  const body = new FormData()
  body.append('file', file)
  const response = await adminApi().post<{ persona: AdminPersona }>(
    `/api/admin/personas/${encodeURIComponent(id)}/image`,
    body,
  )
  return response.data.persona
}

export async function deletePersonaImage(id: string): Promise<AdminPersona> {
  const response = await adminApi().delete<{ persona: AdminPersona }>(
    `/api/admin/personas/${encodeURIComponent(id)}/image`,
  )
  return response.data.persona
}

export async function generatePersonaToken(): Promise<string> {
  const response = await adminApi().post<{ token: string }>(
    '/api/admin/personas/token',
  )
  return response.data.token
}

export async function fetchAdminPersona(id: string): Promise<AdminPersona> {
  const response = await adminApi().get<{ persona: AdminPersona }>(
    `/api/admin/personas/${id}`,
  )
  return response.data.persona
}

export async function fetchAdminDocuments(id: string): Promise<PersonaDocument[]> {
  const response = await adminApi().get<{ documents: PersonaDocument[] }>(
    `/api/admin/personas/${id}/documents`,
  )
  return response.data.documents
}

export async function uploadAdminDocument(
  id: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<PersonaDocument> {
  const form = new FormData()
  form.append('file', file)
  const response = await adminApi().post<{ document: PersonaDocument }>(
    `/api/admin/personas/${id}/documents`,
    form,
    {
      onUploadProgress: event => {
        if (!event.total) return
        onProgress(Math.round((event.loaded / event.total) * 100))
      },
    },
  )
  return response.data.document
}

export async function deleteAdminDocument(
  personaId: string,
  documentId: string,
): Promise<void> {
  await adminApi().delete(
    `/api/admin/personas/${personaId}/documents/${documentId}`,
  )
}

export async function askAdminPersona(
  id: string,
  message: string,
): Promise<string> {
  const response = await adminApi().post<{ answer?: string; message?: string }>(
    `/api/admin/personas/${id}/chat`,
    { message },
  )
  return response.data.answer || response.data.message || ''
}

export async function fetchPublicPersona(token: string): Promise<PublicPersona> {
  const response = await publicApi().get<{ persona: PublicPersona }>(
    `/api/personas/${encodeURIComponent(token)}`,
  )
  return response.data.persona
}

export async function fetchPublicDocuments(
  token: string,
): Promise<PersonaDocument[]> {
  const response = await publicApi().get<{ documents: PersonaDocument[] }>(
    `/api/personas/${encodeURIComponent(token)}/documents`,
  )
  return response.data.documents
}

export async function uploadPublicDocument(
  token: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<PersonaDocument> {
  const form = new FormData()
  form.append('file', file)
  const response = await publicApi().post<{ document: PersonaDocument }>(
    `/api/personas/${encodeURIComponent(token)}/documents`,
    form,
    {
      onUploadProgress: event => {
        if (!event.total) return
        onProgress(Math.round((event.loaded / event.total) * 100))
      },
    },
  )
  return response.data.document
}

export async function deletePublicDocument(
  token: string,
  documentId: string,
): Promise<void> {
  await publicApi().delete(
    `/api/personas/${encodeURIComponent(token)}/documents/${documentId}`,
  )
}

export async function askPublicPersona(
  token: string,
  message: string,
): Promise<string> {
  const response = await publicApi().post<{ answer?: string; message?: string }>(
    `/api/personas/${encodeURIComponent(token)}/chat`,
    { message },
  )
  return response.data.answer || response.data.message || ''
}
