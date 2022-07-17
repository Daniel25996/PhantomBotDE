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

$.lang.register('welcomesystem.set.autowelcome.enabled', 'Automatische Begrüßung aktiviert. $1 wird nun neue Chatter willkommen heißen.');
$.lang.register('welcomesystem.set.autowelcome.disabled', 'Automatische Begrüßung deaktiviert.');
$.lang.register('welcomesystem.set.message.empty', '$1 wird nur erstmalige Chatter begrüßen.');
$.lang.register('welcomesystem.set.message.success', '$1 wird neue Chatter mit "$2" begrüßen.');
$.lang.register('welcomesystem.set.firstmessage.empty', '$1 begrüßt erstmalige Chatter mit der Standardnachricht.');
$.lang.register('welcomesystem.set.firstmessage.success', '$1 begrüßt erstmalige Chatter mit: "$2"');
$.lang.register('welcomesystem.set.cooldown.show', 'Aktuelle Abklingzeit $1 Stunden. Verwende: !welcome cooldown [Stunden] um dies zu ändern.');
$.lang.register('welcomesystem.set.cooldown.usage', 'Verwendung: !welcome cooldown [Stunden] z.B. !welcome cooldown 6');
$.lang.register('welcomesystem.set.cooldown.success', 'Die Begrüßungsabklingzeit wurde auf $1 Stunden festgelegt.');
$.lang.register('welcomesystem.set.disableuser.usage', 'Verwendung: !welcome disable (user)');
$.lang.register('welcomesystem.set.disableuser.fail', 'Die Begrüßung von $1 ist bereits deaktiviert.');
$.lang.register('welcomesystem.set.disableuser.success', '$1 wird $2 nicht willkommen heißen.');
$.lang.register('welcomesystem.set.enableuser.usage', 'Verwendung: !welcome enable (user)');
$.lang.register('welcomesystem.set.enableuser.fail', 'Die Begrüßung ist bereits aktiviert.');
$.lang.register('welcomesystem.set.enableuser.success', '$1 wird $2 willkommen heißen.');
$.lang.register('welcomesystem.generalusage', 'Verwendung: !welcome [toggle | setmessage text | setfirstmessage text | disable user | enable user]. Tags für Nachrichtentext: (names), (1 Text für einen Namen), (2 für Zwei), (3 für Drei oder mehr Namen)');
$.lang.register('welcomesystem.names.join1', ', ');
$.lang.register('welcomesystem.names.join2', ' und ');
