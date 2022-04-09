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

$.lang.register('auctionsystem.usage', 'Verwendung: !auction open (Schritte) (Mindestgebot) [Optionale Parameter: (Auto-Close-Timer) (nopoints)]');
$.lang.register('auctionsystem.set.usage', 'Verwendung: !auction set (Verlängerungstimer). Es sind maximal 29 und mindestens 6 erlaubt.');
$.lang.register('auctionsystem.set', 'Die Verlängerungszeit wurde erfolgreich auf $1 festgelegt.');
$.lang.register('auctionsystem.err.opened', 'Es läuft bereits eine Auktion!');
$.lang.register('auctionsystem.opened', 'Die Auktion ist nun eröffnet! Du kannst Gebote in Schritten von $1 abgeben. Kleinstes, erlaubtes Gebot sind $2! Gib Gebote mit "!bid [Gebot]" ab.');
$.lang.register('auctionsystem.auto.timer.msg', 'Auktion endet automatisch in $1 Sekunden!');
$.lang.register('auctionsystem.err.closed', 'Derzeit läuft keine Auktion.');
$.lang.register('auctionsystem.err.no.bids', 'Auktion geschlossen! Niemand hat ein Gebot abgegeben.');
$.lang.register('auctionsystem.closed', 'Auktion geschlossen! $1 hat die Auktion gewonnen, mit einem Gebot von $2! Glückwunsch!');
$.lang.register('auctionsystem.warnTime.force', 'Die Auktion endet in $1 Sekunden! Aktueller Höchstbietender ist $2 mit $3! Haben wir $4?');
$.lang.register('auctionsystem.warnTime.newBid', 'Neuer Höchstbietender ist 2 $ mit 3 $! Die Auktion bleibt für weitere $1 Sekunden offen! Haben wir $4?');
$.lang.register('auctionsystem.warnTime', 'Die Auktion endet in $1 Sekunden! Aktueller Höchstbietender ist $2 mit $3!');
$.lang.register('auctionsystem.warn.force', 'Die Auktion steht kurz vor dem Ende! Aktuelle:r Höchstbietende:r ist $1 mit einem Gebot von $2! Haben wir vielleicht noch $3?');
$.lang.register('auctionsystem.warn', 'Aktuelle:r Höchstbietende:r ist $1 mit einem Gebot von $2!');
$.lang.register('auctionsystem.bid.usage', 'Verwendung: !bid [Gebot]');
$.lang.register('auctionsystem.err.bid.minimum', 'Du kannst nicht weniger als $1 bieten!');
$.lang.register('auctionsystem.err.points', 'Du hast nicht genug $1 um zu bieten. Ihr Guthaben beträgt $2.');
$.lang.register('auctionsystem.err.increments', 'Diese Auktion läuft in Schritten von $1!Das nächste Gebot beträgt $2');
$.lang.register('auctionsystem.bid', '$1 bot gerade $2! Haben wir $3?');
$.lang.register('auctionsystem.lastWinner.err', 'Es wurde noch keine Auktion abgeschlossen! Kein Gewinner zu zeigen.');
$.lang.register('auctionsystem.lastWinner', 'Das Höchstgebot der letzten Auktionen war $2 von $1! Glückwunsch!');