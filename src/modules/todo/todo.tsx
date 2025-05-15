import 'bootstrap/dist/css/bootstrap.min.css';
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from 'react';
import TodoComponent from './components/todo-component.tsx';
import { ITodo, CalenderInfo } from '../../models/i_common.ts';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import moment from 'moment';

import { useDrop } from 'react-dnd';

import AddTodoForm from './forms/add-todo-form.tsx';
import AddTodoFormHOC from './hoc/AddTodoFormHOC.tsx';
import { useStore } from '../../context/storeProvider.tsx'
import { observer } from 'mobx-react-lite';

import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

import { getUserLoginInfo } from '../../helpers/local-storage-helper.ts'


function App(props: any) {
  const [todo, setTodo] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [isEdit, setIsEdit] = useState(false);
  const [alertText, setAlertText] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const { todoStore, userStore } = useStore();

  const [eventInfo, setEventInfo] = useState<CalenderInfo>({ selectedDate: '', selectedTime: '' });
  const [setReadyToSubmit, setSetReadyToSubmit] = useState(false)
  const navigate = useNavigate();

  const userInfo = getUserLoginInfo();

  useEffect(() => {
    if (!userInfo || userInfo.loggedIn === false) {
      let data = {
        userId: 0,
        loggedIn: false,
      }
      localStorage.setItem("loggedInUserInfo", JSON.stringify(data));
      navigate('/login');
    }
    else todoStore.getTodos(userInfo.userId);
  }
    , []);

  function isOverlapping(start: Date, end: Date, excludeIndex: number = -1): boolean {
    // Check if the new time range is in the past
    const now = new Date();
    if (start < now || end < now) {
      return true;
    }

    // Check for overlap with other todos
    return todoStore.todos.some((todo, index) => {
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
    console.log("here")
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
      setAlertText('Todo time overlaps with an existing task or is in the past');
      setAlertSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (isEdit && editIndex !== -1) {
      const updatedTodos = todoStore.todos.map((t, index) => {
        if (index === editIndex) {
          return { ...t, title: todo, start: startDate, end: endDate };
        }
        return t;
      });
      todoStore.updateTodo(updatedTodos, userInfo.userId);
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
        userId: userInfo.userId,
      };
      todoStore.addTodo(newTodo, userInfo.userId);
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
    todoStore.completeTodo(id);
    setSnackbarOpen(true);
    setAlertText('Todo completed successfully');
    setAlertSeverity('success');
  }

  function handleDelete(id: number) {
    todoStore.deleteTodo(id);
    setSnackbarOpen(true);
    setAlertText('Todo deleted successfully');
    setAlertSeverity('success');
  }

  const [{ isOver }, dropRef] = useDrop({
    accept: 'todo',
    drop: (item: ITodo) => {
      const index = todoStore.todos.findIndex(todo => todo.id === item.id);
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
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const formattedTime = moment(date).format('HH:mm');

    setEventInfo({
      selectedDate: formattedDate,
      selectedTime: formattedTime,
    });
    props.addTodoFormToggler()
  }

  const handleSubmitForm = (formData: { todo: string; startTime: string; endTime: string }) => {
    setTodo(formData.todo);
    const start = new Date(`${eventInfo.selectedDate}T${formData.startTime}`);
    const end = new Date(`${eventInfo.selectedDate}T${formData.endTime}`);
    setStartDate(start);
    setEndDate(end);
    setSetReadyToSubmit(true);
  };

  useEffect(() => {
    if (setReadyToSubmit) {
      console.log("first", setReadyToSubmit)
      handleSubmit()
      setSetReadyToSubmit(false)
    }
  }, [setReadyToSubmit]);


  function handleCloseForm() {
    props.addTodoFormToggler()
    setEventInfo({ selectedDate: '', selectedTime: '' });
    setTodo('');
  }

  function handleEventDrop({ event, start, end }: any) {
    const index = todoStore.todos.findIndex(todo => todo.id === event.id);
    if (isOverlapping(start, end, index)) {
      setAlertText('Dragged time overlaps with an existing task or is in the past');
      setAlertSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    const updatedTodos = todoStore.todos.map(todo =>
      todo.id === event.id ? { ...todo, start, end } : todo
    );
    todoStore.updateTodo(updatedTodos, userInfo.userId);
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
            {todoStore.todos.map((todo) => (
              <TodoComponent key={todo.id} {...todo} handleDelete={handleDelete} handleComplete={handleComplete} start={todo.start || new Date()} end={todo.end || new Date()} />
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
          <div className='d-flex justify-content-between align-items-start'>
            <h1>Enter Your Todo</h1>
            <Button
              variant='contained'
              sx={{
                height: '40px',
                width: '80px',
                backgroundColor: 'slategray',
              }}
              onClick={() => {
                userStore.logout();
                todoStore.logout();
                navigate('/login');
              }}
            >
              Logout
            </Button>
          </div>

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
          events={todoStore.todos.map(todo => ({
            id: todo.id,
            title: todo.title,
            start: new Date(todo.start),
            end: new Date(todo.end),
          }))}
          startAccessor={(event: object) => (event as ITodo).start}
          endAccessor={(event) => (event as ITodo).end}
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
            const matched = todoStore.todos.find(t => t.id === (event as ITodo).id);
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
          onSelectSlot={(slotInfo) => {
            const now = new Date();
            const isPast = slotInfo.start < new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (isPast) {
              setAlertText('Selected time is in the past');
              setAlertSeverity('error');
              setSnackbarOpen(true);
              return; 
            }
            handleCalendarClick(slotInfo);
          }}
          onEventDrop={handleEventDrop}
          resizable
          onEventResize={handleEventDrop}
          dayPropGetter={(date) => {
            const now = new Date();
            const isPast = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (isPast) {
              return {
                style: {
                  backgroundColor: 'rgba(var(--bs-secondary-rgb), var(--bs-bg-opacity))',
                  cursor: 'not-allowed',
                },
              };
            }
            return {};
          }}

        />
      </div>
    </div>
  );
}

export default AddTodoFormHOC(observer(App))