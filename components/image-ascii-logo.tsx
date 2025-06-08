"use client"

export function ImageAsciiLogo() {
  const content = [
    `$ echo "BISHWA THAKUR"`,
    'BISHWA THAKUR//',
    `$ whoami`,
    'bishwathakur//',
    `$ pwd`,
    '/home/bishwathakur/portfolio//',
    `$ ls`,
    'about  education  skills  experience  projects  certifications  contact //',
    `$ blog ls`,
    'For getting the list of blogs//',
    `$ blog <blog_name>`,
    'For getting the blog content//',
  ]

  return (
    <div className="bg-black p-2 font-mono text-white">
      <pre className="text-white whitespace-pre overflow-x-auto text-xs sm:text-sm md:text-base">
        {content.map((line, idx) => {
          const isGreen = line.trimEnd().endsWith('//');
          const cleanedLine = isGreen ? line.replace(/\/\/$/, '').trimEnd() : line;
          return (
            <div key={idx}>
              <span style={{ color: isGreen ? '#00FF41' : 'inherit' }}>
                {cleanedLine}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  )
}
