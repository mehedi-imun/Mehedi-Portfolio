"use client";

import { useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  // Radix refocuses the trigger when the menu closes, and browsers treat that
  // programmatic focus() as focus-visible even after a mouse click -- the
  // button's focus ring then lingers, reading as the icon shrinking inside
  // it. Skip that refocus only when the interaction was pointer-driven;
  // keyboard users still get focus (and the ring) back, as they should.
  const closedByPointer = useRef(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onPointerDown={() => {
            closedByPointer.current = true;
          }}
          onKeyDown={() => {
            closedByPointer.current = false;
          }}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onPointerDownCapture={() => {
          closedByPointer.current = true;
        }}
        onKeyDownCapture={() => {
          closedByPointer.current = false;
        }}
        onCloseAutoFocus={(event) => {
          if (closedByPointer.current) {
            event.preventDefault();
          }
        }}
      >
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
