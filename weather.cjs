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