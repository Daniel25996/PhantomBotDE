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
package tv.phantombot.console;

import com.gmt2001.HttpRequest;
import com.gmt2001.HttpResponse;
import com.gmt2001.TwitchAPIv5;
import com.scaniatv.BotImporter;
import com.scaniatv.GenerateLogs;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.TimeZone;
import net.engio.mbassy.listener.Handler;
import org.json.JSONException;
import org.json.JSONObject;
import tv.phantombot.CaselessProperties.Transaction;
import tv.phantombot.PhantomBot;
import tv.phantombot.discord.DiscordAPI;
import tv.phantombot.event.EventBus;
import tv.phantombot.event.Listener;
import tv.phantombot.event.console.ConsoleInputEvent;
import tv.phantombot.event.irc.channel.IrcChannelJoinEvent;
import tv.phantombot.event.pubsub.channelpoints.PubSubChannelPointsEvent;
import tv.phantombot.event.twitch.bits.TwitchBitsEvent;
import tv.phantombot.event.twitch.clip.TwitchClipEvent;
import tv.phantombot.event.twitch.follower.TwitchFollowEvent;
import tv.phantombot.event.twitch.host.TwitchHostedEvent;
import tv.phantombot.event.twitch.offline.TwitchOfflineEvent;
import tv.phantombot.event.twitch.online.TwitchOnlineEvent;
import tv.phantombot.event.twitch.raid.TwitchRaidEvent;
import tv.phantombot.event.twitch.subscriber.TwitchAnonymousSubscriptionGiftEvent;
import tv.phantombot.event.twitch.subscriber.TwitchMassAnonymousSubscriptionGiftedEvent;
import tv.phantombot.event.twitch.subscriber.TwitchPrimeSubscriberEvent;
import tv.phantombot.event.twitch.subscriber.TwitchReSubscriberEvent;
import tv.phantombot.event.twitch.subscriber.TwitchSubscriberEvent;
import tv.phantombot.event.twitch.subscriber.TwitchSubscriptionGiftEvent;
import tv.phantombot.event.twitter.TwitterRetweetEvent;
import tv.phantombot.script.Script;

public class ConsoleEventHandler implements Listener {

    private static final ConsoleEventHandler instance = new ConsoleEventHandler();
    private Transaction transaction = null;

    /**
     * Method that returns this instance.
     *
     * @return
     */
    public static ConsoleEventHandler instance() {
        return instance;
    }

    /**
     * Class constructor.
     */
    private ConsoleEventHandler() {

    }

