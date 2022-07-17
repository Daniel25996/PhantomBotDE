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

$.lang.register('discord.gambling.need.points', 'Du hast nicht genug $1.');
$.lang.register('discord.gambling.error.max', 'Du kannst maximal $1 setzen.');
$.lang.register('discord.gambling.error.min', 'Du musst mindestens $1 setzen.');
$.lang.register('discord.gambling.lost', '$1 rollte eine $2 und verliert $3 von $4. $5'); // Verwende $4 für die verbleibenden Punkte des Benutzers
$.lang.register('discord.gambling.won', '$1 rollte eine $2 und gewinnt $3! $5'); // Verwende $4 für die verbleibenden Punkte des Benutzers
$.lang.register('discord.gambling.usage', 'Verwendung: !gamble [Betrag / all / half]');
$.lang.register('discord.gambling.set.max.usage', 'Verwendung: !gambling setmax [Betrag]');
$.lang.register('discord.gambling.set.max', 'Maximalen Einsatz geändert: $1!');
$.lang.register('discord.gambling.set.min.usage', 'Verwendung: !gambling setmin [Betrag]');
$.lang.register('discord.gambling.set.min', 'Minimalen Einsatz geändert: $1!');
$.lang.register('discord.gambling.win.range.usage', 'Verwendung: !gambling setwinningrange [Gewinnspanne]');
$.lang.register('discord.gambling.win.range', 'Gewinnspanne geändert: $1-100 Alles zwischen 1-$2 ist verloren');
$.lang.register('discord.gambling.percent.usage', 'Verwendung: !gambling setgainpercent [Betrag]');
$.lang.register('discord.gambling.percent', 'Prozentualer Gewinn geändert: $1%');
$.lang.register('discord.gambling.main.usage', 'Verwendung: !gambling [setmax / setmin / setwinningrange / setgainpercent]');
