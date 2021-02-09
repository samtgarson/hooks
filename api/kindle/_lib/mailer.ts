import { SES } from 'aws-sdk'
import nodemailer from 'nodemailer'

const sesClient = new SES({
	region: 'eu-west-2',
	credentials: {
		accessKeyId: process.env.ROBOT_IAM_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.ROBOT_IAM_SECRET_ACCESS_KEY as string
	}
})

const defaultMailer = nodemailer.createTransport({ SES: sesClient })
const recipientEmail = process.env.KINDLE_RECIPIENT
const senderEmail = process.env.KINDLE_SENDER

if (!recipientEmail) throw new Error('Missing RECIPIENT')
if (!senderEmail) throw new Error('Missing SENDER')

export class Mailer {
	constructor (
		private transport = defaultMailer,
		private sender = senderEmail,
		private recipient = recipientEmail
	) {}

	async sendEmail (title: string, body: string): Promise<void> {
		return this.transport.sendMail({
			to: this.recipient,
			from: this.sender,
			subject: 'convert',
			attachments: [
				{
					filename: title,
					content: body,
					contentType: 'text/html'
				}
			]
		})
	}
}

