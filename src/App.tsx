import 'bootstrap/dist/css/bootstrap.min.css';
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from 'react';
import TodoComponent, { ITodo } from './components/TodoComponent.tsx';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import moment from 'moment';

import { useDrop } from 'react-dnd';

import AddTodoForm from './components/AddTodoForm.tsx';
import AddTodoFormHOC from './HOC/AddTodoFormHOC.tsx';
import { useStore } from './context/storeProvider.tsx';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

function App(props: any) {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [todo, setTodo] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [check, setCheck] = useState(true);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [isEdit, setIsEdit] = useState(false);
  const [alertText, setAlertText] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  interface CalenderInfo {
    selectedDate: string;
    selectedTime: string;
  }
  const [eventInfo, setEventInfo] = useState<CalenderInfo>({ selectedDate: '', selectedTime: '' });
  const [setReadyToSubmit, setSetReadyToSubmit] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
    // console.log(todos)

  }, []);

  useEffect(() => {
    if (check) {
      setCheck(false);
      return;
    }
    localStorage.setItem('todos', JSON.stringify(todos));
    // console.log(todos)
  }, [todos]);

  function isOverlapping(start: Date, end: Date, excludeIndex: number = -1): boolean {
    return todos.some((todo, index) => {
      if (index === excludeIndex) return false; // skip the todo we are editing
      const existingStart = new Date(todo.start);
      const existingEnd = new Date(todo.end);
      return (
        (start >= existingStart && start < existingEnd) ||  // new start is inside existing
        (end > existingStart && end <= existingEnd) ||      // new end is inside existing
        (start <= existingStart && end >= existingEnd)      // new covers existing
      );
    });
  }

  function handleSubmit() {
    // console.log(todo)
    if (!todo.trim()) {
      setAlertText('Todo cannot be empty');
      setAlertSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!startDate || !endDate || endDate <= startDate) {
      setAlertText('End date must be after start date');
      setAlertSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (isOverlapping(startDate, endDate, isEdit ? editIndex : -1)) {
      setAlertText('Todo time overlaps with an existing task');
      setAlertSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (isEdit && editIndex !== -1) {
      const updatedTodos = todos.map((t, index) => {
        if (index === editIndex) {
          return { ...t, title: todo, start: startDate, end: endDate };
        }
        return t;
      });
      setTodos(updatedTodos);
      setIsEdit(false);
      setEditIndex(-1);
      setAlertText('Todo updated successfully');
      setAlertSeverity('success');
    } else {
      const newTodo: ITodo = {
        id: Date.now(),
        title: todo,
        completed: false,
        start: startDate,
        end: endDate,
      };
      setTodos([...todos, newTodo]);
      setAlertText('Todo added successfully');
      setAlertSeverity('success');
    }

    setTodo('');
    setStartDate(new Date());
    setEndDate(new Date());
    setSnackbarOpen(true);
    setEventInfo({ selectedDate: '', selectedTime: '' });
    if (props.showTodoFormPopup) {
      props.addTodoFormToggler();
    }
  }

  function handleComplete(id: number) {
    setTodos(todos.map(todo => (
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )));
  }

  function handleDelete(id: number) {
    setTodos(todos.filter(todo => todo.id !== id));
    setSnackbarOpen(true);
    setAlertText('Todo deleted successfully');
    setAlertSeverity('success');
  }

  const [{ isOver }, dropRef] = useDrop({
    accept: 'todo',
    drop: (item: ITodo) => {
      // console.log(item)
      const index = todos.findIndex(todo => todo.id === item.id);
      setEditIndex(index)
      setIsEdit(true)
      setTodo(item.title);
      setStartDate(new Date(item.start))
      setEndDate(new Date(item.end))
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    })
  })

  function handleCalendarClick(event: any) {
    const date = new Date(event.start);
    // console.log(date)
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const formattedTime = moment(date).format('HH:mm');

    setEventInfo({
      selectedDate: formattedDate,
      selectedTime: formattedTime,
    });
    // console.log(eventInfo)
    props.addTodoFormToggler()
  }

  const handleSubmitForm = (formData: { todo: string; startTime: string; endTime: string }) => {
    // console.log(formData)
    setTodo(formData.todo);
    // console.log(todo)
    const start = new Date(`${eventInfo.selectedDate}T${formData.startTime}`);
    const end = new Date(`${eventInfo.selectedDate}T${formData.endTime}`);
    setStartDate(start);
    setEndDate(end);
    setSetReadyToSubmit(true);
  };

  useEffect(() => {
    if (setReadyToSubmit && todo && startDate && endDate) {
      handleSubmit()
      setSetReadyToSubmit(false)
    }
  }, [todo, startDate, endDate, setReadyToSubmit])


  function handleCloseForm() {
    props.addTodoFormToggler()
    setEventInfo({ selectedDate: '', selectedTime: '' });
    setTodo('');
  }

  function handleEventDrop({ event, start, end }: any) {
    const index = todos.findIndex(todo => todo.id === event.id);
    if (isOverlapping(start, end, index)) {
      setAlertText('Dragged time overlaps with an existing task');
      setAlertSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    const updatedTodos = todos.map(todo =>
      todo.id === event.id ? { ...todo, start, end } : todo
    );
    setTodos(updatedTodos);
  
    setAlertText('Todo updated via drag & drop');
    setAlertSeverity('success');
    setSnackbarOpen(true);
  }

  return (
    <div className="container-fluid d-flex flex-column vh-100 p-0">
      {props.showTodoFormPopup && <AddTodoForm handleSubmitForm={handleSubmitForm} handleCloseForm={handleCloseForm} eventInfo={eventInfo} />}
      <div className='w-100 h-50 d-flex flex-column flex-md-row justify-content-start align-items-center bg-light gap-3 p-3'>
        <div className="h-100 w-100 w-md-50 d-flex flex-column justify-content-start align-items-center bg-secondary gap-3 p-3 rounded">
          <h1 className="text-white">Todo List</h1>
          <div className='w-100 d-flex flex-column gap-3 overflow-auto'>
            {todos.map((todo) => (
              <TodoComponent key={todo.id} {...todo} handleComplete={handleComplete} handleDelete={handleDelete} start={todo.start || new Date()} end={todo.end || new Date()} />
            ))}
          </div>
        </div>

        <div className="h-100 w-100 w-md-50 d-flex flex-column justify-content-start align-items-center bg-light gap-2 p-2"
          ref={(node) => {
            if (node) {
              dropRef(node)
            }
          }}
          style={{ border: isOver ? '2px dashed #0d6efd' : undefined }}
        >
          <h1>Enter Your Todo</h1>
          <TextField
            label="Todo"
            variant="outlined"
            sx={{ backgroundColor: 'white', borderRadius: 1, width: '80%' }}
            onChange={(e) => setTodo(e.target.value)}
            value={todo}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              sx={{ width: '80%' }}
            />
            <DateTimePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              sx={{ width: '80%' }}
            />
          </LocalizationProvider>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert severity={alertSeverity} sx={{ width: '100%' }}>
              {alertText}
            </Alert>
          </Snackbar>

          <Button
            variant="contained"
            sx={{ width: '80%', backgroundColor: 'slategray' }}
            onClick={handleSubmit}
          >
            {isEdit ? 'Update Todo' : 'Add Todo'}
          </Button>
          <h4 className='md-5'>Drag Todo Here </h4>
        </div>
      </div>

      <div className="w-100 h-50 d-flex flex-column justify-content-start align-items-center bg-light gap-3 p-3">
        <h1>Your Events</h1>
        <DnDCalendar
          selectable
          localizer={localizer}
          events={todos.map(todo => ({
            id: todo.id,
            title: todo.title,
            start: new Date(todo.start),
            end: new Date(todo.end),
          }))}
          startAccessor={(event:object) => (event as ITodo).start}
          endAccessor={(event)=> (event as ITodo).end}
          defaultView="week"
          defaultDate={new Date()}
          style={{
            height: 400,
            width: '100%',
            borderRadius: '8px',
            backgroundColor: '#fff',
            padding: '10px',
            boxShadow: '0 0 8px rgba(0,0,0,0.1)',
          }}
          eventPropGetter={(event) => {
            const matched = todos.find(t => t.id === (event as ITodo).id);
            return {
              style: {
                backgroundColor: matched?.completed ? '#6c757d' : '#007bff',
                color: 'white',
                borderRadius: '5px',
                padding: '6px 10px',
                fontSize: '12px',
                opacity: matched?.completed ? 0.6 : 1,
              },
            };
          }}
          onSelectSlot={(event) => {
            handleCalendarClick(event)
          }}
          onEventDrop={handleEventDrop}
          resizable
          onEventResize={handleEventDrop}
        />
      </div>
    </div>
  );
}

export default AddTodoFormHOC(App)