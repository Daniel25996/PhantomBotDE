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
    // Check if the module is enabled.
    socket.getDBValue('greetings_module_toggle', 'modules', './systems/greetingSystem.js', function(e) {
        // If the module is off, don't load any data.
        if (!helpers.handleModuleLoadUp('greetingsModule', e.modules)) {
            return;
        }

        // Get all greetings.
        socket.getDBTableValues('get_all_greetings', 'greeting', function(results) {
            let tableData = [];

            helpers.temp.defaultMessage = results[1].value; // The default message is saved in the second entry

            for (let i = 3; i < results.length; i++) {
                // The first three entries are settings for the greeting system

                tableData.push([
                    i,
                    results[i].key, // Username.
                    results[i].value, // Message.
                    $('<div/>', {
                        'class': 'btn-group'
                    }).append($('<button/>', {
                        'type': 'button',
                        'class': 'btn btn-xs btn-danger',
                        'style': 'float: right',
                        'data-greeting': results[i].key,
                        'html': $('<i/>', {
                            'class': 'fa fa-trash'
                        })
                    })).append($('<button/>', {
                        'type': 'button',
                        'class': 'btn btn-xs btn-warning',
                        'style': 'float: right',
                        'data-greeting': results[i].key,
                        'html': $('<i/>', {
                            'class': 'fa fa-edit'
                        })
                    })).html()
                ]);
            }

            // if the table exists, destroy it.
            if ($.fn.DataTable.isDataTable('#greetingsTable')) {
                $('#greetingsTable').DataTable().destroy();
                // Remove  of the old events.
                $('#greetingsTable').off();
            }

            // Create table.
            let table = $('#greetingsTable').DataTable({
                'searching': true,
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/German.json"
                },
                'autoWidth': false,
                'lengthChange': false,
                'data': tableData,
                'columnDefs': [
                    { 'className': 'default-table', 'width': '5%', 'orderable': false, 'targets': 3 },
                    { 'width': '5%', 'targets': 0 },
                    { 'width': '10%', 'targets': 1 }
                ],
                'columns': [
                    { 'title': 'Id' },
                    { 'title': 'Benutzername' },
                    { 'title': 'Nachricht' },
                    { 'title': 'Aktion' }
                ]
            });

            // On delete button.
            table.on('click', '.btn-danger', function() {
                let greetingUser = $(this).data('greeting');

                // Ask the user if the wants to remove the user greeting.
                helpers.getConfirmDeleteModal('greeting_modal_remove', 'Bist du sicher, dass du ' + greetingUser + 's Begrüßung löschen willst?', true,
                    'Die Benutzerbegrüßung mit ID ' + greetingUser + ' erfolgreich entfernt!', function() {
                    // Delete the user greeting.
                    socket.sendCommandSync('rm_greeting_cmd', 'greeting removesilent ' + greetingUser, function() {
                        // Reload the table.
                        run();
                    });
                });
            });

            // On edit button.
            table.on('click', '.btn-warning', function() {
                let greetingUser = $(this).data('greeting'),
                    t = $(this);

                // Get the greeting.
                socket.getDBValue('edit_greeting_get', 'greeting', greetingUser, function(e) {
                    helpers.getModal('edit-greeting', 'Benutzerbegrüßung bearbeiten', 'Speichern', $('<form/>', {
                        'role': 'form'
                    })
                    // Append User.
                    .append(helpers.getInputGroup('greeting-username', 'text', 'Benutzername', '', greetingUser, 'Der Benutzer, für den diese Begrüßung bestimmt ist.'))
                    // Append Greeting Message
                    .append(helpers.getInputGroup('greeting-message', 'text', 'Begrüßungsnachricht', '', e.greeting, 'Die Begrüßungsnachricht für ' + greetingUser + '.')), function() {// Callback once we click the save button.
                        let greetingUsername = $('#greeting-username'),
                            greetingMessage = $('#greeting-message');

                        // Make sure all boxes have an input.
                        switch (false) {
                            case helpers.handleInputString(greetingUsername):
                            case helpers.handleInputString(greetingMessage):
                                break;
                            default:
                                // Edit the greeting.
                                socket.updateDBValue('edit_greeting_update', 'greeting', greetingUsername.val(), greetingMessage.val().replace(/"/g, '\'\''), function() {
                                    // Update the username.
                                    t.parents('tr').find('td:eq(1)').text(greetingUsername.val());
                                    // Update the greeting message.
                                    t.parents('tr').find('td:eq(2)').text(greetingMessage.val());
                                    // Close the modal.
                                    $('#edit-greeting').modal('hide');
                                    // Alert the user.
                                    toastr.success('Die Benutzerbegrüßung wurde erfolgreich bearbeitet!');
                                });
                        }
                    }).modal('toggle');
                });
            });
        });
    });
});

