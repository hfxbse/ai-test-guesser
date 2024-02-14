import styles from "./reference.module.css";
import GistView from "@/app/quiz/gists/gist";
import {Gist} from "@/app/quiz/gists/route";
import {useEffect, useRef} from "react";
import ReferenceToggle from "@/app/quiz/reference/referenceToggle";

export default function Reference({gist, open, onClose}: {
    gist: Gist,
    open: boolean,
    onClose: (open: boolean) => void
}) {
    const ref = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        if (open && ref.current?.open === false) ref.current?.showModal()
        else if (!open && ref.current?.open === true) ref.current?.close()
    }, [open]);

    console.log(gist.reference.description.split('\n'))

    return <dialog
        className={styles.reference}
        ref={ref}
        onClose={() => onClose(false)}
    >
        <div key={gist.id + gist.gist_user}>
            <div>
                <h1>{gist.reference.title}</h1>
                {
                    gist.reference.description.split('\n').map(paragraph =>
                        <p key={paragraph}>{paragraph}</p>
                    )
                }
            </div>
            <GistView file={gist.reference.filename} id={gist.id} username={gist.gist_user}/>
        </div>
        <div className={styles.continue}>
            <ReferenceToggle label={"Show tests"} onClick={() => onClose(false)}/>
            <span>You can return to this reference if you need to</span>
        </div>
    </dialog>
}
