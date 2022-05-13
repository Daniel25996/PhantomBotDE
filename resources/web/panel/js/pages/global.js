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

// Script that handles all of the global things.

$(function () {
    // Dark mode toggle.
    $('#dark-mode-toggle').on('click', function () {
        // Update the toggle.
        socket.updateDBValue('panel_dark_mode_toggle', 'panelData', 'isDark', $(this).is(':checked'), function () {
            window.location.reload();
        });
    });

    // the button that restarts the bot, if configured
    $('#restart-bot-btn').on('click', function () {
        if (!$('#restart-bot-btn').hasClass('disabled')) {
            toastr.info('Starte den Bot neu...', 'Restart', {timeOut: 3000});
            socket.wsEvent('restart-bot', 'RestartRunner', '', [], function (e) {});
        }
    });

    $('#set-online-btn').on('click', function () {
        socket.sendCommand('set-online', getBotName() + ' forceonline', function (e) {});
    });

    $('#set-offline-btn').on('click', function () {
        socket.sendCommand('set-offline', getBotName() + ' forceoffline', function (e) {});
    });

    socket.addListener('restart-bot-result', function (e) {
        if (e.code === -3) {
            if (e.success) {
                $('#restart-bot-btn').removeClass('disabled');
            } else {
                $('#restart-bot-btn').addClass('disabled');
            }
        } else if (e.success) {
            toastr.success('Neustart erfolgreich', 'Restart', {timeOut: 3000});
        } else if (e.code === -2) {
            toastr.error('Neustart mit einer Ausnahme fehlgeschlagen. Die Ausnahme kann in den Kernfehlerprotokollen gefunden werden', 'Restart', {timeOut: 3000});
        } else if (e.code === -1) {
            toastr.error('Neustart fehlgeschlagen. OS kann nicht ermittelt werden oder OS wird nicht unterstützt', 'Restart', {timeOut: 3000});
        } else {
            toastr.error('Neustart fehlgeschlagen. Der Interpreter hat den Beendigungscode zurückgegeben ' + e.code, 'Restart', {timeOut: 3000});
        }
    });

    socket.wsEvent('restart-bot-check', 'RestartRunner', '', [], function (e) {});

    // the button that signs out.
    $('#sign-out-btn').on('click', function () {
        toastr.info('Signing out...', '', {timeOut: 0});
        socket.close();
        window.sessionStorage.removeItem("webauth");
        window.location = window.location.origin + window.location.pathname + 'login/#logoutSuccess=true';
    });

    // Load the display name.
    $(function () {
        $('#main-name, #second-name').text(getDisplayName());
    });

    // Check if Discord is enabled.
    socket.getDBValue('get_discord_status_index', 'panelData', 'hasDiscord', function (e) {
        // Remove the tab if we are not using Discord.
        if (e.panelData !== 'true') {
            $('#discord_index_tab').remove();
            return;
        }
    });

    // Get bot updates.
    socket.getDBValue('get_bot_updates', 'settings', 'newrelease_info', function (e) {
        if (e.settings !== null) {
            e.settings = e.settings.split('|');

            helpers.handleNewBotUpdate(e.settings[0], e.settings[1]);
        }

        // Check for updates every 30 seconds.
        if (helpers.isDoUpdateLoop === undefined) {
            helpers.isDoUpdateLoop = true;

            // This timer is global and will never get killed.
            setInterval(function () {
                helpers.log('Ausführen der Bot-Versionsprüfung.', helpers.LOG_TYPE.INFO);

                socket.getDBValue('get_bot_updates', 'settings', 'newrelease_info', function (e) {
                    if (e.settings !== null) {
                        e.settings = e.settings.split('|');

                        helpers.handleNewBotUpdate(e.settings[0], e.settings[1]);
                    }
                });
            }, 3e4);
        }
    });

    socket.getBotVersion('get_autorefresh', function (e) {
        if (e['autorefreshoauth'] !== null && e['autorefreshoauth'] !== undefined && !e['autorefreshoauth']) {
            let html = 'Es scheint, als ob du die Automatische Aktualisierung der OAuth-Token nicht eingerichtet hast. Es wird dringend empfohlen, dies einzustellen, '
                    + 'um die neuesten Funktionen zu genießen und um zu vermeiden, dass der aktuelle Token abläuft. Du kannst dies ' +
                    $('<a/>', {'target': '_blank', 'rel': 'noopener noreferrer'}).prop('href', '../oauth/').append('hier')[0].outerHTML + ' einrichten.';
            toastr.warning('OAuth-Token werden möglicherweise nicht automatisch aktualisiert!', {
                'timeOut': 2000
            });
            helpers.addNotification($('<a/>', {
                'href': 'javascript:void(0);',
                'click': function () {
                    helpers.getModal('pb-oauth', 'PhantomBot OAuth Token', 'Ok', $('<form/>', {
                        'role': 'form'
                    })
                            .append($('<p/>', {
                                'html': html
                            })), function () {
                        $('#pb-oauth').modal('toggle');
                    }).modal('toggle');
                }
            }).append($('<i/>', {
                'class': 'fa fa-warning text-yellow'
            })).append('OAuth Token werden nicht aktualisiert'));
        }
    });
});
