import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';
import { apiCall } from '../services/api';

export const NewsletterForm = ({ compact = false }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await apiCall('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      toast({
        title: t('newsletter.successTitle', 'Hvala na prijavi!'),
        description: t('newsletter.successDesc', 'Uskoro ćeš dobiti naše novosti i savjete.'),
      });
      setEmail('');
    } catch (err) {
      toast({
        title: t('newsletter.errorTitle', 'Prijava nije uspjela'),
        description: err.message || t('newsletter.errorDesc', 'Pokušaj ponovno kasnije.'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? 'flex flex-col sm:flex-row gap-2' : 'space-y-3 sm:flex sm:items-center sm:space-y-0 sm:space-x-3'}>
      <div className={compact ? 'flex-1' : 'flex-1'}>
        <Input
          type="email"
          required
          placeholder={t('newsletter.placeholder', 'Tvoja email adresa')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading} className="whitespace-nowrap bg-[#00D9FF] hover:bg-[#00BAD3]">
        {loading
          ? t('newsletter.submitting', 'Prijava...')
          : t('newsletter.cta', 'Prijavi se')}
      </Button>
    </form>
  );
};
