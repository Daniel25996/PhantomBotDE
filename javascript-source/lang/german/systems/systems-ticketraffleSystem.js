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

$.lang.register('ticketrafflesystem.err.raffle.opened', 'Eine Ticket-Verlosung ist bereits geöffnet!');
$.lang.register('ticketrafflesystem.err.missing.syntax', 'Verwendung: !traffle open [Max. Einträge] [Stammzuschauer-Ticket-Multiplikator (Standard = 1)] [Abonnenten-Ticket-Multiplikator  (Standard = 1)] [Ticketpreis] [-followers]');
$.lang.register('ticketrafflesystem.msg.need.to.be.following', 'Du musst dem Kanal folgen, um teilnehmen zu können.');
$.lang.register('ticketrafflesystem.raffle.opened', 'Die Ticket-Verlosung ist nun geöffnet! Kaufe bis zu $1 Tickets mit !tickets - du kannst mehrmals kaufen. Tickets kosten $2. $3');
$.lang.register('ticketrafflesystem.err.raffle.not.opened', 'Derzeit ist keine Ticket-Verlosung geöffnet!');
$.lang.register('ticketrafflesystem.draw.usage', 'Verwendung: !traffle draw [Anzahl (Standard=1)] [Loyalitäts Punktepreis (Standard = 0)]');
$.lang.register('ticketrafflesystem.err.already.drawn', 'Der/Die Gewinner:innen wurden bereits ausgelost.');
$.lang.register('ticketrafflesystem.raffle.closed', 'Die Ticketverlosung ist nun beendet. Verwende "!traffle draw", um die Gewinnenden zu ziehen.');
$.lang.register('ticketrafflesystem.raffle.closed.and.draw', 'Die Ticketverlosung ist nun geschlossen.');
$.lang.register('ticketrafflesystem.raffle.close.err', 'Die Ticketverlosung ist beendet. Niemand hat teilgenommen.');
$.lang.register('ticketrafflesystem.winner.single', 'Gewinner:in dieser Ticket-Verlosung ist: $1! $2');
$.lang.register('ticketrafflesystem.winner.multiple', 'Die Gewinner:innen dieser Ticketverlosung sind: $1!');
$.lang.register('ticketrafflesystem.winner.single.award', 'Der/Die Gewinner:in wurde ausgezeichnet: $1!');
$.lang.register('ticketrafflesystem.winner.multiple.award', 'Die Gewinner wurden ausgezeichnet: $1 jeder!');
$.lang.register('ticketrafflesystem.only.buy.amount', 'Du kannst nur $1 Ticket(s) kaufen.');
$.lang.register('ticketrafflesystem.only.buy.amount.limiter', 'Du kannst nur $1 Ticket(s) kaufen, weil du einen Bonus von $2% erhältst.');
$.lang.register('ticketrafflesystem.limit.hit', 'Du kannst nicht mehr als $1 Ticket(s) kaufen.');
$.lang.register('ticketrafflesystem.limit.hit.limiter', 'Du darfst maximal $1 Ticket(s) kaufen, da du dafür einen Bonus von $2% erhältst. Du hast derzeit $3 Tickets.');
$.lang.register('ticketrafflesystem.settings.err.open', 'Du kannst diese Einstellung nicht ändern, während eine Verlosung offen ist!');
$.lang.register('ticketrafflesystem.err.not.following', 'Du musst dem Kanal folgen, um teilnehmen zu können.');
$.lang.register('ticketrafflesystem.err.points', 'Du hast nicht genügend $1, um teilzunehmen.');
$.lang.register('ticketrafflesystem.err.not.enoughUsers', 'Es haben nicht genügend Benutzer teilgenommen, um $1 Gewinner:innen zu ziehen.');
$.lang.register('ticketrafflesystem.entered', 'Es sind $1 Teilnehmende für die Ticket-Verlosung eingetragen! ($2 Tickets gesamt)');
$.lang.register('ticketrafflesystem.entered.bonus', '$1 (+ $2 Bonus) Einträge zur Ticketverlosung hinzugefügt! ($3 (+ $4 Bonus) Tickets insgesamt)');
$.lang.register('ticketrafflesystem.usage', 'Verwendung: !traffle open [Max. Einträge] [Stammzuschauer-Ticket-Multiplikator (default = 1)] [Abonnenten-Ticket-Multiplikator  (default = 1)] [Ticketpreis] [-followers]');
$.lang.register('ticketrafflesystem.msg.enabled', 'Nachrichten zur Ticketverlosung wurden aktiviert.');
$.lang.register('ticketrafflesystem.msg.disabled', 'Nachrichten zur Ticketverlosung wurden deaktiviert.');
$.lang.register('ticketrafflesystem.limiter.enabled', 'Ticketbegrenzer aktiviert. Bonustickets zählen zum Ticketlimit!');
$.lang.register('ticketrafflesystem.limiter.disabled', 'Ticketbegrenzer deaktiviert. Bonustickets zählen nicht zum Ticketlimit!');
$.lang.register('ticketrafflesystem.ticket.usage', 'Verwendung: !tickets (Menge / max) - Und du hast aktuell $1 Tickets.');
$.lang.register('ticketrafflesystem.ticket.usage.bonus', 'Verwendung: !tickets (Menge / max) - Und du hast derzeit $1 (+ $2 Bonus) Tickets.');
$.lang.register('ticketrafflesystem.auto.msginterval.set', 'Meldungsintervall auf $1 Minuten festgelegt.');
$.lang.register('ticketrafflesystem.auto.msg.set', 'Meldung auf "$1" festgelegt.');
$.lang.register('ticketrafflesystem.auto.msg.usage', 'Verwendung: !traffle autoannouncemessage [Anzahl in Minuten]');
$.lang.register('ticketrafflesystem.auto.msginterval.usage', 'Verwendung: !traffle autoannounceinterval [Anzahl in Minuten]');
$.lang.register('ticketrafflesystem.reset', 'Die Verlosung wurde zurückgesetzt.');
