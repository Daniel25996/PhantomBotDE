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
package tv.phantombot;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.function.Supplier;

public class ConfigurationManager {

    private static final String BOTLOGIN_TXT_LOCATION = "./config/botlogin.txt";
    private static final String PANEL_STANDARD_USER = "panel";
    private static final String PANEL_STANDARD_PASSWORD = "panel";
    private static final String OUAUTH_PREFIX = "oauth:";

    public static final String PROP_ENVOVERRIDE = "ENVOVERRIDE";

    public static final String PROP_BASEPORT = "baseport";
    public static final String PROP_USEHTTPS = "usehttps";
    public static final String PROP_WEBENABLE = "webenable";
    public static final String PROP_MSGLIMIT30 = "msglimit30";
    public static final String PROP_MUSICENABLE = "musicenable";
    public static final String PROP_WHISPERLIMIT60 = "whisperlimit60";
    public static final String PROP_OAUTH = "oauth";
    public static final String PROP_CHANNEL = "channel";
    public static final String PROP_OWNER = "owner";
    public static final String PROP_USER = "user";
    public static final String PROP_DEBUGON = "debugon";
    public static final String PROP_DEBUGLOG = "debuglog";
    public static final String PROP_RELOADSCRIPTS = "reloadscripts";
    public static final String PROP_RHINODEBUGGER = "rhinodebugger";
    public static final String PROP_WEBAUTH = "webauth";
    public static final String PROP_WEBAUTH_RO = "webauthro";
    public static final String PROP_PANEL_USER = "paneluser";
    public static final String PROP_PANEL_PASSWORD = "panelpassword";
    public static final String PROP_YTAUTH = "ytauth";
    public static final String PROP_YTAUTH_RO = "ytauthro";
    public static final String PROP_API_OAUTH = "apioauth";
    public static final String PROP_SILENTSCRIPTSLOAD = "silentscriptsload";
    public static final String PROP_USEROLLBAR = "userollbar";

    private ConfigurationManager() {
        // private constructor to prevent users from instantiating a pure static class
    }

