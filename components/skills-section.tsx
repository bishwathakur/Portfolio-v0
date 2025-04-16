import { AsciiArt } from "@/components/ascii-art"
import { data } from "@/lib/data"

export function SkillsSection() {
  const { categories } = data.skills

  return (
    <div className="space-y-4">
      <AsciiArt art="skills" />

      <div className="space-y-6">
        {categories.map((category, index) => (
          <div key={index}>
            <h3 className="text-gray-900 font-bold mb-2 dark:text-gray-50">{category.name}</h3>
            <div className="space-y-2">
              {category.skills.map((skill, skillIndex) => (
                <SkillBar key={skillIndex} name={skill.name} percentage={skill.percentage} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillBar({ name, percentage }: { name: string; percentage: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{name}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
        <div
          className="h-full bg-gray-900 rounded-full dark:bg-gray-50"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${name} skill level: ${percentage}%`}
        />
      </div>
    </div>
  )
}
