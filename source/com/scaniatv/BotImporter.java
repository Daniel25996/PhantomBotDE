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

/*
 * @author scaniatv
 */

package com.scaniatv;

import com.gmt2001.datastore.DataStore;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import tv.phantombot.PhantomBot;

public class BotImporter {
    /*
     * Method that will import time and points from RevloBot.
     *
     * @param {String} fileName
     */
    public static void ImportRevlo(String fileName) {
        DataStore db = PhantomBot.instance().getDataStore();
        BufferedReader bufferedReader = null;
        List<String> users = new ArrayList<>();
        List<String> points = new ArrayList<>();
        String brLine;

        com.gmt2001.Console.out.println("Importiere RevloBot Punkte...");

        try {
            // Create a new reader.
            bufferedReader = new BufferedReader(new FileReader(fileName));

            // Skip the first line.
            bufferedReader.readLine();

            while ((brLine = bufferedReader.readLine()) != null) {
                String[] spl = brLine.split(",");

                users.add(spl[0].toLowerCase());
                points.add(spl[2]);
                com.gmt2001.Console.out.println("Importiert: " + spl[0] + " - Punkte: " + spl[2]);
            }
            com.gmt2001.Console.out.println("Speichere Daten");

            db.SetBatchString("points", "", users.toArray(new String[users.size()]), points.toArray(new String[points.size()]));

            com.gmt2001.Console.out.println("Importierung abgeschlossen!");
        } catch (IOException ex) {
            com.gmt2001.Console.err.println("Fehler beim Konvertieren von Punkten von RevloBot [IOException] " + ex.getMessage());
        } catch (Exception ex) {
            com.gmt2001.Console.err.println("Fehler beim Konvertieren von Punkten von RevloBot [Exception] " + ex.getMessage());
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException ex) {
                    com.gmt2001.Console.err.printStackTrace(ex);
                }
            }
        }
    }

    /*
     * Method that will import time and points from AnkhBot.
     *
     * @param {String} fileName
     */
    public static void ImportAnkh(String fileName) {
        DataStore db = PhantomBot.instance().getDataStore();
        BufferedReader bufferedReader = null;
        List<String> users = new ArrayList<>();
        List<String> points = new ArrayList<>();
        List<String> time = new ArrayList<>();
        String brLine;

        com.gmt2001.Console.out.println("Importieren von AnkhBot Punkten und Zeiten...");

        try {
            // Create a new reader.
            bufferedReader = new BufferedReader(new FileReader(fileName));

            // Skip the first line.
            bufferedReader.readLine();

            long d = System.currentTimeMillis();
            while ((brLine = bufferedReader.readLine()) != null) {
                String[] spl = brLine.split(",");

                users.add(spl[0].toLowerCase());
                points.add(spl[1]);
                time.add(String.valueOf((Integer.parseInt(spl[2]) * 3600)));
                com.gmt2001.Console.out.println("Importiert: " + spl[0] + " - Punkte: " + spl[1] + " - Zeit " + spl[2]);
            }
            com.gmt2001.Console.out.println("Speichere Daten...");

            db.SetBatchString("points", "", users.toArray(new String[users.size()]), points.toArray(new String[points.size()]));
            db.SetBatchString("time", "", users.toArray(new String[users.size()]), time.toArray(new String[time.size()]));

            com.gmt2001.Console.out.println("Importierung abgeschlossen! " + (System.currentTimeMillis() - d) + "ms");
        } catch (IOException ex) {
            com.gmt2001.Console.err.println("Fehler beim Konvertieren von Punkten und Zeit von AnkhBot [IOException] " + ex.getMessage());
        } catch (NumberFormatException ex) {
            com.gmt2001.Console.err.println("Fehler beim Konvertieren von Punkten und Zeit von AnkhBot [Exception] " + ex.getMessage());
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException ex) {
                    com.gmt2001.Console.err.printStackTrace(ex);
                }
            }
        }
    }
}
