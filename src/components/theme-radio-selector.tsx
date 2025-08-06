"use client"
import { useId } from "react"
import { CheckIcon, MinusIcon } from "lucide-react"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"

const items = [
  { value: "light", label: "Light", image: "/assets/light-theme-thumbnail.png" },
  { value: "dark", label: "Dark", image: "/assets/dark-theme-thumbnail.png" },
  { value: "system", label: "System", image: "/assets/system-theme-thumbnail.png" },
]

export default function ThemeRadioSelector() {
  const id = useId()
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (value: string) => {
    setTheme(value)
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", value)
    }
  }

  return (
    <fieldset className="space-y-4">
      <legend className="text-foreground text-sm leading-none font-medium">
        Choose a theme
      </legend>
      <RadioGroup
        className="flex gap-3"
        value={theme} // Bind the current theme to the RadioGroup
        onValueChange={handleThemeChange} // Use onValueChange for controlled behavior
      >
        {items.map((item) => (
          <label key={`${id}-${item.value}`}>
            <RadioGroupItem
              id={`${id}-${item.value}`}
              value={item.value}
              className="peer sr-only after:absolute after:inset-0"
            />
            <img
              src={item.image}
              alt={item.label}
              width={88}
              height={70}
              className="border-input peer-focus-visible:ring-ring/50 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent relative cursor-pointer overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px] peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50"
            />
            <span className="group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1">
              <CheckIcon
                size={16}
                className="group-peer-data-[state=unchecked]:hidden"
                aria-hidden="true"
              />
              <MinusIcon
                size={16}
                className="group-peer-data-[state=checked]:hidden"
                aria-hidden="true"
              />
              <span className="text-xs font-medium">{item.label}</span>
            </span>
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  )
}