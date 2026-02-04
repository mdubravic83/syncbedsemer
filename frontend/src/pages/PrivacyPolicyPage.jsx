import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const getTitle = () => {
    if (lang === 'hr') return 'Politika privatnosti';
    if (lang === 'de') return 'Datenschutzrichtlinie';
    return 'Privacy Policy';
  };

  const getSubtitle = () => {
    if (lang === 'hr') return 'Ovo pokriva ključne pravne aspekte, osiguravajući transparentnost i usklađenost s propisima o zaštiti podataka.';
    if (lang === 'de') return 'Dies deckt wichtige rechtliche Aspekte ab und gewährleistet Transparenz und Einhaltung der Datenschutzbestimmungen.';
    return 'This covers key legal aspects, ensuring transparency and compliance with data protection regulations.';
  };

  const sections = [
    { id: 1, title: lang === 'hr' ? 'Uvod' : lang === 'de' ? 'Einführung' : 'Introduction' },
    { id: 2, title: lang === 'hr' ? 'Informacije koje prikupljamo' : lang === 'de' ? 'Informationen, die wir erfassen' : 'Information We Collect' },
    { id: 3, title: lang === 'hr' ? 'Kako koristimo vaše informacije' : lang === 'de' ? 'Wie wir Ihre Informationen verwenden' : 'How We Use Your Information' },
    { id: 4, title: lang === 'hr' ? 'Kako dijelimo vaše informacije' : lang === 'de' ? 'Wie wir Ihre Informationen teilen' : 'How We Share Your Information' },
    { id: 5, title: lang === 'hr' ? 'Sigurnost podataka' : lang === 'de' ? 'Datensicherheit' : 'Data Security' },
    { id: 6, title: lang === 'hr' ? 'Vaša prava i izbori' : lang === 'de' ? 'Ihre Rechte & Wahlmöglichkeiten' : 'Your Rights & Choices' },
    { id: 7, title: lang === 'hr' ? 'Zadržavanje podataka' : lang === 'de' ? 'Aufbewahrung von Daten' : 'Retention of Data' },
    { id: 8, title: lang === 'hr' ? 'Linkovi trećih strana' : lang === 'de' ? 'Links zu Drittanbietern' : 'Third-Party Links' },
    { id: 9, title: lang === 'hr' ? 'Promjene ove politike' : lang === 'de' ? 'Änderungen dieser Richtlinie' : 'Changes to This Policy' },
    { id: 10, title: lang === 'hr' ? 'Kontaktirajte nas' : lang === 'de' ? 'Kontaktieren Sie uns' : 'Contact Us' },
  ];

  return (
    <div data-testid="privacy-policy-page">
      <section className="bg-[#0A1628] text-white py-12 md:py-16" data-testid="privacy-hero">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">{getTitle()}</h1>
          <p className="text-gray-300 text-base md:text-lg max-w-3xl">{getSubtitle()}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white" data-testid="privacy-content">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <div id="section-1" className="scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-[#0A1628] mb-4">1. {sections[0].title}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {lang === 'hr' ? 'Dobrodošli u SyncBeds. Vaša privatnost nam je važna i predani smo zaštiti osobnih podataka naših korisnika. Ova Politika privatnosti objašnjava kako prikupljamo, koristimo i štitimo vaše osobne podatke kada koristite našu web stranicu, usluge i platformu.' : 
                   lang === 'de' ? 'Willkommen bei SyncBeds. Ihre Privatsphäre ist uns wichtig, und wir sind bestrebt, die persönlichen Daten unserer Nutzer zu schützen. Diese Datenschutzrichtlinie erklärt, wie wir Ihre persönlichen Daten erfassen, verwenden und schützen.' : 
                   'Welcome to SyncBeds. Your privacy is important to us, and we are committed to protecting the personal data of our users. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website, services, and platform.'}
                </p>
              </div>

              <div id="section-2" className="scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-[#0A1628] mb-4">2. {sections[1].title}</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {lang === 'hr' ? 'Prikupljamo različite vrste informacija kako bismo poboljšali naše usluge:' : 
                   lang === 'de' ? 'Wir erfassen verschiedene Arten von Informationen, um unsere Dienste zu verbessern:' : 
                   'We collect different types of information to improve our services:'}
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>{lang === 'hr' ? 'Ime, email adresa, broj telefona' : lang === 'de' ? 'Name, E-Mail-Adresse, Telefonnummer' : 'Name, email address, phone number'}</li>
                  <li>{lang === 'hr' ? 'Podaci o plaćanju i naplati' : lang === 'de' ? 'Zahlungs- und Rechnungsinformationen' : 'Payment and billing information'}</li>
                  <li>{lang === 'hr' ? 'IP adresa, vrsta preglednika, podaci o uređaju' : lang === 'de' ? 'IP-Adresse, Browsertyp, Geräteinformationen' : 'IP address, browser type, device information'}</li>
                  <li>{lang === 'hr' ? 'Kolačići i tehnologije praćenja' : lang === 'de' ? 'Cookies und Tracking-Technologien' : 'Cookies and tracking technologies'}</li>
                </ul>
              </div>

              <div id="section-3" className="scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-[#0A1628] mb-4">3. {sections[2].title}</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>{lang === 'hr' ? 'Pružanje i održavanje naših usluga' : lang === 'de' ? 'Bereitstellung und Pflege unserer Dienste' : 'Provide and maintain our services'}</li>
                  <li>{lang === 'hr' ? 'Upravljanje rezervacijama i operacijama' : lang === 'de' ? 'Verwaltung von Buchungen und Operationen' : 'Manage bookings and operations'}</li>
                  <li>{lang === 'hr' ? 'Sigurna obrada plaćanja' : lang === 'de' ? 'Sichere Zahlungsabwicklung' : 'Process payments securely'}</li>
                  <li>{lang === 'hr' ? 'Poboljšanje naše platforme' : lang === 'de' ? 'Verbesserung unserer Plattform' : 'Improve our platform'}</li>
                </ul>
              </div>

              <div id="section-4" className="scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-[#0A1628] mb-4">4. {sections[3].title}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {lang === 'hr' ? 'Ne prodajemo niti iznajmljujemo vaše osobne podatke. Možemo podijeliti informacije s pružateljima usluga, pravnim tijelima ako je zakonski potrebno, i poslovnim partnerima samo uz vaš pristanak.' : 
                   lang === 'de' ? 'Wir verkaufen oder vermieten Ihre persönlichen Daten nicht. Wir können Informationen mit Dienstleistern, Rechtsbehörden wenn gesetzlich vorgeschrieben, und Geschäftspartnern nur mit Ihrer Zustimmung teilen.' : 
                   'We do not sell or rent your personal data. We may share information with service providers, legal authorities if required by law, and business partners only with your consent.'}
                </p>
              </div>

              <div id="section-5" className="scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-[#0A1628] mb-4">5. {sections[4].title}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {lang === 'hr' ? 'Primjenjujemo stroge sigurnosne mjere za zaštitu vaših osobnih podataka od neovlaštenog pristupa, gubitka ili otkrivanja.' : 
                   lang === 'de' ? 'Wir implementieren strenge Sicherheitsmaßnahmen, um Ihre persönlichen Daten vor unbefugtem Zugriff, Verlust oder Offenlegung zu schützen.' : 
                   'We implement strict security measures to protect your personal data from unauthorized access, loss, or disclosure.'}
                </p>
              </div>

              <div id="section-6" className="scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-[#0A1628] mb-4">6. {sections[5].title}</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>{lang === 'hr' ? 'Pristupiti, ažurirati ili izbrisati svoje osobne podatke' : lang === 'de' ? 'Auf Ihre persönlichen Daten zugreifen, sie aktualisieren oder löschen' : 'Access, update, or delete your personal information'}</li>
                  <li>{lang === 'hr' ? 'Povući pristanak za marketinške komunikacije' : lang === 'de' ? 'Zustimmung für Marketing-Kommunikationen widerrufen' : 'Withdraw consent for marketing communications'}</li>
                  <li>{lang === 'hr' ? 'Zatražiti kopiju svojih podataka' : lang === 'de' ? 'Eine Kopie Ihrer Daten anfordern' : 'Request a copy of your data'}</li>
                </ul>
              </div>

              <div id="section-10" className="scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-[#0A1628] mb-4">10. {sections[9].title}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {lang === 'hr' ? 'Za pitanja o ovoj Politici privatnosti kontaktirajte nas na: info@syncbeds.com ili +385 97 612 8621' : 
                   lang === 'de' ? 'Bei Fragen zu dieser Datenschutzrichtlinie kontaktieren Sie uns unter: info@syncbeds.com oder +385 97 612 8621' : 
                   'For questions about this Privacy Policy, contact us at: info@syncbeds.com or +385 97 612 8621'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-[#F8FAFB] rounded-xl p-6">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <a key={section.id} href={`#section-${section.id}`} className="block text-sm text-[#00BFB3] hover:text-[#00A399] transition-colors">
                      {section.id}. {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
