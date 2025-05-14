import { Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDrag } from 'react-dnd';
import { ITodo } from '../../../models/i_common'
export interface ITodoFunctionns {
  handleComplete?: (id: number) => void;
  handleDelete?: (id: number) => void;
}

function TodoComponent({ id, title, completed, start, end, handleComplete, handleDelete }: ITodo & ITodoFunctionns) {

  const [{ isDragging }, dragRef] = useDrag({
    type: 'todo',
    item: { id, title, completed, start, end },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  return (
    <div className="d-flex justify-content-between align-items-center p-2 mb-1 bg-white border rounded"
      ref={(node) => {
        if (node) {
          dragRef(node)
        }
      }}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
    >
      <p className="text-black mb-1" style={{ textDecoration: completed ? 'line-through' : 'none' }}>
        {title}
      </p>
      <div className="d-flex align-items-center">
        <Checkbox
          checked={completed}
          onChange={() => handleComplete?.(id)}
          size="small"
        />
        <IconButton
          color="error"
          onClick={() => handleDelete?.(id)}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default TodoComponent;