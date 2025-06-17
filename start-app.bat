@echo off
echo EmoTrackEd - JavaScript Version
echo ==================================
echo This script will help you run the JavaScript version of EmoTrackEd

echo Cleaning up old build files...
if exist .next rmdir /s /q .next

echo Installing dependencies...
call npm install

echo Starting the development server...
call npm run dev

echo If the server doesn't start automatically, please open http://localhost:3000 in your browser
