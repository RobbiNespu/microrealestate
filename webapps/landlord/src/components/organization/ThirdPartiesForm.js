import * as Yup from 'yup';

import { Form, Formik } from 'formik';
import { useCallback, useContext, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import Section from '../FormFields/Section';
import { StoreContext } from '../../store';
import SubmitButton from '../FormFields/SubmitButton';
import TextField from '../FormFields/TextField';
import { Typography } from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';

const validationSchema = Yup.object().shape({
  apiKey: Yup.string().required(),
  domain: Yup.string().required(),
  fromEmail: Yup.string().email().required(),
  replyToEmail: Yup.string().email().required(),
  keyId: Yup.string().required(),
  applicationKey: Yup.string().required(),
  endpoint: Yup.string().required(),
  bucket: Yup.string().required(),
});

const ThirdPartiesForm = observer(({ onSubmit }) => {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);

  const initialValues = useMemo(
    () => ({
      apiKey: store.organization.selected.thirdParties?.mailgun?.apiKey || '',
      domain: store.organization.selected.thirdParties?.mailgun?.domain || '',
      fromEmail:
        store.organization.selected.thirdParties?.mailgun?.fromEmail ||
        store.organization.selected?.contacts?.[0]?.email ||
        '',
      replyToEmail:
        store.organization.selected.thirdParties?.mailgun?.replyToEmail ||
        store.organization.selected?.contacts?.[0]?.email ||
        '',
      keyId: store.organization.selected.thirdParties?.b2?.keyId,
      applicationKey:
        store.organization.selected.thirdParties?.b2?.applicationKey,
      endpoint: store.organization.selected.thirdParties?.b2?.endpoint,
      bucket: store.organization.selected.thirdParties?.b2?.bucket,
    }),
    [store.organization.selected]
  );

  const _onSubmit = useCallback(
    async ({
      apiKey,
      domain,
      fromEmail,
      replyToEmail,
      keyId,
      applicationKey,
      endpoint,
      bucket,
    }) => {
      await onSubmit({
        thirdParties: {
          mailgun: {
            apiKey,
            apiKeyUpdated: apiKey !== initialValues.apiKey,
            domain,
            fromEmail,
            replyToEmail,
          },
          b2: {
            keyId,
            applicationKey,
            keyIdUpdated: keyId !== initialValues.keyId,
            applicationKeyUpdated:
              applicationKey !== initialValues.applicationKey,
            endpoint,
            bucket,
          },
        },
      });
    },
    [
      onSubmit,
      initialValues.apiKey,
      initialValues.keyId,
      initialValues.applicationKey,
    ]
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={_onSubmit}
    >
      {({ values, isSubmitting }) => {
        return (
          <Form autoComplete="off">
            <Section label="Mailgun">
              <Typography>
                {t(
                  'Configuration required for sending invoices, notices and all kind of communication to the tenants'
                )}
              </Typography>
              <TextField
                label={t('Private API key')}
                name="apiKey"
                type="password"
                showHidePassword={values.apiKey !== initialValues.apiKey}
              />
              <TextField label={t('Domain')} name="domain" />
              <TextField label={t('From Email')} name="fromEmail" />
              <TextField label={t('Reply to email')} name="replyToEmail" />
            </Section>
            <Section label="Backblaze B2 Cloud Storage">
              <Typography>
                {t('Configuration required to store documents in the cloud')}
              </Typography>
              <TextField
                label="KeyId"
                name="keyId"
                type="password"
                showHidePassword={values.keyId !== initialValues.keyId}
              />
              <TextField
                label="ApplicationKey"
                name="applicationKey"
                type="password"
                showHidePassword={
                  values.applicationKey !== initialValues.applicationKey
                }
              />
              <TextField label={t('Bucket')} name="bucket" />
              <TextField label={t('Bucket endpoint')} name="endpoint" />
            </Section>
            <SubmitButton
              size="large"
              label={!isSubmitting ? t('Save') : t('Saving')}
            />
          </Form>
        );
      }}
    </Formik>
  );
});

export default ThirdPartiesForm;
