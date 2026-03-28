'use client'

import { useState } from 'react'

type AccordionItem = {
  title: string
  content: React.ReactNode
}

type AccordionProps = {
  items: AccordionItem[]
}

export function Accordion({ items }: AccordionProps) {
  // Each item tracks its own open state independently
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set())

  function toggle(index: number) {
    setOpenIndexes((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div>
      {items.map((item, index) => {
        const isOpen = openIndexes.has(index)
        return (
          <div key={index} className="border-t border-taupe/30">
            {/* Trigger button */}
            <button
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-5 text-left"
            >
              <span className="font-body text-body font-medium text-umber">
                {item.title}
              </span>
              {/* "+" icon that rotates to "×" when open */}
              <span
                className="flex-shrink-0 ml-4 text-umber/60 transition-transform duration-300 ease-out"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                aria-hidden="true"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 2V14M2 8H14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  />
                </svg>
              </span>
            </button>

            {/* Collapsible content */}
            <div
              className="overflow-hidden transition-all duration-300 ease-out"
              style={{ maxHeight: isOpen ? '1000px' : '0px', opacity: isOpen ? 1 : 0 }}
            >
              <div className="pb-6 font-body text-body text-umber/80 leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
      {/* Bottom border */}
      <div className="border-t border-taupe/30" />
    </div>
  )
}
