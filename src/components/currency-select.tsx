'use client';

import { useLocalization } from '@akinon/next/hooks';
import { useState } from 'react';
import settings from 'settings';
import { Button } from './button';
import { Modal } from './modal';
import { SelectCurrency } from './select-currency';
// import { Icon } from './icon';
// import { Image } from '@akinon/next/components';

interface CurrencySelectProps {
  className?: string;
}

export const CurrencySelect = (props: CurrencySelectProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const { t, currency, setCurrency } = useLocalization();
  const { currencies } = settings.localization;

  const handleChange = async (e) => {
    setSelectedCurrency(e.target.value);
    setIsModalOpen(true);
  };

  const confirmModalHandleClick = () => {
    setCurrency(selectedCurrency);
  };

  return (
    <>
      <SelectCurrency
        onChange={handleChange}
        options={currencies.map((currency) => ({
          value: currency.code,
          label: currency.label,
          image: currency.flag
        }))}
        value={currency}
        data-testid="currency"
        borderless
        className={props.className}
      />

      <Modal
        portalId="currency-modal"
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title={t('common.currency_modal.title')}
        titleClassName={'text-2xl font-bold text-center w-full'}
      >
        <div className="p-6">
          {/* <h3
            className="text-2xl font-bold text-center mb-4"
            data-testid="currency-modal-title"
          >
            {t('common.currency_modal.title')}
          </h3> */}
          <p className="text-center mb-10">
            {t('common.currency_modal.description')}
          </p>

          <div className="flex justify-center gap-x-6 my-6">
            <Button
              onClick={() => setIsModalOpen(false)}
              appearance="outlined"
              className="font-medium pinkbtn px-10 py-2 h-12"
            >
              {t('common.currency_modal.close')}
            </Button>

            <Button
              onClick={confirmModalHandleClick}
              appearance="filled"
              className="font-medium pinkbtn px-10 py-4 h-12"
            >
              {t('common.currency_modal.continue')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
