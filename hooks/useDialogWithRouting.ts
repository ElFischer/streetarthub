import { useState, useCallback } from 'react';

function useDialogWithRouting(id: string) {
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = useCallback(() => {
        setIsOpen(true);
        window.history.pushState({}, '', `/art/${id}`);
    }, [id]);

    const closeDialog = useCallback(() => {
        setIsOpen(false);
        window.history.back();
    }, []);

    return { isOpen, openDialog, closeDialog };
}

export default useDialogWithRouting;
