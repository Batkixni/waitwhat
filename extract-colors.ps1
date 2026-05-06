Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('D:/Programming/waitwhat/logo_name_temp.png')
$bmp = New-Object System.Drawing.Bitmap($img)
$w = $bmp.Width; $h = $bmp.Height
Write-Host "Logo+Name Size: ${w}x${h}"
$points = @(
    @([int]($w*0.25),[int]($h*0.3),'logo-upper'),
    @([int]($w*0.25),[int]($h*0.7),'logo-lower'),
    @([int]($w*0.6),[int]($h*0.3),'name-part1'),
    @([int]($w*0.6),[int]($h*0.7),'name-part2'),
    @([int]($w/2),[int]($h/2),'center')
)
foreach ($p in $points) {
    $c = $bmp.GetPixel($p[0],$p[1])
    if ($c.A -gt 10) {
        $hex = '#' + $c.R.ToString('X2') + $c.G.ToString('X2') + $c.B.ToString('X2')
        Write-Host "$($p[2]): $hex RGB($($c.R),$($c.G),$($c.B))"
    }
}
$bmp.Dispose()
$img.Dispose()
