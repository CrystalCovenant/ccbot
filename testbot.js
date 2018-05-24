
const Discord = require('discord.js');
const client = new Discord.Client();

const botId = '448967245528432641';
const botName = 'CC.bot'
var logChannel = null;
const guildID = '143058431488557056';
const hour = 1000 * 60 * 60;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setUsername(botName);
  logChannel = client.channels.get('375658447695249408');

  setInterval(function(){
    var role = client.guilds.get('143058431488557056').roles.find('name', 'Guest');
    var membersInRole = role.members.array();
    if (membersInRole.length > 0){
      for (var i = 0; i < membersInRole.length; i++) {
        member = membersInRole[i];
        if (member.joinedTimestamp < (Date.now() - (hour * 24))){
          member.kick().then(() => logChannel.send('Guest <@'+member.id + '> invite has expired'));
        }
      }
    }
  }, hour);
});

client.on('message', msg => {
	if(msg.member.id == botId) return;
	if (!msg.guild) return;
  
  if (msg.content.indexOf('-purgemsg') > -1){
   if (msg.member.roles.find('name', 'Admin')){
      var amountToDelete = msg.content.replace('-purgemsg', '');
      amountToDelete = amountToDelete.trim();
      if (amountToDelete == ''){
        msg.channel.send('Please provide the amount to purge');
      } else if (isNaN(amountToDelete)){
        msg.channel.send('Please provide a number of messages to delete');
      } else {
        amountToDelete = parseInt(amountToDelete);
        msg.channel.bulkDelete(amountToDelete + 1);
        logChannel.send('<@'+msg.member.id + '> used "' + msg.content + '"" on channel: '+msg.channel.name);
      }
    } else {
      msg.channel.bulkDelete(1);
      logChannel.send('<@'+msg.member.id + '> tried to use "' + msg.content + '"" on channel: '+msg.channel.name);
    }
  }

  if (msg.content == '-inviteguest'){
    var guestChannel = client.channels.get('447233002800676864');
    guestChannel.createInvite({
      maxAge: 900,
      maxUsers: 1,
      unique: true
    })
    .then(function(invite){
      msg.channel.send(invite.url).then(function(newMessage){
        newMessage.delete(1000 * 900);
      });
      
      logChannel.send('<@'+msg.member.id + '> has created a guest invite link on channel: '+msg.channel.name);
    });
  }

  if (msg.content == '-invm'){
    if (msg.member.roles.find('name', 'Admin')){
      var guestChannel = client.channels.get('143088944643440641');
      guestChannel.createInvite({
        maxAge: 900,
        maxUsers: 1,
        unique: true
      })
      .then(function(invite){
        msg.channel.send(invite.url).then(function(newMessage){
          newMessage.delete(1000 * 900);
        });
        
        logChannel.send('<@'+msg.member.id + '> has created a member invite link on channel: '+msg.channel.name);
      });
    } else {
      msg.channel.send('To create an invite link please use -inviteguest');
      logChannel.send('<@'+msg.member.id + '> has attempted to invite a member');
    }
  }

  if (msg.channel.name != 'test') return;

  // msg.reply(msg.content);

  if (msg.content == '-tim'){
    var tim1 = client.emojis.find('name', 'tim1');
    var tim2 = client.emojis.find('name', 'tim2');
    var tim3 = client.emojis.find('name', 'tim3');
    var tim4 = client.emojis.find('name', 'tim4');
    msg.channel.send(`${tim1}${tim2}`);
    msg.channel.send(`${tim3}${tim4}`);
  }

  if(msg.content == '-operator'){
    var role = msg.guild.roles.find('name', 'Operator');
    if (msg.member.roles.has(role.id)){
      //remove
      msg.member.removeRole(role).catch(console.error);
      logChannel.send('<@'+msg.member.id + '> removed Operator role');
    } else {
      msg.member.addRole(role).catch(console.error);
      logChannel.send('<@'+msg.member.id + '> added Operator role');
      //add
    }
  }

  if(msg.content == '-agent'){
    var role = msg.guild.roles.find('name', 'Agent');
    if (msg.member.roles.has(role.id)){
      //remove
      msg.member.removeRole(role).catch(console.error);
      logChannel.send('<@'+msg.member.id + '> removed Agent role');
    } else {
      msg.member.addRole(role).catch(console.error);
      logChannel.send('<@'+msg.member.id + '> added Agent role');
      //add
    }
  }

  if(msg.content == '-guardian'){
    var role = msg.guild.roles.find('name', 'Guardian');
    if (msg.member.roles.has(role.id)){
      //remove
      msg.member.removeRole(role).catch(console.error);
      logChannel.send('<@'+msg.member.id + '> removed Guardian role');
    } else {
      msg.member.addRole(role).catch(console.error);
      logChannel.send('<@'+msg.member.id + '> added Guardian role');
      //add
    }
  }

  if(msg.content == '-hunter'){
    var role = msg.guild.roles.find('name', 'Monster Hunter');
    if (msg.member.roles.has(role.id)){
      //remove
      msg.member.removeRole(role).catch(console.error);
      logChannel.send('<@'+msg.member.id + '> removed Monster Hunter role');
    } else {
      msg.member.addRole(role).catch(console.error);
      logChannel.send('<@'+msg.member.id + '> added Monster Hunter role');
      //add
    }
  }

  
  // msg.channel.send('Test reply');

  // if (msg.content === '/join') {
  //   // Only try to join the sender's voice channel if they are in one themselves
  //   if (msg.member.voiceChannel) {
  //     msg.member.voiceChannel.join()
  //       .then(connection => { // Connection is an instance of VoiceConnection
  //         msg.reply('I have successfully connected to the channel!');
  //       })
  //       .catch(console.log);
  //   } else {
  //     msg.reply('You need to join a voice channel first!');
  //   }
  // }


});

