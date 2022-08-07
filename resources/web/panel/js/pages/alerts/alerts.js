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

/* global toastr */

// Function that querys all of the data we need.
$(function() {
    // Get all module toggles.
    socket.getDBValues('alerts_get_modules', {
        tables: ['modules', 'modules', 'modules', 'modules', 'modules', 'modules', 'modules', 'modules', 'modules', 'modules', 'modules', 'modules'],
        keys: ['./handlers/followHandler.js', './handlers/subscribeHandler.js', './handlers/hostHandler.js', './handlers/bitsHandler.js', './handlers/clipHandler.js',
               './systems/greetingSystem.js', './systems/welcomeSystem.js', './handlers/donationHandler.js', './handlers/raidHandler.js', './handlers/tipeeeStreamHandler.js',
               './handlers/streamElementsHandler.js', './handlers/twitterHandler.js']
    }, true, function(e) {
        // Handle the settings button.
        let keys = Object.keys(e),
            module = '',
            i;

        for (i = 0; i < keys.length; i++) {
            // Handle the status of the buttons.
            if (e[keys[i]] === 'false') {
                module = keys[i].substring(keys[i].lastIndexOf('/') + 1).replace('.js', '');

                // Handle the switch.
                $('#' + module + 'Toggle').prop('checked', false);
                // Handle the settings button.
                $('#' + module + 'Settings').prop('disabled', true);
            }
        }
    });
});

