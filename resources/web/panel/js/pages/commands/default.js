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

// Function that querys all of the data we need.
$(function() {
    const getDisabledIconAttr = function(disabled) {
        return {
            class: 'fa disabled-status-icon ' + (disabled ? 'fa-ban text-muted' : 'fa-check'),
            title: disabled ? 'deaktivieren' : 'aktivieren'
        };
    };

    const updateCommandDisabled = function(name, disabled, callback) {
        const wsUpdate = function () {
            socket.wsEvent('command_disabled_update_ws', './core/commandRegister.js', null,
              [disabled ? 'deaktivieren' : 'aktivieren', name], callback);
        };

        if (disabled) {
            socket.updateDBValue('command_disabled_update', 'disabledCommands', name, true, wsUpdate);
        } else {
            socket.removeDBValue('command_disabled_remove', 'disabledCommands', name, wsUpdate);
        }
    };

    // Query all commands.
    socket.getDBTableValues('commands_get_all', 'permcom', function(results) {
        socket.getDBTableValues('custom_commands_get_all', 'command', function(customCommands) {
            socket.getDBTableValues('disabled_commands_get_all', 'disabledCommands', function(disabledCommands) {
                let tableData = [],
                    cmds = {},
                    disabled = {};

                for (let i = 0; i < customCommands.length; i++) {
                    cmds[customCommands[i].key] = true;
                }

                for (let i = 0; i < disabledCommands.length; i++) {
                    disabled[disabledCommands[i].key] = true;
                }

                for (let i = 0; i < results.length; i++) {
                    if (cmds.hasOwnProperty(results[i].key)) {
                        continue;
                    }

                    tableData.push([
                        '!' + results[i].key,
                        helpers.getGroupNameById(results[i].value),
                        $('<div/>')
                          .append($('<i/>',
                              getDisabledIconAttr(disabled.hasOwnProperty(results[i].key))
                          ))
                          .html(),
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
                if ($.fn.DataTable.isDataTable('#defaultCommandsTable')) {
                    $('#defaultCommandsTable').DataTable().destroy();
                    // Remove all of the old events.
                    $('#defaultCommandsTable').off();
                }

                // Create table.
                let table = $('#defaultCommandsTable').DataTable({
                    'searching': true,
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/German.json"
                    },
                    'autoWidth': false,
                    'data': tableData,
                    'columnDefs': [
                        { 'className': 'default-table-large', 'orderable': false, 'targets': [2, 3] },
                        { 'width': '45%', 'targets': 0 }
                    ],
                    'columns': [
                        { 'title': 'Befehl' },
                        { 'title': 'Benutzerlevel' },
                        { 'title': 'Status' },
                        { 'title': 'Aktionen' }
                    ]
                });

                // On delete button.
                table.on('click', '.btn-danger', function() {
                    let command = $(this).data('command'),
                        row = $(this).parents('tr'),
                        t = $(this);

                    // Ask the user if he want to reset the command.
                    helpers.getConfirmDeleteModal('default_command_modal_remove', 'Bist du sicher, dass du die Berechtigung des Befehls zurücksetzen möchtest?', false,
                            'Die Berechtigung des Befehls wurde zurückgesetzt!', function() {
                        socket.removeDBValue('permcom_temp_del', 'permcom', command, function(e) {
                            // Hide tooltip.
                            t.tooltip('hide');
                            // Remove the table row.
                            table.row(row).remove().draw(false);
                        });
                    });
                });

                // On edit button.
                table.on('click', '.btn-warning', function() {
                    let command = $(this).data('command'),
                        t = $(this);

                    // Get all the info about the command.
                    socket.getDBValues('default_command_edit', {
                        tables: ['permcom', 'cooldown', 'pricecom', 'paycom', 'disabledCommands'],
                        keys: [command, command, command, command, command]
                    }, function(e) {
                        let cooldownJson = (e.cooldown === null ? { isGlobal: 'true', seconds: 0 } : JSON.parse(e.cooldown));

                        // Get advance modal from our util functions in /utils/helpers.js
                        helpers.getAdvanceModal('edit-command', 'Befehl bearbeiten', 'Speichern', $('<form/>', {
                            'role': 'form'
                        })
                        // Append input box for the command name. This one is disabled.
                        .append(helpers.getInputGroup('command-name', 'text', 'Befehl', '', '!' + command, 'Name des Befehls. Dieser kann nicht bearbeitet werden.', true))
                        // Append a select option for the command permission.
                        .append(helpers.getDropdownGroup('command-permission', 'Benutzerlevel', helpers.getGroupNameById(e.permcom),
                            ['Caster', 'Administrator', 'Moderator', 'Abonnent', 'Spender', 'VIP', 'Stammzuschauer', 'Zuschauer']))
                        // Add an advance section that can be opened with a button toggle.
                        .append($('<div/>', {
                            'class': 'collapse',
                            'id': 'advance-collapse',
                            'html': $('<form/>', {
                                    'role': 'form'
                                })
                                // Append input box for the command cost.
                                .append(helpers.getInputGroup('command-cost', 'number', 'Kosten', '0', helpers.getDefaultIfNullOrUndefined(e.pricecom, '0'),
                                    'Kosten in Punkten, die dem Benutzer bei der Ausführung des Befehls abgezogen werden.'))
                                // Append input box for the command reward.
                                .append(helpers.getInputGroup('command-reward', 'number', 'Belohnung', '0', helpers.getDefaultIfNullOrUndefined(e.paycom, '0'),
                                    'Belohnung in Punkten, die der Benutzer beim Ausführen des Befehls erhalten soll.'))
                                // Append input box for the command cooldown.
                                .append(helpers.getInputGroup('command-cooldown', 'number', 'Abklingzeit (Sekunden)', '5', cooldownJson.seconds,
                                    'Abklingzeit des Befehls in Sekunden.')
                                    // Append checkbox for if the cooldown is global or per-user.
                                    .append(helpers.getCheckBox('command-cooldown-global', cooldownJson.isGlobal === 'true', 'Global',
                                        'Wenn diese Option aktiviert ist, wird die Abklingzeit auf alle im Kanal angewendet. Wenn diese Option nicht aktiviert ist, wird die Abklingzeit pro Benutzer angewendet.')))
                                .append(helpers.getCheckBox('command-disabled', e.disabledCommands != null, 'Deaktiviert',
                                    'Wenn diese Option aktiviert ist, kann der Befehl nicht im Chat verwendet werden.'))
                                // Callback function to be called once we hit the save button on the modal.
                        })), function() {
                            let commandPermission = $('#command-permission'),
                                commandCost = $('#command-cost'),
                                commandReward = $('#command-reward'),
                                commandCooldown = $('#command-cooldown'),
                                commandCooldownGlobal = $('#command-cooldown-global').is(':checked'),
                                commandDisabled = $('#command-disabled').is(':checked');

                            // Handle each input to make sure they have a value.
                            switch (false) {
                                case helpers.handleInputNumber(commandCost):
                                case helpers.handleInputNumber(commandReward):
                                case helpers.handleInputNumber(commandCooldown):
                                    break;
                                default:
                                    // Save command information here and close the modal.
                                    socket.updateDBValues('custom_command_edit', {
                                        tables: ['pricecom', 'paycom'],
                                        keys: [command, command],
                                        values: [commandCost.val(), commandReward.val()]
                                    }, function() {
                                        updateCommandDisabled(command, commandDisabled, function () {
                                            // Add the cooldown to the cache.
                                            socket.wsEvent('default_command_edit_cooldown_ws', './core/commandCoolDown.js', null,
                                                ['add', command, commandCooldown.val(), String(commandCooldownGlobal)], function() {
                                                // Edit the command permission.
                                                socket.sendCommand('default_command_permisison_update', 'permcomsilent ' + command + ' ' +
                                                    helpers.getGroupIdByName(commandPermission.find(':selected').text(), true), function() {
                                                    const $tr = t.parents('tr');
                                                    // Update user level value.
                                                    $tr.find('td:eq(1)').text(commandPermission.find(':selected').text());
                                                    // Update status icons
                                                    $tr.find('.disabled-status-icon').attr(getDisabledIconAttr(commandDisabled));
                                                    // Close the modal.
                                                    $('#edit-command').modal('hide');
                                                    // Tell the user the command was edited.
                                                    toastr.success('Befehl !' + command + ' erfolgreich bearbeitet!');
                                                });
                                            });
                                        });
                                    });
                            }
                        }).modal('toggle');
                    });
                });
            });
        });
    });
});
