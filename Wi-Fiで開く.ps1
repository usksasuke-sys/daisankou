# このフォルダの謎解きを、同じWi-Fiの端末から開けるようにする。
$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath $PSScriptRoot
$port = 8084
try { $host.UI.RawUI.WindowTitle = '第三項' } catch {}
$web = Join-Path $PSScriptRoot 'www'

if (-not (Test-Path -LiteralPath (Join-Path $web 'index.html'))) {
  Write-Host 'www\index.html が見つかりません。'
  Read-Host 'Enterで閉じます'
  exit 1
}

function Get-LanAddresses {
  $configs = @(Get-NetIPConfiguration -ErrorAction SilentlyContinue | Where-Object {
    $_.NetAdapter.Status -eq 'Up' -and $_.IPv4Address
  })
  $found = foreach ($config in $configs) {
    foreach ($address in @($config.IPv4Address)) {
      $ip = $address.IPAddress
      if ($ip -and $ip -notlike '127.*' -and $ip -notlike '169.254.*') {
        [pscustomobject]@{ Alias = $config.InterfaceAlias; IP = $ip }
      }
    }
  }
  $wifi = @($found | Where-Object { $_.Alias -match 'Wi-?Fi|WLAN|Wireless|ワイヤレス' })
  if ($wifi.Count -gt 0) { return $wifi }
  return @($found)
}

$busy = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($busy) {
  Write-Host "ポート $port はすでに使われています。先に開いた窓を閉じてから、もう一度開いてください。"
  Read-Host 'Enterで閉じます'
  exit 1
}

$ruleName = "謎解き4 Wi-Fi $port"
$rule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if (-not $rule) {
  try {
    New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow -Protocol TCP -LocalPort $port -Profile Private -ErrorAction Stop | Out-Null
    Write-Host '同じWi-Fiからの接続を、このパソコンで許可しました。'
  } catch {
    Write-Host 'ほかの端末から開けないときは、このファイルを右クリックし、「管理者として実行」を一度だけ選んでください。'
  }
}

Write-Host ''
Write-Host 'このパソコン:'
Write-Host "  http://127.0.0.1:$port/"
$addresses = @(Get-LanAddresses)
if ($addresses.Count -eq 0) {
  Write-Host ''
  Write-Host 'Wi-Fiのアドレスが見つかりません。このパソコンがWi-Fiにつながっているか確認してください。'
} else {
  Write-Host ''
  Write-Host '同じWi-Fiのスマホやタブレット:'
  foreach ($address in $addresses) {
    Write-Host ("  http://{0}:{1}/    ({2})" -f $address.IP, $port, $address.Alias)
  }
}
Write-Host ''
Write-Host '止めるときは、この窓を閉じるか、Ctrl+C を押してください。'
Write-Host ''

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
  Write-Host 'Python が見つかりません。Python を入れてから、もう一度開いてください。'
  Read-Host 'Enterで閉じます'
  exit 1
}

Set-Location -LiteralPath $web
Start-Process "http://127.0.0.1:$port/"
python -m http.server $port --bind 0.0.0.0
