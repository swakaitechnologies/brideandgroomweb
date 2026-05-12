$pinfo = New-Object System.Diagnostics.ProcessStartInfo
$pinfo.FileName = "ssh.exe"
$pinfo.Arguments = "-o StrictHostKeyChecking=no root@72.62.229.210 `"ls /`""
$pinfo.RedirectStandardInput = $true
$pinfo.RedirectStandardOutput = $true
$pinfo.RedirectStandardError = $true
$pinfo.UseShellExecute = $false
$p = New-Object System.Diagnostics.Process
$p.StartInfo = $pinfo
$p.Start() | Out-Null
Start-Sleep -Seconds 2
$p.StandardInput.WriteLine("MaheshBadgujar@2408")
$p.StandardInput.Close()
$out = $p.StandardOutput.ReadToEnd()
$err = $p.StandardError.ReadToEnd()
$p.WaitForExit()
Write-Host "OUT: $out"
Write-Host "ERR: $err"
