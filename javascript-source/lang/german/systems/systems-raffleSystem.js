/*
 * Copyright (C) 2016-2021 phantombot.github.io/PhantomBot
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

$.lang.register('rafflesystem.open.error.opened', 'Eine Verlosung ist bereits im Gange!');
$.lang.register('rafflesystem.open.usage', 'Verwendung: !raffle open [-usetime Minuten | -usepoints Beitrittsgebühr] [Schlüsselwort] [Länge der Verlosung in Minuten] [-followers | -subscribers]. [Schlüsselwort] erforderlich.');
$.lang.register('rafflesystem.open.time', 'Eine Verlosung ist nun geöffnet! Tippe $1 um teilzunehmen. Du musst seit mindestens $2 Minuten im Chat present sein $3 um teilnehmen zu können. $4');
$.lang.register('rafflesystem.open.points', 'Eine Verlosung ist nun geöffnet! Tippe $1 um beizutreten. Teilnahmegebühr $2! $3');
$.lang.register('rafflesystem.open', 'Eine Verlosung ist nun geöffnet! Tippe $1 um an der Verlosung teilzunehmen$2! $3');
$.lang.register('rafflesystem.close.error.closed', 'Derzeit ist keine Verlosung im Gange.');
$.lang.register('rafflesystem.close.success', 'Die Verlosung ist nun geschlossen! Es werden keine Personen mehr angenommen!');
$.lang.register('rafflesystem.winner', 'Gewinner:in dieser Verlosung ist $1! $2');
$.lang.register('rafflesystem.whisper.winner', 'Du hast eine Verlosung im Kanal von $1 gewonnen!');
$.lang.register('rafflesystem.repick.error', 'Es sind keine weiteren Teilnehmenden in der Liste vorhanden.');
$.lang.register('rafflesystem.enter.404', 'Du nimmst an dieser Verlosung bereits teil!');
$.lang.register('rafflesystem.enter.following', 'Du musst diesem Kanal folgen um teilnehmen zu können.');
$.lang.register('rafflesystem.enter.subscriber', 'Du musst Abonnent:in sein, um an dieser Verlosung teilnehmen zu können.');
$.lang.register('rafflesystem.enter.points', 'Du hast nicht genug $1, um an dieser Verlosung teilzunehmen.');
$.lang.register('rafflesystem.enter.time', 'Du bist noch nicht lange genug in diesem Kanal, um an dieser Verlosung teilzunehmen.');
$.lang.register('rafflesystem.usage', 'Verwendung: !raffle [open / close / draw / results / subscriberbonus/ regularbonus / whisperwinner]');
$.lang.register('rafflesystem.results', 'Eine Verlosung ist bereits im Gange! Schlüsselwort: $1 - Teilnehmende: $2');
$.lang.register('rafflesystem.fee', ' - Beitrittsgebühr: $1');
$.lang.register('rafflesystem.subbonus.usage', 'Verwendung: !raffle subscriberbonus [1-10]');
$.lang.register('rafflesystem.subbonus.set', 'Abonnenten Bonusglück auf $1 festgelegt!');
$.lang.register('rafflesystem.regbonus.usage', 'Verwendung: !raffle regularbonus [1-10]');
$.lang.register('rafflesystem.regbonus.set', 'Stammzuschauer Bonusglück auf $1 festgelegt!');
$.lang.register('rafflesystem.whisper.winner.toggle', 'Verlosungsgewinner werden $1 angeflüstert.');
$.lang.register('rafflesystem.raffle.repick.toggle1', 'Verlosungsgewinner werden nicht mehr länger neu ausgelost.');
$.lang.register('rafflesystem.raffle.repick.toggle2', 'Verlosungsgewinner können nun wieder erneut ausgelost werden.');
$.lang.register('rafflesystem.message.usage', 'Verwendung: !raffle message [Nachricht]');
$.lang.register('rafflesystem.message.set', 'Verlosungsnachricht wurde festgelegt zu: "$1"');
$.lang.register('rafflesystem.timer.usage', 'Verwendung: !raffle messagetimer [Minuten]');
$.lang.register('rafflesystem.timer.set', 'Verlosungsnachrichten-Timer wurde auf $1 Minuten gesetzt.');
$.lang.register('rafflesystem.common.following', 'und du musst dem Kanal folgen');
$.lang.register('rafflesystem.common.timer', 'Die Verlosung endet in $1 Minuten.');
$.lang.register('rafflesystem.common.message', 'nicht mehr');
$.lang.register('rafflesystem.open.keyword-exists', 'Das Schlüsselwort darf kein existierender Befehl sein: $1');
$.lang.register('rafflesystem.winner.404', 'Gewinner:in kann nicht ermitteln werden. Niemand hat bei der Verlosung teilgenommen.');
$.lang.register('rafflesystem.isfollowing', '[Follower]');
$.lang.register('rafflesystem.isnotfollowing', '[Kein Follower]');
$.lang.register('rafflesystem.reset', 'Die Verlosung wurde zurückgesetzt.');
