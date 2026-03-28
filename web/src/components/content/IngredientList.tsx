'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Ingredient } from '@/lib/types'

type IngredientListProps = {
  ingredients: Ingredient[]
}

export function IngredientList({ ingredients }: IngredientListProps) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? ingredients.filter((ing) =>
        ing.name.toLowerCase().includes(query.toLowerCase())
      )
    : ingredients

  // Group filtered results alphabetically
  const grouped = filtered.reduce<Record<string, Ingredient[]>>((acc, ingredient) => {
    const letter = ingredient.name.charAt(0).toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(ingredient)
    return acc
  }, {})

  const letters = Object.keys(grouped).sort()

  return (
    <div>
      {/* Search input */}
      <div className="mb-10">
        <input
          type="search"
          placeholder="Search ingredients..."
          aria-label="Search ingredients"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md bg-transparent border-0 border-b border-umber/20 font-body text-body text-umber py-3 placeholder:text-taupe focus:border-terracotta focus:outline-none transition-colors duration-200"
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="font-body text-body text-taupe py-12 text-center">
          No ingredients found matching &quot;{query}&quot;.
        </p>
      ) : (
        <div className="space-y-12">
          {letters.map((letter) => (
            <section key={letter} aria-label={`Ingredients starting with ${letter}`}>
              {/* Letter heading */}
              <h2 className="font-display text-display-md text-terracotta mb-6 pb-2 border-b border-taupe/20">
                {letter}
              </h2>

              {/* Ingredient cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped[letter].map((ingredient) => (
                  <Link
                    key={ingredient._id}
                    href={`/ingredients/${ingredient.slug.current}`}
                    className="group block bg-stone p-6 hover:bg-stone/80 transition-colors duration-200"
                  >
                    <h3 className="font-display text-display-sm text-umber group-hover:text-terracotta transition-colors duration-200 mb-3">
                      {ingredient.name}
                    </h3>

                    {ingredient.benefits && ingredient.benefits.length > 0 && (
                      <ul className="space-y-1">
                        {ingredient.benefits.slice(0, 3).map((benefit, i) => (
                          <li
                            key={i}
                            className="font-body text-body-sm text-umber/70 flex items-start gap-2"
                          >
                            <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-terracotta" aria-hidden="true" />
                            {benefit}
                          </li>
                        ))}
                        {ingredient.benefits.length > 3 && (
                          <li className="font-body text-body-sm text-taupe">
                            +{ingredient.benefits.length - 3} more
                          </li>
                        )}
                      </ul>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