    /**
     * Method that is triggered when the console event fires.
     *
     * @param event
     */
    @Handler
    public void onConsoleInput(ConsoleInputEvent event) throws JSONException {
        // The message said in the console.
        String message = event.getMessage();
        // If settings were changed.
        boolean changed = false;
        // Arguments of the message string.
        String arguments = "";
        // Split arguments of the message string.
        String[] argument = null;

        // If the message is null, or empty ignore everything below.
        if (message == null || message.isEmpty()) {
            return;
        }

        if (transaction == null || transaction.isCommitted()) {
            if (PhantomBot.instance() != null) {
                transaction = PhantomBot.instance().getProperties().startTransaction(Transaction.PRIORITY_MAX);
            }
        }

        message = message.replaceAll("!", "").trim();

        // Check for arguments in the message string.
        if (message.contains(" ")) {
            String messageString = message;
            message = messageString.substring(0, messageString.indexOf(" "));
            arguments = messageString.substring(messageString.indexOf(" ") + 1);
            argument = arguments.split(" ");
        }

        /**
         * @consolecommand raidtest (raiderName) (numViewers) - Tests the raid event.
         */
        if (message.equalsIgnoreCase("raidtest")) {
            String raidName = PhantomBot.generateRandomString(8);
            String raidNum = "10";
            if (argument != null && argument.length > 0 && !argument[0].isBlank()) {
                raidName = argument[0];
            }

            if (argument != null && argument.length > 1 && !argument[1].isBlank()) {
                raidNum = argument[1];
            }
            com.gmt2001.Console.out.println("Teste Raid Event (Benutzername = " + raidName + ", Zuschauer = " + raidNum + ")");
            EventBus.instance().postAsync(new TwitchRaidEvent(raidName, raidNum));
            return;
        }

        /**
         * @consolecommand checkytquota - This command checks the quota points used by YouTube.
         */
        if (message.equalsIgnoreCase("checkytquota")) {
            String ytQuotaDate = PhantomBot.instance().getDataStore().GetString("youtubePlayer", "", "quotaDate");
            String ytQuotaPoints = PhantomBot.instance().getDataStore().GetString("youtubePlayer", "", "quotaPoints");

            if (ytQuotaDate == null || ytQuotaPoints == null) {
                com.gmt2001.Console.out.println("Keine Daten zum YouTube-Kontingent gefunden.");
            } else {
                com.gmt2001.Console.out.println("Datum des YouTube-Kontingents (US/Pacific): " + ytQuotaDate + " Verwendete Punkte: " + ytQuotaPoints);
            }
            return;
        }

        /**
         * @consolecommand exportpoints - This command exports points and time to a CSV file.
         */
        if (message.equalsIgnoreCase("exportpoints")) {
            com.gmt2001.Console.out.println("[CONSOLE] Exportpunkte ausführen.");

            // Top headers of the CSV file.
            String[] headers = new String[]{"Username", "Seconds", "Points"};
            // All points keys.
            String[] keys = PhantomBot.instance().getDataStore().GetKeyList("points", "");
            // Array to store our values.
            List<String[]> values = new ArrayList<>();

            // Loop that gets all points and time.
            for (String key : keys) {
                String[] str = new String[3];
                str[0] = key;
                str[1] = (PhantomBot.instance().getDataStore().exists("time", key) ? PhantomBot.instance().getDataStore().get("time", key) : "0");
                str[2] = PhantomBot.instance().getDataStore().get("points", key);
                values.add(str);
            }

            // Export to CSV.
            PhantomBot.instance().toCSV(headers, values, "points_export.csv");
            com.gmt2001.Console.out.println("[CONSOLE] Punkte wurden nach points_export.csv exportiert.");
            return;
        }

        /**
         * @consolecommand createcmdlist - Creates a list of all commands with their permissions.
         */
        if (message.equalsIgnoreCase("createcmdlist")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe createcmdlist aus.");

            // Headers of the CSV file.
            String[] headers = new String[]{"Command", "Permission", "Module"};
            // All commands.
            String[] keys = PhantomBot.instance().getDataStore().GetKeyList("permcom", "");
            // Array to store commands.
            List<String[]> values = new ArrayList<>();

            for (String key : keys) {
                String[] str = new String[3];
                str[0] = ("!" + key);
                str[1] = PhantomBot.instance().getDataStore().get("groups", PhantomBot.instance().getDataStore().get("permcom", key));
                str[2] = Script.callMethod("getCommandScript", key.contains(" ") ? key.substring(0, key.indexOf(" ")) : key);
                // If the module is disabled, return.
                if (str[2].contains("Undefined")) {
                    continue;
                }
                values.add(str);
            }

            // Export to CSV
            PhantomBot.instance().toCSV(headers, values, "command_list.csv");
            com.gmt2001.Console.out.println("[CONSOLE] Die Befehlsliste wurde unter command_list.csv erstellt.");
            return;
        }

        /**
         * @consolecommand retweettest [Twitter ID] - Sends a fake test Retweet event.
         */
        if (message.equalsIgnoreCase("retweettest")) {
            if (argument == null || argument.length == 0 || argument[0].isBlank()) {
                com.gmt2001.Console.out.println(">> retweet Test erfordert eine Twitter-ID (oder Twitter-IDs)");
                return;
            }
            com.gmt2001.Console.out.println(">> Sende retweet Test Event");
            EventBus.instance().postAsync(new TwitterRetweetEvent(argument));
            return;
        }

        /**
         * @consolecommand botinfo - Prints the bot information in the console.
         */
        if (message.equalsIgnoreCase("botinfo")) {
            com.gmt2001.Console.out.println(PhantomBot.instance().getBotInformation());
            return;
        }

        /**
         * @consolecommand revloconvert [CSV file] - Command that imports points from RevloBot.
         */
        if (message.equalsIgnoreCase("revloconvert")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe revloconvert aus");
            if (argument == null) {
                com.gmt2001.Console.out.println("Du musst die Datei angeben, die du importieren möchtest.");
                return;
            }

            BotImporter.ImportRevlo(arguments);
            return;
        }

        /**
         * @consolecommand ankhconvert [CSV file] - Command that imports points from AnkhBot.
         */
        if (message.equalsIgnoreCase("ankhconvert")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe ankhconvert aus.");
            if (argument == null) {
                com.gmt2001.Console.out.println("Du musst die Datei angeben, die du importieren möchtest.");
                return;
            }

            BotImporter.ImportAnkh(arguments);
            return;
        }

        /**
         * @consolecommand backupdb - Creates a backup of the current database.
         */
        if (message.equalsIgnoreCase("backupdb")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe backupdb aus");
            SimpleDateFormat datefmt = new SimpleDateFormat("ddMMyyyy.hhmmss");
            datefmt.setTimeZone(TimeZone.getTimeZone(PhantomBot.getTimeZone()));
            String timestamp = datefmt.format(new Date());

            PhantomBot.instance().getDataStore().backupDB("phantombot.manual.backup." + timestamp + ".db");
            return;
        }

        /**
         * @consolecommand fixfollowedtable - Grabs the last 10,000 followers from the Twitch API.
         */
        if (message.equalsIgnoreCase("fixfollowedtable")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe fixfollowedtable aus");
            TwitchAPIv5.instance().FixFollowedTable(PhantomBot.instance().getChannelName(), PhantomBot.instance().getDataStore(), false);
            return;
        }

        /**
         * @consolecommand fixfollowedtable-force - Grabs all followers from the Twitch API.
         */
        if (message.equalsIgnoreCase("fixfollowedtable-force")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe fixfollowedtable-force aus");
            TwitchAPIv5.instance().FixFollowedTable(PhantomBot.instance().getChannelName(), PhantomBot.instance().getDataStore(), true);
            return;
        }

        /**
         * @consolecommand jointest (userName) - Sends 30 fake join events or one specific user for testing.
         */
        if (message.equalsIgnoreCase("jointest")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe jointest aus");

            if (argument != null && argument.length > 0 && !argument[0].isBlank()) {
                EventBus.instance().postAsync(new IrcChannelJoinEvent(PhantomBot.instance().getSession(), argument[0]));
            } else {
                for (int i = 0; i < 30; i++) {
                    EventBus.instance().postAsync(new IrcChannelJoinEvent(PhantomBot.instance().getSession(), PhantomBot.generateRandomString(8)));
                }
            }
        }

        /**
         * @consolecommand channelpointstest - Sends a fake Channel Points redemption for testing.
         */
        if (message.equalsIgnoreCase("channelpointstest")) {
            EventBus.instance().postAsync(new PubSubChannelPointsEvent(
                    "id1", "rewardid2", "12345",
                    "thebestuser", "TheBestUser", "Uber Reward",
                    50, "Who you gonna call?", "Ghostbusters!", "UNFULLFILLED"
            ));
            return;
        }

        /**
         * @consolecommand followertest [username] - Sends a fake follower event.
         */
        if (message.equalsIgnoreCase("followertest")) {
            String user = PhantomBot.generateRandomString(10);

            if (argument != null && argument.length > 0 && !argument[0].isBlank()) {
                user = argument[0];
            }

            com.gmt2001.Console.out.println("[CONSOLE] Führen followertest aus (Benutzer: " + user + ")");

            EventBus.instance().postAsync(new TwitchFollowEvent(user, (new Date()).toString()));
            return;
        }

        /**
         * @consolecommand followerstest [amount] - Sends a fake follower events.
         */
        if (message.equalsIgnoreCase("followerstest")) {
            String randomUser = PhantomBot.generateRandomString(10);
            int followCount = 5;

            if (argument != null && argument.length > 0 && !argument[0].isBlank()) {
                followCount = Integer.parseInt(argument[0]);
            }

            com.gmt2001.Console.out.println("[CONSOLE] Führe followerstest aus (Anzahl: " + followCount + ", Benutzer: " + randomUser + ")");

            for (int i = 0; i < followCount; i++) {
                EventBus.instance().postAsync(new TwitchFollowEvent(randomUser + "_" + i, (new Date()).toString()));
            }
            return;
        }

        /**
         * @consolecommand subscribertest (userName) (tier) (months) (message) - Sends a fake subscriber events.
         */
        if (message.equalsIgnoreCase("subscribertest")) {
            String randomUser = PhantomBot.generateRandomString(10);
            String tier = "1000";
            String months = ((int) (Math.random() * 100.0)) + "";
            String smessage = "No message";
            if (argument != null && argument.length > 0 && !argument[0].isBlank()) {
                randomUser = argument[0];
            }

            if (argument != null && argument.length > 1 && !argument[1].isBlank()) {
                tier = argument[1].equalsIgnoreCase("prime") ? argument[1] : argument[1] + "000";
            }

            if (argument != null && argument.length > 2 && !argument[2].isBlank()) {
                months = argument[2];
            }

            if (argument != null && argument.length > 3 && !argument[3].isBlank()) {
                smessage = arguments.substring(argument[0].length() + argument[1].length() + argument[2].length() + 3);
            }

            com.gmt2001.Console.out.println("[CONSOLE] Führe subscribertest aus (Benutzer: " + randomUser + ", Stufe: " + tier + ", Monate: " + months + ", Nachricht: " + smessage + ")");

            EventBus.instance().postAsync(new TwitchSubscriberEvent(randomUser, tier, months, smessage));
            return;
        }

        /**
         * @consolecommand primesubscribertest (userName) (months) - Sends a fake Prime subscriber events.
         */
        if (message.equalsIgnoreCase("primesubscribertest")) {
            String randomUser = PhantomBot.generateRandomString(10);
            String months = ((int) (Math.random() * 100.0)) + "";
            if (argument != null && argument.length > 0 && !argument[0].isBlank()) {
                randomUser = argument[0];
            }

            if (argument != null && argument.length > 1 && !argument[1].isBlank()) {
                months = argument[1];
            }

            com.gmt2001.Console.out.println("[CONSOLE] Führe primesubscribertest aus (Benutzer: " + randomUser + ", Monate: " + months + ")");

            EventBus.instance().postAsync(new TwitchPrimeSubscriberEvent(randomUser, months));
            return;
        }

        /**
         * @consolecommand resubscribertest (userName) (tier) (months) (message) - Sends a fake re-subscriber events.
         */
        if (message.equalsIgnoreCase("resubscribertest")) {
            String randomUser = PhantomBot.generateRandomString(10);
            String tier = "1000";
            String months = ((int) (Math.random() * 100.0)) + "";
            String smessage = "No message";
            if (argument != null && argument.length > 0 && !argument[0].isBlank()) {
                randomUser = argument[0];
            }

            if (argument != null && argument.length > 1 && !argument[1].isBlank()) {
                tier = argument[1].equalsIgnoreCase("prime") ? argument[1] : argument[1] + "000";
            }

            if (argument != null && argument.length > 2 && !argument[2].isBlank()) {
                months = argument[2];
            }

            if (argument != null && argument.length > 3 && !argument[3].isBlank()) {
                smessage = arguments.substring(argument[0].length() + argument[1].length() + argument[2].length() + 3);
            }

            com.gmt2001.Console.out.println("[CONSOLE] Führe resubscribertest aus (Benutzer: " + randomUser + ", Stufe: " + tier + ", Monate: " + months + ", Nachricht: " + smessage + ")");

            EventBus.instance().postAsync(new TwitchReSubscriberEvent(randomUser, months, tier, smessage));
            return;
        }

        /**
         * @consolecommand giftsubtest (userName) (tier) (months) - Sends a fake gift subscriber events.
         */
        if (message.equalsIgnoreCase("giftsubtest")) {
            String randomUser = PhantomBot.generateRandomString(10);
            String tier = "1000";
            String months = ((int) (Math.random() * 100.0)) + "";
            if (argument != null && argument.length > 0 && !argument[0].isBlank()) {
                randomUser = argument[0];
            }

            if (argument != null && argument.length > 1 && !argument[1].isBlank()) {
                tier = argument[1].equalsIgnoreCase("prime") ? argument[1] : argument[1] + "000";
            }

            if (argument != null && argument.length > 2 && !argument[2].isBlank()) {
                months = argument[2];
            }

            com.gmt2001.Console.out.println("[CONSOLE] Führe giftsubtest aus (Benutzer: " + randomUser + ", Stufe: " + tier + ", Monate: " + months + ")");

            EventBus.instance().postAsync(new TwitchSubscriptionGiftEvent(PhantomBot.instance().getChannelName(), randomUser, months, tier));
            return;
        }

        /**
         * @consolecommand massanongiftsubtest (amount) (tier) - Test a mass anonymous gift subscription.
         */
        if (message.equalsIgnoreCase("massanonsubgifttest")) {
            String amount = "10";
            String tier = "1000";
            if (argument != null && argument.length > 0 && !argument[0].isBlank()) {
                amount = argument[0];
            }

            if (argument != null && argument.length > 1 && !argument[1].isBlank()) {
                tier = argument[1].equalsIgnoreCase("prime") ? argument[1] : argument[1] + "000";
            }
            com.gmt2001.Console.out.println("Teste Mass Anonymous Gift Sub (Anzahl: " + amount + ", Stufe: " + tier + ")");
            EventBus.instance().postAsync(new TwitchMassAnonymousSubscriptionGiftedEvent(amount, tier));
            return;
        }

        /**
         * @consolecommand anonsubgifttest (userName) (tier) (months) - Test an anonymous gift subscription
         */
        if (message.equalsIgnoreCase("anonsubgifttest")) {
            String userName = PhantomBot.generateRandomString(8);
            String tier = "1000";
            String months = ((int) (Math.random() * 100.0)) + "";
            if (argument != null && argument.length > 0 && !argument[0].isBlank()) {
                userName = argument[0];
            }

            if (argument != null && argument.length > 1 && !argument[1].isBlank()) {
                tier = argument[1].equalsIgnoreCase("prime") ? argument[1] : argument[1] + "000";
            }

            if (argument != null && argument.length > 2 && !argument[2].isBlank()) {
                months = argument[2];
            }
            com.gmt2001.Console.out.println("Teste Anonymous Gift Sub (Benutzername = " + userName + ", Monate: " + months + ", Stufe: " + tier + ")");
            EventBus.instance().postAsync(new TwitchAnonymousSubscriptionGiftEvent(userName, months, tier));
            return;
        }

        /**
         * @consolecommand onlinetest - Sends a fake online event.
         */
        if (message.equalsIgnoreCase("onlinetest")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe onlinetest aus");

            EventBus.instance().postAsync(new TwitchOnlineEvent());
            return;
        }

        /**
         * @consolecommand offlinetest - Sends a fake offline event.
         */
        if (message.equalsIgnoreCase("offlinetest")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe offlinetest aus");

            EventBus.instance().postAsync(new TwitchOfflineEvent());
            return;
        }

        /**
         * @consolecommand cliptest - Sends a fake clip event.
         */
        if (message.equalsIgnoreCase("cliptest")) {
            String randomUser = PhantomBot.generateRandomString(10);
            if (argument != null && argument.length > 0 && !argument[0].isBlank()) {
                randomUser = argument[0];
            }

            com.gmt2001.Console.out.println("[CONSOLE] Führe cliptest aus" + randomUser);

            EventBus.instance().postAsync(new TwitchClipEvent("https://clips.twitch.tv/ThisIsNotARealClipAtAll", randomUser, "Some title",
                    new org.json.JSONObject("{\"medium\": \"https://clips-media-assets.twitch.tv/vod-107049351-offset-26-preview-480x272.jpg\", "
                            + "\"small\": \"https://clips-media-assets.twitch.tv/vod-107049351-offset-26-preview-260x147.jpg\", "
                            + "\"tiny\": \"https://clips-media-assets.twitch.tv/vod-107049351-offset-26-preview-86x45.jpg\"}")));
            return;
        }

        /**
         * @consolecommand hosttest (userName) (numViewers) - Sends a fake host event.
         */
        if (message.equalsIgnoreCase("hosttest")) {
            String randomUser = PhantomBot.generateRandomString(10);
            int users = 5;
            if (argument != null && argument.length > 0 && !argument[0].isBlank()) {
                randomUser = argument[0];
            }
            if (argument != null && argument.length > 1 && !argument[1].isBlank()) {
                users = Integer.parseInt(argument[1]);
            }

            com.gmt2001.Console.out.println("[CONSOLE] Führe hosttest aus" + randomUser);

            EventBus.instance().postAsync(new TwitchHostedEvent(randomUser, users));
            return;
        }

        /**
         * @consolecommand bitstest (user) (amount) (message) - Sends a fake bits event.
         */
        if (message.equalsIgnoreCase("bitstest")) {
            String randomUser = PhantomBot.generateRandomString(10);
            String amount = ((int) (Math.random() * 100.0)) + "";
            String smessage = "No message";
            if (argument != null && argument.length > 0 && !argument[0].isBlank()) {
                randomUser = argument[0];
            }

            if (argument != null && argument.length > 1 && !argument[1].isBlank()) {
                amount = argument[1];
            }

            if (argument != null && argument.length > 2 && !argument[2].isBlank()) {
                smessage = arguments.substring(argument[0].length() + argument[1].length() + 2);
            }

            com.gmt2001.Console.out.println("[CONSOLE] Führe bitstest aus (Benutzer: " + randomUser + ", Anzahl: " + amount + ", Nachricht: " + smessage + ")");

            EventBus.instance().postAsync(new TwitchBitsEvent(randomUser, amount, smessage));
            return;
        }

        /**
         * @consolecommand discordreconnect - Reconnects to Discord.
         */
        if (message.equalsIgnoreCase("discordreconnect")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe discordreconnect aus");

            DiscordAPI.instance().reconnect();
            return;
        }

        /**
         * @consolecommand reconnect - Reconnects to RMI, Host TMI, and PubSub.
         */
        if (message.equalsIgnoreCase("reconnect")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führung TMI, Host TMI und PubSub wieder verbinden aus");

            PhantomBot.instance().reconnect();
            return;
        }

        /**
         * @consolecommand debugon - Enables debug mode.
         */
        if (message.equalsIgnoreCase("debugon")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe debugon aus: Debug-Modus aktiviert");

            PhantomBot.setDebugging(true);
            return;
        }

        /**
         * @consolecommand debugoff - Disables debug mode.
         */
        if (message.equalsIgnoreCase("debugoff")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe debugoff aus: Debug-Modus deaktiviert");

            PhantomBot.setDebuggingLogOnly(false);
            return;
        }

        /**
         * @consolecommand dumplogs - Writes the latest logs to a file.
         */
        if (message.equalsIgnoreCase("dumplogs")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe dumplogs aus");

            GenerateLogs.writeLogs();
            return;
        }

        /**
         * @consolecommand dumplogs - Prints the latest logs to the console.
         */
        if (message.equalsIgnoreCase("printlogs")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe printlogs aus");

            GenerateLogs.printLogs();
            return;
        }

        /**
         * @consolecommand debuglog - Prints all debug lines to a file.
         */
        if (message.equalsIgnoreCase("debuglog")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe debuglog aus: Debug-Modus aktiviert - nur Protokollierung");

            PhantomBot.setDebuggingLogOnly(true);
            return;
        }

        /**
         * @consolecommand save - Forces the database to save.
         */
        if (message.equalsIgnoreCase("save")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe save aus");

            PhantomBot.instance().getDataStore().SaveAll(true);
            return;
        }

        /**
         * @consolecommand exit - Shuts down the bot.
         */
        if (message.equalsIgnoreCase("exit")) {
            com.gmt2001.Console.out.println("[CONSOLE] Führe exit aus");

            PhantomBot.exitOK();
            return;
        }

        /**
         * @consolecommand apioauth - Updates the API (Caster) oauth.
         */
        if (message.equalsIgnoreCase("apioauth")) {
            System.out.print("Bitte gib deinen oAuth-Token ein, den du auf https://phantombot.github.io/PhantomBot/oauth/ generiert hast, während du als Caster angemeldet bist: ");

            String apiOAuth = System.console().readLine().trim();

            transaction.setProperty("apioauth", apiOAuth);
            changed = true;
        }

        /**
         * @consolecommand oauth - Updates the Chat (Bot) oauth.
         */
        if (message.equalsIgnoreCase("oauth")) {
            System.out.print("Bitte gib deinen oAuth-Token ein, den du auf https://phantombot.github.io/PhantomBot/oauth/ generiert hast, während du als Bot angemeldet bist: ");

            String apiOAuth = System.console().readLine().trim();

            transaction.setProperty("oauth", apiOAuth);
            changed = true;
        }

        /**
         * @consolecommand mysqlsetup - Sets up MySQL.
         */
        if (message.equalsIgnoreCase("mysqlsetup")) {
            try {
                System.out.println("");
                System.out.println("PhantomBot MySQL-Setup.");
                System.out.println("");

                System.out.print("Bitte gebe den MySQL-Hostnamen ein: ");
                String mySqlHost = System.console().readLine().trim();
                transaction.setProperty("mysqlhost", mySqlHost);

                System.out.print("Bitte gebe den MySQL-Port ein: ");
                String mySqlPort = System.console().readLine().trim();
                transaction.setProperty("mysqlport", mySqlPort);

                System.out.print("Bitte gebe den MySQL-Datenbanknamen ein: ");
                String mySqlName = System.console().readLine().trim();
                transaction.setProperty("mysqlname", mySqlName);

                System.out.print("Bitte gebe den Benutzername für MySQL ein: ");
                String mySqlUser = System.console().readLine().trim();
                transaction.setProperty("mysqluser", mySqlUser);

                System.out.print("Bitte gebe das Passwort für MySQL ein: ");
                String mySqlPass = System.console().readLine().trim();
                transaction.setProperty("mysqlpass", mySqlPass);

                String dataStoreType = "MySQLStore";
                transaction.setProperty("datastore", dataStoreType);

                com.gmt2001.Console.out.println("PhantomBot MySQL-Setup abgeschlossen, PhantomBot wird beendet.");
                changed = true;
            } catch (NullPointerException ex) {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }

        /**
         * @consolecommand streamlabssetup - Sets up StreamLabs.
         */
        if (message.equalsIgnoreCase("streamlabssetup")) {
            try {
                System.out.println("");
                System.out.println("PhantomBot StreamLabs-Setup.");
                System.out.println("");

                System.out.println("Bitte registriere eine Anwendung bei StreamLabs");
                System.out.println("Anleitungen sind erhältlich unter https://dev.streamlabs.com/docs/register-your-application");
                System.out.println("Stellen Sie sicher, dass Sie den Sender auf die Whitelist setzen");
                System.out.println("Sie sollten den Umleitungs-URI auf setzen: http://localhost");

                System.out.println("");
                System.out.print("Fügen Sie auf der Seite mit den StreamLabs-Anwendungseinstellungen Ihre StreamLabs-Client-ID ein oder geben Sie sie ein: ");
                String twitchAlertsClientId = System.console().readLine().trim();

                System.out.println("");
                System.out.print("Fügen Sie auf der Seite mit den StreamLabs-Anwendungseinstellungen Ihr StreamLabs-Client-Geheimnis ein oder geben Sie es ein: ");
                String twitchAlertsClientSecret = System.console().readLine().trim();

                System.out.println("");
                System.out.print("Fügen Sie auf der Seite mit den StreamLabs-Anwendungseinstellungen Ihren StreamLabs-Umleitungs-URI ein oder geben Sie ihn ein: ");
                String twitchAlertsRedirectURI = System.console().readLine().trim();

                System.out.println("");
                System.out.println("Verwenden Sie diesen Link, um das Konto zu autorisieren, von dem Sie Spenden lesen möchten");
                System.out.println("HINWEIS: Es ist normal, dass nach der Genehmigung der Autorisierung entweder eine leere Seite oder eine Browserseite mit der Meldung \"Verbindung nicht möglich\" angezeigt wird");
                System.out.println("");
                System.out.println("https://www.streamlabs.com/api/v1.0/authorize?client_id=" + twitchAlertsClientId + "&redirect_uri=" + twitchAlertsRedirectURI + "&response_type=code&scope=donations.read");
                System.out.println("");
                System.out.println("Bitte fügen Sie den Zugangscode aus der URL in die Adressleiste Ihres Browsers ein oder geben Sie ihn ein. Sie können auch einfach die gesamte URL einfügen: ");
                String twitchAlertsKickback = System.console().readLine().trim();

                if (twitchAlertsKickback.contains("code=")) {
                    twitchAlertsKickback = twitchAlertsKickback.substring(twitchAlertsKickback.indexOf("code=") + 5);
                }

                if (twitchAlertsKickback.contains("&")) {
                    twitchAlertsKickback = twitchAlertsKickback.substring(0, twitchAlertsKickback.indexOf("&"));
                }

                HttpResponse res = HttpRequest.getData(HttpRequest.RequestType.POST, "https://streamlabs.com/api/v1.0/token",
                        "grant_type=authorization_code&client_id=" + twitchAlertsClientId + "&client_secret=" + twitchAlertsClientSecret
                        + "&redirect_uri=" + twitchAlertsRedirectURI + "&code=" + twitchAlertsKickback,
                        new HashMap<>());

                if (res.success) {
                    JSONObject j = new JSONObject(res.content);
                    String twitchAlertsKey = j.getString("access_token");
                    transaction.setProperty("twitchalertskey", twitchAlertsKey);

                    System.out.println("PhantomBot StreamLabs-Setup abgeschlossen, PhantomBot wird beendet.");
                    changed = true;
                } else if (res.httpCode == 400) {
                    JSONObject e = new JSONObject(res.content);
                    System.out.println("PhantomBot StreamLabs-Setup fehlgeschlagen");
                    System.err.println(e.getString("error"));
                    System.err.println(e.getString("message"));
                } else {
                    System.out.println("PhantomBot StreamLabs-Setup fehlgeschlagen");
                    System.err.println(res.httpCode);
                    System.err.println(res.content);
                    System.err.println(res.exception);
                }
            } catch (JSONException | NullPointerException ex) {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }

        /**
         * @consolecommand tipeeestreamsetup - Sets up TipeeeStream.
         */
        if (message.equalsIgnoreCase("tipeeestreamsetup")) {
            try {
                System.out.println("");
                System.out.println("PhantomBot TipeeeStream-Setup.");
                System.out.println("");

                System.out.print("Bitte gebe deinen TipeeeStream API OAuth-Key ein: ");
                String tipeeeStreamOAuth = System.console().readLine().trim();
                transaction.setProperty("tipeeestreamkey", tipeeeStreamOAuth);

                System.out.println("PhantomBot TipeeeStream-Setup abgeschlossen, PhantomBot wird beendet.");
                changed = true;
            } catch (NullPointerException ex) {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }

        /**
         * @consolecommand panelsetup - Sets up the panel.
         */
        if (message.equalsIgnoreCase("panelsetup")) {
            try {
                System.out.println("");
                System.out.println("PhantomBot Web-Panel-Setup.");
                System.out.println("Hinweis: Verwenden Sie keine ASCII-Zeichen in Ihrem Username oder Passwort.");
                System.out.println("");

                System.out.print("Bitte gebe einen Username deiner Wahl ein: ");
                String panelUsername = System.console().readLine().trim();
                transaction.setProperty("paneluser", panelUsername);

                System.out.print("Bitte gebe ein Passwort deiner Wahl ein: ");
                String panelPassword = System.console().readLine().trim();
                transaction.setProperty("panelpassword", panelPassword);

                System.out.println("PhantomBot Web-Panel-Setup abgeschlossen, PhantomBot wird beendet.");
                changed = true;
            } catch (NullPointerException ex) {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }

        /**
         * @consolecommand twittersetup - Sets up Twitter.
         */
        if (message.equalsIgnoreCase("twittersetup")) {
            try {
                System.out.println("");
                System.out.println("PhantomBot Twitter-Setup.");
                System.out.println("");

                System.out.print("Bitte gebe deinen Twitter Username ein: ");
                String twitterUsername = System.console().readLine().trim();
                transaction.setProperty("twitterUser", twitterUsername);

                System.out.print("Bitte gebe deinen Consumer Key ein: ");
                String twitterConsumerToken = System.console().readLine().trim();
                transaction.setProperty("twitter_consumer_key", twitterConsumerToken);

                System.out.print("Bitte gebe dein Consumer Secret ein: ");
                String twitterConsumerSecret = System.console().readLine().trim();
                transaction.setProperty("twitter_consumer_secret", twitterConsumerSecret);

                System.out.print("Bitte gebe den Access token ein: ");
                String twitterAccessToken = System.console().readLine().trim();
                transaction.setProperty("twitter_access_token", twitterAccessToken);

                System.out.print("Bitte gebe den Access token secret ein: ");
                String twitterSecretToken = System.console().readLine().trim();
                transaction.setProperty("twitter_secret_token", twitterSecretToken);

                System.out.println("PhantomBot Twitter-Setup abgeschlossen, PhantomBot wird beendet.");
                changed = true;
            } catch (NullPointerException ex) {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }

        /**
         * @consolecommand ytsetup - Sets up YouTube API Key
         */
        if (message.equalsIgnoreCase("ytsetup")) {
            try {
                System.out.println("");
                System.out.println("PhantomBot YouTube API-Schlüsseleinrichtung");
                System.out.println("");
                System.out.println("Bitte geben Sie den von dir erhaltenen YouTube-API-Schlüssel ein: ");
                String youtubeKey = System.console().readLine().trim();
                transaction.setProperty("youtubekey", youtubeKey);
                System.out.println("PhantomBot YouTube API-Schlüssel eingerichtet, PhantomBot wird beendet.");
                changed = true;
            } catch (NullPointerException ex) {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }

        // Check to see if any settings have been changed.
        if (changed) {
            transaction.commit();

            PhantomBot.instance().getDataStore().SaveAll(true);

            com.gmt2001.Console.out.println("");
            com.gmt2001.Console.out.println("Änderungen wurden gespeichert, PhantomBot wird nun beendet.");
            com.gmt2001.Console.out.println("");
            PhantomBot.exitOK();
            return;
        }

        // Handle any other commands.
        PhantomBot.instance().handleCommand(PhantomBot.instance().getBotName(), event.getMessage());
    }
}
