/*
 * Copyright (C) 2022 phantombot.github.io/PhantomBot
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

(function() {
    var state = {
        alphaFilter: false,
        lockdown: false,
        timer: null
    };
    var alphaFilter = /([^a-z0-9\s!@,.?:;"\u201C\u201D'\u2019+=\-_#$%^&*()])/ig;
    
    /**
     * @event ircChannelMessage
     */
    $.bind('ircChannelMessage', function(event) {
        if (state.alphaFilter && $.test(event.getMessage(), alphaFilter)) {
            Packages.tv.phantombot.PhantomBot.instance().getSession().sayNow('.timeout ' + event.getSender() + '\'s Nachricht wurde durch den Lockdown-Alphafilter blockiert.');
        }
    });

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var command = event.getCommand(),
            args = event.getArgs();

        if (command.equalsIgnoreCase('lockdown')) {
            if (args.length === 0 && !state.lockdown) {
                /*Packages.tv.phantombot.PhantomBot.instance().getSession().sayNow('.clear');*/
                Packages.tv.phantombot.PhantomBot.instance().getSession().sayNow('.emoteonly');
                state.lockdown = true;
                Packages.tv.phantombot.PhantomBot.instance().getSession().sayNow('/me === LOCKDOWN AKTIVIERT === Der Chat wurde in den Emoteonly-Modus versetzt, da ein Moderator den Chat-Lockdown initiiert hat. Um den Lockdown zu beenden, muss ein Moderator folgendes schreiben: !lockdown end');

                /*setTimeout(function() {
                    Packages.tv.phantombot.PhantomBot.instance().getSession().sayNow('/me === LOCKDOWN AKTIVIERT === Der Chat wurde in den Emoteonly-Modus versetzt, da ein Moderator den Chat-Lockdown initiiert hat. Um den Lockdown zu beenden, muss ein Moderator folgendes schreiben: !lockdown end');
                }, 5e3);*/
                
                state.timer = setInterval(function() {
                    Packages.tv.phantombot.PhantomBot.instance().getSession().sayNow('/me === LOCKDOWN AKTIVIERT === Der Chat wurde in den Emoteonly-Modus versetzt, da ein Moderator den Chat-Lockdown initiiert hat. Um den Lockdown zu beenden, muss ein Moderator folgendes schreiben: !lockdown end');
                }, 300e3);
            } else if(args.length > 0 && args[0].equalsIgnoreCase('help')) {
                $.say('Lockdown Modul >> !lockdown - Sperrt den Chat mit dem Emoteonly-Modus. Laufende Nachricht alle 5 Minuten >> !lockdown end - Beendet einen Lockdown >> !lockdown alphafilter - Schaltet die Beschränkung der erlaubten Zeichen im Chat um');
            } else if(args.length > 0 && args[0].equalsIgnoreCase('end') && state.lockdown) {
                Packages.tv.phantombot.PhantomBot.instance().getSession().sayNow('/me === LOCKDOWN BEENDET === Der Lockdown wird jetzt aufgehoben. Bitte benehmt euch alle. Ein Moderator kann einen weiteren Lockdown starten, indem er folgendes schreibt: !lockdown');
                Packages.tv.phantombot.PhantomBot.instance().getSession().sayNow('.emoteonlyoff');
                state.lockdown = false;
                clearInterval(state.timer);
            } else if(args.length > 0 && args[0].equalsIgnoreCase('alphafilter')) {
                state.alphaFilter = !state.alphaFilter;
                $.say('Die Alpha-Einschränkung für den Lockdown ist jetzt ' + (state.alphaFilter ? 'aktiviert' : 'deaktiviert'));
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        $.registerChatCommand('./core/lockdown.js', 'lockdown', 2);
    });
})();
