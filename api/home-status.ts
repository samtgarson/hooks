import Airtable, { Response, FieldSet } from 'airtable'
import { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import endpoint from 'lib/endpoint'

interface HomeStatusFields extends FieldSet {
  'Home now?': boolean
  Name: string
}

interface RequestBody {
  status: EnteredOrExited;
  user: User;
  secret: string;
}

interface HomeStatusRequest extends VercelRequest {
  body: RequestBody
}

type EnteredOrExited = 'entered' | 'exited'
type User = 'Sam' | 'Gabrielle'

const TABLE_NAME = "Who's Home"
const BASE_ID = 'appXKxno2yVvUZ7S0'

const airtable = new Airtable({
  endpointUrl: process.env.AIRTABLE_ENDPOINT_URL,
  apiKey: process.env.AIRTABLE_API_KEY
})

const base = airtable.base(BASE_ID)(TABLE_NAME)

const webhookUrl = (evt: string) => (process.env.MAKER_URL || '').replace('{event}', evt)

const updateRow = (rows: Response<HomeStatusFields>, user: string, status: EnteredOrExited) => {
  const boolStatus = status === 'entered'
  const row = rows.find(r => r.get('Name') === user)

  if (!row) return false
  return row.patchUpdate({ 'Home now?': boolStatus })
}

const getRows = async () => {
  const rows = await base.select().firstPage()
  return rows
}

const triggerUpdates = async (rows: Response<HomeStatusFields>) => {
  const status = rows.map(r => r.get('Home now?'))
  const evt = status.every(s => !s)
    ? 'home_empty'
    : 'home_full'

	const url = webhookUrl(evt)
  await axios.get(url)
  return evt
}

const updateStatus = async (user: string, status: EnteredOrExited) => {
  const rows = await getRows()
  await updateRow(rows, user, status)
  const event = await triggerUpdates(rows)

  return {
    users: rows.map(r => r.fields),
    event
  }
}

export default endpoint(async (req: HomeStatusRequest, res: VercelResponse) => {
  const { user, status } = req.body

  if (!user || !status) return res
    .status(400)
    .send({ error: 'Missing body' })

  try {
    const response = await updateStatus(user, status)
    return res.status(200).send(response)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
