import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ModalTemplate } from 'components/Modal/Modal';
import { selectUser } from '../../redux/auth/selectors.js';
import {
  INTERVALS,
  isValidWindow,
  readReminders,
  saveReminders,
} from '../../helpers/reminders.js';
import css from './RemindersModal.module.css';

const getPermission = () =>
  typeof Notification === 'undefined' ? 'unsupported' : Notification.permission;

const RemindersModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const email = useSelector(selectUser)?.email;
  const [settings, setSettings] = useState(() => readReminders(email));
  const [permission, setPermission] = useState(getPermission);
  const isWindowValid = isValidWindow(settings);

  const change = changes => setSettings(current => ({ ...current, ...changes }));

  // The permission is asked right on the click that turns reminders on,
  // because some browsers only allow it during a user action.
  const handleToggle = async event => {
    const enabled = event.target.checked;
    change({ enabled });

    if (enabled && permission === 'default') {
      setPermission(await Notification.requestPermission());
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!isWindowValid) {
      return;
    }

    const { enabled, from, to, interval } = settings;
    saveReminders(email, { enabled, from, to, interval });
    toast.success(t(enabled ? 'reminders.saved' : 'reminders.turnedOff'));
    onClose();
  };

  return (
    <ModalTemplate modalIsOpen={isOpen} closeModal={onClose}>
      <form
        className={css.wrapper}
        role="dialog"
        aria-labelledby="remindersTitle"
        onSubmit={handleSubmit}
      >
        <h2 className={css.title} id="remindersTitle">
          {t('reminders.heading')}
        </h2>
        <p className={css.text}>{t('reminders.text')}</p>

        <label className={css.toggle}>
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={handleToggle}
          />
          {t('reminders.enable')}
        </label>

        <fieldset className={css.fieldset} disabled={!settings.enabled}>
          <legend className={css.label}>{t('reminders.window')}</legend>
          <div className={css.times}>
            <label className={css.time}>
              <span className={css.timeLabel}>{t('reminders.from')}</span>
              <input
                type="time"
                className={css.input}
                value={settings.from}
                onChange={event => change({ from: event.target.value })}
                aria-invalid={!isWindowValid}
              />
            </label>
            <label className={css.time}>
              <span className={css.timeLabel}>{t('reminders.to')}</span>
              <input
                type="time"
                className={css.input}
                value={settings.to}
                onChange={event => change({ to: event.target.value })}
                aria-invalid={!isWindowValid}
              />
            </label>
          </div>
          {!isWindowValid && (
            <p className={css.error} aria-live="assertive">
              {t('reminders.windowError')}
            </p>
          )}
        </fieldset>

        <fieldset className={css.fieldset} disabled={!settings.enabled}>
          <legend className={css.label}>{t('reminders.interval')}</legend>
          <div className={css.radios}>
            {INTERVALS.map(minutes => (
              <label key={minutes} className={css.radio}>
                <input
                  type="radio"
                  name="interval"
                  value={minutes}
                  checked={settings.interval === minutes}
                  onChange={() => change({ interval: minutes })}
                />
                {t(`reminders.intervals.${minutes}`)}
              </label>
            ))}
          </div>
        </fieldset>

        {settings.enabled && permission !== 'granted' && (
          <p className={css.note}>{t('reminders.inAppOnly')}</p>
        )}

        <div className={css.actions}>
          <button
            type="submit"
            className={css.save}
            disabled={!isWindowValid}
          >
            {t('reminders.save')}
          </button>
          <button type="button" className={css.cancel} onClick={onClose}>
            {t('reminders.cancel')}
          </button>
        </div>
      </form>
    </ModalTemplate>
  );
};

export default RemindersModal;
