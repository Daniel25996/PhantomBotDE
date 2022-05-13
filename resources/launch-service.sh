#!/bin/bash
#
# Copyright (C) 2016-2022 phantombot.github.io/PhantomBot
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#

#
# PhantomBot Launcher - Linux and macOS
#
# Please run the following to launch the bot, the chmod is required only once.
# % chmod +x launch-service.sh
# % ./launch-service.sh
#

unset DISPLAY

tmp=""
pwd=""

if [[ "$OSTYPE" == "darwin"* ]]; then
    SOURCE="${BASH_SOURCE[0]}"
    while [ -h "$SOURCE" ]; do
        DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
        SOURCE="$(readlink "$SOURCE")"
        [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
    done
    DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
    cd "$DIR"
    pwd="$DIR"
    JAVA="./java-runtime-macos/bin/java"
elif [[ "$MACHTYPE" != "x86_64"* ]]; then
    cd $(dirname $(readlink -f $0))
    pwd=$(dirname $(readlink -f $0))
    osdist=$(awk '/^ID(_LIKE)?=/' /etc/os-release | sed 's/"//g' | sort --field-separator== --key=1,1 --dictionary-order --reverse | cut -d = -f 2 | awk 'FNR == 1')
    osdist2=$(awk '/^ID(_LIKE)?=/' /etc/os-release | sed 's/"//g' | sort --field-separator== --key=1,1 --dictionary-order --reverse | cut -d = -f 2 | awk 'FNR == 2')
    osver=$(awk '/^VERSION_ID=/' /etc/os-release | sed 's/"//g' | cut -d = -f 2)
    JAVA=$(which java)

    if (( $? > 0 )); then
        jvermaj=0
    else
        jvermaj=$(java --version | awk 'FNR == 1 { print $2 }' | cut -d . -f 1)
    fi

    if (( jvermaj < 11 )); then
        echo "PhantomBot benötigt zur Ausführung Java 11 oder höher."
        echo

        if  [[ "$osdist" == *"debian"* ]]; then
            echo "Bitte installieren Sie das Paket openjdk-11-jre-headless"
            echo

            if (( osver < 10 )); then
                echo "WARNUNG: Du verwendest ein Debian-Derivat niedriger als Version 10 (Buster)"
                echo "Java 11 ist in dieser Version möglicherweise nicht verfügbar"
                echo "Es wird empfohlen, mindestens auf Debian 10 (Buster) zu aktualisieren."
                echo "HINWEIS: Das Aktualisieren der Hauptversion des Betriebssystems bedeutet normalerweise eine saubere Installation (Wipe)."
                echo

                if (( osver == 9 )); then
                    echo "Alternativ kannst du das stretch-backports-Repository zu apt hinzufügen und dann solltest du in der Lage sein, openjdk-11-jre-headless zu installieren"
                    echo "Anleitungen findest du unter https://github.com/superjamie/lazyweb/wiki/Raspberry-Pi-Debian-Backports#installation"
                    echo
                fi
            fi

            echo "Die Befehle dazu sind:"
            echo "   sudo apt-get install openjdk-11-jre-headless"
            echo "   sudo update-alternatives --config java"
            echo
            echo "Wenn du den Befehl update-alternatives ausgibst, wähle die Option für java-11-openjdk"
        elif  [[ "$osdist" == *"fedora"* || "$osdist" == *"rhel"* ]]; then
            echo "Bitte installiere das Paket java-11-openjdk-headless"
            echo

            if [[ "$osdist" == *"rhel"* || "$osdist2" == *"rhel"* ]] && (( osver < 7 )); then
                echo "WARNUNG: Sie verwenden ein RHEL-Derivat niedriger als Version 7"
                echo "Java 11 ist in dieser Version möglicherweise nicht verfügbar"
                echo "Es wird empfohlen, mindestens auf RHEL 7 zu aktualisieren"
                echo "HINWEIS: Das Aktualisieren der Hauptversion des Betriebssystems bedeutet normalerweise eine saubere Installation (Wipe)."
                echo
            elif (( osver < 29 )); then
                echo "WARNUNG: Du verwendest ein Fedora-Derivat niedriger als Version 29"
                echo "Java 11 ist in dieser Version möglicherweise nicht verfügbar"
                echo "Es wird empfohlen, mindestens auf Fedora 29 aufzurüsten"
                echo "HINWEIS: Das Aktualisieren der Hauptversion des Betriebssystems bedeutet normalerweise eine saubere Installation (Wipe)."
                echo
            fi

            echo "Die Befehle dazu sind:"
            echo "   sudo yum install java-11-openjdk-headless"
            echo "   sudo alternatives --config java"
            echo
            echo "Wenn du den alternativen Befehl ausgibst, wähle die Option für java-11-openjdk"
        fi

        exit 1
    fi
else
    cd $(dirname $(readlink -f $0))
    pwd=$(dirname $(readlink -f $0))
    JAVA="./java-runtime-linux/bin/java"
fi

if mount | grep '/tmp' | grep -q noexec; then
    mkdir -p $(dirname $(readlink -f $0))/tmp
    tmp="-Djava.io.tmpdir=$(dirname $(readlink -f $0))/tmp"
fi

if [[ ! -x "${JAVA}" ]]; then
    echo "Java hat nicht die ausführbare Berechtigung"
    echo "Führe den folgenden Befehl aus, um dies zu beheben:"
    echo "   sudo chmod u+x ${JAVA}"

    exit 1
fi

if [[ ! -O "PhantomBot.jar" ]]; then
    echo "Das Verzeichnis wird nicht vom Dienstbenutzer geändert"
    echo "Bitte führe den folgenden Befehl aus, um dies zu beheben:"
    echo "   sudo chown ${EUID} ${pwd}"

    exit 1
fi

${JAVA} --add-exports java.base/sun.security.x509=ALL-UNNAMED --add-opens java.base/java.lang=ALL-UNNAMED ${tmp} -Duser.language=en -Djava.security.policy=config/security -Xms1m -Dfile.encoding=UTF-8 -jar PhantomBotDE.jar "$@"
