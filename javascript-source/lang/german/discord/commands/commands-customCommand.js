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

$.lang.register('discord.customcommands.addcom.usage', 'Verwendung: !addcom [Befehl] [Antwort]');
$.lang.register('discord.customcommands.addcom.err', 'Der Befehl existiert bereits!');
$.lang.register('discord.customcommands.addcom.success', 'Der Befehl !$1 wurde erstellt.');
$.lang.register('discord.customcommands.editcom.usage', 'Verwendung:! editcom [Befehl] [Antwort]');
$.lang.register('discord.customcommands.editcom.404', 'Der Befehl existiert nicht!');
$.lang.register('discord.customcommands.editcom.success', 'Der Befehl !$1 wurde bearbeitet.');
$.lang.register('discord.customcommands.delcom.usage', 'Verwendung: !delcom [Befehl] [Antwort]');
$.lang.register('discord.customcommands.delcom.404', 'Der Befehl existiert nicht.');
$.lang.register('discord.customcommands.delcom.success', ' Der Befehl !$1 wurde gelöscht.');
$.lang.register('discord.customcommands.permcom.usage', 'Verwendung: !permcom [Befehl] [Berechtigung]');
$.lang.register('discord.customcommands.permcom.404', 'Der Befehl existiert nicht.');
$.lang.register('discord.customcommands.permcom.syntax.error', 'Verwendung: !permcom [Befehl] [Berechtigung] - 0 = Jeder 1 = Administratoren');
$.lang.register('discord.customcommands.permcom.success', 'Berechtigung für Befehl !$1 wurde bearbeitet: $2');
$.lang.register('discord.customcommands.coolcom.usage', 'Verwendung: !coolcom [Befehl] [Zeit in Sekunden]');
$.lang.register('discord.customcommands.coolcom.404', 'Der Befehl existiert nicht!');
$.lang.register('discord.customcommands.coolcom.removed', 'Cooldown für Befehl !$1 wurde entfernt.');
$.lang.register('discord.customcommands.coolcom.success', 'Cooldown für Befehl !$1 geändert zu $2 Sekunden.');
$.lang.register('discord.customcommands.channelcom.usage', 'Verwendung: !channelcom [command] [channel / --global / --list] - Trenne die Kanäle durch Kommas (keine Leerzeichen) für mehrere Channels.');
$.lang.register('discord.customcommands.channelcom.global', 'Der Befehl $1 funktioniert jetzt in jedem Kanal.');
$.lang.register('discord.customcommands.channelcom.success', 'Der Befehl !$1 funktioniert jetzt nur in den folgenden Kanälen: $2.');
$.lang.register('discord.customcommands.channelcom.404', 'Für diesen Befehl sind keine Kanäle gesetzt.');
$.lang.register('discord.customcommands.commands', 'Befehle: $1');
$.lang.register('discord.customcommands.bot.commands', 'Bot Befehle: $1');
$.lang.register('discord.customcommands.pricecom.usage', 'Verwendung: !pricecom [Befehl] [Kosten]');
$.lang.register('discord.customcommands.pricecom.success', 'Befehl !$1 kostet ab sofort $2.');
$.lang.register('discord.customcommands.aliascom.usage', 'Verwendung: !aliascom [Alias] [Befehl]');
$.lang.register('discord.customcommands.aliascom.success', 'Befehl !$2 reagiert nun auf den Alias !$1.');
$.lang.register('discord.customcommands.delalias.usage', 'Verwendung: !delalias [Alias]');
$.lang.register('discord.customcommands.delalias.success', 'Alias !$1 wurde entfernt.');
$.lang.register('discord.customcommands.404', 'Der Befehl existiert nicht.');
$.lang.register('discord.customcommands.alias.404', 'Dieser Alias existiert nicht.');
$.lang.register('discord.customcommands.customapi.404', 'Der Befehl !$1 benötigt Parameter.');
$.lang.register('discord.customcommands.customapijson.err', '!$1: Bei der Verarbeitung der API ist ein Fehler aufgetreten.');
