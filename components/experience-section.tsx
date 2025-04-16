import { AsciiArt } from "@/components/ascii-art"
import { data } from "@/lib/data"

export function ExperienceSection() {
  const { jobs } = data.experience

  return (
    <div className="space-y-4">
      <AsciiArt art="experience" />

      <div className="space-y-6">
        {jobs.map((job, index) => (
          <div key={index} className="relative pl-5 border-l border-gray-900/30 dark:border-gray-50/30">
            <div className="absolute w-3 h-3 bg-gray-900 rounded-full -left-[6.5px] top-1 dark:bg-gray-50" />
            <div className="mb-1">
              <h3 className="text-gray-900 font-bold dark:text-gray-50">{job.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {job.company}, {job.location} | {job.period}
              </p>
            </div>
            <ul className="text-sm space-y-1 list-disc pl-4">
              {job.responsibilities.map((responsibility, respIndex) => (
                <li key={respIndex}>{responsibility}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
