import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Lightbulb, Shield, Users, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import EditablePage from '../components/EditablePage';

const AboutStaticContent = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const heroBadge = lang === 'hr' ? 'O NAMA' : lang === 'de' ? 'ÜBER UNS' : 'ABOUT US';
  const heroTitle = lang === 'hr' ? 'Osnažujemo vlasnike nekretnina pametnim rješenjima' : lang === 'de' ? 'Immobilienbesitzer mit intelligenten Lösungen stärken' : 'Empowering Property Owners with Smart Solutions';
  const heroSubtitle = lang === 'hr' ? 'U SyncBeds-u vjerujemo da upravljanje kratkoročnim iznajmljivanjem treba biti jednostavno i učinkovito.' : lang === 'de' ? 'Bei SyncBeds glauben wir, dass die Verwaltung von Kurzzeitvermietungen einfach und effizient sein sollte.' : 'At SyncBeds, we believe managing short-term rentals should be simple and efficient.';
  
  const whoWeAreTitle = lang === 'hr' ? 'Tko smo mi' : lang === 'de' ? 'Wer wir sind' : 'Who We Are';
  const whoWeAreContent = lang === 'hr' ? 'SyncBeds je osnovan od strane tima stručnjaka za ugostiteljstvo i tehnologiju koji su prepoznali izazove s kojima se vlasnici nekretnina suočavaju.' : lang === 'de' ? 'SyncBeds wurde von einem Team aus Gastgewerbe- und Technologieexperten gegründet.' : 'SyncBeds was founded by a team of hospitality and technology experts.';
  
  const whatWeDoTitle = lang === 'hr' ? 'Što radimo' : lang === 'de' ? 'Was wir tun' : 'What We Do';
  const visionTitle = lang === 'hr' ? 'Naša vizija i vrijednosti' : lang === 'de' ? 'Unsere Vision & Werte' : 'Our Vision & Values';

  return (
    <div data-testid="about-page">

      <section className="bg-[#0A1628] text-white py-16 md:py-24" data-testid="about-hero">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-[#00D9FF] text-xs md:text-sm font-semibold tracking-wider uppercase">{heroBadge}</span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight">{heroTitle}</h1>
              <p className="text-gray-300 text-base md:text-lg max-w-lg">{heroSubtitle}</p>
            </div>
            <div className="relative hidden lg:block">
              <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop" alt="About SyncBeds" className="rounded-xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white" data-testid="who-we-are-section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop" alt="Our Team" className="rounded-xl shadow-lg w-full" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#0A1628] mb-6">{whoWeAreTitle}</h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">{whoWeAreContent}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#F8FAFB]" data-testid="what-we-do-section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#0A1628] mb-4">{whatWeDoTitle}</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#00D9FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-[#0A1628]">Channel Manager</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#00D9FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-[#0A1628]">eVisitor Integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#00D9FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-[#0A1628]">Direct Booking Website</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#00D9FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-[#0A1628]">Smart Apartment</span>
                </div>
              </div>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=500&fit=crop" alt="What we do" className="rounded-xl shadow-lg w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white" data-testid="vision-values-section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#0A1628]">{visionTitle}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-[#00D9FF]/10 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-[#00D9FF]" />
              </div>
              <h3 className="text-lg font-semibold font-heading text-[#0A1628] mb-2">{lang === 'hr' ? 'Inovacija' : lang === 'de' ? 'Innovation' : 'Innovation'}</h3>
              <p className="text-gray-600 text-sm">{lang === 'hr' ? 'Kontinuirano razvijamo nove značajke' : lang === 'de' ? 'Wir entwickeln kontinuierlich neue Funktionen' : 'We continuously develop new features'}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-[#00D9FF]/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-[#00D9FF]" />
              </div>
              <h3 className="text-lg font-semibold font-heading text-[#0A1628] mb-2">{lang === 'hr' ? 'Pouzdanost' : lang === 'de' ? 'Zuverlässigkeit' : 'Reliability'}</h3>
              <p className="text-gray-600 text-sm">{lang === 'hr' ? 'Stabilna i sigurna platforma' : lang === 'de' ? 'Stabile und sichere Plattform' : 'Stable and secure platform'}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-[#00D9FF]/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#00D9FF]" />
              </div>
              <h3 className="text-lg font-semibold font-heading text-[#0A1628] mb-2">{lang === 'hr' ? 'Fokus na korisnika' : lang === 'de' ? 'Kundenorientiert' : 'Customer-Centric'}</h3>
              <p className="text-gray-600 text-sm">{lang === 'hr' ? 'Prioritet dajemo potrebama klijenata' : lang === 'de' ? 'Wir priorisieren Kundenbedürfnisse' : 'We prioritize customer needs'}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-[#00D9FF]/10 rounded-lg flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-[#00D9FF]" />
              </div>
              <h3 className="text-lg font-semibold font-heading text-[#0A1628] mb-2">{lang === 'hr' ? 'Transparentnost' : lang === 'de' ? 'Transparenz' : 'Transparency'}</h3>
              <p className="text-gray-600 text-sm">{lang === 'hr' ? 'Bez skrivenih naknada' : lang === 'de' ? 'Keine versteckten Gebühren' : 'No hidden fees'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#0A1628]" data-testid="about-cta-section">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-6">{t('cta.title')}</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">{t('cta.subtitle')}</p>
          <Button className="bg-[#00D9FF] hover:bg-[#00A399] text-white font-semibold py-6 px-10 rounded-lg text-lg" data-testid="about-cta-button">{t('cta.button')}</Button>
        </div>
      </section>

    </div>
  );
};

const AboutPage = () => {
  return <EditablePage slug="about" FallbackContent={AboutStaticContent} />;
};

export default AboutPage;