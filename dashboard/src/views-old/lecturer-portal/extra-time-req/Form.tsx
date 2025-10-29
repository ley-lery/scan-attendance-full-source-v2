/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type Key, useState } from 'react';
import { ZonedDateTime, getLocalTimeZone, parseZonedDateTime, today } from '@internationalized/date';
import { type DateValue,Textarea, TimeInput } from '@heroui/react';
import { DatePicker } from '@/components/hero-ui';
import ModalSystem from '@/components/ui/modal/ModalSystem';
import { CalendarDate } from '@internationalized/date';
import { useTranslation } from 'react-i18next';
import AutocompleteUi from '@/components/hero-ui/auto-complete/AutocompleteUi';
import moment from 'moment';


const curses = [
    {
        id: 1,
        name_en: 'Database System',
    },
    {
        id: 2,
        name_en: 'Python Programming',
    },
    
];
const reqCurses = [
    {
        id: 1,
        name_en: 'Database System',
    },
    {
        id: 2,
        name_en: 'Python Programming',
    },
];

interface FormData {
  course: string;
  orginalDate: CalendarDate | DateValue;
  startOriginalTime: ZonedDateTime;
  endOriginalTime: ZonedDateTime;
  reqCourse: string;
  reqStartDate: CalendarDate | DateValue;
  reqEndDate: CalendarDate | DateValue;
  reason: string;
}
const initialFormData: FormData = {
    course: '',
    orginalDate: today(getLocalTimeZone()),
    startOriginalTime: parseZonedDateTime("2022-11-07T10:45[Asia/Phnom_Penh]") as ZonedDateTime,
    endOriginalTime: parseZonedDateTime("2022-11-07T10:45[Asia/Phnom_Penh]") as ZonedDateTime,
    reqCourse: '',
    reqStartDate: today(getLocalTimeZone()),
    reqEndDate: today(getLocalTimeZone()),
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
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

   
    // ====== Handle input changes ======
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: Key | null } }) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error on change
        if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // ====== Handle date changes ======
    const handleDateChange = (field: keyof FormData, value: DateValue | null) => {
        if (value) {
        setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    // ====== Handle submit ======
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            // Format time fields to HH:mm if they are Date objects, otherwise use as is
            const formatTime = (time: any) => {
                if (typeof time === 'string') return time;
                if (time && typeof time === 'object' && 'hour' in time && 'minute' in time) {
                    // @heroui/react TimeInput returns {hour, minute, ...}
                    const pad = (n: number) => n.toString().padStart(2, '0');
                    return `${pad(time.hour)}:${pad(time.minute)}`;
                }
                return '';
            };

            const payload = {
                course: formData.course,
                orginalDate: moment(formData.orginalDate).format('YYYY-MM-DD'),
                startOriginalTime: formatTime(formData.startOriginalTime),
                endOriginalTime: formatTime(formData.endOriginalTime),
                reqCourse: formData.reqCourse,
                reqStartDate: moment(formData.reqStartDate).format('YYYY-MM-DD'),
                reqEndDate: moment(formData.reqEndDate).format('YYYY-MM-DD'),
                reason: formData.reason,
            }
            console.log(payload, "for submit");
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }
 
    return (
        <ModalSystem
            title={t('requestExtraTime')}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onSubmit={handleSubmit}
            loading={submitting}
            size='2xl'
            saveCloseLabel="request"
        >
            <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
                    <AutocompleteUi
                        label={t("course")}
                        placeholder={t("chooseCourse")}
                        name="course"
                        selectedKey={formData.course}
                        onSelectionChange={handleInputChange}
                        options={curses}
                        optionLabel="name_en"
                        optionValue="id"
                        error={errors.course}
                        isRequired
                    />
                    <DatePicker
                        labelPlacement="outside"
                        label={t('orginalDate')}
                        name="orginalDate"
                        value={formData.orginalDate}
                        onChange={(val) => handleDateChange('orginalDate', val as DateValue)}
                        isRequired
                        minValue={today(getLocalTimeZone()) as unknown as DateValue}
                    />
                    <TimeInput
                        label={t('startTime')}
                        name="startOriginalTime"
                        labelPlacement='outside'
                        value={formData.startOriginalTime as any}
                        onChange={(value) => {
                            setFormData((prev: any) => ({
                                ...prev,
                                startOriginalTime: value,
                            }));
                            if (errors.startOriginalTime) {
                                setErrors((prev) => ({ ...prev, startOriginalTime: "" }));
                            }
                        }}
                        hideTimeZone
                        defaultValue={parseZonedDateTime("2022-11-07T10:45[Asia/Phnom_Penh]")}
                        isRequired
                    />
                    <TimeInput
                        label={t('endTime')}
                        name="endOriginalTime"
                        labelPlacement='outside'
                        value={formData.endOriginalTime as any}
                        onChange={(value) => {
                            setFormData((prev: any) => ({
                                ...prev,
                                endOriginalTime: value,
                            }));
                            if (errors.endOriginalTime) {
                                setErrors((prev) => ({ ...prev, endOriginalTime: "" }));
                            }
                        }}
                        hideTimeZone
                        defaultValue={parseZonedDateTime("2022-11-07T10:45[Asia/Phnom_Penh]")}
                        isRequired
                    />
                </div>
                <div>
                    <h2 className='text-base font-medium text-zinc-500 dark:text-zinc-400'>{t('requestExtraTime')}</h2>
                    <i className='w-full h-px bg-zinc-200 dark:bg-zinc-600 flex' />
                    <div className='grid grid-cols-2 gap-x-4 gap-y-2 mt-4'>
                        <AutocompleteUi
                            label={t("reqCourse")}
                            placeholder={t("chooseCourse")}
                            name="reqCourse"
                            selectedKey={formData.reqCourse}
                            onSelectionChange={handleInputChange}
                            options={reqCurses}
                            optionLabel="name_en"
                            optionValue="id"
                            error={errors.reqCourse}
                            isRequired
                            className='col-span-2'
                        />
                        <DatePicker
                            labelPlacement="outside"
                            label={t('reqStartDate')}
                            name="reqStartDate"
                            value={formData.reqStartDate}
                            onChange={(val) => handleDateChange('reqStartDate', val as DateValue)}
                            isRequired
                        />
                        <DatePicker
                            labelPlacement="outside"
                            label={t('reqEndDate')}
                            name="reqEndDate"
                            value={formData.reqEndDate}
                            onChange={(val) => handleDateChange('reqEndDate', val as DateValue)}
                            isRequired
                        />
                        <Textarea
                            labelPlacement='outside'
                            label={t('reason')}
                            name="reason"
                            value={formData.reason as any}
                            onChange={(val) => handleInputChange(val as any)}
                            className='col-span-2'
                        />
                    </div>
                </div>
              <div>
              </div>
            </div>
        </ModalSystem>
    );
};

export default Form;
