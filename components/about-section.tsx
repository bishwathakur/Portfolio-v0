import { AsciiArt } from "@/components/ascii-art"
import { AsciiPortraitComparison } from "@/components/ascii-portrait-comparison"
import { data } from "@/lib/data"

export function AboutSection() {
  const about = data.about

  return (
    <div className="space-y-4">
      <AsciiArt art="about" />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/5">
          <AsciiPortraitComparison />
          <div className="text-center text-xs text-gray-500 mt-2 dark:text-gray-400">
            {about.name}
            <br />
            <span className="text-gray-900/60 dark:text-gray-50/60">{about.title}</span>
          </div>
        </div>

        <div className="space-y-3 md:w-3/5">
          {about.bio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          <div className="mt-2 p-3 border border-gray-200 border-gray-900/20 rounded bg-gray-900/5 dark:border-gray-800 dark:border-gray-50/20 dark:bg-gray-50/5">
            <h3 className="text-gray-900 font-bold mb-2 dark:text-gray-50">Personal Bio:</h3>
            <div className="space-y-2 text-sm">
              {about.personalBio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mt-2 p-3 border border-gray-200 border-gray-900/20 rounded bg-gray-900/5 dark:border-gray-800 dark:border-gray-50/20 dark:bg-gray-50/5">
            <h3 className="text-gray-900 font-bold mb-2 dark:text-gray-50">Quick Facts:</h3>
            <ul className="space-y-1">
              {about.quickFacts.map((fact, index) => (
                <li key={index}>
                  <span className="text-gray-500 dark:text-gray-400">{fact.label}:</span> {fact.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
