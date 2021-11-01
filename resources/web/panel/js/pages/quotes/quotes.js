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
$(run = function() {
    // Check if the module is enabled.
    socket.getDBValue('quotes_module_toggle', 'modules', './systems/quoteSystem.js', function(e) {
        // If the module is off, don't load any data.
        if (!helpers.handleModuleLoadUp('quotesModule', e.modules)) {
            return;
        }

        // Get all quotes.
        socket.getDBTableValues('get_all_quotes', 'quotes', function(results) {
            let tableData = [];

            for (let i = 0; i < results.length; i++) {
                // Quotes are stored in an array for some reason.
                // So we need to parse it to access the data.
                let data = JSON.parse(results[i].value);

                tableData.push([
                    i,
                    new Date(parseInt(data[2])).toLocaleDateString(), // Date.
                    data[0], // Username.
                    data[3], // Game.
                    data[1], // Quote.
                    $('<div/>', {
                        'class': 'btn-group'
                    }).append($('<button/>', {
                        'type': 'button',
                        'class': 'btn btn-xs btn-danger',
                        'style': 'float: right',
                        'data-quote': results[i].key,
                        'html': $('<i/>', {
                            'class': 'fa fa-trash'
                        })
                    })).append($('<button/>', {
                        'type': 'button',
                        'class': 'btn btn-xs btn-warning',
                        'style': 'float: right',
                        'data-quote': results[i].key,
                        'html': $('<i/>', {
                            'class': 'fa fa-edit'
                        })
                    })).html()
                ]);
            }

            // if the table exists, destroy it.
            if ($.fn.DataTable.isDataTable('#quotesTable')) {
                $('#quotesTable').DataTable().destroy();
                // Remove  of the old events.
                $('#quotesTable').off();
            }

            // Create table.
            let table = $('#quotesTable').DataTable({
                'searching': true,
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/German.json"
                },
                'autoWidth': false,
                'lengthChange': false,
                'data': tableData,
                'columnDefs': [
                    { 'className': 'default-table', 'orderable': false, 'targets': 5 },
                    { 'width': '5%', 'targets': 0 },
                    { 'width': '10%', 'targets': 1 },
                    { 'width': '45%', 'targets': 4 }
                ],
                'columns': [
                    { 'title': 'ID' },
                    { 'title': 'Erstellt am', 'orderData': [1] },
                    { 'title': 'Benutzername' },
                    { 'title': 'Kategorie' },
                    { 'title': 'Zitat' },
                    { 'title': 'Aktion' }
                ]
            });

            // On delete button.
            table.on('click', '.btn-danger', function() {
                let quoteId = $(this).data('quote');

                // Ask the user if the wants to remove the quote.
                helpers.getConfirmDeleteModal('quote_modal_remove', 'Sind Sie sicher, dass Sie das Zitat mit der ID ' + quoteId + ' entfernen möchten?', true,
                    'Du hast erfolgreich das Zitat mit der ID ' + quoteId + ' entfernt!', function() {
                    // Delete the quote.
                    socket.sendCommandSync('rm_quote_cmd', 'delquotesilent ' + quoteId, function() {
                        // Reload the table.
                        run();
                    });
                });
            });

            // On edit button.
            table.on('click', '.btn-warning', function() {
                let quote = $(this).data('quote'),
                    t = $(this);

                // Get the quote.
                socket.getDBValue('edit_quote_get', 'quotes', quote, function(e) {
                    let data = JSON.parse(e.quotes);

                    helpers.getModal('edit-quote', 'Zitat bearbeiten', 'Speichern', $('<form/>', {
                        'role': 'form'
                    })
                    // Append quote date.
                    .append(helpers.getInputGroup('quote-date', 'text', 'Erstellt am', '', helpers.getPaddedDateString(new Date(parseInt(data[2])).toLocaleDateString()), 'Datum, an dem das Zitat erstellt wurde.'))
                    // Append quote creator
                    .append(helpers.getInputGroup('quote-user', 'text', 'Erstellt von', '', data[0], 'Der Benutzer, der das Zitat erstellt hat.'))
                    // Append quote game
                    .append(helpers.getInputGroup('quote-game', 'text', 'Kategorie', '', data[3], 'Die Kategorie, die gespielt wurde, als das Zitat verfasst wurde.'))
                    // Append quote
                    .append(helpers.getTextAreaGroup('quote-quote', 'text', 'Zitat', '', data[1], 'Zitattext.', false)), function() {// Callback once we click the save button.
                        let quoteDate = $('#quote-date'),
                            quoteUser = $('#quote-user'),
                            quoteGame = $('#quote-game'),
                            quoteQuote = $('#quote-quote');

                        // Make sure all boxes have an input.
                        switch (false) {
                            case helpers.handleInputDate(quoteDate):
                            case helpers.handleInputString(quoteUser):
                            case helpers.handleInputString(quoteGame):
                            case helpers.handleInputString(quoteQuote):
                                break;
                            default:
                                // Edit the quote.
                                socket.updateDBValue('edit_quote_update', 'quotes', quote, JSON.stringify([
                                    quoteUser.val(),
                                    quoteQuote.val(),
                                    helpers.getEpochFromDate(quoteDate.val()),
                                    quoteGame.val()
                                ]), function() {
                                    // Update the date.
                                    t.parents('tr').find('td:eq(1)').text(quoteDate.val());
                                    // Update the game.
                                    t.parents('tr').find('td:eq(2)').text(quoteUser.val());
                                    // Update the user.
                                    t.parents('tr').find('td:eq(3)').text(quoteGame.val());
                                    // Update the quote.
                                    t.parents('tr').find('td:eq(4)').text(quoteQuote.val());
                                    // Close the modal.
                                    $('#edit-quote').modal('hide');
                                    // Alert the user.
                                    toastr.success('Zitat erfolgreich bearbeitet!');
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
    socket.addListener('quote_update', function() {
       run();
    });

    // Module toggle.
    $('#quotesModuleToggle').on('change', function() {
        // Enable the module then query the data.
        socket.sendCommand('quotes_module_toggle_cmd', 'module ' + ($(this).is(':checked') ? 'enablesilent' : 'disablesilent') + ' ./systems/quoteSystem.js', run);
    });

    // Add quote button.
    $('#add-quote-button').on('click', function() {
        helpers.getModal('add-quote', 'Zitat hinzufügen', 'Speichern', $('<form/>', {
            'role': 'form'
        })
        // Quote input.
        .append(helpers.getTextAreaGroup('quote-quote', 'text', 'Zitat', 'PhantomBotDE ist Klasse!', '', 'Zitattext.', false)), function() {// Callback once we click the save button.
            let quoteQuote = $('#quote-quote');

            // Handle each input to make sure they have a value.
            switch (false) {
                case helpers.handleInputString(quoteQuote):
                    break;
                default:
                    // Add quote.
                    socket.sendCommandSync('add_quote_cmd', 'addquotesilent ' + quoteQuote.val().replace(/"/g, '\'\''), function() {
                        // Close the modal.
                        $('#add-quote').modal('hide');
                        // Alert the user.
                        toastr.success('Zitat erfolgreich hinzugefügt!');
                    });
            }
        }).modal('toggle');
    });

    // Quotes settings button.
    $('#quote-settings-button').on('click', function() {
        socket.getDBValues('get_quote_settings', {
            tables: ['settings', 'settings'],
            keys: ['quoteMessage', 'quoteTwitchNamesToggle']
        }, true, function(e) {
            helpers.getModal('quote-settings', 'Zitat-Einstellungen', 'Speichern', $('<form/>', {
                'role': 'form'
            })
            // Quote input.
            .append(helpers.getInputGroup('quote-msg', 'text', 'Zitat Antwort', '', helpers.getDefaultIfNullOrUndefined(e.settings, '[(id)] "(quote)" von (user) ((date))'),
                'Nachricht, die in den Chat gesendet werden soll, wenn jemand den Zitat-Befehl verwendet. Tags: (id), (quote), (user), (game) und (date)'))
            .append(helpers.getDropdownGroup('quote-twitch-names-toggle', 'Twitch-Namen erzwingen', (e['quoteTwitchNamesToggle'] !== 'false' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                'Wenn Namen für Zitate gegen Twitch-Benutzernamen validiert werden sollen. Wenn nicht, können Namen alles sein.')),
            function() {// Callback once we click the save button.
                let quoteMsg = $('#quote-msg'),
                    quoteTwitchNamesToggle = $('#quote-twitch-names-toggle').find(':selected').text() === 'Ja';

                // Handle each input to make sure they have a value.
                switch (false) {
                    case helpers.handleInputString(quoteMsg):
                        break;
                    default:
                        // Add quote.
                        socket.updateDBValues('get_quote_settings_update', {
                            tables: ['settings', 'settings'],
                            keys: ['quoteMessage', "quoteTwitchNamesToggle"],
                            values: [quoteMsg.val(), quoteTwitchNamesToggle]
                        }, function() {
                            // Close the modal.
                            $('#quote-settings').modal('hide');
                            // Alert the user.
                            toastr.success('Zitat-Einstellungen erfolgreich gespeichert!');
                        });
                }
            }).modal('toggle');
        });
    });
});
