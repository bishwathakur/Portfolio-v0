import { AsciiArt } from "@/components/ascii-art"
import { data } from "@/lib/data"

export function ProjectsSection() {
  const { projects } = data.projects

  return (
    <div className="space-y-4">
      <AsciiArt art="projects" />

      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="relative pl-5 border-l border-gray-900/30 dark:border-gray-50/30">
            <div className="absolute w-3 h-3 bg-gray-900 rounded-full -left-[6.5px] top-1 dark:bg-gray-50" />
            <div className="mb-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-900 font-bold dark:text-gray-50">{project.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {project.technologies.join(", ")} | {project.period}
                  </p>
                </div>
                {project.github && (
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex-shrink-0"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
            <ul className="text-sm space-y-1 list-disc pl-4">
              {project.details.map((detail, detailIndex) => (
                <li key={detailIndex}>{detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
