/*
 * Copyright (C) 2016-2018 phantombot.tv
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
 * HTTPS Server
 * @author: illusionaryone
 */
package tv.phantombot.httpserver;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.BindException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

import tv.phantombot.PhantomBot;

import com.sun.net.httpserver.HttpsServer;
import java.security.KeyStore;
import java.security.KeyManagementException;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.SSLEngine;
import javax.net.ssl.SSLParameters;
import javax.net.ssl.SSLContext;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.BasicAuthenticator;
import com.sun.net.httpserver.HttpsConfigurator;
import com.sun.net.httpserver.HttpsParameters;
import java.io.File;


public class HTTPSServer {
    private HttpsServer server;
    private String     serverPassword;
    private String     serverWebAuth;
    private String     httpsPassword;
    private String     httpsFileName;
    private int        serverPort;

    public HTTPSServer(String ip, int myPort, String myPassword, String myWebAuth, final String panelUser, final String panelPassword, final String fileName, final String password) throws Exception {
        serverPort = myPort;
        serverPassword = myPassword.replace("oauth:", "");
        serverWebAuth = myWebAuth;

        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());

        this.httpsFileName = fileName;
        this.httpsPassword = password;

        try {
            server = HttpsServer.create((!ip.isEmpty() ? new InetSocketAddress(ip, serverPort) : new InetSocketAddress(serverPort)), 0);
            SSLContext sslContext = SSLContext.getInstance("TLS");

            KeyStore ks = KeyStore.getInstance("JKS");
            FileInputStream inputStream = new FileInputStream(this.httpsFileName);
            ks.load(inputStream, password.toCharArray());

            KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
            kmf.init(ks, password.toCharArray());

            TrustManagerFactory tmf = TrustManagerFactory.getInstance("SunX509");
            tmf.init(ks);

            sslContext.init(kmf.getKeyManagers(), tmf.getTrustManagers(), null);
            server.setHttpsConfigurator(new HttpsConfigurator(sslContext) {
                public void configure (HttpsParameters params) {
                    try {
                        // initialise the SSL context
                        SSLContext c = SSLContext.getDefault();
                        SSLEngine engine = c.createSSLEngine();
                        params.setNeedClientAuth(false);
                        params.setCipherSuites(engine.getEnabledCipherSuites());
                        params.setProtocols(engine.getEnabledProtocols());

                        // get the default parameters
                        SSLParameters defaultSSLParameters = c.getDefaultSSLParameters();
                        params.setSSLParameters(defaultSSLParameters);

                    } catch (Exception ex) {
                        System.out.println("HTTPS-Port konnte nicht erstellt werden.");
                    }
                }
            });

            server.createContext("/", new HTTPSServerHandler());

            HttpContext panelContext = server.createContext("/panel", new PanelHandler());
            HttpContext ytContext = server.createContext("/ytplayer", new YTPHandler());

            BasicAuthenticator auth = new BasicAuthenticator("PhantomBot Web Utilities") {
                @Override
                public boolean checkCredentials(String user, String pwd) {
                    return user.equals(panelUser) && pwd.equals(panelPassword);
                }
            };
            ytContext.setAuthenticator(auth);
            panelContext.setAuthenticator(auth);

            server.setExecutor(Executors.newCachedThreadPool());
            server.start();
        } catch (KeyManagementException ex) {
            com.gmt2001.Console.err.logStackTrace(ex);
            throw new Exception("HTTPS-Server konnte SSL-Zertifikat nicht laden");
        } catch (BindException ex) {
            com.gmt2001.Console.err.println("Verbindung zum Port für HTTPS-Server auf Port " + myPort + " konnte nicht hergestellt werden.");
            com.gmt2001.Console.warn.println("Bitte stellen Sie sicher, dass auf Ihrem System derzeit nicht der Port " + myPort + " verwendet wird.");
            com.gmt2001.Console.warn.println("Du kannst den Basis-Port in botlogin.txt auch auf einen anderen Wert ändern, z.B. " + (myPort + 1000));
            throw new Exception("HTTPS-Server auf Port " + myPort+ " konnte nicht erstellt werden.");
        } catch (IOException ex) {
            com.gmt2001.Console.err.println("HTTPS-Server konnte nicht erstellt werden: " + ex.getMessage());
            com.gmt2001.Console.err.logStackTrace(ex);
            throw new Exception("HTTP-Server auf Port " + myPort+ " konnte nicht erstellt werden.");
        } catch (Exception ex) {
            com.gmt2001.Console.err.println("HTTPS-Server konnte nicht erstellt werden: " + ex.getMessage());
            com.gmt2001.Console.err.logStackTrace(ex);
            throw new Exception("HTTP-Server auf Port " + myPort+ " konnte nicht erstellt werden.");
        }
    }

    public void close() {
        com.gmt2001.Console.out.println("HTTPS-Server schließt Port " + serverPort + " mit 5 Sekunden Verzögerung.");
        server.stop(5);
        com.gmt2001.Console.out.println("HTTP-Server auf Port " + serverPort +" gestoppt");
    }

    class YTPHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            HTTPServerCommon.handleYTP(exchange);
        }
    }

    class PanelHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            HTTPServerCommon.handlePanel(exchange);
        }
    }

    class HTTPSServerHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            HTTPServerCommon.handle(exchange, serverPassword, serverWebAuth);
        }
    }
}
