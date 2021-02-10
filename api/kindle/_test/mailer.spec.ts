import Mail from 'nodemailer/lib/mailer'
import { Mailer } from '../_lib/mailer'

describe('Mailer', () => {
  const mockTransport = { sendMail: jest.fn() } as unknown as jest.Mocked<Mail>

  it('instantiates with default dependencies', () => {
    const mailer = new Mailer()

    expect(mailer['transport']).toBeInstanceOf(Mail)
    expect(mailer['sender']).toEqual(process.env.KINDLE_SENDER)
    expect(mailer['recipient']).toEqual(process.env.KINDLE_RECIPIENT)
  })

  it('sends a mail', () => {
    const sender = "sender"
    const recipient = "recipient"
    const mailer = new Mailer(mockTransport, sender, recipient)
    const title = 'i am a title'
    const body = 'i am body'

    mailer.sendEmail(title, body)

    expect(mockTransport.sendMail).toHaveBeenCalledWith({
      attachments: [
        {
          content: body,
          contentType: "text/html",
          filename: title
        }
      ],
      from: sender,
      subject: "convert",
      to: recipient
    })
  })
})

