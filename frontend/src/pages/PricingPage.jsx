import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import EditablePage from '../components/EditablePage';

const PricingStaticContent = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('basic');

  const plans = [
    {
      id: 'private',
      name: t('pricing.privateRenters'),
      price: '€10',
      priceSuffix: t('pricing.perProperty'),
      properties: '1-10 properties',
    },
    {
      id: 'agencies',
      name: t('pricing.travelAgencies'),
      price: '€6',
      priceSuffix: t('pricing.perProperty'),
      properties: '10-100 properties',
    },
    {
      id: 'hotels',
      name: t('pricing.hotels'),
      price: '€8',
      priceSuffix: t('pricing.perRoom'),
      properties: '10-20 rooms',
    },
    {
      id: 'portals',
      name: t('pricing.webPortals'),
      price: '€50',
      priceSuffix: '+ €0.5 + 2.5%/month',
      properties: 'Up to 100 properties',
    },
  ];

  const featuresList = [
    t('pricing.features.unlimitedAccess'),
    t('pricing.features.freeTraining'),
    t('pricing.features.technicalSupport'),
    t('pricing.features.mobileApp'),
    t('pricing.features.guestPortal'),
    t('pricing.features.bookingEngine'),
    t('pricing.features.onlinePayment'),
    t('pricing.features.emailSending'),
  ];

  return (
    <div data-testid="pricing-page">
      {/* Hero Section */}
      <section className="bg-[#0A1628] text-white py-16 md:py-24" data-testid="pricing-hero">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-[#00BFB3] text-xs md:text-sm font-semibold tracking-wider uppercase">
                {t('pricing.badge')}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight">
                {t('pricing.title')}
              </h1>
              <p className="text-gray-300 text-base md:text-lg max-w-lg">
                {t('pricing.subtitle')}
              </p>
            </div>
            <div className="relative hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop" 
                alt="Pricing"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-16 md:py-24 bg-[#F8FAFB]" data-testid="pricing-cards-section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-[#00BFB3] text-xs font-semibold tracking-wider uppercase">
              PACKAGES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 text-[#0A1628]">
              {t('pricing.packagesTitle')}
            </h2>
            <p className="text-gray-600 mt-4">
              {t('pricing.packagesSubtitle')}
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="basic" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="basic" data-testid="tab-basic">
                {t('pricing.basicPackages')}
              </TabsTrigger>
              <TabsTrigger value="business" data-testid="tab-business">
                {t('pricing.byBusinessType')}
              </TabsTrigger>
              <TabsTrigger value="websites" data-testid="tab-websites">
                {t('pricing.websites')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan, idx) => (
                  <div 
                    key={plan.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    data-testid={`pricing-card-${plan.id}`}
                  >
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-[#0A1628] mb-4">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">{plan.properties}</p>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-[#0A1628]">{plan.price}</span>
                        <span className="text-gray-500 text-sm ml-1">{plan.priceSuffix}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <ul className="space-y-3">
                        {featuresList.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Check className="h-5 w-5 text-[#00BFB3] flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        variant="outline"
                        className="w-full mt-6 border-[#00BFB3] text-[#00BFB3] hover:bg-[#00BFB3] hover:text-white"
                        data-testid={`choose-plan-${plan.id}`}
                      >
                        {t('pricing.choose')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="business">
              <div className="text-center py-12">
                <p className="text-gray-600">Business type packages coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="websites">
              <div className="text-center py-12">
                <p className="text-gray-600">Website packages coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#0A1628]" data-testid="pricing-cta-section">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Button 
            className="bg-[#00BFB3] hover:bg-[#00A399] text-white font-semibold py-6 px-10 rounded-lg text-lg"
            data-testid="pricing-cta-button"
          >
            {t('cta.button')}
          </Button>
        </div>
      </section>

    </div>
  );
};

const PricingPage = () => {
  return <EditablePage slug="pricing" FallbackContent={PricingStaticContent} />;
};

export default PricingPage;
