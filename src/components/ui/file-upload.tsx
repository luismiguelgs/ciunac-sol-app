import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelect?: (file: File) => void
  progress?: number
  showProgress?: boolean
  accept?: string
  maxSize?: number
  className?: string
}

export function FileUpload({
  onFileSelect,
  progress = 0,
  showProgress = false,
  accept = ".pdf,.doc,.docx",
  maxSize = 5 * 1024 * 1024, // 5MB por defecto
  className,
  ...props
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const [error, setError] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const validateFile = (file: File): boolean => {
    if (!file) return false

    // Validar tamaño
    if (file.size > maxSize) {
      setError(`El archivo excede el tamaño máximo permitido de ${maxSize / (1024 * 1024)}MB`)
      return false
    }

    // Validar tipo
    const allowedTypes = accept.split(",").map(type => type.trim())
    const fileExtension = ".".concat(file.name.split(".").pop() || "")
    if (!allowedTypes.includes(fileExtension.toLowerCase())) {
      setError(`Tipo de archivo no permitido. Use: ${accept}`)
      return false
    }

    setError("")
    return true
  }

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      const file = e.dataTransfer.files?.[0]
      if (file && validateFile(file)) {
        onFileSelect?.(file)
      }
    },
    [onFileSelect]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      onFileSelect?.(file)
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="w-full">
      <Card
        className={cn(
          "relative border-2 border-dashed",
          dragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25",
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12 text-muted-foreground"
          >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M12 12v9" />
            <path d="m8 17 4-4 4 4" />
          </svg>
          <div className="text-muted-foreground">
            <p className="font-medium">Arrastra y suelta tu archivo aquí o</p>
            <Button
              type="button"
              variant="link"
              className="text-primary"
              onClick={handleButtonClick}
            >
              haz clic para buscar
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {showProgress && (
            <Progress value={progress} className="w-full h-2" />
          )}
        </CardContent>
      </Card>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept={accept}
        {...props}
      />
    </div>
  )
}