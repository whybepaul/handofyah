const LISTMONK_URL = process.env.LISTMONK_URL
const LISTMONK_API_USER = process.env.LISTMONK_API_USER
const LISTMONK_API_PASSWORD = process.env.LISTMONK_API_PASSWORD
const LISTMONK_LIST_ID = process.env.LISTMONK_LIST_ID

async function listmonkFetch(path: string, options: RequestInit = {}) {
  if (!LISTMONK_URL || !LISTMONK_API_USER || !LISTMONK_API_PASSWORD) {
    throw new Error(
      'Listmonk is not configured. Set LISTMONK_URL, LISTMONK_API_USER, and LISTMONK_API_PASSWORD.'
    )
  }

  const credentials = Buffer.from(`${LISTMONK_API_USER}:${LISTMONK_API_PASSWORD}`).toString('base64')

  const response = await fetch(`${LISTMONK_URL}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Listmonk API error: ${response.status}`)
  }

  return response.json()
}

export async function addSubscriber(email: string, name?: string) {
  return listmonkFetch('/subscribers', {
    method: 'POST',
    body: JSON.stringify({
      email,
      name: name || '',
      lists: [Number(LISTMONK_LIST_ID)],
      status: 'enabled',
    }),
  })
}

export async function sendTransactionalEmail(
  email: string,
  templateId: number,
  data: Record<string, unknown>
) {
  return listmonkFetch('/tx', {
    method: 'POST',
    body: JSON.stringify({
      subscriber_email: email,
      template_id: templateId,
      data,
    }),
  })
}
