import ReactDOM from 'react-dom'

function Modal(props) {

    const { handleCloseModal, children } = props;

    return ReactDOM.createPortal(
        <div className="modal-container">
            <button onClick={handleCloseModal} className='modal-underlay' />

            <div className="modal-content">
                {children}
            </div>
        </div>,
        document.getElementById('portal')
    );
}

export default Modal;