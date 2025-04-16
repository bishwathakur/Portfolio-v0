import { AsciiArt } from "@/components/ascii-art"
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react"
import { data } from "@/lib/data"
import { ResumeDownloadButton } from "@/components/resume-download-button"

export function ContactSection() {
  const contact = data.contact

  return (
    <div className="space-y-4">
      <AsciiArt art="contact" />

      <div className="space-y-6">
        <div className="flex flex-col gap-3">
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center text-sm hover:text-gray-900 transition-colors dark:hover:text-gray-50"
          >
            <Mail className="h-4 w-4 mr-2 text-gray-900 dark:text-gray-50" />
            {contact.email}
          </a>
          <a
            href={`tel:${contact.phone.replace(/-/g, "")}`}
            className="flex items-center text-sm hover:text-gray-900 transition-colors dark:hover:text-gray-50"
          >
            <Phone className="h-4 w-4 mr-2 text-gray-900 dark:text-gray-50" />
            {contact.phone}
          </a>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-gray-900 dark:text-gray-50" />
            {contact.address}
          </div>
          <a
            href={`https://www.${contact.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm hover:text-gray-900 transition-colors dark:hover:text-gray-50"
          >
            <Linkedin className="h-4 w-4 mr-2 text-gray-900 dark:text-gray-50" />
            {contact.linkedin}
          </a>
          <a
            href={`https://${contact.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm hover:text-gray-900 transition-colors dark:hover:text-gray-50"
          >
            <Github className="h-4 w-4 mr-2 text-gray-900 dark:text-gray-50" />
            {contact.github}
          </a>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-900/20 dark:border-gray-50/20">
          <div className="flex justify-center">
            <ResumeDownloadButton />
          </div>
        </div>
      </div>
    </div>
  )
}
