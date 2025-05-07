import { TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

interface CalendarDate {
    selectedDate: string;
    selectedTime: string;
}

interface AddTodoFormProps {
    handleSubmitForm: (data: { todo: string, startTime: string, endTime: string }) => void;
    handleCloseForm: () => void;
    eventInfo: CalendarDate;
}

function AddTodoForm({ handleSubmitForm, handleCloseForm, eventInfo }: AddTodoFormProps) {
    const [todo, setTodo] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');

    useEffect(() => {
        if (eventInfo.selectedTime) {
            setStartTime(eventInfo.selectedTime.slice(0, 5));
            const [h, m] = eventInfo.selectedTime.split(':').map(Number);
            const end = new Date();
            end.setHours(h);
            end.setMinutes(m + 30);
            const formattedEnd = end.toTimeString().slice(0, 5);
            setEndTime(formattedEnd);
        }
    }, [eventInfo]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'fixed', backgroundColor: '#9f9e9e6e', zIndex: 9999 }}
            className="d-flex justify-content-center align-items-center">
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
                className="shadow-lg h-60 w-60 d-flex flex-column justify-content-center align-items-center"
            >
                <h1>Event on {eventInfo.selectedDate} at {eventInfo.selectedTime}</h1>
                <TextField
                    label="Todo"
                    variant="outlined"
                    fullWidth
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                />
                <TextField
                    label="Start Time"
                    variant="outlined"
                    fullWidth
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
                <TextField
                    label="End Time"
                    variant="outlined"
                    fullWidth
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
                <div className="d-flex justify-content-between align-items-center mt-3" style={{ width: '100%' }}>
                    <Button variant="outlined" color="secondary" onClick={handleCloseForm}>
                        Close
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => { handleSubmitForm({ todo, startTime, endTime }) }}>
                        Add Todo
                    </Button>

                </div>
            </div>
        </div>
    );
}

export default AddTodoForm;
