import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { contactApi } from '../services/api';

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await contactApi.submitMessage(formData);
      toast.success('Message sent successfully!');
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="contact-page">
      {/* Hero Section */}
      <section className="bg-[#0A1628] text-white py-16 md:py-24" data-testid="contact-hero">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-[#00D9FF] text-xs md:text-sm font-semibold tracking-wider uppercase">
                {t('contact.badge')}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight">
                {t('contact.title')}
              </h1>
              <p className="text-gray-300 text-base md:text-lg max-w-lg">
                {t('contact.subtitle')}
              </p>
            </div>
            <div className="relative hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600&h=400&fit=crop" 
                alt="Contact"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 bg-white" data-testid="contact-form-section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Map and Contact Info */}
            <div className="space-y-8">
              {/* Map */}
              <div className="rounded-xl overflow-hidden shadow-lg h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2781.1234567890!2d15.9819!3d45.8150!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDQ4JzU0LjAiTiAxNcKwNTgnNTQuOCJF!5e0!3m2!1sen!2shr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SyncBeds Location"
                />
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#00D9FF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-[#00D9FF]" />
                  </div>
                  <div>
                    <p className="text-[#0A1628] font-medium">Klaićeva 14, 10 000 Zagreb, Croatia</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#00D9FF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-[#00D9FF]" />
                  </div>
                  <div>
                    <p className="text-[#0A1628] font-medium">+385 97 612 8621</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#00D9FF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-[#00D9FF]" />
                  </div>
                  <div>
                    <p className="text-[#0A1628] font-medium">info@my-rents.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg白 rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold font-heading text-[#0A1628] mb-6">
                {t('contact.formTitle')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div className="space-y-2">
                  <Label htmlFor="full_name">{t('contact.fullName')}</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder={t('contact.placeholders.fullName')}
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    data-testid="contact-fullname-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('contact.email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('contact.placeholders.email')}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    data-testid="contact-email-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('contact.phone')}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={t('contact.placeholders.phone')}
                    value={formData.phone}
                    onChange={handleChange}
                    data-testid="contact-phone-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">{t('contact.subject')}</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder={t('contact.placeholders.subject')}
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    data-testid="contact-subject-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.message')}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t('contact.placeholders.message')}
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    data-testid="contact-message-input"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-[#00D9FF] hover:bg-[#00A399] text-white py-6"
                  disabled={isSubmitting}
                  data-testid="contact-submit-button"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    t('contact.send')
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
