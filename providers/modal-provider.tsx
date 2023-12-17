"use client";

import { useEffect, useState } from "react";

import PreviewModal from "@/components/preview-modal";

const ModalProvider = ({

}) => {

    const [isMounted, setIsMounted] = useState(false); // good ol' hydration trick.

    useEffect(() => {
        setIsMounted(true);
    }, [])


    if (!isMounted) {
        // if it's not mounted we wont render it. 
        return null;
    }


    return (
        <>
            <PreviewModal />
        </>
    );
}

export default ModalProvider; 