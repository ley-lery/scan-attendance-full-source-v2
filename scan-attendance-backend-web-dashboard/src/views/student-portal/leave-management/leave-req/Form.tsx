/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {  useState } from 'react';
import moment from 'moment';
import { getLocalTimeZone, today } from '@internationalized/date';
import { type DateValue } from '@heroui/react';
import Modal from '@/components/ui/modal/ModalSystem';
import { CalendarDate } from '@internationalized/date';
import { useTranslation } from 'react-i18next';
import ShowToast from '@/components/hero-ui/toast/ShowToast';
import { InputNumber, DatePicker, Textarea } from '@/components/hero-ui';
import { useMutation } from '@/hooks/useMutation';

interface FormData {
    requestDate: DateValue;
    startDate: CalendarDate | DateValue;
    endDate: CalendarDate | DateValue;
    reason: string;
    status: "Pending" | "Approved" | "Rejected" | "Cancelled";
}
const initialFormData: FormData = {
    requestDate: today(getLocalTimeZone()),
    startDate: today(getLocalTimeZone()),
    endDate: today(getLocalTimeZone()), 
    reason: '',
    status: "Pending",
};

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  loadList: () => void;
}

const Form: React.FC<Props> = ({ isOpen, onOpenChange, loadList }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [submitting, setSubmitting] = useState<boolean>(false);


    const formatDateValue = (date: DateValue | null) => date ? date.toString() : null;

    // Mutation
    const { mutate: createLeaveRequest, loading: creating } = useMutation({
        onSuccess: (response) => {
          onOpenChange(false);
          ShowToast({
            color: "success",
            title: "Success",
            description: response?.message ||"Leave request submitted successfully",
          });
          setFormData(initialFormData);
          loadList();
        },
        onError: (err) => {
            console.log(err);
          ShowToast({
            color: "error",
            title: "Error",
            description: err?.message || "Failed to submit leave request",
          });
        },
      });
    
      
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
        } catch (error) {
            console.error('Error calculating days:', error);
            return 0;
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            requestDate : formatDateValue(formData.requestDate),
            startDate : formatDateValue(formData.startDate),
            endDate : formatDateValue(formData.endDate),
            reason: formData.reason,
            status: formData.status,
        }

        console.log('Form submitted:', payload);
        await createLeaveRequest("/student/leave", payload, "POST");
    };

    const handleClear = () => {
        setFormData({
            ...formData,
            reason: '',
        });
    }

    return (
        <Modal
            title="Submit Leave Request"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onSubmit={handleSubmit}
            loading={submitting}
            size='2xl'
            saveCloseLabel={submitting ? t('requesting') : t('request')}
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
                    isDisabled={submitting}
                />

                <DatePicker
                    labelPlacement="outside"
                    label={t('endDate')}
                    name="endDate"
                    value={formData.endDate}
                    onChange={(val) => handleDateChange('endDate', val as DateValue)}
                    isRequired
                    minValue={formData.startDate as unknown as DateValue}
                    isDisabled={submitting}
                />

                <InputNumber
                    label={ t('numberOfDays')}
                    value={calculateDays()}
                    isReadOnly
                    isDisabled={submitting}
                    hideStepper
                    labelPlacement="outside"
                    radius="md"
                    isClearable={false}
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
                isDisabled={submitting}
                isClearable
                onClear={handleClear}
            />
        </Modal>
    );
};

export default Form;