    static CaselessProperties getConfiguration() {
        /* List of properties that must exist. */
        String[] requiredProperties = new String[]{PROP_OAUTH, PROP_CHANNEL, PROP_OWNER, PROP_USER};
        String requiredPropertiesErrorMessage;

        /* Properties configuration */
        CaselessProperties startProperties = new CaselessProperties();

        /* Indicates that the botlogin.txt file should be overwritten/created. */
        boolean changed = false;

        // Indicates that this is a fresh setup
        boolean newSetup = false;

        /* Load up the bot info from the bot login file */
        try {
            if (new File(BOTLOGIN_TXT_LOCATION).exists()) {
                try ( FileInputStream inputStream = new FileInputStream(BOTLOGIN_TXT_LOCATION)) {
                    startProperties.load(inputStream);
                }
            } else {
                /*
                 * Fill in the Properties object with some default values. Note that some values
                 * are left unset to be caught in the upcoming logic to enforce settings.
                 */
                startProperties.setProperty(PROP_BASEPORT, "25000");
                startProperties.setProperty(PROP_USEHTTPS, "true");
                startProperties.setProperty(PROP_WEBENABLE, "true");
                startProperties.setProperty(PROP_MSGLIMIT30, "19.0");
                startProperties.setProperty(PROP_MUSICENABLE, "true");
                startProperties.setProperty(PROP_WHISPERLIMIT60, "60.0");
                startProperties.setProperty(PROP_USEROLLBAR, "false");
            }
        } catch (IOException ex) {
            com.gmt2001.Console.err.printStackTrace(ex);
        }

        /* Load up the bot info from the environment */
        String prefix = "PHANTOMBOT_";
        boolean envOverrides = System.getenv().containsKey(prefix + PROP_ENVOVERRIDE)
                && (System.getenv(prefix + PROP_ENVOVERRIDE).equalsIgnoreCase("true") || System.getenv(prefix + PROP_ENVOVERRIDE).equals("1"));
        System.getenv().entrySet().forEach((v) -> {
            String key = v.getKey().toUpperCase();
            String value = v.getValue();
            if (key.startsWith(prefix) && prefix.length() < key.length() && !key.equals(prefix + PROP_ENVOVERRIDE)) {
                key = key.substring(prefix.length()).toLowerCase();
                if (envOverrides) {
                    startProperties.setProperty(key, value);
                } else {
                    startProperties.putIfAbsent(key, value);
                }
            }
        });

        changed |= generateDefaultValues(startProperties);

        /* Make a new botlogin with the botName, oauth or channel is not found */
        if (startProperties.getProperty(PROP_USER) == null || startProperties.getProperty(PROP_OAUTH) == null || startProperties.getProperty(PROP_CHANNEL) == null) {
            doSetup(startProperties);
            changed = true;
            newSetup = true;
        }

        changed |= correctCommonErrors(startProperties);

        /*
         * Iterate the properties and delete entries for anything that does not have a
         * value.
         */
        changed = startProperties.stringPropertyNames().stream().map((propertyKey) -> startProperties.remove(propertyKey, "")).reduce(changed, (accumulator, _item) -> accumulator | _item);

        /*
         * Check for required settings.
         */
        requiredPropertiesErrorMessage = String.join(" ", Arrays.stream(requiredProperties).filter(x -> startProperties.getProperty(x) == null).toArray(String[]::new));

        if (!requiredPropertiesErrorMessage.isEmpty()) {
            com.gmt2001.Console.err.println();
            com.gmt2001.Console.err.println("Fehlende erforderliche Eigenschaften: " + requiredPropertiesErrorMessage);
            com.gmt2001.Console.err.println("Beende PhantomBot");
            PhantomBot.exitError();
        }

        if (!startProperties.getPropertyAsBoolean("allownonascii", false)) {
            for (String propertyKey : startProperties.stringPropertyNames()) {
                String olds = startProperties.getProperty(propertyKey);
                String news = olds.codePoints().filter(x -> x >= 32 || x <= 126).collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append).toString();

                if (!olds.equals(news)) {
                    startProperties.setProperty(propertyKey, news);
                    changed = true;
                }
            }
        }

        /* Check to see if anything changed */
        if (changed) {
            startProperties.store(false);
        }

        // fresh setup indicator should not be saved
        startProperties.setProperty("newSetup", newSetup ? "true" : "false");

