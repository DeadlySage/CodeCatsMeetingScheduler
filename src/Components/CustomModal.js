import React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';

export default function CustomModal({
    title = 'Title of Meeting',
    isOpen,
    toggle,
    onCancel,
    cancelText,
    onSubmit,
    submitText,
    onDelete,
    deleteText,
    onSuccess,
    successText,
    children,
    headerBackgroundClass = ""
}) {
    return(
        <Modal isOpen={isOpen} toggle={toggle} style={{zIndex: 1000}}>
            <ModalHeader className= {headerBackgroundClass} toggle={toggle}>{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            {(onCancel || onSubmit || onDelete || onSuccess) && (
                <ModalFooter>
                {
                    onCancel &&(
                        <Button color ='secondary' onClick={onCancel}>
                            {cancelText || 'Cancel'}
                        </Button>
                    )
                }
                {
                    onDelete &&(
                        <Button color = 'danger' onClick={onDelete}>
                            {deleteText || 'Delete'} 
                        </Button>
                    )
                }
                {
                    onSubmit &&(
                        <Button color = 'primary' onClick={onSubmit}>
                            {submitText || 'Submit'}
                        </Button>
                    )
                }
                {
                    onSuccess &&(
                        <Button color = 'success' onClick={onSuccess}>
                            {successText || 'Success'}
                        </Button>
                    )
                }
                </ModalFooter>
            )}
            
        </Modal>
    );
    
}