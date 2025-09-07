'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

const ContactSupportPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    category: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/support', formData)
      setSuccess(true)
      setFormData({
        email: '',
        subject: '',
        category: '',
        message: '',
      })
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 font-sans">
      <h1 className="text-4xl font-bold mb-2" style={{ color: '#FFBF00' }}>
        Contact Support
      </h1>
      <p className="text-muted-foreground mb-10">
        Facing issues? Submit a support request and we’ll get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <Label htmlFor="email">Your Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Subject */}
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Brief title of the issue"
            value={formData.subject}
            onChange={e => handleChange('subject', e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={value => handleChange('category', value)}
            required
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bug">🐞 Bug</SelectItem>
              <SelectItem value="feature">💡 Feature Request</SelectItem>
              <SelectItem value="billing">🧾 Billing</SelectItem>
              <SelectItem value="other">❓ Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Explain your issue in detail..."
            rows={6}
            value={formData.message}
            onChange={e => handleChange('message', e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full text-lg font-semibold"
          style={{ backgroundColor: '#FFBF00', color: '#000' }}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" /> Sending...
            </span>
          ) : (
            'Submit Request'
          )}
        </Button>

        {success && (
          <p className="text-green-600 text-center font-medium">
            ✅ Your message has been sent. We&apos;ll get back to you soon!
          </p>
        )}
      </form>
    </div>
  )
}

export default ContactSupportPage
