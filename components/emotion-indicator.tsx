import { cn } from "@/lib/utils"
import { Smile, Frown, Angry, Meh, AlertCircle, ThumbsDown } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EmotionIndicatorProps {
  emotion: string
  size?: "xs" | "sm" | "md" | "lg"
  showLabel?: boolean
}

export function EmotionIndicator({ emotion, size = "md", showLabel = false }: EmotionIndicatorProps) {
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const getEmotionDetails = () => {
    switch (emotion) {
      case "joy":
        return {
          icon: Smile,
          label: "Senang",
          color: "emotion-gradient-joy",
          textColor: "text-[hsl(var(--joy-foreground))]",
        }
      case "sadness":
        return {
          icon: Frown,
          label: "Sedih",
          color: "emotion-gradient-sadness",
          textColor: "text-[hsl(var(--sadness-foreground))]",
        }
      case "anger":
        return {
          icon: Angry,
          label: "Marah",
          color: "emotion-gradient-anger",
          textColor: "text-[hsl(var(--anger-foreground))]",
        }
      case "fear":
        return {
          icon: AlertCircle,
          label: "Takut",
          color: "emotion-gradient-fear",
          textColor: "text-[hsl(var(--fear-foreground))]",
        }
      case "surprise":
        return {
          icon: AlertCircle,
          label: "Terkejut",
          color: "emotion-gradient-surprise",
          textColor: "text-[hsl(var(--surprise-foreground))]",
        }
      case "disgust":
        return {
          icon: ThumbsDown,
          label: "Jijik",
          color: "emotion-gradient-disgust",
          textColor: "text-[hsl(var(--disgust-foreground))]",
        }
      case "neutral":
      default:
        return {
          icon: Meh,
          label: "Netral",
          color: "emotion-gradient-neutral",
          textColor: "text-[hsl(var(--neutral-foreground))]",
        }
    }
  }

  const { icon: Icon, label, color, textColor } = getEmotionDetails()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-1">
            <div className={cn("rounded-full flex items-center justify-center", color, sizeClasses[size])}>
              <Icon className={cn("text-white", iconSizes[size])} />
            </div>
            {showLabel && <span className="text-xs font-medium">{label}</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
