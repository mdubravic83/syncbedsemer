import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsPage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const title = lang === 'hr' ? 'Uvjeti korištenja' : lang === 'de' ? 'Allgemeine Geschäftsbedingungen' : 'Terms & Conditions';
  const subtitle = lang === 'hr' ? 'Ovi Uvjeti korištenja reguliraju vaš pristup i korištenje naše web stranice, softvera i usluga.' : lang === 'de' ? 'Diese Allgemeinen Geschäftsbedingungen regeln Ihren Zugang zu und die Nutzung unserer Website, Software und Dienste.' : 'These Terms and Conditions govern your access to and use of our website, software, and services.';

  return (
    <div data-testid="terms-page">
      <section className="bg-[#0A1628] text-white py-12 md:py-16" data-testid="terms-hero">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">{title}</h1>
          <p className="text-gray-300 text-base md:text-lg max-w-3xl">{subtitle}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg白" data-testid="terms-content">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-heading text-[#0A1628] mb-4">1. {lang === 'hr' ? 'Uvod' : lang === 'de' ? 'Einführung' : 'Introduction'}</h2>
              <p className="text-gray-600 leading-relaxed">
                {lang === 'hr' ? '"SyncBeds" se odnosi na tvrtku koja pruža softver za upravljanje nekretninama. "Korisnik" se odnosi na svakoga tko pristupa ili koristi usluge SyncBeds-a. "Usluge" uključuju Channel Manager, eVisitor integraciju, web stranicu za izravne rezervacije i značajke pametnog apartmana.' : 
                 lang === 'de' ? '"SyncBeds" bezieht sich auf das Unternehmen, das die Immobilienverwaltungssoftware bereitstellt. "Nutzer" bezieht sich auf jeden, der auf die Dienste von SyncBeds zugreift. "Dienste" umfassen den Channel Manager, die eVisitor-Integration, Direktbuchungs-Website und Smart Apartment-Funktionen.' : 
                 '"SyncBeds" refers to the company providing the property management software. "User" refers to anyone accessing or using SyncBeds services. "Services" include the Channel Manager, eVisitor integration, direct booking website, and smart apartment features.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold font-heading text-[#0A1628] mb-4">2. {lang === 'hr' ? 'Pravo pristupa i registracija' : lang === 'de' ? 'Berechtigung & Registrierung' : 'Eligibility & Registration'}</h2>
              <p className="text-gray-600 leading-relaxed">
                {lang === 'hr' ? 'Za korištenje SyncBeds-a morate imati najmanje 18 godina i biti sposobni za sklapanje pravnog ugovora. Pristajete pružiti točne i potpune informacije tijekom registracije. Odgovorni ste za održavanje sigurnosti svog računa.' : 
                 lang === 'de' ? 'Um SyncBeds zu nutzen, müssen Sie mindestens 18 Jahre alt sein. Sie verpflichten sich, während der Registrierung genaue Informationen anzugeben. Sie sind verantwortlich für die Sicherheit Ihres Kontos.' : 
                 'To use SyncBeds, you must be at least 18 years old. You agree to provide accurate information during registration. You are responsible for maintaining your account security.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold font-heading text-[#0A1628] mb-4">3. {lang === 'hr' ? 'Korištenje usluga' : lang === 'de' ? 'Nutzung der Dienste' : 'Use of Services'}</h2>
              <p className="text-gray-600 leading-relaxed">
                {lang === 'hr' ? 'SyncBeds vam daje ograničenu, neekskluzivnu licencu za korištenje platforme. Pristajete ne zloupotrebljavati naše usluge. Zadržavamo pravo suspendirati račune koji krše uvjete.' : 
                 lang === 'de' ? 'SyncBeds gewährt Ihnen eine begrenzte, nicht-exklusive Lizenz zur Nutzung der Plattform. Sie verpflichten sich, unsere Dienste nicht zu missbrauchen. Wir behalten uns das Recht vor, Konten zu sperren.' : 
                 'SyncBeds grants you a limited, non-exclusive license to use the platform. You agree not to misuse our services. We reserve the right to suspend accounts that violate terms.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold font-heading text-[#0A1628] mb-4">4. {lang === 'hr' ? 'Plaćanja i naknade' : lang === 'de' ? 'Zahlungen & Gebühren' : 'Payments & Fees'}</h2>
              <p className="text-gray-600 leading-relaxed">
                {lang === 'hr' ? 'Neke usluge zahtijevaju plaćenu pretplatu. Plaćanja se naplaćuju mjesečno ili godišnje i nisu povratna osim ako nije drugačije navedeno.' : 
                 lang === 'de' ? 'Einige Dienste erfordern ein kostenpflichtiges Abonnement. Zahlungen werden monatlich oder jährlich in Rechnung gestellt und sind nicht erstattungsfähig.' : 
                 'Some services require a paid subscription. Payments are billed monthly or annually and are non-refundable unless stated otherwise.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold font-heading text-[#0A1628] mb-4">5. {lang === 'hr' ? 'Ograničenje odgovornosti' : lang === 'de' ? 'Haftungsbeschränkung' : 'Limitation of Liability'}</h2>
              <p className="text-gray-600 leading-relaxed">
                {lang === 'hr' ? 'SyncBeds se pruža "kakav jest". Nismo odgovorni za izravnu ili neizravnu štetu koja proizlazi iz korištenja platforme.' : 
                 lang === 'de' ? 'SyncBeds wird "wie besehen" bereitgestellt. Wir haften nicht für direkte oder indirekte Schäden, die sich aus der Nutzung der Plattform ergeben.' : 
                 'SyncBeds is provided "as is". We are not liable for direct or indirect damages resulting from use of the platform.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold font-heading text-[#0A1628] mb-4">6. {lang === 'hr' ? 'Kontakt' : lang === 'de' ? 'Kontakt' : 'Contact'}</h2>
              <p className="text-gray-600 leading-relaxed">
                {lang === 'hr' ? 'Za pitanja o ovim Uvjetima korištenja kontaktirajte nas na: info@syncbeds.com ili +385 97 612 8621' : 
                 lang === 'de' ? 'Bei Fragen zu diesen Geschäftsbedingungen kontaktieren Sie uns unter: info@syncbeds.com oder +385 97 612 8621' : 
                 'For questions about these Terms and Conditions, contact us at: info@syncbeds.com or +385 97 612 8621'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
