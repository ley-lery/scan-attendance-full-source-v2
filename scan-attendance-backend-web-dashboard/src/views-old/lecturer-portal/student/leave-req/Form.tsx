/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import moment from 'moment';
import { getLocalTimeZone, today } from '@internationalized/date';
import { type DateValue, NumberInput, Textarea } from '@heroui/react';
// Build UI
import { ModalSystem } from '@/components/ui';
// Hero UI
import { DatePicker } from '@/components/hero-ui';
import { CalendarDate } from '@internationalized/date';
import { useTranslation } from 'react-i18next';
import ShowToast from '@/components/hero-ui/toast/ShowToast';

interface FormData {
  startDate: CalendarDate | DateValue;
  endDate: CalendarDate | DateValue;
  reason: string;
}
const initialFormData: FormData = {
    startDate: today(getLocalTimeZone()),
    endDate: today(getLocalTimeZone()), 
    reason: '',
};

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const Form: React.FC<Props> = ({ isOpen, onOpenChange }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleDateChange = (field: keyof FormData, value: DateValue | null) => {
        if (value) {
        setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const calculateDays = () => {
        try {
        const start = moment(formData.startDate.toDate(getLocalTimeZone()));
        const end = moment(formData.endDate.toDate(getLocalTimeZone()));
        const diff = end.diff(start, 'days') + 1;
        return diff >= 0 ? diff : 0;
        } catch {
        return 0;
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = {
                startDate : moment(formData.startDate.toDate(getLocalTimeZone())).format('YYYY-MM-DD'),
                endDate : moment(formData.endDate.toDate(getLocalTimeZone())).format('YYYY-MM-DD'),
                numberOfDays: calculateDays(),
                reason: formData.reason,
            }
            console.log('Form submitted:', payload);
            ShowToast({
                color: 'success',
                title: t('success'),
                description: t('leaveRequestSubmitted'),
            })
            setFormData(initialFormData);
        } catch (error) {
        console.error('Error submitting form:', error);
        return;
        } finally {
        setSubmitting(false);
        onOpenChange(false);
        }
    };

    const handleClear = () => {
        setFormData({
            ...formData,
            reason: '',
        });
    }

    return (
        <ModalSystem
            title="Submit Leave Request"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onSubmit={handleSubmit}
            loading={submitting}
            size='2xl'
            saveCloseLabel="request"
        >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DatePicker
                labelPlacement="outside"
                label={t('startDate')}
                name="startDate"
                value={formData.startDate}
                onChange={(val) => handleDateChange('startDate', val as DateValue)}
                isRequired
                minValue={today(getLocalTimeZone()) as unknown as DateValue}
            />

            <DatePicker
                labelPlacement="outside"
                label={t('endDate')}
                name="endDate"
                value={formData.endDate}
                onChange={(val) => handleDateChange('endDate', val as DateValue)}
                isRequired
                minValue={formData.startDate as unknown as DateValue}
            />

            <NumberInput
                label={ t('numberOfDays')}
                value={calculateDays()}
                disabled
                hideStepper
                labelPlacement="outside"
                classNames={{
                    inputWrapper: "bg-zinc-200 dark:bg-zinc-800",
                }}
            />
        </div>
        <Textarea
            name="reason"
            label="Reason for Leave"
            labelPlacement="outside"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="Enter reason here..."
            isRequired
            className="w-full"
            classNames={{
            inputWrapper: "bg-zinc-200 dark:bg-zinc-800",
            }}
            isClearable
            onClear={handleClear}
            
        />
        </ModalSystem>
    );
};

export default Form;
