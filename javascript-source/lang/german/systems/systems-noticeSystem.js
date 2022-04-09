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

$.lang.register('noticesystem.notice-usage', 'Verwendung: !notice [status / add / get / list / remove / edit / toggleid / insert / interval / req / toggle / toggleoffline / toggleshuffle / selectgroup / addgroup / removegroup / renamegroup]');
$.lang.register('noticesystem.notice-config', 'Hinweis Einstellungen - [Ausgewählte Gruppe: $1 / Anzahl der Gruppen: $2 / Hinweis umschalten: $3 / Interval Min: $4 / Interval Max: $5 / Nachrichtenauslöser: $6 / Nachrichten in der Gruppe: $7 / Hinweis auch im Offline-Chat anzeigen: $8 / Nachrichten mischen: $9]');
$.lang.register('noticesystem.notice-no-notices', 'Es gibt keine Hinweise in Gruppe $1 - Erstellen  einen mit: !notice add');
$.lang.register('noticesystem.notice-get-usage', 'Verwendung: !notice get [Hinweis ID] - Hinweis IDs in der Gruppe $1 gehen von 0 bis $2');
$.lang.register('noticesystem.notice-list', 'Hinweise in der Gruppe $1: $2');
$.lang.register('noticesystem.notice-remove-usage', 'Verwendung: !notice remove [Hinweis ID] - Hinweis IDs in der Gruppe $1 gehen von 0 bis $2');
$.lang.register('noticesystem.notice-edit-usage', 'Verwendung: !notice edit (Hinweis ID) (Nachricht) - Hinweis IDs in der Gruppe $1 gehen von 0 bis $1');
$.lang.register('noticesystem.notice-edit-success', 'Hinweis in Gruppe $1 bearbeitet!');
$.lang.register('noticesystem.notice-toggleid-usage', 'Verwendung: !notice toggleid (Hinweis ID) - Schaltet die Benachrichtigung bei der angegebenen ID ein/aus');
$.lang.register('noticesystem.notice-toggleid-success', 'Hinweis $1 ist jetzt $2');
$.lang.register('noticesystem.notice-remove-success', 'Hinweis aus Gruppe $1 entfernt!');
$.lang.register('noticesystem.notice-add-usage', 'Verwendung: !notice add [Nachricht oder Befehl]');
$.lang.register('noticesystem.notice-add-success', 'Hinweis zu Gruppe $1 an Position $2 hinzugefügt!');
$.lang.register('noticesystem.notice-insert-usage', 'Verwendung: !notice notice insert [ID] [Nachricht oder Befehl]');
$.lang.register('noticesystem.notice-insert-nan', 'Hinweis ID muss eine Zahl sein');
$.lang.register('noticesystem.notice-insert-success', 'Hinweis in Gruppe $2 an Position $1 eingefügt!');
$.lang.register('noticesystem.notice-interval-usage', 'Verwendung: !notice interval [min Minuten] [max Minuten] | [feste Minuten]');
$.lang.register('noticesystem.notice-interval-nan', 'Hinweisintervalle müssen Zahlen sein.');
$.lang.register('noticesystem.notice-interval-too-small', 'Hinweisintervalle müssen mehr als 0,25 Minuten betragen.');
$.lang.register('noticesystem.notice-interval-wrong-order', 'Minimales Intervall war kleiner oder gleich maximales Intervall.');
$.lang.register('noticesystem.notice-inteval-success', 'Hinweisintervall für Gruppe $1 eingestellt!');
$.lang.register('noticesystem.notice-req-success', 'Erforderliche Nachricht(en) zwischen Hinweisen von Gruppe $1 eingestellt!');
$.lang.register('noticesystem.notice-req-usage', 'Verwendung: !notice req [erforderliche Nachrichten]');
$.lang.register('noticesystem.notice-req-404', 'Beachte, dass die erforderlichen Nachrichten eie Zahl und mindestens 0 sein müssen.');
$.lang.register('noticesystem.notice-enabled', 'Hinweis Gruppe $1 wurde aktiviert!');
$.lang.register('noticesystem.notice-disabled', 'Hinweis Gruppe $1 wurde deaktiviert.');
$.lang.register('noticesystem.notice-enabled.offline', 'Hinweise der Gruppe $1 werden jetzt gesendet, während der Stream offline ist.');
$.lang.register('noticesystem.notice-disabled.offline', 'Hinweise der Gruppe $1 werden jetzt nicht mehr gesendet, während der Stream offline ist.');
$.lang.register('noticesystem.notice-enabled.shuffle', 'Hinweise der Gruppe $1 werden nun in zufälliger Reihenfolge gesendet.');
$.lang.register('noticesystem.notice-disabled.shuffle', 'Hinweise der Gruppe $1 werden jetzt in der Reihenfolge ihrer IDs gesendet.');
$.lang.register('noticesystem.notice-no-groups', 'Es gibt keine Hinweis-Gruppen - Erstellen Sie eine mit: !notice addgroup');
$.lang.register('noticesystem.notice-selectgroup-usage', 'Verwendung: !notice selectgroup [Gruppen ID] - Gruppen IDs gehen von 0 bis $1.');
$.lang.register('noticesystem.notice-selectgroup-404', 'Gruppen IDs gehen von 0 bis $1.');
$.lang.register('noticesystem.notice-selectgroup-success', 'Ausgewählte Gruppe geändert zu $1.');
$.lang.register('noticesystem.notice-addgroup-usage', 'Verwendung: !notice addgroup [Name]');
$.lang.register('noticesystem.notice-addgroup-success', 'Neue Gruppe $1 hinzugefügt und ausgewählt.');
$.lang.register('noticesystem.notice-removegroup-usage', 'Verwendung: !notice removegroup [Gruppen ID] - Gruppen IDs gehen von 0 bis $1.');
$.lang.register('noticesystem.notice-removegroup-404', 'Gruppen IDs gehen von 0 bis $1.');
$.lang.register('noticesystem.notice-removegroup-success', 'Gruppe $1 wurde gelöscht. Aktuell ausgewählte Gruppe: $2.');
$.lang.register('noticesystem.notice-removegroup-success-none-left', 'Gruppe $1 wurde gelöscht. Keine Gruppen übrig. Erstelle eine mit: !notice addgroup');
$.lang.register('noticesystem.notice-renamegroup-usage', 'Verwendung: !notice renamegroup [Gruppen ID] [Name] - Gruppen IDs gehen von 0 bis $1.');
$.lang.register('noticesystem.notice-renamegroup-404', 'Gruppen IDs gehen von 0 bis $1.');
$.lang.register('noticesystem.notice-renamegroup-success', 'Gruppe $1 wurde zu $2 umbenannt.');
