
const Discord = require('discord.js');
const client = new Discord.Client();

const botId = '448967245528432641';
const botName = 'CC.bot'
var logChannel = null;
var botChannel = null;
const guildID = '143058431488557056';
const hour = 1000 * 60 * 60;

var clonnedChannels = [];
var d2pvpChannels = [ '400005848069308416' ];
var d2pveChannels = [ '400364097310556164' ];
var d2raidChannels = [ '444537241671434240' ];

var dEmote = null;
var mhEmote = null;
var ubiEmote = null;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setUsername(botName);
  logChannel = client.channels.get('375658447695249408');
  botChannel = client.channels.get('451809230702510093');

  // fireTeamChannel = client.channels.get('451891012864966676');

  dEmote = client.emojis.find('name', 'Destiny2');
  mhEmote = client.emojis.find('name', 'MonsterHunter');
  ubiEmote = client.emojis.find('name', 'Ubisoft');

  // var core = client.guilds.get('143058431488557056').roles.find('name', 'Core Community Member');

  // fireTeamChannel.send("\nBot Commands:\n\n`-destinypve` - Creates a new Destiny PvE Voice Channel\n`-destinypvp` - Creates a new Destiny PvP Voice Channel\n`-destinyraid` - Creates a new Destiny Raid Voice Channel\n\n-----------------------------------------------------------------------------------------------------------");

  // botChannel.send(
  // "Hey "+core.toString()+" !\n\nYou can now add and remove roles based on the games you are interested in.\n\nHow to use:\n\n1. Click the emotes related to the channels you want to see.\n2. Remove any emotes to remove channels from the sidebar.\n3. If you still want to see channels but don't want pings, mute the corresponding channel.\n4. 'Community Hub' and 'Other Games' will always be visible.\n\nKey:\n\n"+`${dEmote}`+" - Destiny 2\n"+`${ubiEmote}`+" - Ubisoft Games\n"+`${mhEmote}`+" - Monster Hunter\n\nPlease leave any feedback in "+client.channels.get('388176998025003010').toString()+".")
  //   .then( message => {
  //     message.react(dEmote.id);
  //     message.react(ubiEmote.id);
  //     message.react(mhEmote.id);
  //   });
  // botChannel.fetchMessage('451845699693314068').then(msg => { msg.edit("\nBot Commands:\n\n`-inviteguest` - Creates a 24 hour temporary invite to the Discord as a Guest\n`-destinypve` - Creates a new Destiny PvE Voice Channel\n`-destinypvp` - Creates a new Destiny PvP Voice Channel\n`-destinyraid` - Creates a new Destiny Raid Voice Channel\n\n-----------------------------------------------------------------------------------------------------------"); });
  
  botChannel.fetchMessage('451839276058017792');

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

  if (msg.channel.id == '451809230702510093'){

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
          msg.delete(2000);
        });
        
        logChannel.send('<@'+msg.member.id + '> has created a guest invite link on channel: '+msg.channel.name);
      });
    } else {
      msg.delete();
    }
  }

  if (msg.content == '-invm'){
    if (msg.member.roles.find('name', 'Admin')){
      var guestChannel = client.channels.get('143088944643440641');
      guestChannel.createInvite({
        maxAge: 0,
        maxUsers: 1,
        unique: true
      })
      .then(function(invite){
        msg.channel.send(invite.url).then(function(newMessage){
          // newMessage.delete(1000 * 900);
        });
        
        logChannel.send('<@'+msg.member.id + '> has created a member invite link on channel: '+msg.channel.name);
      });
    } else {
      msg.channel.send('To create an invite link please use -inviteguest');
      logChannel.send('<@'+msg.member.id + '> has attempted to invite a member');
    }
  }

  if (msg.content == '-tim'){
    var tim1 = client.emojis.find('name', 'tim1');
    var tim2 = client.emojis.find('name', 'tim2');
    var tim3 = client.emojis.find('name', 'tim3');
    var tim4 = client.emojis.find('name', 'tim4');
    msg.channel.send(`${tim1}${tim2}`);
    msg.channel.send(`${tim3}${tim4}`);
  }

  if (msg.content == '-destinypve'){
    var pveChannel = client.guilds.get('143058431488557056').channels.get('400364097310556164');
    pveChannel.clone('PvE Fireteam ' +(d2pveChannels.length+1)).then( channel => {
      channel.setParent(pveChannel.parentID).then(() => {
        console.log(pveChannel.position);
        var pos = pveChannel.position + d2pveChannels.length;
        channel.setPosition(pos);
      });
      
      msg.member.setVoiceChannel(channel).then(() => {
        clonnedChannels.push(channel.id);
        d2pveChannels.push(channel.id);
      });
    });
  }

  if (msg.content == '-destinypvp'){
    var pvpChannel = client.guilds.get('143058431488557056').channels.get('400364097310556164');
    pvpChannel.clone('PvP Fireteam ' +(d2pvpChannels.length+1)).then( channel => {
      channel.setParent(pvpChannel.parentID).then(() => {
        var pos = pvpChannel.position + d2pvpChannels.length;
        channel.setPosition(pos);  
      });
      msg.member.setVoiceChannel(channel).then(() => {
        clonnedChannels.push(channel.id);
        d2pvpChannels.push(channel.id);
      });
    });
  }

  if (msg.content == '-destinyraid'){
    var raidChannel = client.guilds.get('143058431488557056').channels.get('400364097310556164');
    raidChannel.clone('Raid Fireteam ' +(d2raidChannels.length+1)).then( channel => {
      channel.setParent(raidChannel.parentID).then(() => {
        var pos = raidChannel.position + d2raidChannels.length;
        channel.setPosition(pos);  
      });
     
      msg.member.setVoiceChannel(channel).then(() => {
        clonnedChannels.push(channel.id);
        d2raidChannels.push(channel.id);
      }).catch(e => {
        console.log(e);
      });
    });
  }

  if (msg.channel.name != 'test') return;

  if (msg.content == '-clone'){
    var boisChannel = client.guilds.get('143058431488557056').channels.get('451849031845675012');
    boisChannel.clone('Cloned channel').then(channel => {
      channel.setParent(boisChannel.parentID);
      msg.member.setVoiceChannel(channel.id);
      clonnedChannels.push(channel.id);
      channel.join();
    });
  }

});

