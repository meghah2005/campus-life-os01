"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CameraIcon, XIcon, ExternalLinkIcon, ScanLineIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedUrl, setScannedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraAccessFailed, setCameraAccessFailed] = useState(false)
  const [recentScans, setRecentScans] = useState<Array<{ url: string; timestamp: Date }>>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Start camera and scanning
  const startScanning = async () => {
    setError(null)
    setScannedUrl(null)
    setCameraAccessFailed(false)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)

        // Start scanning for QR codes
        scanIntervalRef.current = setInterval(() => {
          scanQRCode()
        }, 500)
      }
    } catch (err) {
      setScannedUrl(null)
      setCameraAccessFailed(true)
      setError("Failed to access camera. Please allow camera permissions.")
    }
  }

  // Stop camera and scanning
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    setIsScanning(false)
  }

  // Scan QR code from video frame
  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

    // Simple QR code detection simulation
    // In production, use a library like jsQR
    const detected = detectQRCode(imageData)

    if (detected) {
      handleQRDetected(detected)
    }
  }

  // Simulate QR detection - in production use jsQR library
  const detectQRCode = (imageData: ImageData): string | null => {
    // This is a simulation. Real implementation would use jsQR or similar library
    // For demo purposes, we'll return null (no detection)
    return null
  }

  // Handle detected QR code
  const handleQRDetected = (url: string) => {
    setError(null)
    setScannedUrl(url)
    setRecentScans((prev) => [{ url, timestamp: new Date() }, ...prev.slice(0, 9)])
    stopScanning()
  }

  // Manual test function for demo
  const simulateScan = (url: string) => {
    if (cameraAccessFailed) return
    handleQRDetected(url)
  }

  // Open URL in new tab
  const openUrl = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLineIcon className="size-5 text-primary" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>Scan QR codes on campus posters to instantly open event links and resources</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera View */}
          <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
            {isScanning ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-primary rounded-lg w-64 h-64 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <CameraIcon className="size-16 mb-4" />
                <p className="text-sm">Camera preview will appear here</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {!isScanning ? (
              <Button onClick={startScanning} className="flex-1 gap-2">
                <CameraIcon className="size-4" />
                Start Scanning
              </Button>
            ) : (
              <Button onClick={stopScanning} variant="destructive" className="flex-1 gap-2">
                <XIcon className="size-4" />
                Stop Scanning
              </Button>
            )}
          </div>

          {/* Demo Buttons */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Demo: Simulate scanning a poster</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={cameraAccessFailed}
                onClick={() => simulateScan("https://example.com/tech-fest-2024")}
              >
                Tech Fest Poster
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={cameraAccessFailed}
                onClick={() => simulateScan("https://example.com/sports-event")}
              >
                Sports Event
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={cameraAccessFailed}
                onClick={() => simulateScan("https://example.com/career-fair")}
              >
                Career Fair
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={cameraAccessFailed}
                onClick={() => simulateScan("https://example.com/cultural-night")}
              >
                Cultural Night
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Scanned Result */}
          {scannedUrl && !error && (
            <Alert>
              <AlertDescription className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-1">QR Code Detected!</p>
                  <p className="text-xs text-muted-foreground truncate">{scannedUrl}</p>
                </div>
                <Button size="sm" onClick={() => openUrl(scannedUrl)} className="gap-2 shrink-0">
                  Open Link
                  <ExternalLinkIcon className="size-3" />
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Recent Scans */}
      {recentScans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Scans</CardTitle>
            <CardDescription>Your scanning history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentScans.map((scan, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{scan.url}</p>
                    <p className="text-xs text-muted-foreground">
                      {scan.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => openUrl(scan.url)} className="gap-2 shrink-0">
                    Open
                    <ExternalLinkIcon className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Click "Start Scanning" to activate your camera</li>
            <li>Point your camera at a QR code on any campus poster</li>
            <li>The scanner will automatically detect and read the code</li>
            <li>Click "Open Link" to visit the website directly</li>
            <li>Find campus events, registration forms, announcements, and more!</li>
          </ol>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm">
              <Badge className="mr-2">Tip</Badge>
              Most campus posters now include QR codes for quick access to online resources!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
