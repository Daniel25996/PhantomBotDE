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

// Function that queries all of the data we need.
$(run = function() {
    // Query all commands.
    socket.getDBTableValues('discord_commands_get_all', 'discordPermcom', function(results) {
        socket.getDBTableValues('discord_custom_commands_get_all', 'discordCommands', function(customCommands) {
            socket.getDBValue('discord_default_cmds_roles', 'discordPermsObj', 'obj', function(permObj) {
                let tableData = [],
                    cmds = [];

                permObj = JSON.parse(permObj.discordPermsObj);

                // Get all custom commands.
                for (let i = 0; i < customCommands.length; i++) {
                    cmds.push(customCommands[i].key);
                }

                for (let i = 0; i < results.length; i++) {
                    if (cmds.indexOf(results[i].key) !== -1 || results[i].key.indexOf(' ') !== -1) {
                        continue;
                    }

                    // Get all permissions for commands, this is slow, might need to make it better later.
                    let permJson = JSON.parse(results[i].value),
                        perms = {
                        'permissions': [],
                        'roles': []
                    };

                    for (let j = 0; j < permObj.roles.length; j++) {
                        if (permJson.roles.indexOf(permObj.roles[j]._id) > -1) {
                            perms.roles.push(permObj.roles[j].name);
                        }
                    }

                    // No loop needed here since there's just one permission for now.
                    if (permJson.permissions[0].selected == 'true') {
                        perms.permissions.push(permJson.permissions[0].name);
                    }

                    tableData.push([
                        '!' + results[i].key,
                        (perms.roles.length > 0 ? perms.roles.join(', ') : 'None'),
                        (perms.permissions.length > 0 ? perms.permissions.join(', ') : 'None'),
                        $('<div/>', {
                            'class': 'btn-group'
                        }).append($('<button/>', {
                            'type': 'button',
                            'class': 'btn btn-xs btn-danger',
                            'style': 'float: right',
                            'data-toggle': 'tooltip',
                            'title': 'Löscht die Befehlsberechtigung und setzt sie beim Start auf die Standardeinstellung zurück. Dadurch wird der Befehl nicht entfernt, es sei denn, er existiert nicht mehr.',
                            'data-command': results[i].key,
                            'html': $('<i/>', {
                                'class': 'fa fa-refresh'
                            })
                        })).append($('<button/>', {
                            'type': 'button',
                            'class': 'btn btn-xs btn-warning',
                            'style': 'float: right',
                            'data-command': results[i].key,
                            'html': $('<i/>', {
                                'class': 'fa fa-edit'
                            })
                        })).html()
                    ]);
                }

                // if the table exists, destroy it.
                if ($.fn.DataTable.isDataTable('#discordDefaultCommandsTable')) {
                    $('#discordDefaultCommandsTable').DataTable().destroy();
                    // Remove all of the old events.
                    $('#discordDefaultCommandsTable').off();
                }

                // Create table.
                const table = $('#discordDefaultCommandsTable').DataTable({
                    'searching': true,
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/German.json"
                    },
                    'autoWidth': false,
                    'data': tableData,
                    'columnDefs': [
                        { 'className': 'default-table-large', 'orderable': false, 'targets': 3 },
                        { 'width': '45%', 'targets': 0 }
                    ],
                    'columns': [
                        { 'title': 'Befehl' },
                        { 'title': 'Zulässige Rollen' },
                        { 'title': 'Zulässige Berechtigungen' },
                        { 'title': 'Aktionen' }
                    ]
                });

                // On delete button.
                table.on('click', '.btn-danger', function() {
                    let command = $(this).data('command'),
                        row = $(this).parents('tr'),
                        t = $(this);

                    // Ask the user if he want to reset the command.
                    helpers.getConfirmDeleteModal('discord_default_command_modal_remove', 'Bist du sicher, dass du die Berechtigung des Befehls zurücksetzen möchtest?', false,
                            'Die Berechtigung des Befehls wurde zurückgesetzt!', function() {
                        socket.removeDBValue('discord_permcom_temp_del', 'discordPermcom', command, function(e) {
                            // Hide tooltip.
                            t.tooltip('hide');
                            // Remove the table row.
                            table.row(row).remove().draw(false);
                        });
                    });
                });

                // On edit button.
                table.on('click', '.btn-warning', function() {
                    let command = $(this).data('command');

                    // Get all the info about the command.
                    socket.getDBValues('default_command_edit', {
                        tables: ['discordPricecom', 'discordPermcom', 'discordAliascom', 'discordChannelcom', 'discordCooldown', 'discordPermsObj'],
                        keys: [command, command, command, command, command, 'obj']
                    }, function(e) {
                        let cooldownJson = (e.discordCooldown === null ? { globalSec: -1, userSec: -1 } : JSON.parse(e.discordCooldown)),
                            perm = JSON.parse(e.discordPermcom),
                            perms = JSON.parse(e.discordPermsObj);

                        // Get advance modal from our util functions in /utils/helpers.js
                        helpers.getAdvanceModal('edit-command', 'Befehl Bearbeiten', 'Speichern', $('<form/>', {
                            'role': 'form'
                        })
                        // Append input box for the command name. This one is disabled.
                        .append(helpers.getInputGroup('command-name', 'text', 'Befehl', '', '!' + command, 'Name des Befehls. Dieser kann nicht bearbeitet werden.', true))
                        // Append a select option for the command permission.
                        .append(helpers.getMultiDropdownGroup('command-permission', 'Zulässige Rollen und Berechtigungen', [
                            {
                                'title': 'Berechtigungen',
                                'options': perm.permissions
                            },
                            {
                                'title': 'Rollen',
                                'selected': perm.roles,
                                'options': perms.roles
                            }
                        ], 'Welche Rollen dürfen diesen Befehl ausführen? Die Administratorberechtigung ist Personen mit der Administratorberechtigung, die für ihre Rolle in Discord ausgewählt wurde'))
                        // Add an advance section that can be opened with a button toggle.
                        .append($('<div/>', {
                            'class': 'collapse',
                            'id': 'advance-collapse',
                            'html': $('<form/>', {
                                    'role': 'form'
                                })
                            // Append input box for the command cost.
                            .append(helpers.getInputGroup('command-cost', 'number', 'Kosten', '0', helpers.getDefaultIfNullOrUndefined(e.discordPricecom, '0'),
                                'Kosten in Punkten, die dem Benutzer bei der Ausführung des Befehls abgezogen werden.'))
                            // Append input box for the command channel.
                            .append(helpers.getInputGroup('command-channel', 'text', 'Kanal', '#commands', helpers.getDefaultIfNullOrUndefined(e.discordChannelcom, ''),
                                'Kanal, in dem dieser Befehl funktionieren soll. Trennen Sie mit Leerzeichen und Komma für mehrere. Wenn leer, funktioniert der Befehl in allen Kanälen.'))
                            // Append input box for the command alias.
                            .append(helpers.getInputGroup('command-alias', 'text', 'Alias', '!ex', helpers.getDefaultIfNullOrUndefined(e.discordAliascom, ''),
                                'Ein weiterer Befehlsname, der auch diesen Befehl auslöst.'))
                            // Append input box for the global command cooldown.
                            .append(helpers.getInputGroup('command-cooldown-global', 'number', 'Globale Abklingzeit (Sekunden)', '-1', cooldownJson.globalSec,
                                'Globale Abklingzeit des Befehls in Sekunden. -1 Verwendet die botweiten Einstellungen.'))
                            // Append input box for per-user cooldown.
                            .append(helpers.getInputGroup('command-cooldown-user', 'number', 'Pro-Benutzer Abklingzeit (Sekunden)', '-1', cooldownJson.userSec,
                                'Abklingzeit des Befehls pro Benutzer in Sekunden. -1 entfernt die Abklingzeit pro Benutzer.'))
                            // Callback function to be called once we hit the save button on the modal.
                        })), function() {
                            let commandName = $('#command-name'),
                                commandPermissions = $('#command-permission option'),
                                commandCost = $('#command-cost'),
                                commandChannel = $('#command-channel'),
                                commandAlias = $('#command-alias'),
                                commandCooldownGlobal = $('#command-cooldown-global'),
                                commandCooldownUser = $('#command-cooldown-user');

                            // Remove the ! and spaces.
                            commandName.val(commandName.val().replace(/\!/g, '').toLowerCase());
                            commandAlias.val(commandAlias.val().replace(/(\!|\s)/g, '').toLowerCase());

                            // Generate all permissions.
                            const permObj = {
                                'roles': [],
                                'permissions': []
                            };

                            commandPermissions.each(function() {
                                var section = $(this).parent().attr('label');

                                // This is a permission.
                                if (section == 'Berechtigungen') {
                                    permObj.permissions.push({
                                        'name': $(this).html(),
                                        'selected': $(this).is(':selected').toString()
                                    });
                                } else if ($(this).is(':selected')) {
                                    permObj.roles.push($(this).attr('id'));
                                }
                            });

                            // Handle each input to make sure they have a value.
                            switch (false) {
                                case helpers.handleInputString(commandName):
                                case helpers.handleInputNumber(commandCooldownGlobal, -1):
                                case helpers.handleInputNumber(commandCooldownUser, -1):
                                    break;
                                default:
                                    // Save command information here and close the modal.
                                    socket.updateDBValues('custom_command_add', {
                                        tables: ['discordPricecom', 'discordPermcom'],
                                        keys: [commandName.val(), commandName.val(), commandName.val()],
                                        values: [commandCost.val(), JSON.stringify(permObj)]
                                    }, function() {
                                        if (commandChannel.val().length > 0) {
                                            socket.updateDBValue('discord_channel_command_cmd', 'discordChannelcom', commandName.val(), commandChannel.val(), new Function());
                                        } else {
                                            socket.removeDBValue('discord_channel_command_cmd', 'discordChannelcom', commandName.val(), new Function());
                                        }

                                        if (commandAlias.val().length > 0) {
                                            socket.updateDBValue('discord_alias_command_cmd', 'discordAliascom', commandName.val(), commandAlias.val(), new Function());
                                        } else {
                                            socket.removeDBValue('discord_alias_command_cmd', 'discordAliascom', commandName.val(), new Function());
                                        }

                                        socket.wsEvent('custom_command_edit_cooldown_ws', './discord/core/commandCoolDown.js', null,
                                            ['add', commandName.val(), commandCooldownGlobal.val(), commandCooldownUser.val()], function () {

                                            // Reload the table.
                                            run();
                                            // Close the modal.
                                            $('#edit-command').modal('hide');
                                            // Tell the user the command was added.
                                            toastr.success('Befehl erfolgreich bearbeitet !' + commandName.val());

                                            // I hate doing this, but the logic is fucked anyways.
                                            helpers.setTimeout(function() {
                                                // Add the cooldown to the cache.
                                                socket.wsEvent('discord', './discord/commands/customCommands.js', '',
                                                    [commandName.val(), JSON.stringify(permObj),
                                                    commandChannel.val(), commandAlias.val(), commandCost.val()], new Function());
                                            }, 5e2);
                                        });
                                    });
                            }
                        }).on('shown.bs.modal', function(e) {
                            $('#command-permission').select2();
                        }).modal('toggle');
                    });
                });
            });
        });
    });
});
