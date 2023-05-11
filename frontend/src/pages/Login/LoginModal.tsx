import OldModal from "@/contexts/Modals/OldModal";
import clsx from "clsx";
import Login from "@/pages/Login/Login";
import Modal from "@/contexts/Modals/Modal";

export default function LoginModal({showing, onClose}: { showing?: boolean, onClose: () => void }) {
    return <Modal
        onClose={onClose}
        enabled={showing}
        className="p-5"
    >
        <Login onClose={onClose}/>
    </Modal>
}