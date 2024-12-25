require('dotenv').config();
const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    EmbedBuilder,
  } = require ("discord.js");
  const options = {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
      
    ],
  };
 const {
    entersState,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    StreamType,
    getVoiceConnection,
  } = require ("@discordjs/voice");

  const https = require("https");
  const sharp = require("sharp");
  const mathjax = require("mathjax");
  const fs = require("fs");
  const weather = require("weather-js");
  const cron = require("node-cron");
  const ytdl = require("ytdl-core");
  const voicevox_key = (process.env.VOICEVOX_KEY);
  const voicevox_url = `https://deprecatedapis.tts.quest/v2/voicevox/audio/?key=${voicevox_key}&speaker=0&pitch=0&intonationScale=1&speed=1&text=`;

  const client = new Client(options);
  const subscriptions = new Map();
  const channels = new Map();

  const prefix = "!"


  const renderMathToSVG = async (mathInput) => {
    // MathJaxの初期化
    const mjInstance = await mathjax.init({
        loader: { load: ['input/tex', 'output/svg'] },
    });
    const svg = mjInstance.tex2svg(mathInput, { display: true });
    const svgString = mjInstance.startup.adaptor.innerHTML(svg);
    return svgString;
};

const convertSVGToPNG = async (svgString) => {
  // SVGをPNGに変換
  const pngBuffer = await sharp(Buffer.from(svgString))
      .flatten({ background: { r: 255, g: 255, b: 255 } }) 
      .resize(1600, 800, { fit: 'contain' })
      .resize ({width:800})
      .png({ compressionLevel: 0 })
      .trim()
      .toBuffer();
  return pngBuffer;
};

  client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.emoji.name === '✅' && !user.bot) {
      const role = reaction.message.guild.roles.cache.find(role => role.name === 'Time-signal');
      reaction.message.guild.member(user).roles.add(role);
    }
  });