client.on('voiceStateUpdate', (oldMember, member) => {
  var role = client.guilds.get('143058431488557056').roles.find('name', 'Guest');
  if (member.voiceChannelID == '447233002800676864' && member.joinedTimestamp > Date.now() - 5000){
    member.addRole(role).catch(console.error);
    logChannel.send('<@'+member.id + '> has joined the server as a guest');
  }

  if (oldMember.voiceChannelID != undefined && clonnedChannels.indexOf(oldMember.voiceChannelID) > -1){
    var members = oldMember.voiceChannel.members.array();
    if (members.length == 0){
      var i = clonnedChannels.indexOf(oldMember.voiceChannelID);
      var pve = d2pveChannels.indexOf(oldMember.voiceChannelID);
      var pvp = d2pvpChannels.indexOf(oldMember.voiceChannelID);
      var raid = d2raidChannels.indexOf(oldMember.voiceChannelID);
      if (i !== 1){
        clonnedChannels.splice(i, 1);
      }

      if (pve !== 1){
        d2pveChannels.splice(pve, 1);
      } 
      if (pvp !== 1){
        d2pvpChannels.splice(pvp, 1);
      } 
      if (raid !== 1){
        d2raidChannels.splice(raid, 1);
      }
      oldMember.voiceChannel.delete();
    }
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
  }, 10000);
});

client.on('guildMemberRemove', member => {
  logChannel.send('<@'+member.id + '> has left the server');
});

client.on('messageReactionAdd', (reaction, user) => {
  var member = client.guilds.get('143058431488557056').members.get(user.id);
  if (reaction.message.id == '451839276058017792'){
    if (reaction.emoji.id == dEmote.id){
      var role = reaction.message.guild.roles.find('name', 'Guardian');
      if (member.roles.has(role.id)){
        botChannel.send('<@'+user.id + '> Already has the Guardian Role.').then(function(message){ message.delete(5000); });
      } else {
        member.addRole(role).catch(console.error);
        logChannel.send('<@'+user.id + '> added Guardian role');
        botChannel.send('<@'+user.id + '> Guardian role added.').then(function(message){ message.delete(5000); });
        //add
      }
    } else if (reaction.emoji.id == mhEmote.id){
      var role = reaction.message.guild.roles.find('name', 'Monster Hunter');
      if (member.roles.has(role.id)){
        botChannel.send('<@'+user.id + '> Already has the Monster Hunter Role.').then(function(message){ message.delete(5000); });
      } else {
        member.addRole(role).catch(console.error);
        logChannel.send('<@'+user.id + '> added Monster Hunter role');
        botChannel.send('<@'+user.id + '> Monster Hunter role added.').then(function(message){ message.delete(5000); });
        //add
      }
    } else if (reaction.emoji.id == ubiEmote.id){
      var role = reaction.message.guild.roles.find('name', 'Operator');
      if (member.roles.has(role.id)){
        botChannel.send('<@'+user.id + '> Already has the Operator Role.').then(function(message){ message.delete(5000); });
      } else {
        member.addRole(role).catch(console.error);
        logChannel.send('<@'+user.id + '> added Operator role');
        botChannel.send('<@'+user.id + '> Operator role added.').then(function(message){ message.delete(5000); });
        //add
      }
    } else {
      reaction.remove(user);
    }
  }
});

client.on('messageReactionRemove', (reaction, user) => {
  var member = client.guilds.get('143058431488557056').members.get(user.id);
  if (reaction.message.id == '451839276058017792'){
    if (reaction.emoji.id == dEmote.id){
      var role = reaction.message.guild.roles.find('name', 'Guardian');
      if (!member.roles.has(role.id)){
        botChannel.send('<@'+user.id + '> Does not have the Guardian Role.').then(function(message){ message.delete(5000); });
      } else {
        member.removeRole(role).catch(console.error);
        logChannel.send('<@'+user.id + '> removed Guardian role');
        botChannel.send('<@'+user.id + '> Guardian role removed.').then(function(message){ message.delete(5000); });
        //add
      }
    } else if (reaction.emoji.id == mhEmote.id){
      var role = reaction.message.guild.roles.find('name', 'Monster Hunter');
      if (!member.roles.has(role.id)){
        botChannel.send('<@'+user.id + '> Does not have the Monster Hunter Role.').then(function(message){ message.delete(5000); });
      } else {
        member.removeRole(role).catch(console.error);
        logChannel.send('<@'+user.id + '> removed Monster Hunter role');
        botChannel.send('<@'+user.id + '> Monster Hunter role removed.').then(function(message){ message.delete(5000); });
        //add
      }
    } else if (reaction.emoji.id == ubiEmote.id){
      var role = reaction.message.guild.roles.find('name', 'Operator');
      if (!member.roles.has(role.id)){
        botChannel.send('<@'+user.id + '> Does not have the Operator Role.').then(function(message){ message.delete(5000); });
      } else {
        member.removeRole(role).catch(console.error);
        logChannel.send('<@'+user.id + '> removed Operator role');
        botChannel.send('<@'+user.id + '> Operator role removed.').then(function(message){ message.delete(5000); });
        //add
      }
    }
  }
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