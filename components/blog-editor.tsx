"use client"

import { useState, useEffect } from "react"
import { Input } from "./input"
import { Textarea } from "./textarea"
import { Eye, Download, Save, Lock, Plus, X } from "lucide-react"
import { Button } from "./button"
import { Card, CardHeader, CardTitle, CardContent } from "./card"
import { Badge } from "./ui/badge"

interface BlogData {
  title: string
  date: string
  readTime: string
  tags: string[]
  content: string
}

export function BlogEditor() {
  const [blogData, setBlogData] = useState<BlogData>({
    title: "",
    date: new Date().toISOString().split('T')[0],
    readTime: "5 min read",
    tags: [],
    content: ""
  })
  
  const [newTag, setNewTag] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [slug, setSlug] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Check if already authenticated on component mount
  useEffect(() => {
    const authToken = localStorage.getItem('blog-editor-session')
    if (authToken) {
      // Verify the session is still valid
      verifySession(authToken)
    }
  }, [])

  const verifySession = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('blog-editor-session')
      }
    } catch (error) {
      localStorage.removeItem('blog-editor-session')
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (response.ok) {
        setIsAuthenticated(true)
        localStorage.setItem('blog-editor-session', data.token)
        setPassword("")
      } else {
        setError(data.error || "Authentication failed")
        setPassword("")
      }
    } catch (error) {
      setError("Authentication service unavailable")
      setPassword("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('blog-editor-session')
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-gray-600 dark:text-gray-400" />
            <CardTitle>Blog Editor Access</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter password to access the editor
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e:any) => setPassword(e.target.value)}
              placeholder="Enter password..."
              onKeyPress={(e:any) => e.key === 'Enter' && !isLoading && handleLogin()}
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <Button 
              onClick={handleLogin} 
              className="w-full" 
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? "Authenticating..." : "Access Editor"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const addTag = () => {
    if (newTag.trim() && !blogData.tags.includes(newTag.trim())) {
      setBlogData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setBlogData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const generateSlug = () => {
    return blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const downloadJSON = () => {
    const jsonData = {
      data: {
        title: blogData.title,
        date: blogData.date,
        readTime: blogData.readTime,
        tags: blogData.tags
      },
      content: blogData.content
    }

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug || generateSlug()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const saveToAPI = async () => {
    const slugToUse = slug || generateSlug()
    const token = localStorage.getItem('blog-editor-session')
    
    try {
      const response = await fetch('/api/blogs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: blogData.title,
          content: blogData.content, // Send content directly
          date: blogData.date,
          readTime: blogData.readTime,
          tags: blogData.tags
        })
      })

      if (response.ok) {
        alert('Blog saved successfully!')
      } else if (response.status === 401) {
        alert('Session expired. Please log in again.')
        handleLogout()
      } else {
        alert('Error saving blog')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving blog')
    }
  }

  // BlogPreview component
  const BlogPreview = () => (
    <div className="bg-black/90 border border-[#00FF41]/30 rounded-lg p-6 mt-4">
      {/* Header */}
      <div className="border-b border-[#00FF41]/20 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-[#00FF41] mb-2">
          {blogData.title || "Untitled Blog Post"}
        </h1>
        <div className="flex items-center space-x-4 text-white/70 text-sm">
          <span>📅 {blogData.date}</span>
          <span>⏱️ {blogData.readTime}</span>
          <span>🏷️ {blogData.tags.join(", ") || "No tags"}</span>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        <div className="text-white/90 leading-relaxed space-y-4">
          {blogData.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("#")) {
              const level = paragraph.match(/^#+/)?.[0].length || 1
              const text = paragraph.replace(/^#+\s*/, "")
              if (level === 1) {
                return (
                  <h1 key={index} className="text-xl font-bold text-[#00FF41] mt-6 mb-3">
                    {text}
                  </h1>
                )
              } else if (level === 2) {
                return (
                  <h2 key={index} className="text-lg font-semibold text-[#00FF41] mt-5 mb-2">
                    {text}
                  </h2>
                )
              } else {
                return (
                  <h3 key={index} className="text-md font-medium text-[#00FF41] mt-4 mb-2">
                    {text}
                  </h3>
                )
              }
            } else if (paragraph.startsWith("```")) {
              const code = paragraph.replace(/```[\w]*\n?/, "").replace(/```$/, "")
              return (
                <pre key={index} className="bg-gray-900 border border-[#00FF41]/20 rounded p-4 overflow-x-auto text-[#00FF41] text-sm">
                  <code>{code}</code>
                </pre>
              )
            } else if (paragraph.startsWith("- ")) {
              const items = paragraph.split("\n").filter(line => line.startsWith("- "))
              return (
                <ul key={index} className="list-disc list-inside space-y-1 text-white/90">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace("- ", "")}</li>
                  ))}
                </ul>
              )
            } else if (paragraph.trim()) {
              return (
                <p key={index} className="text-white/90">
                  {paragraph}
                </p>
              )
            }
            return null
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#00FF41]/20 pt-4 mt-8">
        <div className="flex justify-between items-center text-sm text-white/60">
          <span>Written by Bishwa Thakur</span>
          <span>Type 'blog ls' to see all posts</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Editor</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Hide" : "Show"} Preview
          </Button>
          <Button onClick={downloadJSON} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download JSON
          </Button>
          <Button onClick={saveToAPI} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Blog
          </Button>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-6">
          {/* Blog Details */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={blogData.title}
                  onChange={(e) => setBlogData(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  placeholder="Enter blog title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={generateSlug() || "auto-generated-from-title"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input
                    type="date"
                    value={blogData.date}
                    onChange={(e) => setBlogData(prev => ({
                      ...prev,
                      date: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Read Time</label>
                  <Input
                    value={blogData.readTime}
                    onChange={(e) => setBlogData(prev => ({
                      ...prev,
                      readTime: e.target.value
                    }))}
                    placeholder="5 min read"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blogData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <p className="text-sm text-muted-foreground">
                Use markdown syntax: # for headers, ``` for code, - for lists
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={blogData.content}
                onChange={(e) => setBlogData(prev => ({
                  ...prev,
                  content: e.target.value
                }))}
                placeholder="# My Blog Post

This is my blog content. I can use **bold text** and *italic text*.

## Code Example

```javascript
console.log('Hello, World!');
```

## Lists

- Item 1
- Item 2
- Item 3

Regular paragraphs work too!"
                className="min-h-[400px] font-mono"
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Terminal Preview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  This is exactly how your blog will appear in the terminal
                </p>
              </CardHeader>
              <CardContent>
                <BlogPreview />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}