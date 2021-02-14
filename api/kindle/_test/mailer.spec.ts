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
    const path = 'path/filename.png'

    mailer.sendEmail(path)

    expect(mockTransport.sendMail).toHaveBeenCalledWith({
      attachments: [
        {
          contentType: "image/png",
          filename: 'filename.png',
          path
        }
      ],
      from: sender,
      cc: sender,
      text: expect.any(String),
      subject: "convert",
      to: recipient
    })
  })
})

