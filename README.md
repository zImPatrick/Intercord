# Intercord
Use discord's interactions feature with this express middleware!

## Example Usage
```js
const middleware = require('intercord');
const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
}));

app.post("/api/discord", middleware({
  discord_public_key: process.env.DISCORD_PUBLIC_KEY,
  cmds: {
    // The data argument gives you back the object that discord sent us
    // https://discord.com/developers/docs/interactions/slash-commands#interaction-response 

    // Sending a generic string response
    "hellobot": (data) => { // "hellobot" is the command name
      return "Hello " + data.member.user.username; // return a string
    },

    // Sending back an embed 
    "test": (data) => {
        return { // https://discord.com/developers/docs/interactions/slash-commands#interaction-response
            type: 4,
            data: {
                embeds: [
                    {
                        title: "Hello!",
                        description: "Hello, " + data.member.user.username
                    }
                ]
            }
        }
    }
  }
}));

```