//スラッシュコマンド用
client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;
    if (commandName === "ping") {
      const now = Date.now();
      const text = `pong!\n\ngateway:${client.ws.ping}ms`;
      await interaction.reply({
        content: text,
        ephemeral: true,
      });
      return interaction.editReply(`${text}\n往復:${Date.now() - now}ms`);
    } else if (commandName === "hello") {
      const lang = {
        ja: (name) => `こんにちは、${name}さん。`,
        en: (name) => `Hello, ${name}!`,
      };
      return interaction.reply(
        lang[interaction.options.getString("language")](
          interaction.member?.displayName || interaction.user.username
        )
      );
    } else if (commandName === "help") {
      return interaction.reply(
        "**コマンド一覧**\n san値チェック:あなたのSAN値を測定します（適当）\n おみくじ:おみくじを引きます\n 教科サイコロ:あなたが今勉強するべき教科を教えてくれます\n !w[場所]:その場所の天気を表示します\n !y[youtubeのURL]:VCに入った状態で実行するとVCにyoutubeの音源を配信します\n !timer[秒]:タイマーが発動します。0になると爆発します\n !join:BOTがVCに参加します\n !say[文字列]:BOTが喋ります\n !bye:BOTが萎え落ちします\n !del[削除数]:**管理者のみ** 指定された数のメッセージを削除"
      );
    }
  }
});

  client.on("ready", (message) => {
    console.log("Discord Bot is ready!");
    setInterval(() => {
      client.user.setActivity({
        name: `ping:${client.ws.ping}ms,/helpでコマンド一覧を表示します`,
      });
    }, 10000);
    cron.schedule("59 23 * * *", () => {
      client.channels.cache
        .get("1309348175844474930")
        .send("<@&1309351007343345714>もうすぐ日付が変わります！");
    });
    cron.schedule("0 0 * * *", () => {
      client.channels.cache
        .get("1309348175844474930")
        .send("# <@&1309351007343345714>おはよう新世界、おやすみ旧世界。");
    });
  });

  client.on("messageCreate", async (message) => {
    if (message.author.id == client.user.id) return;
    const msg = message.content;
    // console.log(msg);
    const gui = message.channel;
    //console.log (gui)
    if (message.content.match(/san値チェック|SAN値チェック/)) {
      const san = Math.floor(Math.random() * 101);
      message.channel.send("今の君のsan値は" + san + "らしい");
    }
     if (message.content.match("python")) {
     message.channel.send("pythonはゴミ！");
    }
    if (message.content === "おみくじ") {
     const omikuji = [
       "大吉だよ！(10%)",
       "中吉(20%)",
       "小吉ぃ(40%)",
       "凶だ、、、(20%)",
       "ごめん！大凶だ、、、(10%)",
               ];
      
      const n = Math.floor(Math.random()*omikuji.length);
      message.channel.send(`${message.author}` + omikuji[n]);
      console.log(n);
    }
    if (message.content.match("conflict歌って")) {
      message.channel.send(
        "conflict歌います。ズォールヒ～～↑ｗｗｗｗヴィヤーンタースｗｗｗｗｗワース フェスツｗｗｗｗｗｗｗルオルｗｗｗｗｗプローイユクｗｗｗｗｗｗｗダルフェ スォーイヴォーｗｗｗｗｗスウェンネｗｗｗｗヤットゥ ヴ ヒェンヴガｒジョｊゴアｊガオガオッガｗｗｗじゃｇｊｊ"
      );
    }
    if (message.content === "教科サイコロ") {
      const m = Math.floor(Math.random() * 9);
    const s = ["国語", "数A","数B", "化学","物理","公共A","公共B", "菅原英語","片岡英語", "倫理社会"];
      message.channel.send(
        "今日君がやるべき教科は" + s[m] + "だよ！！！頑張れ！！"
      );
      console.log (m)
    }
    if (message.content === "ぬるぽ") {
      message.channel.send("ｶﾞｯ");
    }


    if (!message.content.startsWith(prefix)) return;
  const [command, ...args] = message.content.slice(prefix.length).split(/\s+/g);

  if (command === "tex"){    
    const tex_str = args.join(" ");
    console.log(tex_str)
    try {
      const svg = await renderMathToSVG(tex_str);
      const png = await convertSVGToPNG(svg);
      message.reply({ files: [{ attachment: png, name: 'math.png' }] });
  } catch (error) {
      console.error('Error rendering math:', error);
      message.reply('数式のレンダリングに失敗しました。入力を確認してください。');
  }

  }

  if (command === "w") {
    weather.find({ search: args[0], degreeType: "C" }, function (err, result) {
      if (err) message.channel.send(err);
      if (result.length === 0) {
        message.channel.send("**場所を取得できませんでした**");
        return;
      }
      var current = result[0].current;
      switch (current.skytext) {
        case "Mostly Sunny":
          var skytext = "ほぼ晴れ";
          break;
        case "Cloudy":
          var skytext = "曇り";
          break;
        case "Partly Cloudy":
          var skytext = "晴れのち曇り";
          break;
        case "Sunny":
          var skytext = "晴れ";
          break;
        case "Clear":
          var skytext = "雲1つない快晴";
          break;
        case "Mostly Clear":
          var skytext = "ほぼ快晴";
          break;
        case "Mostly Cloudy":
          var skytext = "ほぼ曇り";
          break;
        case "Partly Sunny":
          var skytext = "所により晴れ";
          break;
        case "Light Rain":
          var skytext = "小雨";
          break;
        default:
          var skytext = current.skytext;
          break;
      }
      const embed = new EmbedBuilder()

        .setDescription("**" + skytext + "**")
        .setAuthor({
          name: `${current.date}の${current.observationpoint}の天気`,
        })
        .setThumbnail(current.imageUrl)
        .setColor(0x0099ff)
        .setFields(
          {
            name: "温度",
            value: `${current.temperature}℃`,
            inline: true,
          },
          {
            name: "体感温度",
            value: `${current.feelslike}℃`,
            inline: true,
          },
          {
            name: "風",
            value: current.winddisplay,
            inline: true,
          },
          {
            name: "湿度",
            value: `${current.humidity}%`,
            inline: true,
          }
        );
      message.channel.send({ embeds: [embed] });
    });
  }
  //timer
  if (command === "timer") {
    const time = message.content.split(" ")[1];
    message.channel.send(`${time}秒後にメンションします。`);
    setTimeout(() => {
      message.channel.send(
        `${message.author}さん、${time}秒経ちました。爆発します`
      );
    }, time * 1000);
  }
  //判別用
  if (command === "status") {
    message.channel.send("code2");
  }
  //voicevox api ポイント確認
  if (command === "pc") {
    const req = await fetch(
      `https://api.su-shiki.com/v2/api/?key=${process.env.voicevox_key}`
    );
    const res = await req.text();
    message.channel.send(res);
  }
  if(command === "pcc"){
    console.log(require('dotenv').config({ path: './.env' }));
    console.log(process.env.voicevox_key);
  }
  //ytdl-core
  if (command === "yt") {
    const url = message.content.split(" ")[1];
    if (!ytdl.validateURL(url))
      return message.reply(`${url}は処理できません。`);
    const channel = message.member.voice.channel;
    if (!channel) return message.reply("ボイチャに参加してないよ？");
    const connection = joinVoiceChannel({
      adapterCreator: channel.guild.voiceAdapterCreator,
      channelId: channel.id,
      guildId: channel.guild.id,
      selfDeaf: false,
      selfMute: false,
    });

    const player = createAudioPlayer();
    connection.subscribe(player);
    const stream = ytdl(ytdl.getURLVideoID(url), {
      filter: (format) =>
        format.audioCodec === "opus" && format.container === "webm",
      quality: "highest",
      highWaterMark: 32 * 1024 * 1024,
    });
    const resource = createAudioResource(stream, {
      inputType: StreamType.WebmOpus,
    });
    player.play(resource);
    await entersState(player, AudioPlayerStatus.Playing, 10 * 1000);
    await entersState(player, AudioPlayerStatus.Idle, 24 * 60 * 60 * 1000);
  }
  //以下読み上げ関連
  //VC参加用トリガー
  if (command === "join") {
    const channel = message.member.voice.channel;
    if (!channel) return message.reply("VCに未参加です");
    const connection = joinVoiceChannel({
      adapterCreator: channel.guild.voiceAdapterCreator,
      channelId: channel.id,
      guildId: channel.guild.id,
      selfDeaf: true,
      selfMute: false,
    });
    const ent_n = Math.floor(Math.random() * 2);
    console.log(ent_n);
    const entrance_message = ["こっち見んな", "呼んだ？", "仕事したくねぇ"];
    const sound = await fetch(voicevox_url + entrance_message[ent_n]);
    const player = createAudioPlayer();
    connection.subscribe(player);
    const stream = sound.body;
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });
    player.play(resource);
    await entersState(player, AudioPlayerStatus.Playing, 10 * 1000);
    await entersState(player, AudioPlayerStatus.Idle, 24 * 60 * 60 * 1000);
    const ch = message.member.voice.channel.name;
    message.channel.send(ch + "に接続済み");
  }
  //読み上げ
  if (command === "say") {
    console.log(message.content);
    const saym = message.content.split(" ")[1];
    const channel = message.member.voice.channel;
    if (!channel) return "VCに未参加です";
    const connection = joinVoiceChannel({
      adapterCreator: channel.guild.voiceAdapterCreator,
      channelId: channel.id,
      guildId: channel.guild.id,
      selfDeaf: true,
      selfMute: false,
    });
    const sound = await fetch(voicevox_url + saym);
    const player = createAudioPlayer();
    connection.subscribe(player);
    const stream = sound.body;
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });
    player.play(resource);
    await entersState(player, AudioPlayerStatus.Playing, 10 * 1000);
    await entersState(player, AudioPlayerStatus.Idle, 24 * 60 * 60 * 1000);
  }

  //VC切断用cmd
  if (command === "bye") {
    const connection = getVoiceConnection(message.guild.id);
    const ch = message.member.voice.channel.name;
    message.channel.send(ch + "から切断されました、、、萎えます");
    if (connection) connection.destroy();
  }
  //メッセージ削除(adminのみ)
  if (message.content.startsWith("!del")) {
    if (!message.member.permissions.has("Administrator"))
      return message.channel.send("あなたにはメッセージ削除権限がありません");
    const how = message.content.split(" ");
    const messages = await message.channel.messages.fetch({ limit: how[1] });
    message.channel.bulkDelete(messages);
  }


  })

client.login(process.env.DISCORD_BOT_TOKEN); 
