import { useState } from "react";
const AddTodoFormHOC = (WrappedComponent: any) => (
    function comp(props: any) {
        const [showTodoFormPopup, setShowTodoFormPopup] = useState<boolean>(false);
        function addTodoFormToggler() {
            setShowTodoFormPopup(!showTodoFormPopup);
        }
        return (
            <WrappedComponent {...props} addTodoFormToggler={addTodoFormToggler} showTodoFormPopup={showTodoFormPopup} />
        );
    }
)
export default AddTodoFormHOC;