// Function that handlers the loading of events.
$(function() {
    socket.addListener('greeting_update', function() {
       run();
    });

    // Module toggle.
    $('#greetingsModuleToggle').on('change', function() {
        // Enable the module then query the data.
        socket.sendCommand('greeting_module_toggle_cmd', 'module ' + ($(this).is(':checked') ? 'enablesilent' : 'disablesilent') + ' ./systems/greetingSystem.js', run);
    });

    // Add greeting button.
    $('#add-greeting-button').on('click', function() {
        /** 
         * For some reason using the single keyed getDBValue function does not work here
         * socket.getDBValue('get_default_greeting', 'greeting', 'defaultJoin', function(e) {
         */
        socket.getDBValues('get_default_greeting', {tables: ['greeting'], keys: ['defaultJoin']}, true, function(e) {
            helpers.getModal('add-greeting', 'Benutzergruß hinzufügen', 'Speichern', $('<form/>', {
                'role': 'form'
            })
            // User Greeting input.
            // Append User.
            .append(helpers.getInputGroup('greeting-username', 'text', 'Benutzername', '', '', 'Der Benutzer, für den diese Begrüßung bestimmt ist.'))
            // Append Greeting Message
            .append(helpers.getInputGroup('greeting-message', 'text', 'Begrüßungsnachricht', e.defaultJoin, undefined, 'Die Begrüßung, die gesendet wird, nachdem der Benutzer seine erste Nachricht gesendet hat, wird als aktiv betrachtet.')), function() {// Callback once we click the save button.
                let greetingUsername = $('#greeting-username'),
                    greetingMessage = $('#greeting-message').val() !== '' ? $('#greeting-message').val() : e.defaultJoin;
                

                // Handle each input to make sure they have a value.
                switch (false) {
                    case helpers.handleInputString(greetingUsername):
                        break;
                    default:
                        // Add User Greeting.
                        socket.sendCommandSync('add_greeting_cmd', 'greeting setsilent ' + greetingUsername.val() + ' ' + greetingMessage.replace(/"/g, '\'\''), function() {
                            // Close the modal.
                            $('#add-greeting').modal('hide');
                            // Reload the table.
                            run();
                            // Alert the user.
                            toastr.success('Benutzergruß erfolgreich hinzugefügt!');
                        });
                }
            }).modal('toggle');
        });
    });

    // User Greeting settings button.
    $('#greeting-settings-button').on('click', function() {
        socket.getDBValues('alerts_get_greeting_settings', {
            tables: ['greeting', 'greeting', 'greeting'],
            keys: ['autoGreetEnabled', 'cooldown', 'defaultJoin']
        }, true, function(e) {
            helpers.getModal('greeting-alert', 'Begrüßungsalarmeinstellungen', 'Speichern', $('<form/>', {
                'role': 'form'
            })
            // Add the toggle for greeting alerts.
            .append(helpers.getDropdownGroup('greeting-toggle', 'Begrüßungsbenachrichtigungen aktivieren', (e.autoGreetEnabled === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                'Wenn es Benutzern erlaubt sein soll, eine Nachricht festzulegen, wenn sie dem Kanal beitreten.'))
            // Add the input for the greeting reward.
            .append(helpers.getInputGroup('greeting-cooldown', 'number', 'Begrüßungs-Cooldown (Stunden)', '', (parseInt(e.cooldown) / 36e5),
                'Wie lange die Begrüßungsnachricht pro Benutzer in Stunden sein wird. Mindestens 5 Stunden.'))
            // Add input for the default greeting message
            .append(helpers.getInputGroup('greeting-default-message', 'text', 'Standard-Begrüßungsnachricht', '', e.defaultJoin,
                'Die standardmäßige Begrüßungsnachricht.')),
            function() { // Callback once the user clicks save.
                let greetingToggle = $('#greeting-toggle').find(':selected').text() === 'Ja',
                    greetingCooldown = $('#greeting-cooldown'),
                    defaultMessage = $('#greeting-default-message');

                // Make sure the user has someone in each box.
                switch (false) {
                    case helpers.handleInputNumber(greetingCooldown, 5):
                    case helpers.handleInputString(defaultMessage):
                        break;
                    default:
                        socket.updateDBValues('alerts_update_greeting_settings', {
                            tables: ['greeting', 'greeting', 'greeting'],
                            keys: ['autoGreetEnabled', 'cooldown', 'defaultJoin'],
                            values: [greetingToggle, (parseInt(greetingCooldown.val()) * 36e5), defaultMessage.val().replace(/"/g, '\'\'')]
                        }, function() {
                            socket.sendCommand('alerts_update_greeting_settings_cmd', 'greetingspanelupdate', function() {
                                // Close the modal.
                                $('#greeting-alert').modal('toggle');
                                // Alert the user.
                                toastr.success('Begrüßungsbenachrichtigungseinstellungen erfolgreich aktualisiert!');
                            });
                        });
                }
            }).modal('toggle');
        });
    });
});
