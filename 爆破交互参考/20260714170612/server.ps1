$port = 8770
$root = (Get-Location).Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server started at http://localhost:$port/"
Write-Host "Root: $root"
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $resp = $ctx.Response
    $path = $req.Url.LocalPath
    if ($path -eq '/') { $path = '/index.html' }
    $file = Join-Path $root $path.TrimStart('/')
    if (Test-Path $file -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $resp.ContentLength64 = $bytes.Length
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        switch ($ext) {
            '.html' { $resp.ContentType = 'text/html; charset=utf-8' }
            '.css'  { $resp.ContentType = 'text/css' }
            '.js'   { $resp.ContentType = 'application/javascript' }
            '.png'  { $resp.ContentType = 'image/png' }
            '.jpg'  { $resp.ContentType = 'image/jpeg' }
            default { $resp.ContentType = 'application/octet-stream' }
        }
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $resp.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found: $path")
        $resp.OutputStream.Write($msg, 0, $msg.Length)
    }
    $resp.OutputStream.Close()
}
