@echo off
powershell -ExecutionPolicy Bypass -File "%~dp0tools\Refresh-LocalDockerStack.ps1" %*
