import { AsciiArt } from "@/components/ascii-art"
import { data } from "@/lib/data"

export function ProjectsSection() {
  const { projects } = data.projects

  return (
    <div className="space-y-4">
      <AsciiArt art="projects" />

      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="p-3 border border-gray-200 border-gray-900/20 rounded bg-gray-900/5 dark:border-gray-800 dark:border-gray-50/20 dark:bg-gray-50/5">
            <h3 className="text-gray-900 font-bold dark:text-gray-50">{project.title}</h3>
            <pre className="text-xs my-2 text-gray-500 dark:text-gray-400">{project.diagram}</pre>
            <p className="text-sm mb-2">{project.description}</p>
            <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">Technologies: {project.technologies}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
