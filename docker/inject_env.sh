#!/bin/sh

# Pfad zur index.html im Container
HTML_FILE="/usr/share/nginx/html/index.html"

# Prüfen, ob die Datei existiert (falls das Volume falsch gemountet ist)
if [ -f "$HTML_FILE" ]; then
  echo "Injiziere Umgebungsvariablen in $HTML_FILE..."
  
  # Platzhalter ersetzen
  sed -i "s|__VITE_API_URL_PLACEHOLDER__|${VITE_API_URL}|g" $HTML_FILE
  sed -i "s|__VITE_VOSK_URL_PLACEHOLDER__|${VITE_VOSK_URL}|g" $HTML_FILE
  sed -i "s|__VITE_PERSONA_PLACEHOLDER__|${VITE_PERSONA:-agata}|g" $HTML_FILE
else
  echo "Fehler: $HTML_FILE nicht gefunden. Prüfe deine Volumes!"
fi
