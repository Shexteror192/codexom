const http = require("http");
const express = require("express");
const app = express();

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://staffpola6.glitch.me/`);
}, 280000);

const Discord = require("discord.js");
const config = require("./config.json");
const ms = require("ms");
const enmap = require("enmap");
const moment = require("moment");

const client = new Discord.Client();
const db = new enmap({ name: "test" });

const prefix = config.prefix;
const token = config.token;
const time = config.time;

client.on("ready", () => {
  console.log("logged in as " + client.user.username);
});

client.on("message", async message => {
  if (message.content === 'jonn') {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
  
  if (
    message.author.bot ||
    message.channel.type !== "dm" ||
    !message.content.includes("discord.gg")
  )
    return;

  var user = message.author;
  if (db.get(user.id) == undefined) {
    db.ensure(user.id, {
      last: null
    });
  }

  if (db.get(user.id, "last") !== null && moment().diff(moment(parseInt(db.get(user.id, "last"))), "h") < time) {
    message.channel.send(`> **You need to wait until it ends ${moment(parseInt(db.get(user.id, "last"))).add(time, "h").fromNow()}**`);
    return;
  }
  
  var ad_message = message.content.replace("@everyone", "").replace("@here", "");

  client.channels.cache
    .get(config.ad_channel)
    .send(ad_message + "\n\n<@" + user.id + ">");


  message.channel.send(">>> https://discord.gg/tFsaRdc **Done.\nCheck <#"+client.channels.cache.get(config.ad_channel).id +
      ">**"                   
       );

  db.set(user.id, moment().format("x"), "last");
});

client.login("NzQ4MzE1MTg4NzI1NTQ3MTY1.X0bo1A.68f2go2M2AJCeI4LWYcyzDQ7zfg")

client.on("message", async message => {
  if (message.content == "invites") {
    let oi = message.mentions.users.first()
      ? message.mentions.users.first().id
      : message.author.id;
    let Tag = message.mentions.users.first()
      ? message.mentions.users.first().tag
      : message.author.tag;
    let Username = message.mentions.users.first()
      ? message.mentions.users.first().username
      : message.author.username;
    let Avatar = message.mentions.users.first()
      ? message.mentions.users.first().avatarURL
      : message.author.avatarURL;

    message.guild.fetchInvites().then(invs => {
      let member = client.guilds.get(message.guild.id).members.get(oi);
      let personalInvites = invs.filter(i => i.inviter.id === oi);
      let urll = invs.filter(i => i.inviter.id === oi);
      let link = urll.reduce(
        (p, v) =>
          v.url + ` , Total de membros recrutados no convite: ${v.uses}.\n` + p,
        `\nServidor: ${message.guild.name} \n `
      );
      let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);
      let inviteCode = personalInvites.reduce((p, v) => v.code);
      let possibleInvites = [["Total members you invited:"]];
      possibleInvites.push([inviteCount, inviteCode]);
      let user = message.mentions.users.first() || message.author;
      let mem = message.guild.member(user);
      let millisJoined = new Date().getTime() - mem.joinedAt.getTime();
      let daysJoined = millisJoined / 1000 / 60 / 60 / 24;

      var inviteInfo = new Discord.RichEmbed()
        .setTitle(`:incoming_envelope: **[INVITE INFO]** ${Username}`)
        .setThumbnail(client.user.avatarURL)
        .addField("**Invites**", `**➥** [ **${Number(inviteCount)}** ]`)
        .addField(
          "**Joined At Server**",
          `**➥** [ Day **${daysJoined.toFixed(0)}** ]`
        )

        .setColor("BLUE")
        .setTimestamp()
        .setFooter(Tag, Avatar);
      message.channel.send(inviteInfo);
    });
  }
});






