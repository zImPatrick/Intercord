/*

SETTINGS = {
    discord_public_key: string,
    cmds: {"name": callback || "id": callback }
}

*/

const nacl = require('tweetnacl');

module.exports = (settings) => {
    return (req, res, next) => {
        if (req.method !== 'POST') return next();

        const PUBLIC_KEY = settings["discord_public_key"];
        const signature = req.get('X-Signature-Ed25519');
        const timestamp = req.get('X-Signature-Timestamp');

        const isVerified = nacl.sign.detached.verify(
            Buffer.from(timestamp + req.rawBody),
            Buffer.from(signature, 'hex'),
            Buffer.from(PUBLIC_KEY, 'hex')
        );

        if(!isVerified) return res.status(401).end("Not authenticated");

        if(req.body["type"] == enums.InteractionType.Ping)
            return res.json({ type: 1 });

        if(req.body["type"] == enums.InteractionType.ApplicationCommand) { // cmd received
            var cmd = settings["cmds"][req.body["data"]["name"]] || settings["cmds"][req.body["data"]["id"]];
            var resp = cmd(req.body, req);
            if(typeof resp === "string") {
                return res.json({
                    "type": enums.InteractionResponseType["ChannelMessageWithSource"],
                    "data": {
                        "content": resp,
                    }
                })
            } else if (typeof resp === "object") {
                return res.json(resp);
            } else throw TypeError("Expected response of command callback to be a string or object");
        }

        
    }
};

var enums = exports.enums = {
    InteractionType: { // https://discord.com/developers/docs/interactions/slash-commands#interaction-interactiontype
        "Ping": 1,
        "ApplicationCommand": 2
    },
    InteractionResponseType: { // https://discord.com/developers/docs/interactions/slash-commands#interaction-response-interactionresponsetype
        "Pong": 1,
        "Acknowledge": 2,
        "ChannelMessage": 3,
        "ChannelMessageWithSource": 4,
        "AcknowledgeWithSource": 5
    }
}