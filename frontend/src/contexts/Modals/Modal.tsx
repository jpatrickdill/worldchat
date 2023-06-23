import React, {MouseEvent, ReactNode, useEffect, useRef, useState} from "react";
import clsx from "clsx";
import {ModalProps, useModals} from "@/contexts/Modals/ModalContext";
import {v4 as uuidv4} from "uuid";

export default function Modal(props: ModalProps) {
    const {registerModal, removeModal} = useModals();
    const [modalId] = useState(uuidv4());

    props = {
        // defaults
        size: "xl",
        enabled: true,
        buttonEl: "Done",

        // user props
        ...props,
    };

    useEffect(() => {
        if (props.enabled) {
            registerModal(modalId, props);
        } else {
            removeModal(modalId);
        }
    }, [props.title, props.children, props.onClose, props.enabled]);

    useEffect(() => {
        return () => {
            removeModal(modalId);
        }
    }, []);


    return null;
}