client.on('voiceStateUpdate', (oldMember, member) => {
  if (member.voiceChannelID == '447233002800676864' && member.joinedTimestamp > Date.now() - 1000){
    var role = client.guilds.get('143058431488557056').roles.find('name', 'Guest');
    member.addRole([role]).catch(console.error);
    logChannel.send('<@'+member.id + '> has joined the server as a guest');
  }
});

client.on('guildMemberAdd', member => {
  setTimeout(function(){
    if (member.roles.array().length == 1){
      var guardian = client.guilds.get('143058431488557056').roles.find('name', 'Guardian');
      var core = client.guilds.get('143058431488557056').roles.find('name', 'Core Community Member');
      var operator = client.guilds.get('143058431488557056').roles.find('name', 'Operator');
      var hunter = client.guilds.get('143058431488557056').roles.find('name', 'Monster Hunter');

      member.setRoles([guardian, core, operator, hunter]);
      logChannel.send('<@'+member.id + '> has joined the server as a member');
    }
  }, 1500);
});

client.login('NDQ4OTY3MjQ1NTI4NDMyNjQx.Ded1hw.e5QHDpzY_T6GxJ208rewtvjGk60');


//448967245528432641
//https://discordapp.com/api/oauth2/authorize?client_id=448967245528432641&scope=bot&permissions=8

/*

Tara BotInfo // Crystal Covenant AI v0.4

Commands
--------------------------------------
-inv          Create invite to Destiny-Guest voice channel. Require Guardian roles.
-guardian     Request Guardian roles. [Destiny 2]
-r6ranked     Request R6ranked roles. [Rainbow Six: Siege]
-operator     Assign or remove operator role. [Rainbow Six: Siege]
-agent        Assign or remove agent role. [The Division]
-hunter       Assign or remove hunter role. [Monster Hunter]
-tz           Link to a timezone converter

Memes and Stuff
--------------------------------------
-tim            Summon tim's face

Admins Only
--------------------------------------
-killccai       Kill cc.ai bot. Must be restarted manually.
-purgemsg [#]   Delete the # of past messages on current channel.

Sound Effect [Admins][BotJoinAuthorChannel]
--------------------------------------
-ydt            I can't believe you've done this
-fls            Fookin' laser sights
-nani           NANI???!!!
-titanic        Emotional titanic flute
-shaxx1         Shaxx Quotes 1
-abort          End Sound Effect Sequence
-taps           Play Taps

*/

/*


someone joins through invite:
	auto give roles:
		Core Community Member
		Guardian
		Operator
		Monster Hunter


*/