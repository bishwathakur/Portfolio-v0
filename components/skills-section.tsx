import { AsciiArt } from "@/components/ascii-art"
import { data } from "@/lib/data"

export function SkillsSection() {
  const { categories } = data.skills

  return (
    <div className="space-y-4">
      <AsciiArt art="skills" />

      <div className="space-y-6">
        {categories.map((category, index) => (
          <div key={index} className="p-3 border border-primary/20 rounded bg-primary/5">
            <h3 className="text-white font-bold mb-2">{category.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {category.skills.map((skill, skillIndex) => {
                // Convert percentage to stars (1-3)
                let stars = 1
                if (skill.percentage >= 85) stars = 3
                else if (skill.percentage >= 75) stars = 2

                return <SkillItem key={skillIndex} name={skill.name} stars={stars} />
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillItem({ name, stars }: { name: string; stars: number }) {
  // Create star display with only filled stars
  const starDisplay = "★".repeat(stars)

  return (
    <div className="flex items-center justify-between font-mono">
      <span className="text-white">{name}</span>
      <span className="text-green-400" style={{ textShadow: "0 0 5px rgba(74, 222, 128, 0.5)" }}>
        {starDisplay}
      </span>
    </div>
  )
}
