import Airtable, { Response, FieldSet } from 'airtable'
import { NowRequest, NowResponse } from '@now/node'
import axios from 'axios'
import logger from './_utils/logger'

interface HomeStatusFields extends FieldSet {
  'Home now?': boolean
  Name: string
}

interface RequestBody {
  status: EnteredOrExited;
  user: User;
  secret: string;
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

module.exports = logger(async (req: NowRequest, res: NowResponse) => {
  const { user, secret, status } = req.body as RequestBody || {}

  if (secret !== process.env.WEBHOOK_SECRET) return res
    .status(401)
    .send({ error: 'Not Authorized' })

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
