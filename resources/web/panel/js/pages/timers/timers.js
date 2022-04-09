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

(function (){
    let selected = null;

    function openGroupModal(groupData, cb) {
        const idPrefix = groupData == null ? 'add-' : 'edit-'
        const title = groupData == null ? 'Gruppe hinzufügen' : 'Gruppe bearbeiten',
              name = groupData == null ? '' : groupData.name,
              noticeToggle  = groupData == null ? 'Ja' : (groupData.noticeToggle === true ? 'Ja' : 'Nein'),
              noticeOfflineToggle = groupData == null ? 'Nein' : (groupData.noticeOfflineToggle === true ? 'Ja' : 'Nein'),
              intervalMin = groupData == null ? '10' : groupData.intervalMin,
              intervalMax = groupData == null ? '' : (intervalMin === groupData.intervalMax ? '' : groupData.intervalMax),
              reqMessages = groupData == null ? '0' : groupData.reqMessages,
              shuffle = groupData == null ? 'Nein' : (groupData.shuffle === true ? 'Ja' : 'Nein');

        helpers.getModal(idPrefix + 'group-modal', title, 'Speichern',
            $('<form/>', {'role': 'form'})
                /*
                name: "Announcements",
                noticeToggle: noticeToggle,
                noticeOfflineToggle: noticeOffline,
                intervalMin: noticeInterval,
                intervalMax: noticeInterval,
                reqMessages: noticeReqMessages,
                shuffle: false,
                messages: notices
                */
                // Append group name.
                .append(helpers.getInputGroup(idPrefix + 'group-name', 'text', 'Gruppenname', 'Gruppenname', name))
                // Append toggle.
                .append(helpers.getDropdownGroup(idPrefix + 'notice-toggle', 'Aktiv', noticeToggle, ['Ja', 'Nein'], 'Wenn die Gruppe überhaupt aktiviert werden soll.'))
                // Append offline toggle.
                .append(helpers.getDropdownGroup(idPrefix + 'notice-offline-toggle', 'Aktiv Offline', noticeOfflineToggle, ['Ja', 'Nein'], "Wenn die Nachrichten der Gruppe im Offline-Chat gepostet werden sollen."))
                // Append interval minimum.
                .append(helpers.getInputGroup(idPrefix + 'notice-interval-min', 'number', 'Timer-Intervall-Minimum (Minuten)', '', intervalMin, 'Wie lange muss mindestens gewartet werden, bevor eine weitere Nachricht aus dieser Gruppe gesendet wird.'))
                // Append interval minimum.
                .append(helpers.getInputGroup(idPrefix + 'notice-interval-max', 'number', 'Timer-Intervall-Maximum (Minuten)', '', intervalMax, 'Wie lange maximal gewartet werden soll, bevor eine weitere Nachricht aus dieser Gruppe gesendet wird. Lasse das Feld leer, um den Zeitintervall nicht wahllos zu setzen.'))
                // Append required messages.
                .append(helpers.getInputGroup(idPrefix + 'notice-req-messages', 'number', 'Timer-erforderliche Nachrichten', '', reqMessages, 'Warte mindestens so viele Nachrichten ab, bevor eine weitere Nachricht aus dieser Gruppe im Chat gepostet wird.'))
                // Append shuffle.
                .append(helpers.getDropdownGroup(idPrefix + 'group-shuffle', 'Mischen', shuffle, ['Ja', 'Nein'], "Wenn die Nachrichten der Gruppe in zufälliger Reihenfolge gepostet werden sollen.")),
            // Callback once the user clicks save.
            function() {// Callback once we click the save button.
                const $groupName = $('#' + idPrefix + 'group-name'),
                      $noticeToggle = $('#' + idPrefix + 'notice-toggle'),
                      $noticeOfflineToggle = $('#' + idPrefix + 'notice-offline-toggle'),
                      $noticeIntervalMin = $('#' + idPrefix + 'notice-interval-min'),
                      $noticeIntervalMax = $('#' + idPrefix + 'notice-interval-max'),
                      $noticeReqMsg = $('#' + idPrefix + 'notice-req-messages'),
                      $groupShuffle = $('#' + idPrefix + 'group-shuffle');

                // Handle each input to make sure they have a value.
                switch (false) {
                    case helpers.handleInputString($groupName):
                    case helpers.handleInput($noticeIntervalMin, function (obj) {
                        if (obj.val().length === 0) {
                            return "Kann nicht leer sein";
                        }
                        if (!isFinite(obj.val())) {
                            return "Bitte gebe eine Nummer ein.";
                        }
                        const min = parseFloat(obj.val());
                        if (min < 0.25) {
                            return "Zahl muss größer oder gleich 0,25 sein.";
                        }
                        if (parseFloat($noticeIntervalMax.val()) < min) {
                            return "Die Zahl muss kleiner oder gleich dem Timer-Intervall-Maximum sein.";
                        }
                        return null;
                    }):
                    case helpers.handleInput($noticeIntervalMax, function (obj) {
                        if (obj.val().length === 0) {
                            obj.val($noticeIntervalMin.val());
                            return null;
                        }
                        if (!isFinite(obj.val())) {
                            return "Bitte gebe eine Zahl ein oder lassen es leer.";
                        }
                        if (parseFloat($noticeIntervalMin.val()) > parseFloat(obj.val())) {
                            return "Die Zahl muss größer oder gleich dem Timer-Intervall-Minimum sein.";
                        }
                        return null;
                    }):
                    case helpers.handleInputNumber($noticeReqMsg):
                        break;
                    default:
                        cb({
                            groupName: $groupName.val(),
                            noticeToggle: $noticeToggle.find(':selected').text() === 'Ja',
                            noticeOfflineToggle: $noticeOfflineToggle.find(':selected').text() === 'Ja',
                            noticeIntervalMin: Number($noticeIntervalMin.val()),
                            noticeIntervalMax: Number($noticeIntervalMax.val() || $noticeIntervalMin.val()),
                            noticeReqMsg: Number($noticeReqMsg.val()),
                            groupShuffle: $groupShuffle.find(':selected').text() === 'Ja'
                        });
                }
            }
        ).modal('toggle');
    }

    // Function that queries all of the data we need.
    function run() {
        // Check if the module is enabled.
        socket.getDBValue('notice_module_toggle', 'modules', './systems/noticeSystem.js', function(e) {
            // If the module is off, don't load any data.
            if (!helpers.handleModuleLoadUp('noticesModule', e.modules)) {
                return;
            }

            // Query timer groups
            socket.getDBTableValues('timers_get_all', 'notices', function(results) {
                let tableData = [];
                for (let i = 0; i < results.length; i++) {
                    const groupId = results[i].key,
                          groupName = JSON.parse(results[i].value).name;
                    tableData.push([
                        groupId,
                        groupName,
                        $('<div/>', {
                            'class': 'btn-group'
                        }).append($('<button/>', {
                            'type': 'button',
                            'class': 'btn btn-xs btn-danger btn-group-delete',
                            'style': 'float: right',
                            'data-group-id': groupId,
                            'data-group-name': groupName,
                            'html': $('<i/>', { 'class': 'fa fa-trash' })
                        })).append($('<button/>', {
                            'type': 'button',
                            'class': 'btn btn-xs btn-warning btn-group-settings',
                            'style': 'float: right',
                            'data-group-id': groupId,
                            'data-group-name': groupName,
                            'html': $('<i/>', { 'class': 'fa fa-cog' })
                        })).append($('<button/>', {
                            'type': 'button',
                            'class': 'btn btn-xs btn-success btn-group-edit',
                            'style': 'float: right',
                            'data-group-id': groupId,
                            'data-group-name': groupName,
                            'html': $('<i/>', { 'class': 'fa fa-edit' })
                        })).html()
                    ]);
                }

                const $groupTable = $('#groups-table');
                // if the table exists, destroy it.
                if ($.fn.DataTable.isDataTable('#groups-table')) {
                    $groupTable.DataTable().destroy();
                    // Remove all of the old events.
                    $groupTable.off();
                }

                // Create groups table.
                let table = $groupTable.DataTable({
                    'searching': true,
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/German.json"
                    },
                    'autoWidth': false,
                    'lengthChange': false,
                    'data': tableData,
                    'columnDefs': [
                        { 'className': 'default-table', 'width': '70px', 'orderable': false, 'targets': 2 },
                        { 'width': '3%', 'targets': 0 },
                    ],
                    'columns': [
                        { 'title': 'ID' },
                        { 'title': 'Name' },
                        { 'title': 'Aktionen' }
                    ]
                });

                // On delete button.
                table.on('click', '.btn-group-delete', function() {
                    const groupId = $(this).data('groupId').toString(),
                        groupName = $(this).data('groupName');

                    // Ask the user if he want to remove the timer.
                   helpers.getConfirmDeleteModal('timer_modal_remove_group',
                       'Bist du sicher, dass du die Timer Gruppe "' + groupName + '" mit all seinen Nachrichten dauerhaft löschen möchtest?', true,
                       'Du hast die Gruppe "' + groupName + '" erfolgreich entfernt!', function() {
                            // Remove the group
                            socket.wsEvent('timer_group_remove_ws', './systems/noticeSystem.js', null,
                                ['removeGroup', groupId], function() {
                                    // Reload the table.
                                    run();
                                }
                            );
                        }
                    );
                });

                // On edit group button.
                table.on('click', '.btn-group-settings', function() {
                    const groupId = $(this).data('groupId').toString(),
                          $this = $(this);

                    socket.getDBValue('timer_group_edit_get', 'notices', groupId, function(e) {
                        let groupData = e.notices;
                        if (groupData == null) {
                            run();  // group doesn't exist anymore => reload
                        }
                        groupData = JSON.parse(groupData);
                        openGroupModal(groupData, function(result) {
                            socket.updateDBValue('timer_group_edit_update', 'notices', groupId, JSON.stringify({
                                name: result.groupName,
                                noticeToggle: result.noticeToggle,
                                noticeOfflineToggle: result.noticeOfflineToggle,
                                intervalMin: result.noticeIntervalMin,
                                intervalMax: result.noticeIntervalMax,
                                reqMessages: result.noticeReqMsg,
                                shuffle: result.groupShuffle,
                                messages: groupData.messages,
                                disabled: groupData.disabled,
                            }), function () {
                                socket.wsEvent('timer_group_edit_ws', './systems/noticeSystem.js', null,
                                    ['reloadGroup', groupId], function() {
                                        // Update group name in table.
                                        $this.parents('tr').find('td:eq(1)').text(result.groupName);
                                        if (selected === Number(groupId)) {
                                            // reload the messages table
                                            showGroupMessages(selected);
                                        }
                                        // Close the modal.
                                        $('#edit-group-modal').modal('hide');
                                        // Alert the user.
                                        toastr.success('Timergruppe erfolgreich bearbeitet!');
                                    }
                                );
                            });
                        });
                    });
                });

                // On edit button.
                table.on('click', '.btn-group-edit', function() {
                    const groupId = Number($(this).data('groupId'));
                    showGroupMessages(groupId);
                });

                if (selected == null) {
                    if (results.length > 0) {
                        showGroupMessages(0);
                    } else {
                        showGroupMessages(null)
                    }
                } else {
                    if (selected >= results.length) {
                        showGroupMessages(results.length - 1);
                    } else if (selected < 0) {
                        showGroupMessages(results.length + (selected % results.length));
                    } else {
                        showGroupMessages(selected);
                    }
                }
            });
        });
    }
    $(run);

    function showGroupMessages(groupId) {
        selected = groupId;
        const $messageBox = $('#messages-box');
        const $messagesTable = $('#messages-table');
        if (groupId == null) {
            $messageBox.addClass("hidden");
            return;
        }

        socket.getDBValue('timer_messages_edit_get', 'notices', String(groupId), function(e) {
            let groupData = e.notices;
            if (groupData == null) {
                run();  // group doesn't exist anymore => reload
                return;
            }
            groupData = JSON.parse(groupData);

            function messageRowData(i) {
                return [
                    i,
                    groupData.messages[i],
                    $('<div/>', {
                        'class': 'btn-group'
                    }).append($('<button/>', {
                        'type': 'button',
                        'class': 'btn btn-xs btn-danger btn-group-delete',
                        'style': 'float: right',
                        'data-message-id': i,
                        'html': $('<i/>', { 'class': 'fa fa-trash' })
                    })).append($('<button/>', {
                        'type': 'button',
                        'class': 'btn btn-xs btn-success btn-group-edit',
                        'style': 'float: right',
                        'data-message-id': i,
                        'html': $('<i/>', { 'class': 'fa fa-edit' })
                    })).append($('<button/>', {
                        'type': 'button',
                        'class': 'btn btn-xs btn-group-toggle btn-' + (groupData.disabled[i] ? 'warning' : 'success'),
                        'data-toggle': 'tooltip',
                        'title': (groupData.disabled[i] ? 'Klicke, um den Notice zu aktivieren.' : 'Klicke, um den Notice zu deaktivieren.'),
                        'style': 'float: right',
                        'data-message-id': i,
                        'html': $('<i/>', {
                            'class': 'fa fa-' + (groupData.disabled[i] ? 'check' : 'close')
                        })
                    })).html()
                ];
            }

            $messageBox.find(".box-title > span").text(groupData.name);

            let tableData = [];
            for (let i = 0; i < groupData.messages.length; i++) {
                tableData.push(messageRowData(i));
            }

            // if the table exists, destroy it.
            if ($.fn.DataTable.isDataTable('#messages-table')) {
                $messagesTable.DataTable().destroy();
                // Remove all of the old events.
                $messagesTable.off();
            }

            // Create messages table.
            let table = $messagesTable.DataTable({
                'searching': true,
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/German.json"
                },
                'autoWidth': false,
                'lengthChange': false,
                'data': tableData,
                'columnDefs': [
                    { 'className': 'default-table', 'width': '70px', 'orderable': false, 'targets': 2 },
                    { 'width': '3%', 'targets': 0 },
                ],
                'columns': [
                    { 'title': 'ID' },
                    { 'title': 'Text' },
                    { 'title': 'Aktionen' }
                ]
            });

            // Add message button.
            $('#add-message-button').off('click').on('click', function() {
                helpers.getModal('add-message', 'Nachricht hinzufügen', 'Speichern',
                    $('<form/>', { 'role': 'form'})
                        // Append timer text.
                        .append(helpers.getTextAreaGroup('message-text', 'text', 'Nachricht', 'Folge mir auf Twitter! https://twitter.com/PhantomBotApp', '', 'Meldung dieses Timers. Verwende den Präfix "command:" und dann den Namen des Befehls, um einen Befehl auszuführen.')),
                    // Callback once the user clicks save.
                    function() {// Callback once we click the save button.
                        const $messageText = $('#message-text');

                        // Handle each input to make sure they have a value.
                        switch (false) {
                            case helpers.handleInputString($messageText):
                                break;
                            default:
                                groupData.messages.push($messageText.val());
                                groupData.disabled.push(false);
                                socket.updateDBValue('timer_group_add_message_update', 'notices', String(groupId), JSON.stringify(groupData), function () {
                                    socket.wsEvent('timer_group_add_message_ws', './systems/noticeSystem.js', null,
                                        ['reloadGroup', String(groupId)], function() {
                                            // Update group name in table.
                                            table.rows.add([messageRowData(groupData.messages.length - 1)]);
                                            table.draw(false);
                                            // Close the modal.
                                            $('#add-message').modal('hide');
                                            // Alert the user.
                                            toastr.success('Nachricht erfolgreich hinzugefügt!');
                                        }
                                    );
                                });
                        }
                    }
                ).modal('toggle');
            });

            // Delete message button
            table.on('click', '.btn-group-delete', function() {
                const messageId = Number($(this).data('messageId'));
                // Ask the user if he want to remove the timer.
                helpers.getConfirmDeleteModal('timer_modal_remove_message',
                    'Möchtest du die Nachricht wirklich dauerhaft löschen?', true,
                    'Du hast die Nachricht erfolgreich entfernt!', function() {
                        // Remove the message
                        groupData.messages.splice(messageId, 1);
                        groupData.disabled.splice(messageId, 1);
                        table.rows(messageId).remove();
                        table.draw(false);
                        socket.updateDBValue('timer_group_remove_message_update', 'notices', String(groupId), JSON.stringify(groupData), function () {
                            socket.wsEvent('timer_group_remove_message_ws', './systems/noticeSystem.js', null,
                                ['reloadGroup', String(groupId)], function () { }
                            );
                        });
                    }
                );
            });

            // Edit message button.
            table.on('click', '.btn-group-edit', function() {
                const messageId = Number($(this).data('messageId'));
                helpers.getModal('edit-message', 'Nachricht bearbeiten', 'Speichern',
                    $('<form/>', { 'role': 'form'})
                        // Append timer text.
                        .append(helpers.getTextAreaGroup('message-text', 'text', 'Nachricht', 'Folge mir auf Twitter! https://twitter.com/PhantomBotApp', groupData.messages[messageId], 'Meldung dieses Timers. Verwende den Präfix "command:" und dann den Namen des Befehls, um einen Befehl auszuführen.')),
                    // Callback once the user clicks save.
                    function() {// Callback once we click the save button.
                        const $messageText = $('#message-text');

                        // Handle each input to make sure they have a value.
                        switch (false) {
                            case helpers.handleInputString($messageText):
                                break;
                            default:
                                groupData.messages[messageId] = $messageText.val();
                                socket.updateDBValue('timer_group_add_message_update', 'notices', String(groupId), JSON.stringify(groupData), function () {
                                    socket.wsEvent('timer_group_add_message_ws', './systems/noticeSystem.js', null,
                                        ['reloadGroup', String(groupId)], function() {
                                            // Update group name in table.
                                            table.row(messageId).data(messageRowData(messageId));
                                            table.draw(false);
                                            // Close the modal.
                                            $('#edit-message').modal('hide');
                                            // Alert the user.
                                            toastr.success('Nachricht erfolgreich bearbeitet');
                                        }
                                    );
                                });
                        }
                    }
                ).modal('toggle');
            });

            // Toggle message button.
            table.on('click', '.btn-group-toggle', function() {
                const $this = $(this);
                const messageId = Number($this.data('messageId'));
                groupData.disabled[messageId] = !groupData.disabled[messageId];
                socket.updateDBValue('timer_group_toggle_message_update', 'notices', String(groupId), JSON.stringify(groupData), function () {
                    socket.wsEvent('timer_group_toggle_message_ws', './systems/noticeSystem.js', null,
                        ['reloadGroup', String(groupId)], function() {
                            toastr.success('Erfolgreich den Hinweis ' + (!groupData.disabled[messageId] ? 'aktiviert' : 'deaktiviert'));
                            // Update the button.
                            if (groupData.disabled[messageId]) {
                                $this.removeClass('btn-success').addClass('btn-warning').find('i').removeClass('fa-close').addClass('fa-check');
                                $this.prop('title', 'Klicke, um den Hinweis zu aktivieren.').tooltip('fixTitle').tooltip('show');
                            } else {
                                $this.removeClass('btn-warning').addClass('btn-success').find('i').removeClass('fa-check').addClass('fa-close');
                                $this.prop('title', 'Klicke, um den Hinweis zu deaktivieren.').tooltip('fixTitle').tooltip('show');
                            }
                        }
                    );
                });
            });

            $messageBox.removeClass("hidden");
        });
    }

    // Function that handlers the loading of events.
    $(function() {
        // Toggle for the module.
        $('#noticesModuleToggle').on('change', function() {
            // Enable the module then query the data.
            socket.sendCommandSync('notices_module_toggle_cmd', 'module ' + ($(this).is(':checked') ? 'enablesilent' : 'disablesilent') + ' ./systems/noticeSystem.js', run);
        });

        // On add group button.
        $("#btn-add-group").on('click', function() {
            openGroupModal(null, function(result) {
                socket.wsEvent('timer_group_appended_ws', './systems/noticeSystem.js', null,
                    ['appendGroup', JSON.stringify({
                        name: result.groupName,
                        noticeToggle: result.noticeToggle,
                        noticeOfflineToggle: result.noticeOfflineToggle,
                        intervalMin: result.noticeIntervalMin,
                        intervalMax: result.noticeIntervalMax,
                        reqMessages: result.noticeReqMsg,
                        shuffle: result.groupShuffle,
                        messages: []
                    })], function() {
                        // Close the modal.
                        $('#add-group-modal').modal('hide');
                        // Alert the user.
                        toastr.success('Die Timer-Gruppe wurde erfolgreich hinzugefügt!');
                        selected = -1;
                        // Reload the table.
                        run();
                    }
                );
            });
        });
    });
})();
