$ErrorActionPreference = "Stop"

function Start-ServiceAndWait {
    param(
        [string]$ServiceName,
        [string]$WaitText = "Started .*Application"
    )
    
    $logFile = "$PWD\logs\$ServiceName.log"
    Write-Host "Starting $ServiceName ... (Logging to $logFile)"
    
    # Start the process in background
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd $ServiceName && ..\mvnw.cmd spring-boot:run > ..\logs\$ServiceName.log 2>&1" -WindowStyle Hidden
    
    # Wait for the service to log "Started"
    $started = $false
    for ($i = 0; $i -lt 180; $i++) {
        if (Test-Path $logFile) {
            $content = Get-Content $logFile -Tail 50 -ErrorAction SilentlyContinue
            if ($content -match $WaitText -or $content -match "Started .* in .* seconds") {
                $started = $true
                break
            }
        }
        Start-Sleep -Seconds 2
    }
    
    if ($started) {
        Write-Host "[OK] $ServiceName started successfully." -ForegroundColor Green
    } else {
        Write-Host "[ERROR] $ServiceName failed to start within timeout. Check logs." -ForegroundColor Red
    }
}

function Start-ServicesParallelAndWait {
    param(
        [string[]]$ServiceNames
    )
    
    $jobs = @()
    foreach ($svc in $ServiceNames) {
        $logFile = "$PWD\logs\$svc.log"
        Write-Host "Starting $svc in parallel ... (Logging to $logFile)"
        Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd $svc && ..\mvnw.cmd spring-boot:run > ..\logs\$svc.log 2>&1" -WindowStyle Hidden
    }
    
    Write-Host "Waiting for all parallel services to start..."
    
    $pending = [System.Collections.ArrayList]::new()
    $pending.AddRange($ServiceNames)
    
    for ($i = 0; $i -lt 240; $i++) {
        $completed = @()
        foreach ($svc in $pending) {
            $logFile = "$PWD\logs\$svc.log"
            if (Test-Path $logFile) {
                $content = Get-Content $logFile -Tail 50 -ErrorAction SilentlyContinue
                if ($content -match "Started .*Application" -or $content -match "Started .* in .* seconds") {
                    Write-Host "[OK] $svc started successfully." -ForegroundColor Green
                    $completed += $svc
                }
            }
        }
        
        foreach ($c in $completed) {
            $pending.Remove($c)
        }
        
        if ($pending.Count -eq 0) {
            break
        }
        Start-Sleep -Seconds 2
    }
    
    if ($pending.Count -gt 0) {
        Write-Host "[ERROR] The following services failed to start within timeout: $($pending -join ', ')" -ForegroundColor Red
    }
}

# Ensure logs directory exists
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

Write-Host "--- PHASE 1: SEQUENTIAL ---"
Start-ServiceAndWait -ServiceName "config-server"
Start-ServiceAndWait -ServiceName "discovery-server"
Start-ServiceAndWait -ServiceName "api-gateway"

Write-Host "--- PHASE 2: PARALLEL BATCH 1 ---"
$batch1 = @("auth-service", "patient-service", "doctor-service", "appointment-service", "admission-service")
Start-ServicesParallelAndWait -ServiceNames $batch1

Write-Host "--- PHASE 3: PARALLEL BATCH 2 ---"
$batch2 = @("billing-service", "pharmacy-service", "laboratory-service", "inventory-service", "notification-service", "audit-service", "analytics-service", "reporting-service")
Start-ServicesParallelAndWait -ServiceNames $batch2

Write-Host "All startup sequences completed!"

#.\start-services.ps1
