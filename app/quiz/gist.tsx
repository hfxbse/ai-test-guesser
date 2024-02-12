import SuperGist from 'super-react-gist'
import {BarLoader} from "react-spinners";
import {Roboto} from "next/font/google";
import styles from './gist.module.css'

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

export default function Gist({id, username, file, className}: {
    id: string,
    username: string,
    file: string,
    className?: string
}) {
    return <SuperGist
        url={`https://gist.github.com/${username}/${id}`}
        file={file}
        LoadingComponent={placeholder}
        className={className}
    />
}
