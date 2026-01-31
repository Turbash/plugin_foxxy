Add-Type -AssemblyName System.Drawing

$sizes = @(16, 48, 128)

foreach($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Fill background
    $g.FillRectangle([System.Drawing.Brushes]::Purple, 0, 0, $size, $size)
    
    # Draw F
    $fontSize = [int]($size * 0.6)
    $font = New-Object System.Drawing.Font('Arial', $fontSize, [System.Drawing.FontStyle]::Bold)
    $x = $size * 0.15
    $y = $size * 0.1
    $g.DrawString('F', $font, [System.Drawing.Brushes]::White, $x, $y)
    
    # Save
    $path = "c:\Users\negir\plugin_foxxy\test_extension\icon$size.png"
    $bmp.Save($path)
    
    # Cleanup
    $g.Dispose()
    $bmp.Dispose()
    $font.Dispose()
    
    Write-Host "Created icon$size.png"
}
