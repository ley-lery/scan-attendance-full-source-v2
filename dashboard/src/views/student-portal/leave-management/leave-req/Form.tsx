/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {  useState } from 'react';
import moment from 'moment';
import { getLocalTimeZone, today } from '@internationalized/date';
import { type DateValue } from '@heroui/react';
import { CalendarDate } from '@internationalized/date';
import { useTranslation } from 'react-i18next';
import ShowToast from '@/components/hero-ui/toast/ShowToast';
import { InputNumber, DatePicker, Textarea, ModalRequest } from '@/components/hero-ui';
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
  onClose: () => void;
  loadList: () => void;
}

const Form: React.FC<Props> = ({ isOpen, onClose, loadList }) => {


    const { t } = useTranslation();
    const [formData, setFormData] = useState<FormData>(initialFormData);


    const formatDateValue = (date: DateValue | null) => date ? date.toString() : null;

    // Mutation
    const { mutate: createLeaveRequest, loading: creating } = useMutation({
        onSuccess: (response) => {
            onClose();
            ShowToast({
                color: "success",
                title: "Success",
                description: response?.data?.message ||"Leave request submitted successfully",
            });
            setFormData(initialFormData);
            loadList();
        },
        onError: (err) => {
            console.log("Error: ", err);
            ShowToast({
                color: "error",
                title: "Submit Failed",
                description: err?.response?.data?.message || "Failed to submit leave request",
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

    const handleDaysChange = (value: number | React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (value as number > 0) {
                const startMoment = moment(formData.startDate.toDate(getLocalTimeZone()));
                const newEndDate = startMoment.add(value as number - 1, 'days');
                
                // Convert back to CalendarDate
                const newEndCalendarDate = new CalendarDate(
                    newEndDate.year(),
                    newEndDate.month() + 1, // moment months are 0-indexed
                    newEndDate.date()
                );
                
                setFormData((prev) => ({ ...prev, endDate: newEndCalendarDate }));
            }
        } catch (error) {
            console.error('Error updating end date:', error);
        }
    };

    const handleSubmit = async () => {
        
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

    if (!isOpen) return null;

    return (
        <ModalRequest
            title="Submit Leave Request"
            isOpen={isOpen}
            onClose={onClose}
            onRequest={handleSubmit}
            onSubmit={handleSubmit}
            isLoading={creating}
            isDisabled={creating}
        >

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <DatePicker
                    labelPlacement="outside"
                    label={t('startDate')}
                    name="startDate"
                    value={formData.startDate}
                    onChange={(val) => handleDateChange('startDate', val as DateValue)}
                    isRequired
                    minValue={today(getLocalTimeZone()) as unknown as DateValue}
                    isDisabled={creating}
                />

                <DatePicker
                    labelPlacement="outside"
                    label={t('endDate')}
                    name="endDate"
                    value={formData.endDate}
                    onChange={(val) => handleDateChange('endDate', val as DateValue)}
                    isRequired
                    minValue={formData.startDate as unknown as DateValue}
                    isDisabled={creating}
                />

                <InputNumber
                    label={ t('numberOfDays')}
                    value={calculateDays()}
                    onChange={handleDaysChange}
                    isDisabled={creating}
                    hideStepper
                    labelPlacement="outside"
                    radius="md"
                    isClearable={false}
                    min={1}
                    max={30}
                />
                <Textarea
                    name="reason"
                    label="Reason for Leave"
                    labelPlacement="outside"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Enter reason here..."
                    isRequired
                    className="w-full col-span-3"
                    isDisabled={creating}
                    isClearable
                    onClear={handleClear}
                />
            </div>
        </ModalRequest>
    );
};

export default Form;