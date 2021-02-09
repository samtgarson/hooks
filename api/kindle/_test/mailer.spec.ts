import Mail from 'nodemailer/lib/mailer'
import { Mailer } from '../_lib/mailer'

describe('Mailer', () => {
  const mockTransport = { sendMail: jest.fn() } as unknown as jest.Mocked<Mail>

  it('instantiates with default dependencies', () => {
    const mailer = new Mailer()

    expect(mailer['transport']).toBeInstanceOf(Mail)
  })

  it('sends a mail', () => {
    const mailer = new Mailer(mockTransport)
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
      from: "robot@samgarson.com",
      subject: "convert",
      to: "samtgarson@gmail.com"
    })
  })
})

