import { AsciiArt } from "@/components/ascii-art"
import { Award, Trophy, Flag } from "lucide-react"
import { data } from "@/lib/data"

export function CertificationsSection() {
  const { certifications, competitions, initiatives } = data.certifications

  return (
    <div className="space-y-4">
      <AsciiArt art="certifications" />

      <div className="space-y-6">
        <div>
          <h3 className="text-gray-900 font-bold mb-2 flex items-center dark:text-gray-50">
            <Award className="h-4 w-4 mr-2" />
            Certifications
          </h3>
          <ul className="space-y-2 pl-6">
            {certifications.map((cert, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-900 mr-2 dark:text-gray-50">•</span>
                <div>
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{cert.issuer}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-gray-900 font-bold mb-2 flex items-center dark:text-gray-50">
            <Trophy className="h-4 w-4 mr-2" />
            Competitions
          </h3>
          <ul className="space-y-2 pl-6">
            {competitions.map((competition, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-900 mr-2 dark:text-gray-50">•</span>
                <p>{competition}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-gray-900 font-bold mb-2 flex items-center dark:text-gray-50">
            <Flag className="h-4 w-4 mr-2" />
            Cybersecurity Initiatives
          </h3>
          <ul className="space-y-2 pl-6">
            {initiatives.map((initiative, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-900 mr-2 dark:text-gray-50">•</span>
                <p>{initiative}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
