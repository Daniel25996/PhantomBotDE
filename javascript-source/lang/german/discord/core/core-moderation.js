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

$.lang.register('moderation.usage', 'Verwendung: !moderation [links / caps / spam / blacklist / whitelist / cleanup / logs]');
$.lang.register('moderation.links.usage', 'Verwendung: !moderation links [toggle / Permitzeit]');
$.lang.register('moderation.links.toggle', 'Link Moderation wurde $1.');
$.lang.register('moderation.links.permit.time.usage', 'Verwendung: !moderation links permittime [Sekunden]');
$.lang.register('moderation.links.permit.time.set', 'Permit Zeit geändert zu $1 Sekunden!');
$.lang.register('moderation.caps.usage', 'Verwendung: !moderation caps [toggle / triggerlength / limitpercent]');
$.lang.register('moderation.caps.toggle', 'Caps Moderation wurde $1.');
$.lang.register('moderation.caps.trigger.usage', 'Verwendung: !moderation caps triggerlength [Zeichenzahl]');
$.lang.register('moderation.caps.trigger.set', 'Caps trigger limit wurde geändert zu $1%');
$.lang.register('moderation.caps.limit.usage', 'Verwendung: !moderation caps limitpercent [Prozent]');
$.lang.register('moderation.caps.limit.set', 'Caps limit umgestellt zu $1%');
$.lang.register('moderation.long.message.usage', 'Verwendung: !moderation longmessage [toggle / limit]');
$.lang.register('moderation.long.message.toggle', 'Moderation für lange Nachrichten wurde $1.');
$.lang.register('moderation.long.message.limit.usage', 'Verwendung: !moderation longmessage limit [Zeichenzahl]');
$.lang.register('moderation.long.message.limit.set', 'Limit für Lange Nachrichten geändert zu $1 zeichen!');
$.lang.register('moderation.spam.usage', 'Verwendung: !moderation spam [toggle / limit]');
$.lang.register('moderation.spam.toggle', 'Spam moderation wurde $1.');
$.lang.register('moderation.spam.limit.usage', 'Verwendung: !moderation spam limit [Nachrichten]');
$.lang.register('moderation.spam.limit.set', 'Spam limit wurde umgestellt auf $1 Nachricht/en!');
$.lang.register('moderation.blacklist.usage', 'Verwendung: !moderation blacklist [add / remove / list]');
$.lang.register('moderation.blacklist.add.usage', 'Verwendung: !moderation blacklist add [Ausdruck]');
$.lang.register('moderation.blacklist.add.success', 'Ausdruck wurde der Verbotsliste hinzugefügt.');
$.lang.register('moderation.blacklist.remove.usage', 'Verwendung: !moderation blacklist remove [Ausdruck]');
$.lang.register('moderation.blacklist.remove.404', 'Der Ausdruck ist nicht auf der Blacklist!');
$.lang.register('moderation.blacklist.remove.success', 'Ausdruck erfolgreich von der Verbotsliste entfernt.');
$.lang.register('moderation.blacklist.list.404', 'Die Verbotsliste ist leer.');
$.lang.register('moderation.blacklist.list', 'Verbotsliste: ```$1```');
$.lang.register('moderation.whitelist.usage', 'Verwendung: !moderation whitelist [add / remove / list]');
$.lang.register('moderation.whitelist.add.usage', 'Verwendung: !moderation whitelist add [Wort/Satz oder Name#Zahl]');
$.lang.register('moderation.whitelist.add.success', 'Wort/Satz/Benutzername zur Ausnahmenliste hinzugefügt.');
$.lang.register('moderation.whitelist.remove.usage', 'Usage: !moderation whitelist remove [Wort/Satz oder Name#Zahl]');
$.lang.register('moderation.whitelist.remove.404', 'Wort/Satz/Benutzername ist nicht auf der Ausnahmenliste!');
$.lang.register('moderation.whitelist.remove.success', 'Wort/Satz/Benutzername von der Ausnahmenliste gelöscht.');
$.lang.register('moderation.whitelist.list.404', 'Die Ausnahmenliste ist leer.');
$.lang.register('moderation.whitelist.list', 'Ausnahmenliste: ```$1```');
$.lang.register('moderation.cleanup.usage', 'Verwendung: !moderation cleanup [Kanal] [Anzahl]');
$.lang.register('moderation.cleanup.err.amount', 'Du kannst nur 2 bis 10.000 Nachrichten löschen.');
$.lang.register('moderation.cleanup.err.unknownchannel', 'Unbekannter Kanal: $1. Versuchen Sie die automatische Vervollständigung von Discord.');
$.lang.register('moderation.cleanup.failed', 'Kann Befehl nicht ausführen: bin schon dabei.');
$.lang.register('moderation.cleanup.failed.err', 'Kann Befehl nicht ausführen.');
$.lang.register('moderation.cleanup.done', '$1 Nachrichten gelöscht.');
$.lang.register('moderation.logs.toggle.usage', 'Verwendung: !moderation logs [toggle / channel] - Schaltet die Twitch-Moderationsprotokolle um, die in Discord veröffentlicht werden.');
$.lang.register('moderation.logs.toggle', 'Twitch Moderations Logs $1. **[Bitte Bot neu starten]**');
$.lang.register('moderation.logs.channel.usage', 'Verwendung: !moderation logs channel [Kanalname]');
$.lang.register('moderation.logs.channel.set', 'Ankündigungen des Twitch-Moderationsprotokolls werden jetzt im Kanal $1 gemacht.');