        return startProperties;
    }

    private static boolean generateDefaultValues(CaselessProperties startProperties) {
        boolean changed = false;

        changed |= setDefaultIfMissing(startProperties, PROP_USEROLLBAR, "true", "Enabled Rollbar");

        /* Check to see if there's a webOauth set */
        changed |= setDefaultIfMissing(startProperties, PROP_WEBAUTH, ConfigurationManager::generateWebAuth, "Es wurde ein neuer Webauth-Schlüssel generiert für " + BOTLOGIN_TXT_LOCATION);
        /* Check to see if there's a webOAuthRO set */
        changed |= setDefaultIfMissing(startProperties, PROP_WEBAUTH_RO, ConfigurationManager::generateWebAuth, "Es wurde ein neuer Webauth-Leseschlüssel generiert für " + BOTLOGIN_TXT_LOCATION);
        /* Check to see if there's a panelUsername set */
        changed |= setDefaultIfMissing(startProperties, PROP_PANEL_USER, PANEL_STANDARD_USER,
                "Kein Panel-Benutzername, mit Standardwert von '" + PANEL_STANDARD_USER + "' für das Control Panel und den YouTube Player.");
        /* Check to see if there's a panelPassword set */
        changed |= setDefaultIfMissing(startProperties, PROP_PANEL_PASSWORD, PANEL_STANDARD_PASSWORD,
                "Kein Panel-Passwort, mit dem Standardwert von'" + PANEL_STANDARD_PASSWORD + "' für Control Panel und YouTube Player.");
        /* Check to see if there's a youtubeOAuth set */
        changed |= setDefaultIfMissing(startProperties, PROP_YTAUTH, ConfigurationManager::generateWebAuth, "Neuer YouTube Websocket-Schlüssel wurde generiert für " + BOTLOGIN_TXT_LOCATION);
        /* Check to see if there's a youtubeOAuthThro set */
        changed |= setDefaultIfMissing(startProperties, PROP_YTAUTH_RO, ConfigurationManager::generateWebAuth, "Neuer YouTube schreibgeschützter Websocket-Schlüssel wurde generiert für " + BOTLOGIN_TXT_LOCATION);
        return changed;
    }

    private static boolean correctCommonErrors(CaselessProperties startProperties) {
        boolean changed = false;

        /* Make sure the oauth has been set correctly */
        if (startProperties.getProperty(PROP_OAUTH) != null && !startProperties.getProperty(PROP_OAUTH).startsWith(OUAUTH_PREFIX) && !startProperties.getProperty(PROP_OAUTH).isEmpty()) {
            startProperties.setProperty(PROP_OAUTH, OUAUTH_PREFIX + startProperties.getProperty(PROP_OAUTH));
            changed = true;
        }

        /* Make sure the apiOAuth has been set correctly */
        if (startProperties.getProperty(PROP_API_OAUTH) != null && !startProperties.getProperty(PROP_API_OAUTH).startsWith(OUAUTH_PREFIX) && !startProperties.getProperty(PROP_API_OAUTH).isEmpty()) {
            startProperties.setProperty(PROP_API_OAUTH, OUAUTH_PREFIX + startProperties.getProperty(PROP_API_OAUTH));
            changed = true;
        }

        /* Make sure the channelName does not have a # */
        if (startProperties.getProperty(PROP_CHANNEL).startsWith("#")) {
            startProperties.setProperty(PROP_CHANNEL, startProperties.getProperty(PROP_CHANNEL).substring(1));
            changed = true;
        } else if (startProperties.getProperty(PROP_CHANNEL).contains(".tv")) {
            startProperties.setProperty(PROP_CHANNEL, startProperties.getProperty(PROP_CHANNEL).substring(startProperties.getProperty(PROP_CHANNEL).indexOf(".tv/") + 4).replaceAll("/", ""));
            changed = true;
        }

        /* Check for the owner after the channel check is done. */
        if (startProperties.getProperty(PROP_OWNER) == null && startProperties.getProperty(PROP_CHANNEL) != null && !startProperties.getProperty(PROP_CHANNEL).isEmpty()) {
            startProperties.setProperty(PROP_OWNER, startProperties.getProperty(PROP_CHANNEL));
            changed = true;
        }
        return changed;
    }

    /**
     * Sets a default value to a properties object if the requested property does not exist
     *
     * @param properties the properties object to be modified
     * @param propertyName the name of the property, which should be set if null
     * @param defaultValue the default value, to which the property is set, if the property is missing in the properties object
     * @param setMessage the message which will be printed if the value is set to the given default value
     * @return {@code true} if the value has been set to default, {@code false} if the value is already present in the properties object
     */
    private static boolean setDefaultIfMissing(CaselessProperties properties, String propertyName, String defaultValue, String generatedMessage) {
        return setDefaultIfMissing(properties, propertyName, () -> defaultValue, generatedMessage);
    }

    /**
     * Sets a default value to a properties object if the requested property does not exist
     *
     * @param properties the properties object to be modified
     * @param propertyName the name of the property, which should be generated if null
     * @param defaultValueGenerator the generating function, which generates the default value, if the property is missing in the properties object
     * @param generatedMessage the message which will be printed if the value is generated
     * @return {@code true} if the value has been generated, {@code false} if the value is already present in the properties object and does not have
     * to be generated
     */
    private static boolean setDefaultIfMissing(CaselessProperties properties, String propertyName, Supplier<String> defaultValueGenerator, String generatedMessage) {
        boolean changed = false;
        if (properties.getProperty(propertyName) == null) {
            properties.setProperty(propertyName, defaultValueGenerator.get());
            com.gmt2001.Console.debug.println(generatedMessage);
            changed = true;
        }
        return changed;
    }

    /**
     * Gets a boolean value from the a properties object and prints a message according to the property name.
     *
     * @param properties the Properties object to get the boolean value from
     * @param propertyName the name of the property to get
     * @param defaulValue the default value of the property
     * @return the value of the property. If parsing the value to a boolean fails, the default value is returned.
     */
    public static boolean getBoolean(CaselessProperties properties, String propertyName, boolean defaulValue) {
        return properties.getPropertyAsBoolean(propertyName, defaulValue);
    }

    private static void doSetup(CaselessProperties startProperties) {
        try {

            com.gmt2001.Console.out.print("\r\n");
            com.gmt2001.Console.out.print("Willkommen beim PhantomBotDE Setup Prozess!\r\n");
            com.gmt2001.Console.out.print("\r\n");

            final String os = System.getProperty("os.name").toLowerCase();

            // Detect Windows, MacOS, Linux or any other operating system.
            if (os.startsWith("win")) {
                com.gmt2001.Console.out.print("PhantomBot hat festgestellt, dass auf Ihrem Gerät Windows ausgeführt wird.\r\n");
                com.gmt2001.Console.out.print("Hier ist die Installationsanleitung für Windows: https://phantombot.github.io/PhantomBot/guides/#guide=content/setupbot/windows");
            } else if (os.startsWith("mac")) {
                com.gmt2001.Console.out.print("PhantomBot hat festgestellt, dass auf Ihrem Gerät macOS läuft.\r\n");
                com.gmt2001.Console.out.print("Hier ist die Installationsanleitung für macOS: https://phantombot.github.io/PhantomBot/guides/#guide=content/setupbot/macos");
            } else {
                com.gmt2001.Console.out.print("PhantomBot hat festgestellt, dass auf Ihrem Gerät Linux läuft.\r\n");
                com.gmt2001.Console.out.print("Hier ist die Installationsanleitung für Ubuntu: https://phantombot.github.io/PhantomBot/guides/#guide=content/setupbot/ubuntu\r\n");
                com.gmt2001.Console.out.print("Hier ist die Installationsanleitung für CentOS: https://phantombot.github.io/PhantomBot/guides/#guide=content/setupbot/centos");
            }

            com.gmt2001.Console.out.print("\r\n\r\n\r\n");

            // Bot name.
            do {
                com.gmt2001.Console.out.print("1. Bitte gib den Twitch-Benutzernamen des Bot ein: ");

                startProperties.setProperty("user", System.console().readLine().trim().toLowerCase());
            } while (startProperties.getProperty("user", "").length() <= 0);

            // Twitch oauth.
            do {
                com.gmt2001.Console.out.print("\r\n");
                com.gmt2001.Console.out.print("2. Du brauchst nun einen temporären OAuth-Token, damit der Bot chatten kann.\r\n");
                com.gmt2001.Console.out.print("Bitte beachte, dass dieser OAuth-Token generiert werden muss, während du mit dem Twitch-Konto des Bot angemeldet bist.\r\n");
                com.gmt2001.Console.out.print("Wenn du nicht als Bot angemeldet bist, gehe bitte auf https://twitch.tv/ und melde dich als Bot an.\r\n");
                com.gmt2001.Console.out.print("Den OAuth-Token des Bot erhältst du hier: https://phantombot.github.io/PhantomBot/oauth/\r\n");
                com.gmt2001.Console.out.print("Bitte gib den OAuth-Token des Bots ein: ");

                startProperties.setProperty(PROP_OAUTH, System.console().readLine().trim());
            } while (startProperties.getProperty(PROP_OAUTH, "").length() <= 0);

            // api oauth.
            do {
                com.gmt2001.Console.out.print("\r\n");
                com.gmt2001.Console.out.print("3. Nachdem diese Einrichtung abgeschlossen ist, müsst due die automatische Aktualisierung der OAuth-Token einrichten.\r\n");
                com.gmt2001.Console.out.print("Du wirst auch das Kanal-OAuth-Token für den Bot einrichten, um den Titel und die Kategorie ändern zu können.\r\n");
                com.gmt2001.Console.out.print("\r\n");
                com.gmt2001.Console.out.print("Bitte beachte, dass das BOT-Token für das Konto bestimmt ist, dass im Chat angezeigt wird.\r\n");
                com.gmt2001.Console.out.print("Bitte beachte, dass der CASTER-Token für das Konto des Senders für API-Anforderungen gilt.\r\n");
                com.gmt2001.Console.out.print("\r\n");
                com.gmt2001.Console.out.print("Der Link zur Einrichtungsseite ist hier: http://127.0.0.1:25000/oauth/\r\n");
                com.gmt2001.Console.out.print("Oder rufe die entsprechende URL auf, wenn der Bot remote gehostet wird\r\n");
                com.gmt2001.Console.out.print("\r\n");
                com.gmt2001.Console.out.print("Bitte beachte, dass du diese Einrichtung zuerst abschließen musst, bevor du auf diese Seite zugreifen kannst\r\n");

                startProperties.setProperty(PROP_API_OAUTH, startProperties.getProperty(PROP_OAUTH, "null"));
            } while (startProperties.getProperty(PROP_API_OAUTH, "").length() <= 0);

            // Channel name.
            do {
                com.gmt2001.Console.out.print("\r\n");
                com.gmt2001.Console.out.print("4. Bitte gib den Namen des Twitch-Kanals ein, dem der Bot beitreten soll: ");

                startProperties.setProperty(PROP_CHANNEL, System.console().readLine().trim());
            } while (startProperties.getProperty(PROP_CHANNEL, "").length() <= 0);

            // Panel username.
            do {
                com.gmt2001.Console.out.print("\r\n");
                com.gmt2001.Console.out.print("5. Bitte gebe einen benutzerdefinierten Benutzernamen für das Web-Panel ein: ");

                startProperties.setProperty(PROP_PANEL_USER, System.console().readLine().trim());
            } while (startProperties.getProperty(PROP_PANEL_USER, "").length() <= 0);

            // Panel password.
            do {
                com.gmt2001.Console.out.print("\r\n");
                com.gmt2001.Console.out.print("6. Bitte gebe ein benutzerdefiniertes Passwort für das Web-Panel ein: ");

                startProperties.setProperty(PROP_PANEL_PASSWORD, System.console().readLine().trim());
            } while (startProperties.getProperty(PROP_PANEL_PASSWORD, "").length() <= 0);

            com.gmt2001.Console.out.print("\r\n");
            com.gmt2001.Console.out.print("PhantomBot wird in 10 Sekunden gestartet.\r\n");
            com.gmt2001.Console.out.print("Wenn du den Bot lokal betreiben möchtest, kannst Du hier auf das Control Panel zugreifen: http://localhost:25000/ \r\n");
            com.gmt2001.Console.out.print("Wenn du den Bot auf einem Server betreibst, stelle sicher, dass du die folgenden Ports öffnest: \r\n");
            com.gmt2001.Console.out.print("25000. Du musst 'localhost' auf deine Server-IP ändern, um auf das Panel zugreifen zu können. \r\n");
            com.gmt2001.Console.out.print("\r\n");
            com.gmt2001.Console.out.print("Du kannst jetzt das automatisch aktualisierende OAuth-Token-System einrichten, du benötigst den\r\n");
            com.gmt2001.Console.out.print("Benutzername und das Passwort für das Webpanel, die du oben festgelegt hast, um auf die Seite zuzugreifen.\r\n");
            com.gmt2001.Console.out.print("\r\n");

            Thread.sleep(10000);

        } catch (InterruptedException ex) {
            com.gmt2001.Console.debug.println("Der Standbymodus konnte nicht im Setup aktiviert werden: " + ex.getMessage());
            Thread.currentThread().interrupt();
        } catch (NullPointerException ex) {
            com.gmt2001.Console.err.printStackTrace(ex);
            com.gmt2001.Console.out.println("[ERROR] PhantomBotDE konnte nicht eingerichtet werden. Wird beendet...");
            PhantomBot.exitError();
        }
    }

    /* gen a oauth */
    private static String generateWebAuth() {
        return PhantomBot.generateRandomString(30);
    }
}
