🪝

**hooks**_—Webhooks for personal projects_

A repository of webook handlers for personal projects, deployed at `hooks.samgarson.com` using [Vercel](https://vercel.com).

## Hooks

- [**`home-status`**](api/home-status/index.ts) A handler which receives [location triggers from IFTTT](https://ifttt.com/location) (via [IFTTT webhooks](https://ifttt.com/maker_webhooks)) and stores who's home in an [Airtable](https://airtable.com/). Currently used to make sure my central heating is off when noone is home, using [the IFTTT Hive Thermostat integration](https://ifttt.com/hive_active_heating).
- [**`kindle`**](api/kindle/index.ts) A handler which receives new articles via the [Feedly IFTTT integration](https://ifttt.com/feedly) and sends the contents of the article to my Kindle.

## Develop

Run the app:
```sh
concurrently "vercel dev" "npm:quirrel"
```