// Function that handlers the loading of events.
$(function() {
    // Toggle for the alert modules.
    $('[data-alert-toggle]').on('change', function() {
        let name = $(this).attr('id'),
            checked = $(this).is(':checked');

        // Handle the module.
        socket.sendCommandSync('alerts_module_toggle', 'module ' + (checked ? 'enablesilent' : 'disablesilent') + ' ' + $(this).data('alert-toggle'), function() {
            // Toggle the settings button.
            $('#' + name.replace('Toggle', 'Settings')).prop('disabled', !checked);
            // Alert the user.
            toastr.success('Das Alarmmodul wurde erfolgreich ' + (checked ? 'aktiviert' : 'deaktiviert') + '!');
        });
    });

    // Follow handler settings.
    $('#followHandlerSettings').on('click', function() {
        socket.getDBValues('alerts_follow_get_settings', {
            tables: ['settings', 'settings', 'settings', 'settings'],
            keys: ['followToggle', 'followReward', 'followMessage', 'followDelay']
        }, true, function(e) {
            helpers.getModal('follow-alert', 'Follower Alarm Einstellungen', 'Speichern', $('<form/>', {
                'role': 'form'
            })
            // Add the toggle for follow alerts.
            .append(helpers.getDropdownGroup('follow-toggle', 'Follow-Alarme aktivieren', (e.followToggle === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                'Wenn eine Nachricht im Kanal gesendet werden soll, wenn jemand folgt. Dadurch wird auch die Belohnung umgeschaltet.'))
            // Add the the text area for the follow message.
            .append(helpers.getTextAreaGroup('follow-message', 'text', 'Follow Nachricht', '', e.followMessage,
                'Die Nachricht wird gesendet, wenn jemand dem Kanal folgt. Tags: (name), (alert), (playsound) und (reward)', false))
            // Add the the box for the reward.
            .append(helpers.getInputGroup('follow-reward', 'number', 'Follow Belohnung', '', e.followReward,
                'Belohnung für Benutzer, die dem Kanal folgen.'))
            // Add the the box for the reward
            .append(helpers.getInputGroup('follow-delay', 'number', 'Follow Verzögerung (Sekunden)', '', e.followDelay,
                'Verzögerung zwischen den im Kanal geposteten Follow-Meldungen. Das Minimum beträgt 5 Sekunden.')),
            function() { // Callback once the user clicks save.
                let followToggle = $('#follow-toggle').find(':selected').text() === 'Ja',
                    followMessage = $('#follow-message'),
                    followReward = $('#follow-reward'),
                    followDelay = $('#follow-delay');

                // Make sure everything has been filled it correctly.
                switch (false) {
                    case helpers.handleInputString(followMessage):
                    case helpers.handleInputNumber(followReward, 0):
                    case helpers.handleInputNumber(followDelay, 5):
                        break;
                    default:
                        // Update settings.
                        socket.updateDBValues('alerts_follow_update_settings', {
                            tables: ['settings', 'settings', 'settings', 'settings'],
                            keys: ['followToggle', 'followReward', 'followMessage', 'followDelay'],
                            values: [followToggle, followReward.val(), followMessage.val(), followDelay.val()]
                        }, function() {
                            socket.sendCommand('alerts_follow_update_settings_cmd', 'followerpanelupdate', function() {
                                // Close the modal.
                                $('#follow-alert').modal('toggle');
                                // Alert the user.
                                toastr.success('Die Einstellungen für die Follower-Alarm wurden erfolgreich aktualisiert!');
                            });
                        });
                }
            }).modal('toggle');
        });
    });

    // Subscribe handler settings.
    $('#subscribeHandlerSettings').on('click', function() {
        let tables = [];
        let keys = [
            'subscribeMessage', 'reSubscribeMessage', 'giftSubMessage', 'giftAnonSubMessage', 'massGiftSubMessage', 'massAnonGiftSubMessage',
            'subscriberWelcomeToggle', 'reSubscriberWelcomeToggle', 'giftSubWelcomeToggle', 'giftAnonSubWelcomeToggle', 'massGiftSubWelcomeToggle',
            'massAnonGiftSubWelcomeToggle', 'subscribeReward', 'reSubscribeReward', 'giftSubReward', 'massGiftSubReward', 'subEmote', 'subPlans'
        ];
        for (let i = 0; i < keys.length; i++) {
            tables.push('subscribeHandler');
        }
        socket.getDBValues('alerts_subscribe_get_settings', {
            tables: tables,
            keys: keys
        }, true, function(e) {
            helpers.parseJSONValues(e, keys);
            helpers.getModal('subscribe-alert', 'Abonnement Benachrichtigungseinstellungen', 'Speichen', $('<form/>', {
                'role': 'form'
            })
            // Add the div for the col boxes.
            .append($('<div/>', {
                'class': 'panel-group',
                'id': 'accordion'
            })
            // Append first collapsible accordion.
            .append(helpers.getCollapsibleAccordion('main-1', 'Abonnement-Einstellungen', $('<form/>', {
                    'role': 'form'
                })
                // Add toggle for normal subscriptions.
                .append(helpers.getDropdownGroup('sub-toggle', 'Abonnement-Alarme aktivieren', (e.subscriberWelcomeToggle === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'Wenn eine Nachricht im Channel gesendet werden soll, wenn dich jemand abonniert. Dadurch wird auch die Belohnung umgeschaltet.'))
                // Append message box for the message
                .append(helpers.getTextAreaGroup('sub-msg-1000', 'text', 'Neue Abonnementnachricht (Tier 1)', '', e.subscribeMessage['1000'],
                    'Nachricht, die gesendet wird, wenn jemand den Kanal neu abonniert auf Stufe 1.', false))
                .append(helpers.getTextAreaGroup('sub-msg-2000', 'text', 'Neue Abonnementnachricht (Tier 2)', '', e.subscribeMessage['2000'],
                    'Nachricht, die gesendet wird, wenn jemand den Kanal neu abonniert auf Stufe 2.', false))
                .append(helpers.getTextAreaGroup('sub-msg-3000', 'text', 'Neue Abonnementnachricht (Tier 3)', '', e.subscribeMessage['3000'],
                    'Nachricht, die gesendet wird, wenn jemand den Kanal neu abonniert auf Stufe 3.', false))
                .append(helpers.getTextAreaGroup('sub-msg-prime', 'text', 'Neue Abonnementnachricht (Prime)', '', e.subscribeMessage['Prime'],
                    'Nachricht, die gesendet wird, wenn jemand den Kanal neu abonniert mit Prime.', false))
                // Appen the reward box
                .append(helpers.getInputGroup('sub-reward-1000', 'number', 'Neue Abonnementbelohnung (Tier 1)', '', e.subscribeReward['1000'],
                    'Punktebelohnung, die vergeben wird, wenn jemand den Kanal auf Stufe 1 neu abonniert.'))
                .append(helpers.getInputGroup('sub-reward-2000', 'number', 'Neue Abonnementbelohnung (Tier 2)', '', e.subscribeReward['2000'],
                    'Punktebelohnung, die vergeben wird, wenn jemand den Kanal auf Stufe 2 neu abonniert.'))
                .append(helpers.getInputGroup('sub-reward-3000', 'number', 'Neue Abonnementbelohnung (Tier 3)', '', e.subscribeReward['3000'],
                    'Punktebelohnung, die vergeben wird, wenn jemand den Kanal auf Stufe 3 neu abonniert.'))
                .append(helpers.getInputGroup('sub-reward-prime', 'number', 'Neue Abonnementbelohnung (Prime)', '', e.subscribeReward['Prime'],
                    'Punktebelohnung, die vergeben wird, wenn jemand den Kanal mit Prime neu abonniert.'))
            ))
            // Append third collapsible accordion.
            .append(helpers.getCollapsibleAccordion('main-3', 'Einstellungen für das erneute Abonnieren', $('<form/>', {
                    'role': 'form'
                })
                // Add toggle for resubscriptions.
                .append(helpers.getDropdownGroup('resub-toggle', 'Benachrichtigungen für erneutes Abonnieren aktivieren', (e.reSubscriberWelcomeToggle === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'Wenn eine Nachricht im Kanal gesendet werden soll, wenn dich jemand erneut abonniert. Dadurch wird auch die Belohnung umgeschaltet.'))
                // Append message box for the message
                .append(helpers.getTextAreaGroup('resub-msg-1000', 'text', 'Re-Abonnement Nachricht (Tier 1)', '', e.reSubscribeMessage['1000'],
                    'Nachricht, die gesendet wird, wenn jemand den Kanal auf Stufe 1 erneut abonniert.', false))
                .append(helpers.getTextAreaGroup('resub-msg-2000', 'text', 'Re-Abonnement Nachricht (Tier 2)', '', e.reSubscribeMessage['2000'],
                    'Nachricht, die gesendet wird, wenn jemand den Kanal auf Stufe 2 erneut abonniert.', false))
                .append(helpers.getTextAreaGroup('resub-msg-3000', 'text', 'Re-Abonnement Nachricht (Tier 3)', '', e.reSubscribeMessage['3000'],
                    'Nachricht, die gesendet wird, wenn jemand den Kanal auf Stufe 3 erneut abonniert.', false))
                .append(helpers.getTextAreaGroup('resub-msg-prime', 'text', 'Re-Abonnement Nachricht (Prime)', '', e.reSubscribeMessage,
                    'Nachricht, die gesendet wird, wenn jemand den Kanal mit Prime erneut abonniert.', false))
                // Appen the reward box
                .append(helpers.getInputGroup('resub-reward-1000', 'number', 'Re-Abonnementbelohnung (Tier 1)', '', e.reSubscribeReward['1000'],
                    'Nachricht, die gesendet wird, wenn jemand den Kanal auf Stufe 1 erneut abonniert.'))
                .append(helpers.getInputGroup('resub-reward-2000', 'number', 'Re-Abonnementbelohnung (Tier 2)', '', e.reSubscribeReward['2000'],
                    'Nachricht, die gesendet wird, wenn jemand den Kanal auf Stufe 2 erneut abonniert.'))
                .append(helpers.getInputGroup('resub-reward-3000', 'number', 'Re-Abonnementbelohnung (Tier 3)', '', e.reSubscribeReward['3000'],
                    'Nachricht, die gesendet wird, wenn jemand den Kanal auf Stufe 3 erneut abonniert.'))
                .append(helpers.getInputGroup('resub-reward-prime', 'number', 'Re-Abonnementbelohnung (Prime)', '', e.reSubscribeReward['Prime'],
                    'Punktebelohnung, die vergeben wird, wenn jemand den Kanal mit Prime erneut abonniert.'))
            ))
            // Append forth collapsible accordion.
            .append(helpers.getCollapsibleAccordion('main-4', 'Einstellungen für Geschenk-Abonnements', $('<form/>', {
                    'role': 'form'
                })
                // Add toggle for gifted subscriptions.
                .append(helpers.getDropdownGroup('giftsub-toggle', 'Geschenk-Abonnement-Alarme aktivieren', (e.giftSubWelcomeToggle === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'Wenn eine Nachricht im Kanal gesendet werden soll, wenn jemand ein Abonnement verschenkt. Dadurch wird auch die Belohnung umgeschaltet.'))
                // Append message box for the message
                .append(helpers.getTextAreaGroup('giftsub-msg-1000', 'text', 'Geschenk-Abonnement-Nachricht (Tier 1)', '', e.giftSubMessage['1000'],
                    'Nachricht, die gesendet wird, wenn jemand ein Abonnement für den Kanal auf Stufe 1 verschenkt.', false))
                .append(helpers.getTextAreaGroup('giftsub-msg-2000', 'text', 'Geschenk-Abonnement-Nachricht (Tier 2)', '', e.giftSubMessage['2000'],
                    'Nachricht, die gesendet wird, wenn jemand ein Abonnement für den Kanal auf Stufe 2 verschenkt.', false))
                .append(helpers.getTextAreaGroup('giftsub-msg-3000', 'text', 'Geschenk-Abonnement-Nachricht (Tier 3)', '', e.giftSubMessage['3000'],
                    'Nachricht, die gesendet wird, wenn jemand ein Abonnement für den Kanal auf Stufe 3 verschenkt.', false))
                // Appen the reward box
                .append(helpers.getInputGroup('giftsub-reward-1000', 'number', 'Geschenk-Abonnement-Belohnung (Tier 1)', '', e.giftSubReward['1000'],
                    'Punktebelohnung für jemanden, der ein Abonnement des Kanals auf Stufe 1 verschenkt.'))
                .append(helpers.getInputGroup('giftsub-reward-2000', 'number', 'Geschenk-Abonnement-Belohnung (Tier 2)', '', e.giftSubReward['2000'],
                    'Punktebelohnung für jemanden, der ein Abonnement des Kanals auf Stufe 2 verschenkt.'))
                .append(helpers.getInputGroup('giftsub-reward-3000', 'number', 'Geschenk-Abonnement-Belohnung (Tier 3)', '', e.giftSubReward['3000'],
                    'Punktebelohnung für jemanden, der ein Abonnement des Kanals auf Stufe 3 verschenkt.'))
            ))
            // Append fith collapsible accordion.
            .append(helpers.getCollapsibleAccordion('main-5', 'Einstellungen für anonyme Geschenkabonnements', $('<form/>', {
                    'role': 'form'
                })
                // Add toggle for gifted subscriptions.
                .append(helpers.getDropdownGroup('anon-giftsub-toggle', 'Aktiviert anonyme Geschenkabonnementbenachrichtigungen', (e.giftAnonSubWelcomeToggle === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'Wenn eine Nachricht im Kanal gesendet werden soll, wenn jemand anonym ein Abonnement verschenkt.'))
                // Append message box for the message
                .append(helpers.getTextAreaGroup('anon-giftsub-msg-1000', 'text', 'Anonyme Geschenk-Abonnement-Nachricht (Tier 1)', '', e.giftAnonSubMessage['1000'],
                    'Nachricht, die gesendet wird, wenn jemand anonym ein Abonnement für den Kanal auf Stufe 1 verschenkt.', false))
                .append(helpers.getTextAreaGroup('anon-giftsub-msg-2000', 'text', 'Anonyme Geschenk-Abonnement-Nachricht (Tier 2)', '', e.giftAnonSubMessage['2000'],
                    'Nachricht, die gesendet wird, wenn jemand anonym ein Abonnement für den Kanal auf Stufe 2 verschenkt.', false))
                .append(helpers.getTextAreaGroup('anon-giftsub-msg-3000', 'text', 'Anonyme Geschenk-Abonnement-Nachricht (Tier 3)', '', e.giftAnonSubMessage['3000'],
                    'Nachricht, die gesendet wird, wenn jemand anonym ein Abonnement für den Kanal auf Stufe 3 verschenkt.', false))
            ))
            // Append sixth collapsible accordion.
            .append(helpers.getCollapsibleAccordion('main-6', 'Einstellungen für Massen-/Geheimgeschenkabonnements', $('<form/>', {
                    'role': 'form'
                })
                // Add toggle for gifted subscriptions.
                .append(helpers.getDropdownGroup('mass-giftsub-toggle', 'Aktiviert Abonnementbenachrichtigungen für Massen-/Geheimgeschenke', (e.massGiftSubWelcomeToggle === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'Wenn eine Nachricht im Kanal gesendet werden soll, wenn jemand Massenabonnements verschenkt. Dadurch wird auch die Belohnung umgeschaltet.'))
                // Append message box for the message
                .append(helpers.getTextAreaGroup('mass-giftsub-msg-1000', 'text', 'Massen-/Geheimgeschenk-Abonnement-Nachricht (Tier 1)', '', e.massGiftSubMessage['1000'],
                    'Nachricht, die gesendet wird, wenn jemand Massenabonnements für den Kanal auf Stufe 1 verschenkt.', false))
                .append(helpers.getTextAreaGroup('mass-giftsub-msg-2000', 'text', 'Massen-/Geheimgeschenk-Abonnement-Nachricht (Tier 2)', '', e.massGiftSubMessage['2000'],
                    'Nachricht, die gesendet wird, wenn jemand Massenabonnements für den Kanal auf Stufe 2 verschenkt.', false))
                .append(helpers.getTextAreaGroup('mass-giftsub-msg-3000', 'text', 'Massen-/Geheimgeschenk-Abonnement-Nachricht (Tier 3)', '', e.massGiftSubMessage['3000'],
                    'Nachricht, die gesendet wird, wenn jemand Massenabonnements für den Kanal auf Stufe 3 verschenkt.', false))
                // Appen the reward box
                .append(helpers.getInputGroup('mass-giftsub-reward-1000', 'number', 'Massen-/Geheimgeschenk-Abonnement-Belohnung (Tier 1)', '', e.massGiftSubReward['1000'],
                    'Punktebelohnung für jemanden, der Abonnements auf Stufe 1 in dem Kanal verschenkt (pro verschenktem Abonnement).'))
                .append(helpers.getInputGroup('mass-giftsub-reward-2000', 'number', 'Massen-/Geheimgeschenk-Abonnement-Belohnung (Tier 2)', '', e.massGiftSubReward['2000'],
                    'Punktebelohnung für jemanden, der Abonnements auf Stufe 2 in dem Kanal verschenkt (pro verschenktem Abonnement).'))
                .append(helpers.getInputGroup('mass-giftsub-reward-3000', 'number', 'Massen-/Geheimgeschenk-Abonnement-Belohnung (Tier 3)', '', e.massGiftSubReward['3000'],
                    'Punktebelohnung für jemanden, der Abonnements auf Stufe 3 in dem Kanal verschenkt (pro verschenktem Abonnement).'))
            ))
            // Append seventh collapsible accordion.
            .append(helpers.getCollapsibleAccordion('main-7', 'Abonnementeinstellungen für anonyme Massen-/Geheimgeschenke', $('<form/>', {
                    'role': 'form'
                })
                // Add toggle for gifted subscriptions.
                .append(helpers.getDropdownGroup('anon-mass-giftsub-toggle', 'Aktiviert die anonymen Massen-/Geheimgeschenk-Nachrichten', (e.massAnonGiftSubWelcomeToggle === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'Wenn eine Nachricht im Kanal gesendet werden soll, wenn jemand anonym Massenabonnements verschenkt.'))
                // Append message box for the message
                .append(helpers.getTextAreaGroup('anon-mass-giftsub-msg-1000', 'text', 'Anonyme Massen-/Geheimgeschenk-Abonnement-Nachricht (Tier 1)', '', e.massAnonGiftSubMessage['1000'],
                    'Nachricht, die gesendet wird, wenn jemand anonym Massenabonnements für den Kanal auf Stufe 1 verschenkt.', false))
                .append(helpers.getTextAreaGroup('anon-mass-giftsub-msg-2000', 'text', 'Anonyme Massen-/Geheimgeschenk-Abonnement-Nachricht (Tier 2)', '', e.massAnonGiftSubMessage['2000'],
                    'Nachricht, die gesendet wird, wenn jemand anonym Massenabonnements für den Kanal auf Stufe 2 verschenkt.', false))
                .append(helpers.getTextAreaGroup('anon-mass-giftsub-msg-3000', 'text', 'Anonyme Massen-/Geheimgeschenk-Abonnement-Nachricht (Tier 3)', '', e.massAnonGiftSubMessage['3000'],
                    'Nachricht, die gesendet wird, wenn jemand anonym Massenabonnements für den Kanal auf Stufe 3 verschenkt.', false))
            ))
            // Tier settings
            .append(helpers.getCollapsibleAccordion('main-8', 'Stufeneinstellungen', $('<form/>', {
                    'role': 'form'
                })
                // Append sub plan name
                .append(helpers.getInputGroup('sub-plan-1000', 'text', 'Name des Abonnementplans (Tier 1)', '', e.subPlans['1000'], 'Name für den Stufe 1 Plan.'))
                .append(helpers.getInputGroup('sub-plan-2000', 'text', 'Name des Abonnementplans (Tier 2)', '', e.subPlans['2000'], 'Name für den Stufe 2 Plan.'))
                .append(helpers.getInputGroup('sub-plan-3000', 'text', 'Name des Abonnementplans (Tier 3)', '', e.subPlans['3000'], 'Name für den Stufe 3 Plan.'))
                .append(helpers.getInputGroup('sub-plan-prime', 'text', 'Name des Abonnementplans (Prime)', '', e.subPlans['Prime'], 'Name für den Prime Plan.'))
                // Append the emotes box
                .append(helpers.getInputGroup('sub-emote-1000', 'text', 'Abonnement-Emote (Tier 1)', '', e.subEmote['1000'],
                    'Emote, dass das (customemote) für Stufe 1 Abonnements ersetzt. Für individuelle Abonnement-Nachrichten wird das Emote für die Anzahl der '
                    + 'abonnierten Monate wiederholt. Bei Massenabonnementnachrichten wird das Emote für die Anzahl der geschenkten Abonnements wiederholt.'))
                .append(helpers.getInputGroup('sub-emote-2000', 'text', 'Abonnement-Emote (Tier 2)', '', e.subEmote['2000'],
                    'Emote, dass das (customemote) für Stufe 2 Abonnements ersetzt. Für individuelle Abonnement-Nachrichten wird das Emote für die Anzahl der '
                    + 'abonnierten Monate wiederholt. Bei Massenabonnementnachrichten wird das Emote für die Anzahl der geschenkten Abonnements wiederholt.'))
                .append(helpers.getInputGroup('sub-emote-3000', 'text', 'Abonnement-Emote (Tier 3)', '', e.subEmote['3000'],
                    'Emote, dass das (customemote) für Stufe 3 Abonnements ersetzt. Für individuelle Abonnement-Nachrichten wird das Emote für die Anzahl der '
                    + 'abonnierten Monate wiederholt. Bei Massenabonnementnachrichten wird das Emote für die Anzahl der geschenkten Abonnements wiederholt.'))
                .append(helpers.getInputGroup('sub-emote-prime', 'text', 'Abonnement-Emote (Prime)', '', e.subEmote['Prime'],
                    'Emote, dass das (customemote) für Prime-Abonnements ersetzt. Das Emote wird für die Anzahl der abonnierten Monate wiederholt.'))
            ))),
            function() { // Callback once the user clicks save.
                let subToggle = $('#sub-toggle').find(':selected').text() === 'Ja',
                    subMsg1000 = $('#sub-msg-1000'),
                    subMsg2000 = $('#sub-msg-2000'),
                    subMsg3000 = $('#sub-msg-3000'),
                    subMsgPrime = $('#sub-msg-prime'),
                    subReward1000 = $('#sub-reward-1000'),
                    subReward2000 = $('#sub-reward-2000'),
                    subReward3000 = $('#sub-reward-3000'),
                    subRewardPrime = $('#sub-reward-prime'),
                    reSubToggle = $('#resub-toggle').find(':selected').text() === 'Ja',
                    reSubMsg1000 = $('#resub-msg-1000'),
                    reSubMsg2000 = $('#resub-msg-2000'),
                    reSubMsg3000 = $('#resub-msg-3000'),
                    reSubMsgPrime = $('#resub-msg-prime'),
                    reSubReward1000 = $('#resub-reward-1000'),
                    reSubReward2000 = $('#resub-reward-2000'),
                    reSubReward3000 = $('#resub-reward-3000'),
                    reSubRewardPrime = $('#resub-reward-prime'),
                    giftSubToggle = $('#giftsub-toggle').find(':selected').text() === 'Ja',
                    giftSubMsg1000 = $('#giftsub-msg-1000'),
                    giftSubMsg2000 = $('#giftsub-msg-2000'),
                    giftSubMsg3000 = $('#giftsub-msg-3000'),
                    giftSubReward1000 = $('#giftsub-reward-1000'),
                    giftSubReward2000 = $('#giftsub-reward-2000'),
                    giftSubReward3000 = $('#giftsub-reward-3000'),
                    anonGiftSubToggle = $('#anon-giftsub-toggle').find(':selected').text() === 'Ja',
                    anonGiftSubMsg1000 = $('#anon-giftsub-msg-1000'),
                    anonGiftSubMsg2000 = $('#anon-giftsub-msg-2000'),
                    anonGiftSubMsg3000 = $('#anon-giftsub-msg-3000'),
                    massGiftSubToggle = $('#mass-giftsub-toggle').find(':selected').text() === 'Ja',
                    massGiftSubMsg1000 = $('#mass-giftsub-msg-1000'),
                    massGiftSubMsg2000 = $('#mass-giftsub-msg-2000'),
                    massGiftSubMsg3000 = $('#mass-giftsub-msg-3000'),
                    massGiftSubReward1000 = $('#mass-giftsub-reward-1000'),
                    massGiftSubReward2000 = $('#mass-giftsub-reward-2000'),
                    massGiftSubReward3000 = $('#mass-giftsub-reward-3000'),
                    anonMassGiftSubToggle = $('#anon-mass-giftsub-toggle').find(':selected').text() === 'Ja',
                    anonMassGiftSubMsg1000 = $('#anon-mass-gifsub-msg-1000'),
                    anonMassGiftSubMsg2000 = $('#anon-mass-gifsub-msg-2000'),
                    anonMassGiftSubMsg3000 = $('#anon-mass-gifsub-msg-3000'),
                    tierOne = $('#sub-plan-1000'),
                    tierTwo = $('#sub-plan-2000'),
                    tierThree = $('#sub-plan-3000'),
                    tierPrime = $('#sub-plan-prime'),
                    subEmote1000 = $('#sub-emote-1000'),
                    subEmote2000 = $('#sub-emote-2000'),
                    subEmote3000 = $('#sub-emote-3000'),
                    subEmotePrime = $('#sub-emote-prime');

                // Make sure the user has someone in each box.
                switch (false) {
                    case helpers.handleInputString(subMsg1000):
                    case helpers.handleInputString(subMsg2000):
                    case helpers.handleInputString(subMsg3000):
                    case helpers.handleInputString(subMsgPrime):
                    case helpers.handleInputNumber(subReward1000, 0):
                    case helpers.handleInputNumber(subReward2000, 0):
                    case helpers.handleInputNumber(subReward3000, 0):
                    case helpers.handleInputNumber(subRewardPrime, 0):
                    case helpers.handleInputString(reSubMsg1000):
                    case helpers.handleInputString(reSubMsg2000):
                    case helpers.handleInputString(reSubMsg3000):
                    case helpers.handleInputString(reSubMsgPrime):
                    case helpers.handleInputNumber(reSubReward1000, 0):
                    case helpers.handleInputNumber(reSubReward2000, 0):
                    case helpers.handleInputNumber(reSubReward3000, 0):
                    case helpers.handleInputNumber(reSubRewardPrime, 0):
                    case helpers.handleInputString(giftSubMsg1000):
                    case helpers.handleInputString(giftSubMsg2000):
                    case helpers.handleInputString(giftSubMsg3000):
                    case helpers.handleInputNumber(giftSubReward1000, 0):
                    case helpers.handleInputNumber(giftSubReward2000, 0):
                    case helpers.handleInputNumber(giftSubReward3000, 0):
                    case helpers.handleInputString(anonGiftSubMsg1000):
                    case helpers.handleInputString(anonGiftSubMsg2000):
                    case helpers.handleInputString(anonGiftSubMsg3000):
                    case helpers.handleInputString(massGiftSubMsg1000):
                    case helpers.handleInputString(massGiftSubMsg2000):
                    case helpers.handleInputString(massGiftSubMsg3000):
                    case helpers.handleInputNumber(massGiftSubReward1000, 0):
                    case helpers.handleInputNumber(massGiftSubReward2000, 0):
                    case helpers.handleInputNumber(massGiftSubReward3000, 0):
                    case helpers.handleInputString(anonMassGiftSubMsg1000):
                    case helpers.handleInputString(anonMassGiftSubMsg2000):
                    case helpers.handleInputString(anonMassGiftSubMsg3000):
                    case helpers.handleInputString(tierOne):
                    case helpers.handleInputString(tierTwo):
                    case helpers.handleInputString(tierThree):
                    case helpers.handleInputString(tierPrime):
                        break;
                    default:
                        socket.updateDBValues('alerts_subscribe_update_settings', {
                            tables: tables,
                            keys: keys,
                            values: [
                                JSON.stringify({'1000': subMsg1000.val(), '2000': subMsg2000.val(), '3000': subMsg3000.val(), 'Prime': subMsgPrime.val()}),
                                JSON.stringify({'1000': reSubMsg1000.val(), '2000': reSubMsg2000.val(), '3000': reSubMsg3000.val(), 'Prime': reSubMsgPrime.val()}),
                                JSON.stringify({'1000': giftSubMsg1000.val(), '2000': giftSubMsg2000.val(), '3000': giftSubMsg3000.val()}),
                                JSON.stringify({'1000': anonGiftSubMsg1000.val(), '2000': anonGiftSubMsg2000.val(), '3000': anonGiftSubMsg3000.val()}),
                                JSON.stringify({'1000': massGiftSubMsg1000.val(), '2000': massGiftSubMsg2000.val(), '3000': massGiftSubMsg3000.val()}),
                                JSON.stringify({'1000': anonMassGiftSubMsg1000.val(), '2000': anonMassGiftSubMsg2000.val(), '3000': anonMassGiftSubMsg3000.val()}),
                                subToggle, reSubToggle, giftSubToggle, anonGiftSubToggle, massGiftSubToggle, anonMassGiftSubToggle,
                                JSON.stringify({'1000': parseInt(subReward1000.val()), '2000': parseInt(subReward2000.val()), '3000': parseInt(subReward3000.val()), 'Prime': parseInt(subRewardPrime.val())}),
                                JSON.stringify({'1000': parseInt(reSubReward1000.val()), '2000': parseInt(reSubReward2000.val()), '3000': parseInt(reSubReward3000.val()), 'Prime': parseInt(reSubRewardPrime.val())}),
                                JSON.stringify({'1000': parseInt(giftSubReward1000.val()), '2000': parseInt(giftSubReward2000.val()), '3000': parseInt(giftSubReward3000.val())}),
                                JSON.stringify({'1000': parseInt(massGiftSubReward1000.val()), '2000': parseInt(massGiftSubReward2000.val()), '3000': parseInt(massGiftSubReward3000.val())}),
                                JSON.stringify({'1000': subEmote1000.val(), '2000': subEmote2000.val(), '3000': subEmote3000.val(), 'Prime': subEmotePrime.val()}),
                                JSON.stringify({'1000': tierOne.val(), '2000': tierTwo.val(), '3000': tierThree.val(), 'Prime': tierPrime.val()})
                            ]
                        }, function() {
                            socket.sendCommand('alerts_subscribe_update_settings_cmd', 'subscriberpanelupdate', function() {
                                // Close the modal.
                                $('#subscribe-alert').modal('toggle');
                                // Alert the user.
                                toastr.success('Erfolgreich Benachrichtigungseinstellungen für Abonnements aktualisiert!');
                            });
                        });
                }
            }).modal('toggle');
        });
    });

    // Host settings button.
    $('#hostHandlerSettings').on('click', function() {
        socket.getDBValues('alerts_get_host_settings', {
            tables: ['settings', 'settings', 'settings', 'settings', 'settings', 'settings'],
            keys: ['hostReward', 'hostMinViewerCount', 'hostMinCount', 'hostMessage', 'hostHistory', 'hostToggle']
        }, true, function(e) {
            helpers.getModal('host-alert', 'Host-Alarmeinstellungen', 'Speichern', $('<form/>', {
                'role': 'form'
            })
            // Add the div for the col boxes.
            .append($('<div/>', {
                'class': 'panel-group',
                'id': 'accordion'
            })
            // Append first collapsible accordion.
            .append(helpers.getCollapsibleAccordion('main-1', 'Host-Einstellungen', $('<form/>', {
                    'role': 'form'
                })
                // Add toggle for normal hosts
                .append(helpers.getDropdownGroup('host-toggle', 'Host-Alarme aktivieren', (e.hostToggle === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'Wenn eine Nachricht im Kanal gesendet werden soll, wenn jemand den Kanal hostet.'))
                // Append message box for the message
                .append(helpers.getTextAreaGroup('host-msg', 'text', 'Host-Nachricht', '', e.hostMessage,
                    'Die Nachricht wird gesendet, wenn jemand den Kanal hostet. Tags: (name), (alert), (playsound), (reward) und (viewers)', false))
                // Appen the reward box
                .append(helpers.getInputGroup('host-reward', 'number', 'Host-Belohnung', '', e.hostReward,
                    'Belohnung, die dem Benutzer gezahlt wird, wenn er den Kanal hostet.'))))
            // Append third collapsible accordion.
            .append(helpers.getCollapsibleAccordion('main-3', 'Zusätzliche Einstellungen', $('<form/>', {
                    'role': 'form'
                })
                // Add toggle for host history.
                .append(helpers.getDropdownGroup('host-history', 'Host-Verlauf aktivieren', (e.hostHistory === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'Wenn alle Hosts für eine spätere Ansicht protokolliert werden sollen.'))
                // Min host box reward.
                .append(helpers.getInputGroup('host-minpoint', 'number', 'Mindestanzahl der Zuschauer für die Host-Belohnung', '', e.hostMinViewerCount,
                    'Minimale Anzahl von Zuschauern, mit denen die Benutzer hosten muss, um eine Belohnung zu erhalten.'))
                // Min host box alert.
                .append(helpers.getInputGroup('host-minalert', 'number', 'Minimale Zuschauer für Host Alarm', '', e.hostMinCount,
                    'Minimale Anzahl von Zuschauern, mit denen die Benutzer hosten muss, um den Alarm auszulösen.'))))),
            function() { // Callback once the user clicks save.
                let hostToggle = $('#host-toggle').find(':selected').text() === 'Ja',
                    hostMsg = $('#host-msg'),
                    hostReward = $('#host-reward'),
                    hostHistory = $('#host-history').find(':selected').text() === 'Ja',
                    hostMinPoints = $('#host-minpoint'),
                    hostMinAlert = $('#host-minalert');

                // Make sure the user has someone in each box.
                switch (false) {
                    case helpers.handleInputString(hostMsg):
                    case helpers.handleInputNumber(hostReward, 0):
                    case helpers.handleInputNumber(hostMinPoints, 0):
                    case helpers.handleInputNumber(hostMinAlert, 0):
                        break;
                    default:
                        socket.updateDBValues('alerts_update_host_settings', {
                            tables: ['settings', 'settings', 'settings', 'settings', 'settings', 'settings'],
                            keys: ['hostReward', 'hostMinViewerCount', 'hostMinCount', 'hostMessage',
                                'hostHistory', 'hostToggle'],
                            values: [hostReward.val(), hostMinPoints.val(), hostMinAlert.val(),
                                hostMsg.val(), hostHistory, hostToggle]
                        }, function() {
                            socket.sendCommand('alerts_update_host_settings_cmd', 'reloadhost', function() {
                                // Close the modal.
                                $('#host-alert').modal('toggle');
                                // Alert the user.
                                toastr.success('Host-Alarmeinstellungen erfolgreich aktualisiert!');
                            });
                        });
                }

            }).modal('toggle');
        });
    });

    // Bits alert settings.
    $('#bitsHandlerSettings').on('click', function() {
        socket.getDBValues('alerts_get_bits_settings', {
            tables: ['bitsSettings', 'bitsSettings', 'bitsSettings'],
            keys: ['toggle', 'message', 'minimum']
        }, true, function(e) {
            helpers.getModal('bits-alert', 'Bits Alarm-Einstellungen', 'Speichern', $('<form/>', {
                'role': 'form'
            })
            // Add the toggle for bits alerts.
            .append(helpers.getDropdownGroup('bits-toggle', 'Bits-Alarme aktivieren', (e.toggle === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                'Wenn eine Nachricht im Kanal gesagt werden soll, wenn jemand cheert.'))
            // Add the the text area for the bits message.
            .append(helpers.getTextAreaGroup('bits-message', 'text', 'Bits Nachricht', '', e.message,
                'Die Nachricht wird gesendet, wenn jemand im Kanal cheert. Tags: (name), (alert), (playsound), (message) und (amount)', false))
            // Add the box for the reward.
            .append(helpers.getInputGroup('bits-minimum', 'number', 'Bits Minimum', '', e.minimum, 'Anzahl der Bits, die benötigt werden, um den Alarm auszulösen.')),
            function() { // Callback once the user clicks save.
                let bitsToggle = $('#bits-toggle').find(':selected').text() === 'Ja',
                    bitsMsg = $('#bits-message'),
                    bitsMin = $('#bits-minimum');

                // Make sure the user has someone in each box.
                switch (false) {
                    case helpers.handleInputString(bitsMsg):
                    case helpers.handleInputNumber(bitsMin):
                        break;
                    default:
                        socket.updateDBValues('alerts_update_bits_settings', {
                            tables: ['bitsSettings', 'bitsSettings', 'bitsSettings'],
                            keys: ['toggle', 'message', 'minimum'],
                            values: [bitsToggle, bitsMsg.val(), bitsMin.val()]
                        }, function() {
                            socket.sendCommand('alerts_update_bits_settings_cmd', 'reloadbits', function() {
                                // Close the modal.
                                $('#bits-alert').modal('toggle');
                                // Alert the user.
                                toastr.success('Bit-Alarmeinstellungen erfolgreich aktualisiert!');
                            });
                        });
                }

            }).modal('toggle');
        });
    });

    // Clip alert settings.
    $('#clipHandlerSettings').on('click', function() {
        socket.getDBValues('alerts_get_clip_settings', {
            tables: ['clipsSettings', 'clipsSettings'],
            keys: ['toggle', 'message']
        }, true, function(e) {
            helpers.getModal('clip-alert', 'Clip-Alarmeinstellungen', 'Speichern', $('<form/>', {
                'role': 'form'
            })
            // Add the toggle for clip alerts.
            .append(helpers.getDropdownGroup('clip-toggle', 'Clip-Alarme aktivieren', (e.toggle === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                'Wenn eine Nachricht im Kanal gesendet werden soll, wenn jemand einen Clip erstellt.'))
            // Add the text area for the clips message.
            .append(helpers.getTextAreaGroup('clip-message', 'text', 'Clip-Nachricht', '', e.message,
                'Die Nachricht wird gesendet, wenn jemand einen Clip erstellt. Tags: (name), (alert), (playsound), (title) und (url)', false)),
            function() { // Callback once the user clicks save.
                let clipToggle = $('#clip-toggle').find(':selected').text() === 'Ja',
                    clipMsg = $('#clip-message');

                // Make sure the user has someone in each box.
                switch (false) {
                    case helpers.handleInputString(clipMsg):
                        break;
                    default:
                        socket.updateDBValues('alerts_update_clip_settings', {
                            tables: ['clipsSettings', 'clipsSettings'],
                            keys: ['toggle', 'message'],
                            values: [clipToggle, clipMsg.val()]
                        }, function() {
                            socket.sendCommand('alerts_update_clip_settings_cmd', 'reloadclip', function() {
                                // Close the modal.
                                $('#clip-alert').modal('toggle');
                                // Alert the user.
                                toastr.success('Clip-Alarmeinstellungen erfolgreich aktualisiert!');
                            });
                        });
                }
            }).modal('toggle');
        });
    });

    // Raid settings.
    $('#raidHandlerSettings').on('click', function() {
        socket.getDBValues('alerts_get_raid_settings', {
            tables: ['raidSettings', 'raidSettings', 'raidSettings', 'raidSettings', 'raidSettings', 'raidSettings'],
            keys: ['raidToggle', 'newRaidIncMessage', 'raidIncMessage', 'raidReward', 'raidOutMessage', 'raidOutSpam']
        }, true, function(e) {
            helpers.getModal('raid-alert', 'Raid Alarm Einstellungen', 'Speichern', $('<form/>', {
                'role': 'form'
            })
            // Add the div for the col boxes.
            .append($('<div/>', {
                'class': 'panel-group',
                'id': 'accordion'
            })
            // Append first collapsible accordion.
            .append(helpers.getCollapsibleAccordion('main-1', 'Einstellungen für eingehende Raids', $('<form/>', {
                    'role': 'form'
                })
                 // Add the toggle for raid alerts.
                .append(helpers.getDropdownGroup('raid-toggle', 'Raid-Alarme aktivieren', (e.raidToggle === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'Wenn eine Nachricht im Kanal gesendet werden soll, wenn ein eingehender Raid passiert.'))
                // Add the text area for the new raid message.
                .append(helpers.getTextAreaGroup('new-raid-message', 'text', 'New Raider Message', '', e.newRaidIncMessage,
                    'Die Nachricht wird gesendet, wenn jemand zum ersten Mal deinen Kanal raiden. Tags: (username), (alert), (playsound), (viewers), (url), (reward) und (game)', false))
                // Add the text area for the raid message.
                .append(helpers.getTextAreaGroup('raid-message', 'text', 'Raider Nachricht', '', e.raidIncMessage,
                    'Die Nachricht wird gesendet, wenn jemand deinen Kanal raidet. Tags: (username), (alert), (playsound), (viewers), (url), (times), (reward) und (game)', false))
                // Appen the reward box
                .append(helpers.getInputGroup('raid-reward', 'number', 'Raid Belohnung', '', e.raidReward,
                    'Belohnung für die Benutzer, die deinen Kanal geraidet haben.'))))
            // Append second collapsible accordion.
            .append(helpers.getCollapsibleAccordion('main-2', 'Einstellungen für ausgehende Raids', $('<form/>', {
                    'role': 'form'
                })
                // Add the text area for the new raid message.
                .append(helpers.getTextAreaGroup('out-raid-message', 'text', 'Raiding Nachricht', '', e.raidOutMessage,
                    'Die Nachricht wird in den Chat gesendet, wenn du den Befehl !raid verwendest, um einen Kanal zu raiden. Tags: (username) und (url)', false))
                 // Appen the spam box
                .append(helpers.getInputGroup('raid-spam', 'number', 'Raiding Nachrichten-Spam', '', e.raidOutSpam,
                    'Wie oft wird die Nachricht bei Verwendung des Befehls !raid im Chat angezeigt. Maximum ist 10 Mal.'))))),
            function() {
                let raidToggle = $('#raid-toggle').find(':selected').text() === 'Ja',
                    raidNewMsg = $('#new-raid-message'),
                    raidMsg = $('#raid-message'),
                    raidReward = $('#raid-reward'),
                    raidOutMsg = $('#out-raid-message'),
                    raidMsgSpam = $('#raid-spam');

                switch (false) {
                    case helpers.handleInputString(raidNewMsg):
                    case helpers.handleInputString(raidMsg):
                    case helpers.handleInputNumber(raidReward, 0):
                    case helpers.handleInputString(raidOutMsg):
                    case helpers.handleInputNumber(raidMsgSpam, 1, 10):
                        break;
                    default:
                        socket.updateDBValues('raid_setting_update', {
                            tables: ['raidSettings', 'raidSettings', 'raidSettings', 'raidSettings', 'raidSettings', 'raidSettings'],
                            keys: ['raidToggle', 'newRaidIncMessage', 'raidIncMessage', 'raidReward', 'raidOutMessage', 'raidOutSpam'],
                            values: [raidToggle, raidNewMsg.val(), raidMsg.val(), raidReward.val(), raidOutMsg.val(), raidMsgSpam.val()]
                        }, function() {
                            socket.sendCommand('raid_setting_update_cmd', 'reloadraid', function() {
                                // Alert the user.
                                toastr.success('Raid-Einstellungen erfolgreich aktualisiert!');
                                // Close the modal.
                                $('#raid-alert').modal('toggle');
                            });
                        });
                }
            }).modal('toggle');
        });
    });

    // Welcome esettings.
    $('#welcomeSystemSettings').on('click', function() {
        const updateDisabled = function(disabledUsers, welcomeDisabled, callback) {
            let addTables = [],
                addKeys = [],
                addVals = [],
                delTables = [],
                delKeys = [];

            let previouslyDisabled = {};
            for (let row of disabledUsers) {
                previouslyDisabled[row.key] = true;
            }
            let newDisabledUsers = welcomeDisabled.map(function (name) {
                return name.replace(/[^a-zA-Z0-9_\n]/g, '').toLowerCase();
            });
            for (let newDisabledUser of newDisabledUsers) {
                if (!newDisabledUser) {
                    continue;
                }
                if (previouslyDisabled.hasOwnProperty(newDisabledUser)) {
                    delete previouslyDisabled[newDisabledUser];
                } else {
                    addTables.push('welcome_disabled_users');
                    addKeys.push(newDisabledUser);
                    addVals.push('true');
                }
            }
            for (let disabledUser in previouslyDisabled) {
                if (previouslyDisabled.hasOwnProperty(disabledUser)) {
                    delTables.push('welcome_disabled_users');
                    delKeys.push(disabledUser);
                }
            }

            const add = function (cb) {
                if (addKeys.length) {
                    socket.updateDBValues('alerts_add_welcome_disabled', {
                        tables: addTables,
                        keys: addKeys,
                        values: addVals
                    }, cb);
                } else {
                    cb();
                }
            };

            const remove = function (cb) {
                if (delKeys.length) {
                    socket.removeDBValues('alerts_del_welcome_disabled', {
                        tables: delTables,
                        keys: delKeys
                    }, cb);
                } else {
                    cb();
                }
            };

            add(function () { remove(callback); });
        };

        socket.getDBValues('alerts_get_welcome_settings', {
            tables: ['welcome', 'welcome', 'welcome', 'welcome'],
            keys: ['welcomeEnabled', 'welcomeMessage', 'welcomeMessageFirst', 'cooldown']
        }, true, function(e) {
            socket.getDBTableValues('alerts_get_welcome_disabled_users', 'welcome_disabled_users', function (disabledUsers) {
                let disabledUserOptions = [];
                for (let row of disabledUsers) {
                    disabledUserOptions.push({
                        'name': row.key,
                        'selected': 'true'
                    });
                }
                const modal = helpers.getModal('welcome-alert', 'Willkommen Alarm-Einstellungen', 'Speichern', $('<form/>', {
                    'role': 'form'
                })
                // Add the toggle for welcome alerts.
                .append(helpers.getDropdownGroup('welcome-toggle', 'Willkommen Nachrichten aktivieren', (e.welcomeEnabled === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'If users should be welcomed by the bot when the start chatting.'))
                // Add the input for welcome message.
                .append(helpers.getInputGroup('welcome-message', 'text', 'Willkommen Nachricht', '', e.welcomeMessage, 'Willkommensnachricht für neue Chatter. Lasse dieses Feld leer, um zurückkehrende Chatter nicht zu begrüßen. Tags: (names), (1 Text für einen Namen), (2 für zwei), (3 für drei oder mehr Namen)'))
                // Add the input for first time welcome message.
                .append(helpers.getInputGroup('welcome-message-first', 'text', 'Erstes Chatten Willkommensnachricht', '', e.welcomeMessageFirst, 'Willkommensnachricht für erstmalige Chatter. Lasse das Feld leer, um die Standard-Begrüßungsnachricht zu verwenden. Tags: (names), (1 Text für einen Namen), (2 für zwei), (3 für drei oder mehr Namen)'))
                // Add the input for the welcome cooldown.
                .append(helpers.getInputGroup('welcome-cooldown', 'number', 'Willkommen Abklingzeit (Stunden)', '', (parseInt(e.cooldown) / 36e5),
                    'Wie viele Stunden muss ein Benutzer nicht chatten, um wieder begrüßt zu werden. Mindestens 1 Stunde.'))
                // Add the input for excluded users.
                .append(helpers.getFlatMultiDropdownGroup('welcome-disabled', 'Ausgeschlossene Benutzer', disabledUserOptions,
                    'Benutzer, die der Bot nicht willkommen heißt. Kanalbesitzer und dieser Bot sind immer ausgeschlossen.')),
                function() { // Callback once the user clicks save.
                    let welcomeToggle = $('#welcome-toggle').find(':selected').text() === 'Ja',
                        welcomeMessage = $('#welcome-message').val(),
                        welcomeMessageFirst = $('#welcome-message-first').val(),
                        $welcomeCooldown = $('#welcome-cooldown'),
                        welcomeDisabled = $('#welcome-disabled').val();

                    // Make sure the user has someone in each box.
                    switch (false) {
                        case helpers.handleInputNumber($welcomeCooldown, 1):
                            break;
                        default:
                            socket.updateDBValues('alerts_update_welcome_settings', {
                                tables: ['welcome', 'welcome', 'welcome', 'welcome'],
                                keys: ['welcomeEnabled', 'welcomeMessage', 'welcomeMessageFirst', 'cooldown'],
                                values: [welcomeToggle, welcomeMessage, welcomeMessageFirst, (parseInt($welcomeCooldown.val()) * 36e5)]
                            }, function() {
                                updateDisabled(disabledUsers, welcomeDisabled, function () {
                                    socket.sendCommand('alerts_update_welcome_settings_cmd', 'welcomepanelupdate', function() {
                                        // Close the modal.
                                        $('#welcome-alert').modal('toggle');
                                        // Alert the user.
                                        toastr.success('Willkommensalarm Einstellungen erfolgreich aktualisiert!');
                                    });
                                });
                            });
                    }
                }).modal('toggle');
                modal.find('#welcome-disabled').select2({
                    tags: true,
                    tokenSeparators: [',', ' '],
                    selectOnClose: true,
                    createTag: function (params) {
                        const term = params.term.replace(/[^a-zA-Z0-9_\n]/g, '').toLowerCase();
                        // Don't offset to create a tag if there is no @ symbol
                        if (!term) {
                            // Return null to disable tag creation
                            return null;
                        }

                        return {
                            id: term,
                            text: term
                        };
                    }
                });
            });
        });
    });

    // StreamLabs settings.
    $('#donationHandlerSettings').on('click', function() {
        socket.getDBValues('alerts_get_streamlabs_settings', {
            tables: ['donations', 'donations', 'donations'],
            keys: ['announce', 'reward', 'message']
        }, true, function(e) {
            helpers.getModal('streamlabs-alert', 'StreamLabs Alarmeinstellungen', 'Speichern', $('<form/>', {
                'role': 'form'
            })
            /// Add the toggle for streamlabs alerts.
            .append(helpers.getDropdownGroup('streamlabs-toggle', 'StreamLabs-Alarme aktivieren', (e.announce === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                'Wenn StreamLabs Spenden in den Chat senden soll.'))
            // Add the the text area for the tip message.
            .append(helpers.getTextAreaGroup('streamlabs-message', 'text', 'Spenden Nachricht', '', e.message,
                'Die Nachricht wird in den Kanal gesendet, wenn jemand über StreamLabs spendet. Tags: (name), (amount), (amount.toFixed(0)), (points), (pointname), (currency) und (message)'))
            // Add the the box for the tip reward
            .append(helpers.getInputGroup('streamlabs-reward', 'number', 'Spenden Belohnungs-Multiplikator', '', e.reward, 'Belohnungsmultiplikator für die Belohnung.')),
            function() { // Callback once the user clicks save.
                let tipToggle = $('#streamlabs-toggle').find(':selected').text() === 'Ja',
                    tipMessage = $('#streamlabs-message'),
                    tipReward = $('#streamlabs-reward');

                // Make sure the user has someone in each box.
                switch (false) {
                    case helpers.handleInputString(tipMessage):
                    case helpers.handleInputNumber(tipReward, 0):
                        break;
                    default:
                        socket.updateDBValues('alerts_update_streamlabs_settings', {
                            tables: ['donations', 'donations', 'donations'],
                            keys: ['announce', 'reward', 'message'],
                            values: [tipToggle, tipReward.val(), tipMessage.val()]
                        }, function() {
                            socket.sendCommand('alerts_update_streamlabs_settings_cmd', 'donationpanelupdate', function() {
                                // Close the modal.
                                $('#streamlabs-alert').modal('toggle');
                                // Alert the user.
                                toastr.success('StreamLabs Benachrichtigungseinstellungen wurden erfolgreich aktualisiert!');
                            });
                        });
                }
            }).modal('toggle');
        });
    });

    // TipeeeStream settings.
    $('#tipeeeStreamHandlerSettings').on('click', function() {
        socket.getDBValues('alerts_get_tipeeestream_settings', {
            tables: ['tipeeeStreamHandler', 'tipeeeStreamHandler', 'tipeeeStreamHandler'],
            keys: ['toggle', 'reward', 'message']
        }, true, function(e) {
            helpers.getModal('tipeeestream-alert', 'TipeeeStream Alarm-Einstellungen', 'Speichern', $('<form/>', {
                'role': 'form'
            })
            /// Add the toggle for streamlabs alerts.
            .append(helpers.getDropdownGroup('tipeeestream-toggle', 'TipeeeStream-Alarme aktivieren', (e.toggle === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                'Wenn TipeeeStream Spenden in den Chat gesendet werden sollen.'))
            // Add the the text area for the tip message.
            .append(helpers.getTextAreaGroup('tipeeestream-message', 'text', 'Spenden Nachricht', '', e.message,
                'Die Nachricht wird in den Kanal gesendet, wenn jemand über TipeeStream spendet. Tags: (name), (amount), (reward), (formattedamount) und (message)'))
            // Add the the box for the tip reward
            .append(helpers.getInputGroup('tipeeestream-reward', 'number', 'Spenden Belohnungs-Multiplikator', '', e.reward, 'Belohnungsmultiplikator für die Belohnung.')),
            function() { // Callback once the user clicks save.
                let tipToggle = $('#tipeeestream-toggle').find(':selected').text() === 'Ja',
                    tipMessage = $('#tipeeestream-message'),
                    tipReward = $('#tipeeestream-reward');

                // Make sure the user has someone in each box.
                switch (false) {
                    case helpers.handleInputString(tipMessage):
                    case helpers.handleInputNumber(tipReward, 0):
                        break;
                    default:
                        socket.updateDBValues('alerts_update_tipeeestream_settings', {
                            tables: ['tipeeeStreamHandler', 'tipeeeStreamHandler', 'tipeeeStreamHandler'],
                            keys: ['toggle', 'reward', 'message'],
                            values: [tipToggle, tipReward.val(), tipMessage.val()]
                        }, function() {
                            socket.sendCommand('alerts_update_tipeeestream_settings_cmd', 'tipeeestreamreload', function() {
                                // Close the modal.
                                $('#tipeeestream-alert').modal('toggle');
                                // Alert the user.
                                toastr.success('TipeeeStream-Benachrichtigungseinstellungen wurden erfolgreich aktualisiert!');
                            });
                        });
                }
            }).modal('toggle');
        });
    });

    // StreamElements settings.
    $('#streamElementsHandlerSettings').on('click', function() {
        socket.getDBValues('alerts_get_streamelements_settings', {
            tables: ['streamElementsHandler', 'streamElementsHandler', 'streamElementsHandler'],
            keys: ['toggle', 'reward', 'message']
        }, true, function(e) {
            helpers.getModal('streamelements-alert', 'StreamElements Benachrichtigungseinstellungen', 'Speichern', $('<form/>', {
                'role': 'form'
            })
            /// Add the toggle for streamelements alerts.
            .append(helpers.getDropdownGroup('streamelements-toggle', 'StreamElements-Alarme aktivieren', (e.toggle === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                'Wenn StreamElements Spenden in den Chat gesendet werden sollen.'))
            // Add the the text area for the tip message.
            .append(helpers.getTextAreaGroup('streamelements-message', 'text', 'Spenden Nachricht', '', e.message,
                'Die Nachricht wird in den Kanal gesendet, wenn jemand über StreamElements spendet. Tags: (name), (amount), (reward), (currency) und (message)'))
            // Add the the box for the tip reward
            .append(helpers.getInputGroup('streamelements-reward', 'number', 'Spenden Belohnungs-Multiplier', '', e.reward, 'Belohnungsmultiplikator für die Belohnung.')),
            function() { // Callback once the user clicks save.
                let tipToggle = $('#streamelements-toggle').find(':selected').text() === 'Ja',
                    tipMessage = $('#streamelements-message'),
                    tipReward = $('#streamelements-reward');

                // Make sure the user has someone in each box.
                switch (false) {
                    case helpers.handleInputString(tipMessage):
                    case helpers.handleInputNumber(tipReward, 0):
                        break;
                    default:
                        socket.updateDBValues('alerts_update_streamelements_settings', {
                            tables: ['streamElementsHandler', 'streamElementsHandler', 'streamElementsHandler'],
                            keys: ['toggle', 'reward', 'message'],
                            values: [tipToggle, tipReward.val(), tipMessage.val()]
                        }, function() {
                            socket.sendCommand('alerts_update_streamelements_settings_cmd', 'streamelementsreload', function() {
                                // Close the modal.
                                $('#streamelements-alert').modal('toggle');
                                // Alert the user.
                                toastr.success('StreamElements-Benachrichtigungseinstellungen wurden erfolgreich aktualisiert!');
                            });
                        });
                }
            }).modal('toggle');
        });
    });

    // Twitter settings.
    $('#twitterHandlerSettings').on('click', function() {
        socket.getDBValues('alerts_get_twitter_settings', {
            tables: ['twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter',
                    'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter'],
            keys: ['message_online', 'message_gamechange', 'message_update', 'polldelay_mentions', 'polldelay_retweets', 'polldelay_hometimeline', 'polldelay_usertimeline', 'postdelay_update',
                    'reward_points', 'reward_cooldown', 'poll_mentions', 'poll_retweets', 'poll_hometimeline', 'poll_usertimeline', 'post_online', 'post_gamechange', 'post_update', 'reward_toggle', 'reward_announce']
        }, true, function(e) {
            helpers.getModal('twitter-alert', 'Twitter-Alarmeinstellungen', 'Speichern', $('<form/>', {
                'role': 'form'
            })
            // Add the div for the col boxes.
            .append($('<div/>', {
                'class': 'panel-group',
                'id': 'accordion'
            })
            // Append first collapsible accordion.
            .append(helpers.getCollapsibleAccordion('main-1', 'Twitter-Konfiguration', $('<form/>', {
                    'role': 'form'
                })
                // Add the toggle for mentions
                .append(helpers.getDropdownGroup('poll-mentions', 'Suche Erwähnungen', (e.poll_mentions === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'Wenn PhantomBot nach Erwähnungen auf Ihrer Timeline suchen und diese im Chat posten sollte.'))
                // Add the toggle for retweets
                .append(helpers.getDropdownGroup('poll-retweets', 'Suche Retweets', (e.poll_retweets === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'Wenn PhantomBot nach Ihren Retweets suchen und diese im Chat posten soll.'))
                // Add the toggle for home timeline
                .append(helpers.getDropdownGroup('poll-home', 'Suche auf der Startseiten Timeline', (e.poll_hometimeline === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'Wenn PhantomBot nach allem auf deiner Timeline suchen und es im Chat posten soll.'))
                // Add the toggle for user timeline
                .append(helpers.getDropdownGroup('poll-user', 'Suche auf der Benutzer-Timeline', (e.poll_usertimeline === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'Wenn PhantomBot nach allem auf deiner von dir geposteten Timeline suchen und es im Chat posten sollte.'))
                // Query interval for mentions
                .append(helpers.getInputGroup('query-mentions', 'number', 'Such Interval für Erwähnung (Sekunden)', '', e.polldelay_mentions, 'Wie oft der Bot nach Erwähnungen suchen soll. Das Minimum beträgt 60 Sekunden.'))
                // Query interval for retweets
                .append(helpers.getInputGroup('query-retweets', 'number', 'Such Interval für Retweets (Sekunden)', '', e.polldelay_retweets, 'Wie oft der Bot nach Retweets suchen soll. Das Minimum beträgt 60 Sekunden.'))
                // Query interval for mentions
                .append(helpers.getInputGroup('query-home', 'number', 'Such Interval für Home TimeLine (Sekunden)', '', e.polldelay_hometimeline, 'Wie oft der Bot nach der Home Timeline suchen soll. Das Minimum beträgt 60 Sekunden.'))
                // Query interval for mentions
                .append(helpers.getInputGroup('query-user', 'number', 'Such Interval für User TimeLine (Sekunden)', '', e.polldelay_usertimeline, 'Wie oft der Bot nach der User-Timeline suchen soll. Das Minimum beträgt 15 Sekunden.'))))
            // Append second collapsible accordion.
            .append(helpers.getCollapsibleAccordion('main-2', 'Twitter Retweet Konfiguration', $('<form/>', {
                    'role': 'form'
                })
                // Add the toggle for mentions
                .append(helpers.getDropdownGroup('retweet-toggle', 'Retweet-Belohnungen aktivieren', (e.reward_toggle === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'], 'Wenn PhantomBot Benutzer belohnen soll, die Tweets retweeten.'))
                // Add the toggle for retweets
                .append(helpers.getDropdownGroup('retweet-toggle-msg', 'Retweet Belohnungensnachricht aktivieren', (e.reward_announce === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'],
                    'Wenn PhantomBot ankündigen soll, dass es einen Benutzer für das Reetweeten Ihrer Tweets belohnt hat.'))
                // Query interval for mentions
                .append(helpers.getInputGroup('retweet-reward', 'number', 'Retweet Belohnung', '', e.reward_points, 'Belohnung für den Benutzer der Ihre Tweets retweetete.'))
                // Query interval for mentions
                .append(helpers.getInputGroup('retweet-cooldown', 'number', 'Retweet Abklingzeit (Stunden)', '', e.reward_cooldown, 'Abklingzeit, wie oft der Bot einen Benutzer für Retweets belohnen kann.'))))
            // Append third collapsible accordion.
            .append(helpers.getCollapsibleAccordion('main-3', 'Alarmeinstellungen', $('<form/>', {
                    'role': 'form'
                })
                // Add the toggle for the online Tweet.
                .append(helpers.getDropdownGroup('online-toggle', 'Online-Tweet aktivieren', (e.post_online === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'], 'Lasse den Bot twittern, wenn der Steamer live gehst.'))
                // Add the toggle for the game Tweet.
                .append(helpers.getDropdownGroup('game-toggle', 'Spielwechsel-Tweet aktivieren', (e.post_gamechange === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'], 'Lasse den Bot twittern, wenn das Spiel gewechselt wird.'))
                // Add the toggle for the timed Tweet.
                .append(helpers.getDropdownGroup('timed-toggle', 'Zeitgesteuerten Online-Tweet aktivieren', (e.post_update === 'true' ? 'Ja' : 'Nein'), ['Ja', 'Nein'], 'Lasse den Bot alle X Stunden twittern und sagen, dass der Steamer noch live ist.'))
                // Add the the text area for online message
                .append(helpers.getTextAreaGroup('online-msg', 'text', 'Online-Tweet', '', e.message_online, 'Nachricht, die getwittert wird, wenn Sie live gehen. Tags: (title), (game) und (twitchurl)', false))
                // Add the the text area for online message
                .append(helpers.getTextAreaGroup('game-msg', 'text', 'Spielwechsel-Tweet', '', e.message_gamechange, 'Nachricht, die beim Spielwechsel getwittert wird. Tags: (title), (game) und (twitchurl)', false))
                // Add the the text area for online message
                .append(helpers.getTextAreaGroup('timed-msg', 'text', 'Zeitgesteuerter Online-Tweet', '', e.message_update, 'Nachricht, die von Zeit zu Zeit getwittert wird. Tags: (title), (game), (uptime) und (twitchurl)', false))
                // timed message minutes.
                .append(helpers.getInputGroup('timed-msg-time', 'number', 'Zeitgesteuertes Nachrichtenintervall (Minuten)', '', e.postdelay_update, 'Wie oft in Minuten soll die zeitgesteuerte Online-Nachricht gesendet werden? Das Minimum beträgt 180 Minuten.'))))),
            function() { // Callback once the user clicks save.
                let onlineToggle = $('#online-toggle').find(':selected').text() === 'Ja',
                    gameToggle = $('#game-toggle').find(':selected').text() === 'Ja',
                    timedToggle = $('#timed-toggle').find(':selected').text() === 'Ja',
                    onlineMsg = $('#online-msg'),
                    gameMsg = $('#game-msg'),
                    timedMsg = $('#timed-msg'),
                    timedTime = $('#timed-msg-time'),
                    mentionToggle = $('#poll-mentions').find(':selected').text() === 'Ja',
                    rtToggle = $('#poll-retweets').find(':selected').text() === 'Ja',
                    homeToggle = $('#poll-home').find(':selected').text() === 'Ja',
                    userToggle = $('#poll-user').find(':selected').text() === 'Ja',
                    mentionTime = $('#query-mentions'),
                    rtTime = $('#query-retweets'),
                    homeTime = $('#query-home'),
                    userTime = $('#query-user'),
                    rtRewardToggle = $('#retweet-toggle').find(':selected').text() === 'Ja',
                    rtRewardToggleMsg = $('#retweet-toggle-msg').find(':selected').text() === 'Ja',
                    rtReward = $('#retweet-reward'),
                    rtCooldown = $('#retweet-cooldown');

                // Make sure the user filled in everything.
                switch (false) {
                    case helpers.handleInputString(onlineMsg):
                    case helpers.handleInputString(gameMsg):
                    case helpers.handleInputString(timedMsg):
                    case helpers.handleInputNumber(timedTime, 180):
                    case helpers.handleInputNumber(mentionTime, 60):
                    case helpers.handleInputNumber(rtTime, 60):
                    case helpers.handleInputNumber(homeTime, 60):
                    case helpers.handleInputNumber(userTime, 15):
                    case helpers.handleInputNumber(rtReward, 0):
                    case helpers.handleInputNumber(rtCooldown, 0):
                        break;
                    default:
                        socket.updateDBValues('alerts_get_twitter_settings', {
                            tables: ['twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter',
                                    'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter', 'twitter'],
                            keys: ['message_online', 'message_gamechange', 'message_update', 'polldelay_mentions', 'polldelay_retweets', 'polldelay_hometimeline', 'polldelay_usertimeline', 'postdelay_update',
                                    'reward_points', 'reward_cooldown', 'poll_mentions', 'poll_retweets', 'poll_hometimeline', 'poll_usertimeline', 'post_online', 'post_gamechange', 'post_update', 'reward_toggle', 'reward_announce'],
                            values: [onlineMsg.val(), gameMsg.val(), timedMsg.val(), mentionTime.val(), rtTime.val(), homeTime.val(), userTime.val(), timedTime.val(), rtReward.val(), rtCooldown.val(), mentionToggle,
                                    rtToggle, homeToggle, userToggle, onlineToggle, gameToggle, timedToggle, rtRewardToggle, rtRewardToggleMsg]
                        }, function() {
                            // Close the modal.
                            $('#twitter-alert').modal('toggle');
                            // Alert the user.
                            toastr.success('Twitter-Alarmeinstellungen wurden erfolgreich aktualisiert!');
                        });
                }
            }).modal('toggle');
        });
    });
});
