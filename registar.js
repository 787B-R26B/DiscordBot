require('dotenv').config();

const { SlashCommandBuilder, REST, Routes} = require("discord.js");

const ping = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("pong!");

  const hello = new SlashCommandBuilder()
  .setName("hello")
  .setDescription("挨拶をします。")
  .addStringOption((option) =>
    option
      .setName("language")
      .setDescription("言語を指定します。")
      .setRequired(true) //trueで必須、falseで任意
      .addChoices(
        { name: "Japanese", value: "ja" },
        { name: "English", value: "en" }
      )
  );

const help = new SlashCommandBuilder()
.setName("help")
.setDescription("コマンド一覧を表示します")

const commands = [ping, hello, help];

//登録用関数
const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);
async function main() {
  await rest.put(
    Routes.applicationCommands("1285187460082569318"), 
    { body: commands }
  )
}
main().catch((err) => console.log(err));

