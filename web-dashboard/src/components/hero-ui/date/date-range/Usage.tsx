/* eslint-disable @typescript-eslint/no-explicit-any */
import InputTextUi from "@/components/inputs/InputTextUi";
import { Button } from "@heroui/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Key, useState } from "react";
import DateRangePickerUi from "./DateRangUi";
import moment from "moment";
import InputNumberUi from "@/components/inputs/InputNumberUi";


const initialWorkDate = {
    start: parseDate(today(getLocalTimeZone()).toString()),
    end: parseDate(today(getLocalTimeZone()).add({days: 1}).toString()), 
}

const Usage = () => {
    const [workDate, setWorkDate] = useState<any>(initialWorkDate);
    const [formData, setFormData] = useState({
        employeeName: "",
        startWorkDate: initialWorkDate.start,
        endWorkDate: initialWorkDate.end,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: Key } }) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const calculateDays = () => {
        const startDate = moment(workDate.start.toDate(getLocalTimeZone()));
        const endDate = moment(workDate.end.toDate(getLocalTimeZone()));
        return endDate.diff(startDate, 'days') + 1; // +1 to include both start and end dates
    };

    const handleSubmit = () => {
        const formmattedStart = moment(workDate.start.toDate(getLocalTimeZone())).format("YYYY-MM-DD")
        const endFormatted = moment(workDate.end.toDate(getLocalTimeZone())).format("YYYY-MM-DD");
        const numberOfDays = calculateDays();
        
        const payload = {
            employeeName: formData.employeeName,
            startWorkDate: formmattedStart,
            endWorkDate: endFormatted,
            numberOfDays: numberOfDays,
        };
        console.log(payload); 
    }

    return (
    <div className="grid grid-cols-1 gap-4">
        <InputTextUi
            labelPlacement="outside"
            label="Employee Name"
            placeholder="Enter employee name"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleInputChange}
            isRequired
        />
        <DateRangePickerUi label="Date range (controlled)" value={workDate} onChange={setWorkDate} />
        
        {/* Display calculated days */}
        <InputNumberUi
            value={calculateDays()}
            disabled
            label="Number of Days"
            placeholder="Calculated days"
            labelPlacement="outside"
            className="max-w-xs pointer-events-none"
            isClearable={false}
        />
        <Button
            onPress={handleSubmit}
            className="mt-4 max-w-xs"
            color="primary"
        > 
            Submit
        </Button>
    
    </div>
    );
};

export default Usage;