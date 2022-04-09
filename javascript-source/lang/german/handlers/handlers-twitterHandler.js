/*
 * Copyright (C) 2016-2022 phantombot.github.io/PhantomBot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

$.lang.register('twitter.tweet', '[Twitter Feed von @(twitterid)] $1');
$.lang.register('twitter.tweet.mention', '[Twitter Feed von @(twitterid)] @$1: $2');
$.lang.register('twitter.reward.announcement', 'Retweets von $1! Belohnung von $2 vergeben!');
$.lang.register('twitter.usage', 'Verwendung: !twitter [lasttweet | lastmention | lastretweet | set | post | id]');
$.lang.register('twitter.id', '$1 ist auf Twitter @$2: twitter.com/$2');
$.lang.register('twitter.usage.id', '("!twitter usage" für die Verwendung)');
$.lang.register('twitter.set.usage', 'Verwendung: !twitter set [message | polldelay | poll | post | updatetimer | reward]');
$.lang.register('twitter.set.polldelay.usage', 'Verwendung: !twitter set polldelay [mentions | retweets | hometimeline | usertimeline]');
$.lang.register('twitter.set.polldelay.minerror', 'Zu wenig für eine Abfrageverzögerung, Minimum ist, $1, für diese Einstellung.');
$.lang.register('twitter.set.polldelay.mentions.usage', 'Verwendung: !twitter set polldelay mentions [Sekunden]. Minimum ist 60. Aktuell: $1');
$.lang.register('twitter.set.polldelay.retweets.usage', 'Verwendung: !twitter set polldelay rewteets [Sekunden]. Minimum ist 60. Aktuell: $1');
$.lang.register('twitter.set.polldelay.hometimeline.usage', 'Verwendung: !twitter set polldelay hometimeline [Sekunden]. Minimum ist 60. Aktuell: $1');
$.lang.register('twitter.set.polldelay.usertimeline.usage', 'Verwendung: !twitter set polldelay usertimeline [Sekunden]. Minimum ist 15. Aktuell: $1');
$.lang.register('twitter.set.polldelay.mentions.success', 'Setze Twitter Abfrageverzögerung für Erwähnungen auf $1 Sekunden.');
$.lang.register('twitter.set.polldelay.retweets.success', 'Setze Twitter Abfrageverzögerung für Retweets auf $1 Sekunden.');
$.lang.register('twitter.set.polldelay.hometimeline.success', 'Setze Twitter Abfrageverzögerung für Home-Timeline auf $1 Sekunden.');
$.lang.register('twitter.set.polldelay.usertimeline.success', 'Setze Twitter Abfrageverzögerung für Benutzer-Timeline auf $1 Sekunden.');
$.lang.register('twitter.set.poll.usage', 'Verwendung: !twitter set poll [mentions | retweets | hometimeline | usertimeline]');
$.lang.register('twitter.set.poll.mentions.usage', 'Verwendung: !twitter set poll mentions [on/off]. Aktuell $1. Ruft die @Erwähnungen von Twitter ab.');
$.lang.register('twitter.set.poll.retweets.usage', 'Verwendung: !twitter set poll mentions [on/off]. Aktuell: $1. Ruft die Retweets von Twitter ab.');
$.lang.register('twitter.set.poll.hometimeline.usage', 'Verwendung: !twitter set poll hometimeline [on/off]. Aktuell: $1. Fragt alle deine Tweets und die aller anderen deines Verlaufs ab. Deaktiviert alle anderen Abfragen.');
$.lang.register('twitter.set.poll.usertimeline.usage', 'Verwendung: !twitter set poll usertimeline [on/off]. Aktuell: $1. Fragt alle deine Twitter-Tweets ab.');
$.lang.register('twitter.set.poll.mentions.success', 'Twitter Erwähnungs-Abfrage auf $1 gesetzt.');
$.lang.register('twitter.set.poll.retweets.success', 'Twitter Retweets-Abfrage auf $1 gesetzt.');
$.lang.register('twitter.set.poll.hometimeline.success', 'Twitter Hometimeline-Abfrage auf $1 gesetzt. Es wird nichts mehr anderes abgefragt.');
$.lang.register('twitter.set.poll.usertimeline.success', 'Twitter Usertimeline-Abfrage auf $1 gesetzt.');
$.lang.register('twitter.set.post.usage', 'Verwendung: !twitter set post [online | gamechange | update]');
$.lang.register('twitter.set.post.online.usage', 'Verwendung: !twitter set post online [on/off]. Aktuell $1.');
$.lang.register('twitter.set.post.gamechange.usage', 'Verwendung: !twitter set post gamechange [on/off]. Aktuell $1.');
$.lang.register('twitter.set.post.update.usage', 'Verwendung: !twitter set post update [on/off]. Aktuell $1.');
$.lang.register('twitter.set.post.online.success', 'Setze Twitter Online Post auf $1.');
$.lang.register('twitter.set.post.gamechange.success', ' Setzt Twitter Kategorieänderungs Post auf $1.');
$.lang.register('twitter.set.post.update.success', 'Setze Twitter Update Post auf $1.');
$.lang.register('twitter.set.message.usage', 'Verwendung; !twitter set message [online | gamechange]');
$.lang.register('twitter.set.message.online.usage', 'Verwendung: !twitter set message online [Nachricht]. Tags: (game) (twitchurl). Aktuell: $1');
$.lang.register('twitter.set.message.online.success', 'Setze Twitter Online Auto-Post Nachricht auf: $1');
$.lang.register('twitter.set.message.gamechange.usage', 'Verwendung: !twitter set message gamechange [Nachricht]. Tags: (game) (twitchurl). Aktuell: $1');
$.lang.register('twitter.set.message.gamechange.success', 'Setzt Twitter Kategoriewechsel Auto-Post Nachricht auf: $1');
$.lang.register('twitter.set.message.update.usage', 'Verwendung: !twitter set message update [Nachricht]. Tags: (game) (twitchurl) (uptime). Aktuell: $1');
$.lang.register('twitter.set.message.update.success', 'Setze Twitter Update Auto-Post Nachricht auf: $1');
$.lang.register('twitter.set.updatetimer.usage', 'Verwendung: !twitter set updatetimer [Minuten]. Minimal erlaubt sind 60 Minuten um Ablehnung von doppelten Posts von Twitter zu verhindern.');
$.lang.register('twitter.set.updatetimer.toosmall', 'Minimal erlaubt sind 180 Minuten um Ablehnung von doppelten Posts von Twitter zu verhindern.');
$.lang.register('twitter.set.updatetimer.success', 'Twitter Updatetimer auf $1 Minuten gesetzt.');
$.lang.register('twitter.set.reward.usage', 'Verwendung: !twitter set reward [toggle | points | cooldown | announce]');
$.lang.register('twitter.set.reward.toggle.usage', 'Verwendung: !twitter set reward toggle [on/off]. Aktuell $1. Aktiviere/Deaktiviere Belohnungen für Retweets.');
$.lang.register('twitter.set.reward.toggle.success', 'Setze Twitter Retweet Belohnungen auf $1.');
$.lang.register('twitter.set.reward.points.usage', 'Verwendung: !twitter set reward points [points]. Aktuell $1. Legen Sie den Belohnungsmenge für Retweets fest.');
$.lang.register('twitter.set.reward.points.success', 'Setzt Twitter Retweet Belohnungen auf $1.');
$.lang.register('twitter.set.reward.cooldown.usage', 'Verwendung: !twitter set reward cooldown [Stunden]. Aktuell $1. Stunden, die die Benutzer zwischen den Belohnungen warten müssen.');
$.lang.register('twitter.set.reward.cooldown.success', 'Setzte Twitter Retweet Belohnungs-Abklingzeit auf $1 Stunden.');
$.lang.register('twitter.set.reward.announce.usage', 'Verwendung: !twitter set reward announce [on/off]. Aktuell $1. Aktiviere/Deaktiviere Benachrichtigungen für Retweet Belohnungen.');
$.lang.register('twitter.set.reward.announce.success', 'Setze Twitter Retweet Belohnungsnachrichten auf: $1');
$.lang.register('twitter.post.usage', 'Verwendung: !twitter post [Nachricht]');
$.lang.register('twitter.post.sent', 'An Twitter gesendet: $1');
$.lang.register('twitter.post.failed', 'Fehler beim senden der Nachricht an Twitter');
$.lang.register('twitter.lasttweet', 'Letzter Tweet: $1');
$.lang.register('twitter.lasttweet.disabled', 'Fragt Tweets nicht von der Home- oder Usertimeline ab. ');
$.lang.register('twitter.lastmention', 'Letzte Erwähnung: $1');
$.lang.register('twitter.lastmention.disabled', 'Erwähnungen werden nicht abgefragt.');
$.lang.register('twitter.lastretweet', 'Letzter Retweet: $1');
$.lang.register('twitter.lastretweet.disabled', 'Retweets werden nicht abfragen.');
$.lang.register('twitter.register.usage', 'Verwendung: !twitter register [twitter_id]. Aktuell $1. Registriere/Ändere deine Twitter ID.');
$.lang.register('twitter.register.success', 'Registrierte Ihre Twitter-ID als $1. Zum abmelden verwende "!twitter unregister".');
$.lang.register('twitter.register.notregistered', 'Es ist keine ID registriert!');
$.lang.register('twitter.register.inuse', 'Es ist bereits eine Twitter ID registriert: $1');
$.lang.register('twitter.unregister', 'Deine Twitter ID wurde abgemeldet!');
