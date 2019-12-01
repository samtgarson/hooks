**hooks**_—Webhooks for personal projects_

A repository of webook handlers for personal projects, deployed at `hooks.samgarson.com` using [Zeit Now](https://now.sh).

## Hooks

- [**`home-status`**](api/home-status.js) A handler which receives [location triggers from IFTTT](https://ifttt.com/location) (via [IFTTT webhooks](https://ifttt.com/maker_webhooks)) and stores who's home in an [Airtable](https://airtable.com/). Currently used to make sure my central heating is off when noone is home, using [the IFTTT Hive Thermostat integration](https://ifttt.com/hive_active_heating).
