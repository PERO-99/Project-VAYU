import { useState } from 'react'

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'your.email@gmail.com'
const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/'
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || ''

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Story Pitch',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    if (!WEB3FORMS_KEY) {
      const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        `[VAYU] ${formData.subject}: ${formData.name}`
      )}&body=${encodeURIComponent(
        `From: ${formData.name} <${formData.email}>\n\nMessage:\n${formData.message}`
      )}`
      window.location.href = mailtoUrl
      setSubmitted(true)
      setSubmitting(false)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', subject: 'Story Pitch', message: '' })
      }, 4000)
      return
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: formData.name,
          email: formData.email,
          subject: `[VAYU] ${formData.subject}`,
          message: formData.message,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: 'Story Pitch', message: '' })
      } else {
        throw new Error(data.message || 'Submission failed.')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <section className="w-full flex items-center justify-center bg-[#F2EDE8] pt-32 pb-16" style={{ minHeight: '40vh' }}>
        <div className="text-center px-6">
          <h1 className="text-display font-display text-[#0E0E0E] mb-4">Get in Touch</h1>
          <p className="text-body-large text-[#0E0E0E] opacity-70 max-w-[480px] mx-auto">
            Pitch a story, ask a question, or just say hello.
          </p>
        </div>
      </section>

      <section className="w-full pb-24 bg-[#F2EDE8]">
        <div className="content-max">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
              <h3 className="text-h3 font-display text-[#0E0E0E] mb-8">Send a Message</h3>

              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#4A5D43] flex items-center justify-center mx-auto mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h4 className="text-h3 font-display text-[#0E0E0E] mb-2">Message Sent</h4>
                  <p className="text-[16px] font-light text-[#0E0E0E] opacity-60">
                    {!WEB3FORMS_KEY 
                      ? 'Your email client has been opened to send this message.' 
                      : "We'll be in touch soon."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={submitting}
                      className="w-full bg-transparent border-b border-[rgba(14,14,14,0.2)] py-3 text-[16px] outline-none focus:border-[#4A5D43] transition-colors placeholder:text-[rgba(14,14,14,0.4)]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={submitting}
                      className="w-full bg-transparent border-b border-[rgba(14,14,14,0.2)] py-3 text-[16px] outline-none focus:border-[#4A5D43] transition-colors placeholder:text-[rgba(14,14,14,0.4)]"
                    />
                  </div>
                  <div>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      disabled={submitting}
                      className="w-full bg-transparent border-b border-[rgba(14,14,14,0.2)] py-3 text-[16px] outline-none focus:border-[#4A5D43] transition-colors text-[#0E0E0E]"
                    >
                      <option value="Story Pitch">Story Pitch</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <textarea
                      placeholder="Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      disabled={submitting}
                      rows={5}
                      className="w-full bg-transparent border-b border-[rgba(14,14,14,0.2)] py-3 text-[16px] outline-none focus:border-[#4A5D43] transition-colors resize-none placeholder:text-[rgba(14,14,14,0.4)]"
                      style={{ minHeight: '120px' }}
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-500 text-sm py-2">
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="btn-pill bg-[#4A5D43] text-white hover:bg-[#3a4a35] mt-4 disabled:opacity-50"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            <div className="lg:w-1/2">
              <h3 className="text-h3 font-display text-[#0E0E0E] mb-8">Other Ways to Reach Us</h3>
              <div className="space-y-6">
                <div>
                  <span className="text-caption text-[#0E0E0E] opacity-60 block mb-1">Email</span>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-[18px] font-light text-[#0E0E0E] hover:text-[#C07A5F] transition-colors no-underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
                <div className="space-y-3">
                  <span className="text-caption text-[#0E0E0E] opacity-60 block">Social</span>
                  <a 
                    href={INSTAGRAM_URL} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-[16px] font-light text-[#0E0E0E] hover:text-[#C07A5F] transition-colors no-underline"
                  >
                    Instagram <span>&rarr;</span>
                  </a>
                </div>
                <div>
                  <span className="text-caption text-[#0E0E0E] opacity-60 block mb-1">Location</span>
                  <p className="text-[16px] font-light text-[#0E0E0E] opacity-60">
                    Based everywhere. HQ in Bhilai, Chhattisgarh, India.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
