import { AsciiArt } from "@/components/ascii-art"
import { data } from "@/lib/data"

export function EducationSection() {
  const { education } = data.education

  return (
    <div className="space-y-4">
      <AsciiArt art="education" />

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="p-3 border border-gray-200 border-gray-900/20 rounded bg-gray-900/5 dark:border-gray-800 dark:border-gray-50/20 dark:bg-gray-50/5">
            <h3 className="text-gray-900 font-bold dark:text-gray-50">{edu.institution}</h3>
            <p className="text-sm">
              {edu.degree} | GPA: {edu.gpa}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{edu.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
