import {BarLoader} from "react-spinners";
import {Roboto} from "next/font/google";
import styles from './gist.module.css'
import React, {ComponentType, useMemo} from "react";
import dynamic from "next/dynamic";

const roboto = Roboto({weight: "300", subsets: ["latin"]})

function placeholder() {
    return <div className={styles.placeholder}>
        <div>
            <h2 className={roboto.className}>Loading code snippet…</h2>
            <BarLoader
                color={"var(--color-primary)"}
                cssOverride={{
                    background: "inherit"
                }}
            />
        </div>
    </div>
}

export default function Gist({id, username, file}: {
    id: string,
    username: string,
    file: string,
}) {
    const SuperGist: ComponentType<{
        url: string,
        file: string,
        LoadingComponent: () => React.JSX.Element,
    }> = useMemo(() => dynamic(() => import('super-react-gist'), {ssr: false}), [])

    return <div className={styles.gist}>
        <SuperGist
            url={`https://gist.github.com/${username}/${id}`}
            file={file}
            LoadingComponent={placeholder}
        />
    </div>
}
