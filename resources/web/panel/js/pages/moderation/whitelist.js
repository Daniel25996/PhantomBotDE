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
    // Query whitelist.
    socket.getDBTableValues('moderation_whitelist_get', 'whiteList', function(results) {
        let tableData = [];

        for (let i = 0; i < results.length; i++) {
            tableData.push([
                results[i].key,
                $('<div/>', {
                    'class': 'btn-group'
                }).append($('<button/>', {
                    'type': 'button',
                    'class': 'btn btn-xs btn-danger',
                    'style': 'float: right',
                    'data-whitelist': results[i].key,
                    'html': $('<i/>', {
                        'class': 'fa fa-trash'
                    })
                })).append($('<button/>', {
                    'type': 'button',
                    'class': 'btn btn-xs btn-warning',
                    'style': 'float: right',
                    'data-whitelist': results[i].key,
                    'html': $('<i/>', {
                        'class': 'fa fa-edit'
                    })
                })).html()
            ]);
        }

        // if the table exists, destroy it.
        if ($.fn.DataTable.isDataTable('#whitelistTable')) {
            $('#whitelistTable').DataTable().destroy();
            // Remove all of the old events.
            $('#whitelistTable').off();
        }

        // Create table.
        let table = $('#whitelistTable').DataTable({
            'searching': true,
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/German.json"
            },
            'autoWidth': false,
            'lengthChange': false,
            'data': tableData,
            'columnDefs': [
                { 'className': 'default-table', 'orderable': false, 'targets': 1 }
            ],
            'columns': [
                { 'title': 'Ausnahmeliste' },
                { 'title': 'Aktionen' }
            ]
        });

        // On delete button.
        table.on('click', '.btn-danger', function() {
            let whitelist = $(this).data('whitelist'),
                row = $(this).parents('tr');

            // Ask the user if he wants to delete the blacklist.
            helpers.getConfirmDeleteModal('blacklist_modal_remove', 'Bist du sicher, dass du diese Ausnahme entfernen möchtest?', true,
                'Die Ausnahme wurde erfolgreich entfernt!', function() { // Callback if the user clicks delete.
                // Delete all information about the alias.
                socket.removeDBValue('whitelist_remove', 'whiteList', whitelist, function() {
                    socket.sendCommand('whitelist_remove_cmd', 'reloadmod', function() {
                        // Remove the table row.
                        table.row(row).remove().draw(false);
                    });
                });
            });
        });

        // On edit button.
        table.on('click', '.btn-warning', function() {
            let whitelist = $(this).data('whitelist'),
                t = $(this);

            helpers.getModal('edit-whitelist', 'Ausnahme bearbeiten', 'Speichern', $('<form/>', {
                'role': 'form'
            })
            // Append box for the whitelist.
            .append(helpers.getInputGroup('whitelist-name', 'text', 'URL', '', whitelist, 'URL, die auf der Ausnahmeliste stehen soll.')), function() {
                let w = $('#whitelist-name');

                // Handle each input to make sure they have a value.
                switch (false) {
                    case helpers.handleInputString(w):
                        break;
                    default:
                        // Delete old whitelist.
                        socket.removeDBValue('whitelist_remove', 'whiteList', whitelist, function() {
                            // Add the whitelist
                            socket.updateDBValue('whitelist_edit', 'whiteList', w.val().toLowerCase(), 'true', function() {
                                // Reload the script cache.
                                socket.sendCommand('whitelist_remove_cmd', 'reloadmod', function() {
                                    // Edit the table row.
                                    t.parents('tr').find('td:eq(0)').text(w.val());
                                    // Close the modal.
                                    $('#edit-whitelist').modal('hide');
                                    // Alert the user.
                                    toastr.success('Ausnahme erfolgreich bearbeitet!');
                                });
                            });
                        });
                }
            }).modal('toggle');
        });
    });
});

// Function that handlers the loading of events.
$(function() {
    // Add whitelist button.
    $('#add-whitelist-button').on('click', function() {
        helpers.getModal('add-whitelist', 'Ausnahme hinzufügen', 'Speichern', $('<form/>', {
            'role': 'form'
        })
        // Append box for the whitelist.
        .append(helpers.getInputGroup('whitelist-name', 'text', 'URL', 'https://phantombot.github.io/PhantomBot', '', 'URL, die auf die Ausnahmelist gesetzt werden soll.')), function() {
            let whitelist = $('#whitelist-name');

            // Handle each input to make sure they have a value.
            switch (false) {
                case helpers.handleInputString(whitelist):
                    break;
                default:
                    // Add the whitelist
                    socket.updateDBValue('whitelist_add', 'whiteList', whitelist.val().toLowerCase(), 'true', function() {
                        // Reload the script cache.
                        socket.sendCommand('whitelist_add_cmd', 'reloadmod', function() {
                            // Reload the table.
                            run();
                            // Close the modal.
                            $('#add-whitelist').modal('hide');
                            // Alert the user.
                            toastr.success('Ausnahme erfolgreich hinzugefügt!');
                        });
                    });
            }
        }).modal('toggle');
    });
});
