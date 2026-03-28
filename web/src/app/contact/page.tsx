import type { Metadata } from 'next'
import { ContactForm } from '@/components/ui/ContactForm'

export const metadata: Metadata = {
  title: 'Contact | Hand of Yah',
  description: 'Get in touch with the Hand of Yah team.',
}

// Server component — metadata is exported here; the interactive form
// logic lives in ContactForm (a client component).
export default function ContactPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto py-16 lg:py-20">
      <h1 className="font-display text-display-lg text-umber mb-4">Contact</h1>
      <p className="font-body text-body text-umber/75 mb-10">
        Questions, feedback, or just want to say hello — we read every message.
      </p>

      <ContactForm />
    </div>
  )
}
